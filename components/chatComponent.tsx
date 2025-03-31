import React from 'react'
import { Badge } from './ui/badge'
import { useChat } from '@ai-sdk/react';
import MessageBox from './messageBox';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { CornerDownLeft, Loader2 } from 'lucide-react';


type Props = {
    reportData?: string
  }

const ChatComponent = ({reportData}: Props) => {
    const { messages, input, handleInputChange, isLoading, handleSubmit } = useChat({api:"api/lawchatgemini"});
    return (
        <>
            <div className="h-full bg-muted/50 relative flex flex-col min-h-[50vh] rounded-xl p-4 gap-4">
                <Badge variant={'outline'}
                className={`absolute right-3 top-1.5 ${reportData && "bg-[#00B612]"}`}
            >
                {reportData ? "✓ Report Added" : "No Report Added"}
            </Badge>
            <div className='flex-1'>
                <div className='flex flex-col gap-4'>
                    {
                        messages.map((m,idx)=>{
                            return <MessageBox key={idx} role={m.role} content={m.content}/>
                        })
                    }
                </div>
            </div>
            <form
        className="relative overflow-hidden rounded-lg border bg-background"
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit(event, {
            data: {
              reportData: reportData as string,
            },
          });
        }}
      >
        <Textarea
          value={input}
          onChange={handleInputChange}
          placeholder="Type your query here..."
          className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
        />
        <div className="flex items-center p-3 pt-0">
          <Button
            disabled={isLoading}
            type="submit"
            size="sm"
            className="ml-auto"
          >
            {isLoading ? "Analysing..." : "3. Ask"}
            {isLoading ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <CornerDownLeft className="size-3.5" />
            )}
          </Button>
        </div>
      </form>
            </div>
        </>
    )
}

export default ChatComponent