import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

// モデルの安全設定
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_KEY as string;
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-pro",
    safetySettings,
  });

  try {
    // リクエストからpromptを取得
    const { history, message } = await req.json();

    let result;
    if (history.length > 0) {
      const chat = model.startChat({
        history,
        safetySettings,
      });
      // モデルを使用してコンテンツを生成
      result = await chat.sendMessage(message);
    } else {
      // モデルを使用してコンテンツを生成
      result = await model.generateContent(message);
    }
    const response = await result.response;
    const resText = await response.text();

    // 結果をJSONとしてクライアントに返す
    return NextResponse.json({ message: resText });
  } catch (error) {
    // エラー処理
    return NextResponse.json({ error });
  }
}
