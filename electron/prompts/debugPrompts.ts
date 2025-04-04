export const debugUserPrompt = (language: string, problemStatement: string, inputFormatDescription: string, inputParameters: string, outputFormatDescription: string, returns: string, constraints: string, exampleTestCases: string) => `
Given the following coding problem and its visual representation:

Language: ${language}

Problem Statement:
${problemStatement}

Input Format:
${inputFormatDescription}

Parameters:
${inputParameters}

Output Format:
${outputFormatDescription}
${returns}

Constraints:
${constraints}

Example Test Cases:
${exampleTestCases}

First extract and analyze the code shown in the image. Then create an improved version while maintaining the same general approach and structure. The old code you save should ONLY be the exact code that you see on the screen, regardless of any optimizations or changes you make. Make all your changes in the new_code field. You should use the image that has the most recent, longest version of the code, making sure to combine multiple images if necessary.
Focus on keeping the solution syntactically similar but with optimizations and INLINE comments ONLY ON lines of code that were changed. Make sure there are no extra line breaks and all the code that is unchanged is in the same line as it was in the original code.

IMPORTANT FORMATTING NOTES:
1. Use actual line breaks (press enter for new lines) in both old_code and new_code
2. Maintain proper indentation with spaces in both code blocks
3. Add inline comments ONLY on changed lines in new_code
4. The entire response must be valid JSON that can be parsed`

export const debugSysPrompt = `
You are to be given a screenshot and some content. First extract and analyze the code shown in the image. Then create an improved version while maintaining the same general approach and structure. The old code you save should ONLY be the exact code that you see on the screen, regardless of any optimizations or changes you make. Make all your changes in the new_code field. You should use the image that has the most recent, longest version of the code, making sure to combine multiple images if necessary.
Focus on keeping the solution syntactically similar but with optimizations and INLINE comments ONLY ON lines of code that were changed. Make sure there are no extra line breaks and all the code that is unchanged is in the same line as it was in the original code.

What you will receive:
- Programming Language: PYTHON3
- Problem Statement
- Input Format
- Parameters
- Output Format
- Constraints
- Example Test Cases

IMPORTANT FORMATTING NOTES:
1. Use actual line breaks (press enter for new lines) in both old_code and new_code
2. Maintain proper indentation with spaces in both code blocks
3. Add inline comments ONLY on changed lines in new_code
4. The entire response must be valid JSON that can be parsed
`

export const debugFunction = [
    {
      name: "debug_and_provide_solution",
      description:
        "Debug based on the problem and provide a solution to the coding problem",
      parameters: {
        type: "object",
        properties: {
          thoughts: {
            type: "array",
            items: { type: "string" },
            description:
              "Share up to 3 key thoughts as you work through solving this problem for the first time. Write in the voice of someone actively reasoning through their approach, using natural pauses, uncertainty, and casual language that shows real-time problem solving. Each thought must be max 100 characters and be full sentences that don't sound choppy when read aloud.",
            maxItems: 3,
            thoughtGuidelines: [
              "First thought should capture that initial moment of recognition - connecting it to something familiar or identifying the core challenge. Include verbal cues like 'hmm' or 'this reminds me of' that show active thinking.",
              "Second thought must explore your emerging strategy and MUST explicitly name the algorithm or data structure being considered. Show both knowledge and uncertainty - like 'I could probably use a heap here, but I'm worried about...'",
              "Third thought should show satisfaction at having a direction while acknowledging you still need to work out specifics - like 'Okay, I think I see how this could work...'"
            ]
          },
          old_code: {
            type: "string",
            description:
              "The exact code implementation found in the image. There should be no additional lines of code added, this should only contain the code that is visible from the images, regardless of correctness or any fixes you can make. Include every line of code that are visible in the image.  You should use the image that has the most recent, longest version of the code, making sure to combine multiple images if necessary."
          },
          new_code: {
            type: "string",
            description:
              "The improved code implementation with in-line comments only on lines of code that were changed"
          },
          time_complexity: {
            type: "string",
            description:
              "Time complexity with explanation, format as 'O(_) because _.' Importantly, if there were slight optimizations in the complexity that don't affect the overall complexity, MENTION THEM."
          },
          space_complexity: {
            type: "string",
            description:
              "Space complexity with explanation, format as 'O(_) because _' Importantly, if there were slight optimizations in the complexity that don't affect the overall complexity, MENTION THEM."
          }
        },
        required: [
          "thoughts",
          "old_code",
          "new_code",
          "time_complexity",
          "space_complexity"
        ]
      }
    }
  ]