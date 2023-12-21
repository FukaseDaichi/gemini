"use client";

import ReactMarkdown from "react-markdown";

export type ChatbubbleProps = {
  role?: "user" | "model";
  parts?: string;
};
export function Chatbubble(props: ChatbubbleProps) {
  return (
    <div className="flex flex-col space-y-2">
      {props.role === "user" ? (
        <span className="font-bold">あなた</span>
      ) : (
        <div className="flex items-center space-x-2">
          <BotIcon className="text-blue-500" />
          <span className="font-bold">Gemini</span>
        </div>
      )}
      <div className="bg-gray-100 p-3 rounded-lg">
        <ReactMarkdown className="test">{props.parts}</ReactMarkdown>
      </div>
    </div>
  );

  function BotIcon(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 8V4H8" />
        <rect width="16" height="12" x="4" y="8" rx="2" />
        <path d="M2 14h2" />
        <path d="M20 14h2" />
        <path d="M15 13v2" />
        <path d="M9 13v2" />
      </svg>
    );
  }
}
