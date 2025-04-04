 const functions = [
    {
      name: "extract_problem_details",
      description:
        "Extract and structure the key components of a coding problem",
      parameters: {
        type: "object",
        properties: {
          problem_statement: {
            type: "string",
            description:
              "The ENTIRE main problem statement describing what needs to be solved"
          },
          input_format: {
            type: "object",
            properties: {
              description: {
                type: "string",
                description: "Description of the input format"
              },
              parameters: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                      description: "Name of the parameter"
                    },
                    type: {
                      type: "string",
                      enum: [
                        "number",
                        "string",
                        "array",
                        "array2d",
                        "array3d",
                        "matrix",
                        "tree",
                        "graph"
                      ],
                      description: "Type of the parameter"
                    },
                    subtype: {
                      type: "string",
                      enum: ["integer", "float", "string", "char", "boolean"],
                      description: "For arrays, specifies the type of elements"
                    }
                  },
                  required: ["name", "type"]
                }
              }
            },
            required: ["description", "parameters"]
          },
          output_format: {
            type: "object",
            properties: {
              description: {
                type: "string",
                description: "Description of the expected output format"
              },
              type: {
                type: "string",
                enum: [
                  "number",
                  "string",
                  "array",
                  "array2d",
                  "array3d",
                  "matrix",
                  "boolean"
                ],
                description: "Type of the output"
              },
              subtype: {
                type: "string",
                enum: ["integer", "float", "string", "char", "boolean"],
                description: "For arrays, specifies the type of elements"
              }
            },
            required: ["description", "type"]
          },
          constraints: {
            type: "array",
            items: {
              type: "object",
              properties: {
                description: {
                  type: "string",
                  description: "Description of the constraint"
                },
                parameter: {
                  type: "string",
                  description: "The parameter this constraint applies to"
                },
                range: {
                  type: "object",
                  properties: {
                    min: { type: "number" },
                    max: { type: "number" }
                  }
                }
              },
              required: ["description"]
            }
          },
          test_cases: {
            type: "array",
            items: {
              type: "object",
              properties: {
                input: {
                  type: "object",
                  properties: {
                    args: {
                      type: "array",
                      items: {
                        anyOf: [
                          { type: "integer" },
                          { type: "string" },
                          {
                            type: "array",
                            items: {
                              anyOf: [
                                { type: "integer" },
                                { type: "string" },
                                { type: "boolean" },
                                { type: "null" }
                              ]
                            }
                          },
                          { type: "object" },
                          { type: "boolean" },
                          { type: "null" }
                        ]
                      }
                    }
                  },
                  required: ["args"]
                },
                output: {
                  type: "object",
                  properties: {
                    result: {
                      anyOf: [
                        { type: "integer" },
                        { type: "string" },
                        {
                          type: "array",
                          items: {
                            anyOf: [
                              { type: "integer" },
                              { type: "string" },
                              { type: "boolean" },
                              { type: "null" }
                            ]
                          }
                        },
                        { type: "object" },
                        { type: "boolean" },
                        { type: "null" }
                      ]
                    }
                  },
                  required: ["result"]
                }
              },
              required: ["input", "output"]
            },
            minItems: 1
          },
          start_code: {
            type: "string",
            description: "The starting code for the problem which should be a starting point for the solution"
          },
          future_steps: {
            type: "array",
            description: "Array of the future steps for the problem requirements which should be a list of steps that need to be taken to solve the problem.",
            // array of the steps. for example:
            // Your task is to implement a simple container of integer numbers. Plan your design according to the level specifications below:
            // Level 1: Container should support adding and removing numbers.
            // Level 2: Container should support getting the median of the numbers stored in it.
            // To move to the next level, you need to pass all the tests at this level when submitting the solution.
            items: {
              type: "string",
              description: "The step for the problem requirements. For example: 'Level 1: Container should support adding and removing numbers.'"
            }
          }
        },
        required: ["problem_statement"]
      }
    }
  ]

