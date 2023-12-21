"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Chatbubble, ChatbubbleProps } from "./chatbubble/chatbubble";

export function Chat() {
  const [text, setText] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [messages, setMessages] = useState<ChatbubbleProps[]>([]);

  const run = async (prompt: string) => {
    if (isRunning) {
      return;
    }
    setIsRunning(true);
    // ユーザーメッセージの追加
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", parts: prompt },
    ]);

    try {
      console.log(messages); // デバッグ用
      // APIへのPOSTリクエストの設定
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // リクエストボディにpromptを含める
        body: JSON.stringify({ history: messages, message: prompt }),
      });

      // レスポンスが正常かどうかをチェック
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      // レスポンスデータをJSON形式で取得
      const data = await response.json();
      console.log(data); // デバッグ用
      const resText = data.message;
      // AIメッセージの追加
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "model", parts: resText },
      ]);
    } catch (error) {
      console.error("API call failed:", error);
      throw error;
    }

    setIsRunning(false);
    setText("");
  };

  return (
    <div className="flex flex-col h-screen w-10/12">
      <div className="flex items-center p-4 shadow bg-white">
        <h1 className="text-xl font-semibold">Chat Gemini</h1>
      </div>
      {messages.map((message, i) => {
        return <Chatbubble key={i} {...message} />;
      })}
      <div className="flex-grow overflow-auto"></div>
      <div className="flex items-center p-4 border-t bg-white">
        <Textarea
          className="flex-grow"
          placeholder="Shift + Enterで改行、普通のエンターで送信"
          value={text}
          rows={1}
          onChange={(e) => {
            setText(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              text && run(text);
            }
          }}
        />
        <Button
          className="ml-4"
          onClick={() => {
            text && run(text);
          }}
        >
          Send
        </Button>
      </div>
    </div>
  );
}
