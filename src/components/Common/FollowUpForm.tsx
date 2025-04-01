import React, { useState, useRef } from "react";
import { useToast } from "../../App";

interface FollowUpFormProps {
  onSubmit: (question: string) => Promise<void>;
  isLoading: boolean;
}

const FollowUpForm: React.FC<FollowUpFormProps> = ({ onSubmit, isLoading }) => {
  const [followUpQuestion, setFollowUpQuestion] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!followUpQuestion.trim()) {
      showToast("Error", "Please enter a question", "destructive");
      return;
    }

    try {
      await onSubmit(followUpQuestion);
      setFollowUpQuestion("");
    } catch (error) {
      console.error("Error submitting follow-up question:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Submit on Ctrl/Cmd + Enter
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="mt-4 border-t border-zinc-700 pt-4">
      <h3 className="text-md font-semibold mb-2">Ask a Follow-up Question</h3>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <textarea
          ref={inputRef}
          value={followUpQuestion}
          onChange={(e) => setFollowUpQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your follow-up question here..."
          className="p-3 mb-3 bg-zinc-800 border border-zinc-700 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          disabled={isLoading}
        />
        
        <button
          type="submit"
          className="py-2 bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading || !followUpQuestion.trim()}
        >
          {isLoading ? "Processing..." : "Submit Question"}
        </button>
      </form>
    </div>
  );
};

export default FollowUpForm; 