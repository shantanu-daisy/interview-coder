import React from "react";

interface ConversationViewProps {
  messages: Array<{
    role: string;
    content: string;
  }>;
}

const ConversationView: React.FC<ConversationViewProps> = ({ messages }) => {
  // Filter out system messages and only display user and assistant messages
  const displayMessages = messages.filter(
    (message) => message.role === "user" || message.role === "assistant"
  );

  return (
    <div className="space-y-6">
      {displayMessages.map((message, index) => (
        <div 
          key={index}
          className={`flex flex-col ${
            message.role === "user" ? "items-end" : "items-start"
          }`}
        >
          <div className="max-w-[85%]">
            <div className="text-xs text-zinc-400 mb-1">
              {message.role === "user" ? "You" : "Assistant"}
            </div>
            <div 
              className={`p-3 rounded-lg whitespace-pre-wrap ${
                message.role === "user" 
                  ? "bg-blue-700/60 text-white" 
                  : "bg-zinc-800 text-white border border-zinc-700"
              }`}
            >
              {message.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConversationView; 