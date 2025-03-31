import {GoogleGenerativeAI} from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
});


const prompt = `Attached is an image of a property law notice.  
Go over the property law notice and summarize the key legal points, obligations, and any important deadlines. 
Then summarize in 100 words. You may increase the word limit if the notice is lengthy. 
Do not output personal details like names, addresses, or dates. 
Ensure you include numerical references to legal clauses, key stipulations,
 and relevant legal terminology from the notice.  ## Summary:` ;

 export async function POST(req: Request, res: Response) {
    const { base64 } = await req.json();
    const filePart = fileToGenerativePart(base64)

    console.log(filePart);
    const generatedContent = await model.generateContent([prompt, filePart]);

    console.log(generatedContent);
    const textResponse = generatedContent.response.candidates![0].content.parts[0].text;

    return new Response(textResponse, { status: 200 })
}

function fileToGenerativePart(imageData: string) {
    return {
        inlineData: {
            data: imageData.split(",")[1],
            mimeType: imageData.substring(
                imageData.indexOf(":") + 1,
                imageData.lastIndexOf(";")
            ),
        },
    }
}
