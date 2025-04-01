import { Message, StreamData, streamText } from "ai";
import { Pinecone } from '@pinecone-database/pinecone'
import { queryPineconeVectorStore } from "@/utils";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

export const maxDuration = 60;

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

const google = createGoogleGenerativeAI({
    baseURL: 'https://generativelanguage.googleapis.com/v1beta',
    apiKey: process.env.GEMINI_API_KEY
});

const model = google('models/gemini-1.5-pro-latest', {
    safetySettings: [
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
    ],
});

export async function POST(req:Request, res: Response){
    const reqBody =  await req.json();
    const messages: Message[] = reqBody.messages;
    const userQuestion = messages[messages.length-1].content;
    const reportData = reqBody.data.reportData;
    const searchQuery = `Represent this for searching relevant passages:Client notice says: \n${reportData}\n\n`
    const retrievals = await queryPineconeVectorStore(pc, 'index-one', 'testspace-one', searchQuery)
    const finalPrompt = `Here is a summary of a land acquisition report and a user query. Some generic legal precedents and principles related to property law are also provided that may or may not be relevant to the case.  
    Go through the land acquisition report and answer the user query.  
    Ensure the response is factually accurate and demonstrates a thorough understanding of property law, the report details, and the legal context.  
    Before answering, you may enrich your knowledge by reviewing the provided legal precedents and principles.  
    The legal precedents are general insights and not necessarily applicable to the case at hand. Do not include any precedent if it is not relevant to the specific case.  

    \n\n**Land Acquisition Report Summary:**\n${reportData}.  
    \n**End of Land Acquisition Report**  

    \n\n**User Query:**\n${userQuestion}?  
    \n**End of User Query**  

    \n\n**Legal Precedents & Property Law Principles:**  
    \n\n${retrievals}.  
    \n\n**End of Legal Precedents & Principles**  

    \n\nProvide a thorough justification for your answer.  
    \n\n**Answer:**  
    `;

    const data = new StreamData();
    data.append({
        retrievals: retrievals
    });

    const result = await streamText({
        model: model,
        prompt: finalPrompt,
        onFinish() {
            data.close();
        }
    });

    return result.toDataStreamResponse();
}