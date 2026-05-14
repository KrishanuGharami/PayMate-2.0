'use client'

import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, Send, User, Loader2, AlertCircle } from 'lucide-react';
import { aiChatbotSupport, type AIChatbotSupportOutput } from '@/ai/flows/ai-chatbot-support';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type Message = {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    escalate?: boolean;
};

function SupportChatClient() {
    const searchParams = useSearchParams();
    const issue = searchParams.get('issue');
    const amount = searchParams.get('amount');
    const recipient = searchParams.get('recipient');
    
    const initialMessage = issue === 'PaymentFailed' 
        ? `Hello, I'm having trouble with my payment of ₹${amount} to ${recipient}. Can you help me understand why it failed?`
        : '';

    const [messages, setMessages] = useState<Message[]>(initialMessage ? [{ id: '0', text: initialMessage, sender: 'user' }] : []);
    const [input, setInput] = useState(initialMessage ? '' : '');
    const [isLoading, setIsLoading] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    // Auto-trigger the first message if passed from params
    useEffect(() => {
        if (initialMessage && messages.length === 1 && !isLoading) {
             handleSend(initialMessage);
        }
    }, [initialMessage]);

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({
                top: scrollAreaRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [messages]);

    const handleSend = async (overrideText?: string) => {
        const textToProcess = overrideText || input;
        if (!textToProcess.trim()) return;
        
        if (!overrideText) {
            const userMessage: Message = { id: Date.now().toString(), text: textToProcess, sender: 'user' };
            setMessages(prev => [...prev, userMessage]);
        }
        
        setInput('');
        setIsLoading(true);

        const transactionDetails = issue === 'PaymentFailed' 
            ? `The user just tried to send ₹${amount} to ${recipient} but it failed or was blocked by fraud detection.` 
            : undefined;

        try {
            const response: AIChatbotSupportOutput = await aiChatbotSupport({ 
                query: textToProcess,
                transactionDetails
            });
            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: response.response,
                sender: 'bot',
                escalate: response.escalateToHuman
            };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('AI Support Chat Error:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: 'Sorry, I encountered an error. This might be due to a missing AI service API key. Please check your environment configuration.',
                sender: 'bot',
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="p-4 sm:p-6 lg:p-8 h-full flex flex-col">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">AI Support Chat</h1>
                <p className="text-muted-foreground">Get instant help with your questions.</p>
            </header>
            <Card className="flex-1 flex flex-col shadow-md">
                <CardContent className="p-0 flex-1 flex flex-col">
                    <ScrollArea className="flex-1 p-6" viewportRef={scrollAreaRef}>
                        <div className="space-y-6">
                            {messages.map(message => (
                                <div key={message.id} className={cn("flex items-start gap-4", message.sender === 'user' ? 'justify-end' : 'justify-start')}>
                                    {message.sender === 'bot' && (
                                        <Avatar>
                                            <AvatarFallback className="bg-primary text-primary-foreground"><Bot /></AvatarFallback>
                                        </Avatar>
                                    )}
                                    <div className={cn("max-w-lg p-3 rounded-lg shadow-sm", message.sender === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted rounded-bl-none')}>
                                        <p className="text-sm">{message.text}</p>
                                        {message.escalate && (
                                            <Alert variant="destructive" className="mt-3">
                                                <AlertCircle className="h-4 w-4" />
                                                <AlertTitle>Escalation Required</AlertTitle>
                                                <AlertDescription className="text-xs">
                                                    Our support team will contact you shortly.
                                                </AlertDescription>
                                            </Alert>
                                        )}
                                    </div>
                                    {message.sender === 'user' && (
                                        <Avatar>
                                            <AvatarFallback><User /></AvatarFallback>
                                        </Avatar>
                                    )}
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex items-start gap-4 justify-start">
                                    <Avatar>
                                        <AvatarFallback className="bg-primary text-primary-foreground"><Bot /></AvatarFallback>
                                    </Avatar>
                                    <div className="max-w-md p-3 rounded-lg bg-muted flex items-center shadow-sm">
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        <span className="text-sm">Thinking...</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                    <div className="p-4 border-t bg-background/50">
                        <div className="flex gap-2">
                            <Input 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type your message..."
                                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                                disabled={isLoading}
                                className="h-11"
                            />
                            <Button onClick={() => handleSend()} disabled={isLoading || !input.trim()} size="icon" className="h-11 w-11 shrink-0">
                                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                                <span className="sr-only">Send</span>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default function SupportPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center"><Loader2 className="animate-spin mx-auto"/>Loading Support...</div>}>
            <SupportChatClient />
        </Suspense>
    )
}
