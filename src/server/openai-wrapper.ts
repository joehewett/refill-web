import { createHash } from "crypto";
import OpenAI from "openai";
import { type Readable } from "openai/_shims";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { queryHashes } from "./db/schema";

export const query = async (
  body: OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming,
  openAIKey: string,
  options?:
    | OpenAI.RequestOptions<Record<string, unknown> | Readable>
    | undefined,
) => {
  const openai = new OpenAI({
    apiKey: openAIKey,
  });

  const hash = createHash("md5");

  const queryHash = hash
    .update(JSON.stringify(body) + JSON.stringify(options))
    .digest("hex");

  const cached = await db.query.queryHashes.findFirst({
    where: eq(queryHashes.hash, queryHash),
  });

  if (cached) {
    return cached.response as OpenAI.Chat.Completions.ChatCompletion;
  }

  const response = await openai.chat.completions.create(body, options);

  await db.insert(queryHashes).values({
    hash: queryHash,
    response,
  });

  return response;
};
