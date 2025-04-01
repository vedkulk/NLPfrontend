import { HfInference } from "@huggingface/inference";
import { Pinecone } from "@pinecone-database/pinecone";

const hf = new HfInference(process.env.HUGGING_FACE_TOKEN)

export async function queryPineconeVectorStore(
    client: Pinecone,
    indexName: string,
    namespace: string,
    query: string
): Promise<string>{
    const hfOutput = await hf.featureExtraction({
        model: "mixedbread-ai/mxbai-embed-large-v1",
        inputs: query,
    });
        console.log(hfOutput)
        const queryEmbedding = Array.from(hfOutput);
        // console.log("Querying database vector store...");
        const index = client.Index(indexName);
        const queryResponse = await index.namespace(namespace).query({
            topK: 5,
            vector: queryEmbedding as any,
            includeMetadata: true,
            // includeValues: true,
            includeValues: false
        });
    //console.log(queryResponse)
    if (queryResponse.matches.length > 0) {
        const concatenatedRetrievals = queryResponse.matches
            .map((match,index) =>`\nLegal Findings ${index+1}: \n ${match.metadata?.chunk}`)
            .join(". \n\n");
        console.log(concatenatedRetrievals)
        return concatenatedRetrievals;
    } else {
        return "<nomatches>";
    }
        return "";
}