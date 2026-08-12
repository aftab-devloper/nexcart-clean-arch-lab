import { VoyageAIClient } from "voyageai";
import { EmbeddingPort } from "../ports/embedding.port";

const client = new VoyageAIClient({ apiKey: process.env.VOYAGE_API_KEY });

export class VoyageEmbeddingAdapter implements EmbeddingPort {
  async embed(text: string): Promise<number[]> {
    const response = await client.embed({
      input: [text],
      model: "voyage-3-lite",
    });

    const embedding = response.data?.[0]?.embedding;
    if (!embedding) {
      throw new Error("Voyage AI did not return an embedding");
    }
    return embedding;
  }
}