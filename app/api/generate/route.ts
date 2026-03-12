import { streamObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const { content } = await req.json();

  const result = await streamObject({
    model: google("gemini-1.5-flash"),
    schema: z.object({
      cards: z.array(
        z.object({
          front: z.string().describe("Concise question or term"),
          back: z.string().describe("Clear, informative answer"),
        })
      ),
    }),
    prompt: `Extract 10-20 high-quality flashcards from the following content.\n\nContent:\n${content}`,
  });

  return result.toTextStreamResponse();
}
