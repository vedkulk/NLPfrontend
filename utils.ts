import { HfInference } from "@huggingface/inference";
import { Pinecone } from "@pinecone-database/pinecone";

const hf = new HfInference(process.env.HUGGING_FACE_TOKEN);

export async function queryPineconeVectorStore(
  client: Pinecone,
  indexName: string,
  namespace: string,
  query: string
): Promise<string> {
  try {
    console.log("🔹 Sending query to Hugging Face...");
    
    // Ensure the HF request does not hang
    const hfOutput = await hf.featureExtraction({
      model: "intfloat/multilingual-e5-large",
      inputs: query,
    });

    if (!hfOutput || !Array.isArray(hfOutput)) {
      throw new Error("❌ Hugging Face output is invalid.");
    }

    const queryEmbedding = Array.from(hfOutput);
    console.log("✅ Hugging Face response received. Embedding generated.");

    console.log("🔹 Querying Pinecone database...");
    const index = client.Index(indexName);
    const queryResponse = await index.namespace(namespace).query({
      topK: 5,
      vector: queryEmbedding as any,
      includeMetadata: true,
      includeValues: false,
    });

    if (!queryResponse || !queryResponse.matches) {
      console.error("❌ Pinecone query returned no valid matches.");
      return "<nomatches>";
    }

    if (queryResponse.matches.length > 0) {
      const concatenatedRetrievals = queryResponse.matches
        .map((match, index) => `\nLegal Findings ${index + 1}: \n ${match.metadata?.chunk}`)
        .join(". \n\n");

      console.log("✅ Retrieved legal findings:");
      console.log(concatenatedRetrievals);

      // Ensure the data stream is properly closed
      if (queryResponse.stream) {
        console.log("🔹 Closing data stream...");
        queryResponse.stream.close(); // <-- This ensures the stream is properly closed
      }

      return concatenatedRetrievals;
    } else {
      console.log("❌ No matches found.");
      return "<nomatches>";
    }
  } catch (error) {
    console.error("❌ Error in queryPineconeVectorStore:", error);
    return "<error>";
  }
}
