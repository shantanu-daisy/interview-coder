import axios from "axios";
import { store } from "../store";

// Define message types for the conversation
export interface Message {
  role: "system" | "user" | "assistant";
  content: {type: "text", text: string}[];
}

const initial_message = `You are a helpful coding and technical assistant for a senior fullstack software engineer that is currently interviewing for a job. Provide clear, concise answers to programming and technical questions. Include code examples where appropriate.
When asked about code, you are probably currently in a coding interview and will be given a problem to solve. You will need to provide a detailed plan of attack before you start coding. You will also need to provide a time complexity and space complexity analysis of your solution.
When asked about a system design question, you will need to provide a detailed plan of attack as if you were in a system design interview for a fullstack role. Instead of giving images, use text to create diagrams to explain the architecture and the components of the system. You are to design the high level architecture of the system and the components of the system.


`
// Keep track of conversation history
let conversationHistory: Message[] = [
  {
    role: "user",
    content: [{type: "text", text: initial_message}]
  }
];

export function resetConversation() {
  conversationHistory = [
    {
      role: "user",
      content: [{type: "text", text: initial_message}]
    }
  ];
}

// Set a new context for solution-specific questions
export function setSolutionContext(solutionCode: string, thoughts: string[], timeComplexity: string, spaceComplexity: string) {
  const contextMessage = `I'll be answering questions about the following solution code: 
\`\`\`
${solutionCode}
\`\`\`

The thought process behind this solution was:
${thoughts.join("\n")}

Time Complexity: ${timeComplexity}
Space Complexity: ${spaceComplexity}

Please provide detailed explanations about this solution when answering user questions.`;
  
  resetConversation();
  conversationHistory[0].content.push({type: "text", text: contextMessage});
}

export async function processQuestion(question: string, isFollowUp: boolean = false): Promise<{ success: boolean; answer?: string; error?: string }> {
  try {
    const storedApiKey = store.get("openaiApiKey");
    if (!storedApiKey) {
      return { success: false, error: "OpenAI API key not set" };
    }

    // Add user message to history
    conversationHistory.push({
      role: "user",
      content: [{type: "text", text: question}]
    });

    // Prepare the API request to OpenAI
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "o1-mini",
        messages: conversationHistory,
        // temperature: 0.7,
        // max_tokens: 2048
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedApiKey}`
        }
      }
    );

    // Extract the answer from the response
    const answer = response.data.choices[0]?.message?.content || "No answer received";
    
    // Add the assistant's response to the conversation history
    conversationHistory.push({
      role: "assistant",
      content: [{type: "text", text: answer}]
    });
    
    return { success: true, answer };
  } catch (error: any) {
    console.error("Error processing question:", error);
    
    // Handle different error cases
    if (error.response?.status === 401) {
      return { success: false, error: "Invalid API key" };
    } else if (error.response?.status === 429) {
      return { success: false, error: "API key rate limit exceeded or out of credits" };
    } else if (error.response?.data?.error?.message) {
      return { success: false, error: error.response.data.error.message };
    } else if (error.message) {
      return { success: false, error: error.message };
    } else {
      return { success: false, error: "Unknown error occurred" };
    }
  }
} 