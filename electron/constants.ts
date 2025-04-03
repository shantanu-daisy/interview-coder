// Constants shared between main process and preload script

export const PROCESSING_EVENTS = {
  // Global states
  UNAUTHORIZED: "procesing-unauthorized",
  NO_SCREENSHOTS: "processing-no-screenshots",
  API_KEY_OUT_OF_CREDITS: "processing-api-key-out-of-credits",
  OUT_OF_CREDITS: "out-of-credits",
  API_KEY_INVALID: "api-key-invalid",
  // States for generating the initial solution
  INITIAL_START: "initial-start",
  PROBLEM_EXTRACTED: "problem-extracted",
  SOLUTION_SUCCESS: "solution-success",
  INITIAL_SOLUTION_ERROR: "solution-error",

  // States for processing the debugging
  DEBUG_START: "debug-start",
  DEBUG_SUCCESS: "debug-success",
  DEBUG_ERROR: "debug-error",

  // Question feature
  OPEN_QUESTION_BOX: "open-question-box",
  
  // Cheatsheet feature
  OPEN_CHEATSHEET: "open-cheatsheet"
} as const 