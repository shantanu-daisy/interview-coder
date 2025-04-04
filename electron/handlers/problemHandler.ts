// Import necessary modules
import axios from "axios"
import { store } from "../store"
import { solveUserPrompt, solveSysPrompt, solveResponseSchema } from "../prompts/solutionPrompts"
import { extractProblemFunction, extractUserPrompt, extractSysPrompt } from "../prompts/extractProblemPrompt"
import { debugFunction, debugSysPrompt, debugUserPrompt } from "../prompts/debugPrompts"
// Define interfaces for ProblemInfo and related structures

interface DebugSolutionResponse {
  thoughts: string[]
  old_code: string
  new_code: string
  time_complexity: string
  space_complexity: string
}

interface ProblemInfo {
  problem_statement?: string
  input_format?: {
    description?: string
    parameters?: Array<{
      name: string
      type: string
      subtype?: string
    }>
  }
  output_format?: {
    description?: string
    type?: string
    subtype?: string
  }
  constraints?: Array<{
    description: string
    parameter?: string
    range?: {
      min?: number
      max?: number
    }
  }>
  test_cases?: any // Adjust the type as needed
  start_code?: string
  future_steps?: string[]
}

interface StoreSchema {
  openaiApiKey: string
  // add other store fields here
}

// Define the extractProblemInfo function
export async function extractProblemInfo(
  imageDataList: string[]
): Promise<any> {
  const storedApiKey = store.get("openaiApiKey") 
  if (!storedApiKey) {
    throw new Error("OpenAI API key not set")
  }

  // Prepare the image contents for the message
  const imageContents = imageDataList.map((imageData) => ({
    type: "image_url",
    image_url: {
      url: `data:image/jpeg;base64,${imageData}`
    }
  }))


  // Construct the messages to send to the model
  const messages = [
    {
      role: "system",
      content: [
        {
          type: "text",
          text: extractSysPrompt
        }
      ]
    },
    {
      role: "user",
      content: [
        {
          type: "text",
          text: extractUserPrompt
        },
        ...imageContents
      ]
    }
  ]

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o",
        messages: messages,
        functions: extractProblemFunction,
        function_call: { name: "extract_problem_details" },
        max_tokens: 4096
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedApiKey}`
        }
      }
    )
    const functionCallArguments =
      response.data.choices[0].message.function_call.arguments
    const parsedFunctionCallArguments = JSON.parse(functionCallArguments)
    console.log('functionCallArguments', parsedFunctionCallArguments)
    return parsedFunctionCallArguments // return the parsed function call arguments
    
  } catch (error) {
    if (error.response?.status === 429) {
      throw new Error(
        "API Key out of credits. Please refill your OpenAI API credits and try again."
      )
    }

    throw error
  }
}

const language = process.env.VITE_PROGRAMMING_DEFAULT_LANG

export async function generateSolutionResponses(
  problemInfo: ProblemInfo
): Promise<any> {
  try {
    const storedApiKey = store.get("openaiApiKey") as string
    if (!storedApiKey) {
      throw new Error("OpenAI API key not set")
    }

    let constraints = problemInfo.constraints?.map((c: any) => {
      let constraintStr = `- ${c.description}`
      if (c.range) {
        constraintStr += ` (${c.parameter}: ${c.range.min} to ${c.range.max})`
      }
      return constraintStr
    })
    .join("\n") ?? "No constraints specified"

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "o3-mini",
        messages: [
          {
            role: "developer",
            content: [{
              type: "text",
              text: solveSysPrompt
            }]
          },
          {
            role: "user",
            content: [{
              type: "text",
              text: solveUserPrompt(problemInfo, constraints)
            }]
          }
        ],
        response_format: solveResponseSchema,
        reasoning_effort: "high"
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedApiKey}`
        }
      }
    )
    const content = response.data.choices[0].message.content
    return JSON.parse(content)
  } catch (error: any) {
    if (error.response?.status === 429) {
      throw new Error(
        "API Key out of credits. Please refill your OpenAI API credits and try again."
      )
    }
    console.error("Error details:", error)
    throw new Error(`Error generating solutions: ${error.message}`)
  }
}

export async function debugSolutionResponses(
  imageDataList: string[],
  problemInfo: ProblemInfo
): Promise<DebugSolutionResponse> {
  // Process images for inclusion in prompt
  const imageContents = imageDataList.map((imageData) => ({
    type: "image_url",
    image_url: {
      url: `data:image/jpeg;base64,${imageData}`
    }
  }))

  // Build the prompt with error handling
  const problemStatement =
    problemInfo.problem_statement ?? "Problem statement not available"

  const inputFormatDescription =
    problemInfo.input_format?.description ??
    "Input format description not available"

  const inputParameters = problemInfo.input_format?.parameters
    ? problemInfo.input_format.parameters
        .map(
          (p) => `- ${p.name}: ${p.type}${p.subtype ? ` of ${p.subtype}` : ""}`
        )
        .join(" ")
    : "Input parameters not available"

  const outputFormatDescription =
    problemInfo.output_format?.description ??
    "Output format description not available"

  const returns = problemInfo.output_format?.type
    ? `Returns: ${problemInfo.output_format.type}${
        problemInfo.output_format.subtype
          ? ` of ${problemInfo.output_format.subtype}`
          : ""
      }`
    : "Returns: Output type not available"

  const constraints = problemInfo.constraints
    ? problemInfo.constraints
        .map((c) => {
          let constraintStr = `- ${c.description}`
          if (c.range) {
            constraintStr += ` (${c.parameter}: ${c.range.min} to ${c.range.max})`
          }
          return constraintStr
        })
        .join(" ")
    : "Constraints not available"

  let exampleTestCases = "Test cases not available"
  if (problemInfo.test_cases) {
    try {
      exampleTestCases = JSON.stringify(problemInfo.test_cases, null, 2)
    } catch {
      exampleTestCases = "Test cases not available"
    }
  }

  // Construct the debug prompt
  
  // Construct the messages array
  const messages = [
    {
      role: "system",
      content: [
        {
          type: "text",
          text: debugSysPrompt
        }
      ]
    },
    {
      role: "user",
      content: [
        {
          type: "text",
          text: debugUserPrompt(language, problemStatement, inputFormatDescription, inputParameters, outputFormatDescription, returns, constraints, exampleTestCases)
        },
        ...imageContents
      ]
    }
  ]  

  try {
    // Send the request to the OpenAI API
    const storedApiKey = store.get("openaiApiKey") as string
    if (!storedApiKey) {
      throw new Error("OpenAI API key not set")
    }
     const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
          model: "gpt-4o-mini",
          messages: messages,
          functions: debugFunction,
          function_call: { name: "debug_and_provide_solution" },
          max_tokens: 4096
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedApiKey}`
        }
      }
    )
    // Extract the function call arguments from the response
    const functionCallArguments =
      response.data.choices[0].message.function_call.arguments

    // Parse and return the response
    return JSON.parse(functionCallArguments) as DebugSolutionResponse
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error(
        "API endpoint not found. Please check the model name and URL."
      )
    } else if (error.response?.status === 401) {
      throw new Error("Authentication failed. Please check your API key.")
    } else if (error.response?.status === 401) {
      throw new Error(
        "API Key out of credits. Please refill your OpenAI API credits and try again."
      )
    } else {
      throw new Error(
        `OpenAI API error: ${
          error.response?.data?.error?.message || error.message
        }`
      )
    }
  }
}
