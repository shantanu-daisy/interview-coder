export const solveUserPrompt = (problemInfo: any, constraints: string) => `Given the following coding problem:
Language: PYTHON3

PROBLEM STATEMENT:
${problemInfo.problem_statement}

CONSTRAINTS:
${constraints}

INPUT FORMAT:
${problemInfo.input_format?.description }

PARAMETRES:
${
  problemInfo.input_format?.parameters
    ?.map((p: any) => `- ${p.name}: ${p.type}${p.subtype ? ` of ${p.subtype}` : ""}`)
    .join("\n") ?? "No parameters available"
}

OUTPUT FORMAT:
${problemInfo.output_format?.description ?? "Output format not available"}

RETURNS: 
${problemInfo.output_format?.type ?? "Type not specified"}${
      problemInfo.output_format?.subtype
        ? ` of ${problemInfo.output_format.subtype}`
        : ""
    }


TEST CASES:
${JSON.stringify(problemInfo.test_cases ?? "No test cases available", null, 2)}

STARTER CODE:
${problemInfo.start_code ?? "No starter code available"}

FUTURE STEPS:
consider the requirements of the problem in each level.
${problemInfo.future_steps?.map((step: string) => `- ${step}`).join("\n") ?? "No future steps available"}

Generate a solution in this format:
{
  "thoughts": [
    "List any questions you should ask to show knowledge during the interview. Give at least 2 questions.",
    "First thought showing recognition of the problem and core challenge",
    "Second thought naming specific algorithm/data structure being considered. Any possible solution strategies you should try like whether its a tree problem or if it can be solved with BFS/DFS.",
    "Third Explain the reasoning behind your choice of algorithm/data structure. Why did we choose this approach?",
    "Fourth thought showing confidence in approach while acknowledging details needed"
  ],
  "code": "The PYTHON3 solution with comments explaining the code. Make sure to output the code for each level, and write all necessary code for each level following the starter code. For example:
  // Level 1:
  // Level 2:
  // Level 3:
  ",
  "time_complexity": "The time complexity in form O(_) because _",
  "space_complexity": "The space complexity in form O(_) because _"
}

Format Requirements:
1. Use actual line breaks in code field
2. Indent code properly with spaces
3. Include clear code comments
4. Response must be valid JSON
5. Return only the JSON object with no markdown or other formatting
6. Use as vanilla PYTHON3 code as possible, do not use any frameworks or libraries. Only use what is available in the starter code.`

export const solveSysPrompt = `
You will be given the a python coding question and you are to solve the coding challenge interview question using python3.  These are the fields you will get:

- PROBLEM STATEMENT: ENTIRE Problem statement (what needs to be solved)
- CONSTRAINTS: Constraints on the input
- INPUT FORMAT: Description of the input format
- PARAMETERS: Input parameters
- OUTPUT FORMAT: Description of the output format
- RETURNS: format of the return
- TEST CASE EXAMPLES: Example test cases
- STARTER CODE: If the problem has starter code or a code format, include it as well.
- FUTURE STEPS: If the problem has multiple levels or subproblems, extract all of those subproblems and the future steps the problem expects

Generate a solution in this format:
{
  "thoughts": [
    "List any questions you should ask to show knowledge during the interview. Give at least 2 questions.",
    "First thought showing recognition of the problem and core challenge",
    "Second thought naming specific algorithm/data structure being considered. Any possible solution strategies you should try like whether its a tree problem or if it can be solved with BFS/DFS.",
    "Third Explain the reasoning behind your choice of algorithm/data structure. Why did we choose this approach?",
    "Fourth thought showing confidence in approach while acknowledging details needed"
  ],
  "code": "The PYTHON3 solution with comments explaining the code. Make sure to output the code for each level if applicable, and write all necessary code for each level following the starter code. For example:
  // Level 1:
  // Level 2:
  // Level 3:
  ",
  "time_complexity": "The time complexity in form O(_) because _",
  "space_complexity": "The space complexity in form O(_) because _"
}

Format Requirements:
1. Use actual line breaks in code field
2. Indent code properly with spaces
3. Include clear code comments
4. Response must be valid JSON
5. Return only the JSON object with no markdown or other formatting
6. Use as vanilla PYTHON3 code as possible, do not use any frameworks or libraries. Only use what is available in the starter code.
`

export const reactPromptContent = (problemInfo: any) => `Given the following coding problem where you need to build this frontend react component application:

Problem Statement:
${problemInfo.problem_statement ?? "Problem statement not available"}

Input Format:
${problemInfo.input_format?.description ?? "Input format not available"}
Parameters:
${
  problemInfo.input_format?.parameters
    ?.map((p: any) => `- ${p.name}: ${p.type}${p.subtype ? ` of ${p.subtype}` : ""}`)
    .join("\n") ?? "No parameters available"
}

Output Format:
${problemInfo.output_format?.description ?? "Output format not available"}
Returns: ${problemInfo.output_format?.type ?? "Type not specified"}${
      problemInfo.output_format?.subtype
        ? ` of ${problemInfo.output_format.subtype}`
        : ""
    }

Constraints:
${
  problemInfo.constraints
    ?.map((c: any) => {
      let constraintStr = `- ${c.description}`
      if (c.range) {
        constraintStr += ` (${c.parameter}: ${c.range.min} to ${c.range.max})`
      }
      return constraintStr
    })
    .join("\n") ?? "No constraints specified"
}

Test Cases:
${JSON.stringify(problemInfo.test_cases ?? "No test cases available", null, 2)}

Generate a solution in this format:
{
  "thoughts": [
    "List any questions you should ask to show knowledge during the interview. Give at least 2 questions.",
    "First thought showing recognition of the problem and core challenge",
    "Second thought naming specific algorithm/data structure being considered. Any possible solution strategies you should try like whether its a tree problem or if it can be solved with BFS/DFS.",
    "Third Explain the reasoning behind your choice of algorithm/data structure. Why did we choose this approach?",
    "Fourth thought showing confidence in approach while acknowledging details needed"
  ],
  "code": "The REACT TYPESCRIPT solution with comments explaining the code. Make sure to include all the files needed to build the application. Because this is a react application, make sure to include the html, css, and any neccessary ts files needed to build the application. ",
  "time_complexity": "The time complexity in form O(_) because _",
  "space_complexity": "The space complexity in form O(_) because _"
}

Format Requirements:
1. Use actual line breaks in code field
2. Indent code properly with spaces
3. Include clear code comments
4. Response must be valid JSON
5. Return only the JSON object with no markdown or other formatting`

export const solveResponseSchema = {
    "type": "json_schema",
    "json_schema": {
      "name": "solution_schema",
      "strict": true,
      "schema": {
        "type": "object",
        "properties": {
          "thoughts": {
            "type": "array",
            "description": "An array of strings representing the thought process, including interview questions and detailed reasoning.",
            "items": {
              "type": "string"
            }
          },
          "code": {
            "type": "string",
            "description": "The solution code with proper line breaks, indentation, and inline comments."
          },
          "time_complexity": {
            "type": "string",
            "description": "The time complexity in the format ‘O(_) because ’."
          },
          "space_complexity": {
            "type": "string",
            "description": "The space complexity in the format ’O() because _’."
          }
        },
        "required": [
          "thoughts",
          "code",
          "time_complexity",
          "space_complexity"
        ],
        "additionalProperties": false,
        "$defs": {
          "thoughts": {
            "type": "array",
            "description": "An array of strings representing the thought process, including interview questions and detailed reasoning.",
            "items": {
              "type": "string"
            },
            "required": ["thoughts"],
            "additionalProperties": false
          }
        }
      }
    }
  }