export const extractProblemFunction = [
{
  name: "extract_problem_details",
  description: "Extract and structure the key components of a coding problem",
  
  parameters: {
    type: "object",
    properties: {
      problem_statement: {
        type: "string",
        description: "The ENTIRE main problem statement describing what needs to be solved"
      },
      input_format: {
        type: "object",
        properties: {
          description: {
            type: "string",
            description: "Description of the input format"
          },
          parameters: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description: "Name of the parameter"
                },
                type: {
                  type: "string",
                  enum: ["number","string","array","array2d","array3d","matrix","tree","graph"],
                  description: "Type of the parameter"
                },
                subtype: {
                  type: "string",
                  enum: ["integer", "float", "string", "char", "boolean"],
                  description: "For arrays, specifies the type of elements"
                }
              },
              required: ["name", "type"]
            }
          }
        },
        required: ["description", "parameters"]
      },
      output_format: {
        type: "object",
        properties: {
          description: {
            type: "string",
            description: "Description of the expected output format"
          },
          type: {
            type: "string",
            enum: ["number","string","array","array2d","array3d","matrix","boolean"],
            description: "Type of the output"
          },
          subtype: {
            type: "string",
            enum: ["integer", "float", "string", "char", "boolean"],
            description: "For arrays, specifies the type of elements"
          }
        },
        required: ["description", "type"]
      },
      constraints: {
        type: "array",
        items: {
          type: "object",
          properties: {
            description: {
              type: "string",
              description: "Description of the constraint"
            },
            parameter: {
              type: "string",
              description: "The parameter this constraint applies to"
            },
            range: {
              type: "object",
              properties: {
                min: { type: "number" },
                max: { type: "number" }
              }
            }
          },
          required: ["description"]
        }
      },
      test_cases: {
        type: "array",
        items: {
          type: "object",
          properties: {
            input: {
              type: "object",
              properties: {
                args: {
                  type: "array",
                  items: {
                    anyOf: [
                      { type: "integer" },
                      { type: "string" },
                      {
                        type: "array",
                        items: {
                          anyOf: [
                            { type: "integer" },
                            { type: "string" },
                            { type: "boolean" },
                            { type: "null" }
                          ]
                        }
                      },
                      { type: "object" },
                      { type: "boolean" },
                      { type: "null" }
                    ]
                  }
                }
              },
              required: ["args"]
            },
            output: {
              type: "object",
              properties: {
                result: {
                  anyOf: [
                    { type: "integer" },
                    { type: "string" },
                    {
                      type: "array",
                      items: {
                        anyOf: [
                          { type: "integer" },
                          { type: "string" },
                          { type: "boolean" },
                          { type: "null" }
                        ]
                      }
                    },
                    { type: "object" },
                    { type: "boolean" },
                    { type: "null" }
                  ]
                }
              },
              required: ["result"]
            }
          },
          required: ["input", "output"]
        },
        minItems: 1
      },
      start_code: {
        type: "string",
        description: "The starting code for the problem which should be a starting point for the solution"
      },
      future_steps: {
        type: "array",
        description: "Array of the future steps for the problem requirements which should be a list of steps that need to be taken to solve the problem.",
        items: {
          type: "string",
          description: "The step for the problem requirements. For example: 'Level 1: Container should support adding and removing numbers.'"
        }
      }
    },
    required: ["problem_statement", "start_code"]
  },
}
]

