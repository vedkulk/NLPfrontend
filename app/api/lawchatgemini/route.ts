import { Message } from "ai";
import { Pinecone } from '@pinecone-database/pinecone'
import { queryPineconeVectorStore } from "@/utils";

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });


export async function POST(req:Request, res: Response){
    const reqBody =  await req.json();
    const messages: Message[] = reqBody.messages;
    const userQuestion = messages[messages.length-1].content;
    const reportData = reqBody.data.reportData;
    const searchQuery = `Client notice says: \n${reportData}\n\n`
    const retrievals = await queryPineconeVectorStore(pc, 'index-one', 'testspace-one', searchQuery)
    return new Response("dummy", {status:200})
}