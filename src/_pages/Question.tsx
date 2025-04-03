import React, { useState, useEffect, useRef } from "react";
import { useToast } from "../App";
import FollowUpForm from "../components/Common/FollowUpForm";
import ConversationView from "../components/Common/ConversationView";

interface QuestionProps {
  setView: (view: "queue" | "solutions" | "debug" | "question" | "cheatsheet") => void;
}

interface Message {
  role: string;
  content: string;
}

const Question: React.FC<QuestionProps> = ({ setView }) => {
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { showToast } = useToast();

  // Focus the input when the component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    
    // We don't need to call resetConversation here since it will be done in the backend
    // when a new conversation starts
  }, []);

  // Handle the submission of a question
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim()) {
      showToast("Error", "Please enter a question", "error");
      return;
    }

    await processQuestion(question);
    setQuestion("");
  };
  
  // Process a question (initial or follow-up)
  const processQuestion = async (questionText: string) => {
    setIsLoading(true);
    
    // Add the user's question to the messages array
    const userMessage: Message = { role: "user", content: questionText };
    setMessages(prev => [...prev, userMessage]);
    
    try {
      const response = await window.electronAPI.askQuestion(questionText);
      if (response.success) {
        // Add the assistant's response to the messages array
        const assistantMessage: Message = { role: "assistant", content: response.answer || "" };
        setMessages(prev => [...prev, assistantMessage]);
        setConversationStarted(true);
      } else {
        showToast("Error", response.error || "Failed to get an answer", "error");
      }
    } catch (error) {
      console.error("Error asking question:", error);
      showToast("Error", "Failed to communicate with the API", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Submit on Ctrl/Cmd + Enter
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleSubmit(e);
    }
  };
  
  // Handle follow-up question submission
  const handleFollowUpSubmit = async (followUpText: string) => {
    await processQuestion(followUpText);
  };

  return (
    <div className="flex flex-col h-full p-4 bg-zinc-900 text-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Ask a Question</h1>
        <button
          onClick={() => setView("queue")}
          className="px-3 py-1 bg-zinc-800 rounded hover:bg-zinc-700"
        >
          Back to Queue
        </button>
      </div>

      {!conversationStarted ? (
        <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
          <textarea
            ref={inputRef}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your question here..."
            className="flex-grow p-3 mb-4 bg-zinc-800 border border-zinc-700 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          
          <button
            type="submit"
            className="py-2 bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || !question.trim()}
          >
            {isLoading ? "Processing..." : "Submit Question"}
          </button>
        </form>
      ) : (
        <div className="flex flex-col flex-grow">
          <div className="flex-grow overflow-y-auto mb-4">
            <ConversationView messages={messages} />
          </div>
          
          <FollowUpForm 
            onSubmit={handleFollowUpSubmit}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
};

export default Question; 