// export const extractProblemFunctions = [
// {
//       name: "extract_problem_details",
//       description:
//         "Extract and structure the key components of a coding problem",
//       parameters: {
//         type: "object",
//         properties: {
//           problem_statement: {
//             type: "string",
//             description:
//               "The ENTIRE main problem statement describing what needs to be solved"
//           },
//           input_format: {
//             type: "object",
//             properties: {
//               description: {
//                 type: "string",
//                 description: "Description of the input format"
//               },
//               parameters: {
//                 type: "array",
//                 items: {
//                   type: "object",
//                   properties: {
//                     name: {
//                       type: "string",
//                       description: "Name of the parameter"
//                     },
//                     type: {
//                       type: "string",
//                       enum: [
//                         "number",
//                         "string",
//                         "array",
//                         "array2d",
//                         "array3d",
//                         "matrix",
//                         "tree",
//                         "graph"
//                       ],
//                       description: "Type of the parameter"
//                     },
//                     subtype: {
//                       type: "string",
//                       enum: ["integer", "float", "string", "char", "boolean"],
//                       description: "For arrays, specifies the type of elements"
//                     }
//                   },
//                   required: ["name", "type"]
//                 }
//               }
//             },
//             required: ["description", "parameters"]
//           },
//           output_format: {
//             type: "object",
//             properties: {
//               description: {
//                 type: "string",
//                 description: "Description of the expected output format"
//               },
//               type: {
//                 type: "string",
//                 enum: [
//                   "number",
//                   "string",
//                   "array",
//                   "array2d",
//                   "array3d",
//                   "matrix",
//                   "boolean"
//                 ],
//                 description: "Type of the output"
//               },
//               subtype: {
//                 type: "string",
//                 enum: ["integer", "float", "string", "char", "boolean"],
//                 description: "For arrays, specifies the type of elements"
//               }
//             },
//             required: ["description", "type"]
//           },
//           constraints: {
//             type: "array",
//             items: {
//               type: "object",
//               properties: {
//                 description: {
//                   type: "string",
//                   description: "Description of the constraint"
//                 },
//                 parameter: {
//                   type: "string",
//                   description: "The parameter this constraint applies to"
//                 },
//                 range: {
//                   type: "object",
//                   properties: {
//                     min: { type: "number" },
//                     max: { type: "number" }
//                   }
//                 }
//               },
//               required: ["description"]
//             }
//           },
//           test_cases: {
//             type: "array",
//             items: {
//               type: "object",
//               properties: {
//                 input: {
//                   type: "object",
//                   properties: {
//                     args: {
//                       type: "array",
//                       items: {
//                         anyOf: [
//                           { type: "integer" },
//                           { type: "string" },
//                           {
//                             type: "array",
//                             items: {
//                               anyOf: [
//                                 { type: "integer" },
//                                 { type: "string" },
//                                 { type: "boolean" },
//                                 { type: "null" }
//                               ]
//                             }
//                           },
//                           { type: "object" },
//                           { type: "boolean" },
//                           { type: "null" }
//                         ]
//                       }
//                     }
//                   },
//                   required: ["args"]
//                 },
//                 output: {
//                   type: "object",
//                   properties: {
//                     result: {
//                       anyOf: [
//                         { type: "integer" },
//                         { type: "string" },
//                         {
//                           type: "array",
//                           items: {
//                             anyOf: [
//                               { type: "integer" },
//                               { type: "string" },
//                               { type: "boolean" },
//                               { type: "null" }
//                             ]
//                           }
//                         },
//                         { type: "object" },
//                         { type: "boolean" },
//                         { type: "null" }
//                       ]
//                     }
//                   },
//                   required: ["result"]
//                 }
//               },
//               required: ["input", "output"]
//             },
//             minItems: 1
//           },
//           start_code: {
//             type: "string",
//             description: "The starting code for the problem which should be a starting point for the solution"
//           },
//           future_steps: {
//             type: "array",
//             description: "Array of the future steps for the problem requirements which should be a list of steps that need to be taken to solve the problem.",
//             items: {
//               type: "string",
//               description: "The step for the problem requirements. For example: 'Level 1: Container should support adding and removing numbers.'"
//             }
//           }
//         },
//         required: ["problem_statement", "start_code", "input_format", "output_format", "constraints",]
//       }
// }
// ]

export const extractUserPrompt = `
Extract the following information from this coding problem image:
1. ENTIRE Problem statement (what needs to be solved)
2. Input/Output format
3. Constraints on the input
4. Example test cases
Format each test case exactly like this:
{'input': {'args': [nums, target]}, 'output': {'result': [0,1]}}
Note: test cases must have 'input.args' as an array of arguments in order,
'output.result' containing the expected return value.
Example for two_sum([2,7,11,15], 9) returning [0,1]:
{'input': {'args': [[2,7,11,15], 9]}, 'output': {'result': [0,1]}}
5. If the problem has starter code or a code format, include it as well.
6. If the problem has multiple levels or subproblems, extract all of those subproblems and the future steps the problem expects
`

export const extractSysPrompt = `
You are given one (or more) screenshots of a coding interview question. In the question, there will generally be a description and information about the question as well as test cases and such. Sometimes there will just be notes and you will need to assume the question through the notes. It will be similar to a leetcode style question.
You are to extract the following information from the problem image(s):
- PROBLEM STATEMENT: ENTIRE Problem statement (what needs to be solved)
- CONSTRAINTS: Constraints on the input
- INPUT FORMAT: Description of the input format
- PARAMETERS: Input parameters
- OUTPUT FORMAT: Description of the output format
- RETURNS: format of the return
- TEST CASE EXAMPLES: Example test cases
- STARTER CODE: If the problem has starter code or a code format, include it as well.
- FUTURE STEPS: If the problem has multiple levels or subproblems, extract all of those subproblems and the future steps the problem expects
`

export const extractReactProblemPrompt = `
You are given a frontend coding problem. You are to be given a mockup of what to build in the React Framework with vanilla CSS.
Extract the following information from this coding problem image:
1. ENTIRE PRD of what needs to be built (what needs to be solved). Give a detailed PRD of what needs to be built that will be passed to the react frontend developer who wont get to see your mockups.
2. Details about component structure and hierarchy.
3. Details 
`