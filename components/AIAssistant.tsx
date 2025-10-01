import React, { useState, useRef, useEffect } from 'react';
import { getOutfitRecommendation } from '../services/geminiService';
import { Outfit } from '../types';
import { ChatIcon, CloseIcon, SendIcon } from './icons';

interface AIAssistantProps {
  outfits: Outfit[];
  onOutfitRecommendation: (outfitName: string) => void;
}

type Message = {
  sender: 'user' | 'ai';
  text: string;
};

const AIAssistant: React.FC<AIAssistantProps> = ({ outfits, onOutfitRecommendation }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: "Hello! How are you feeling today? Let's pick an outfit." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const aiResponseText = await getOutfitRecommendation(input, outfits);
    
    const outfitNameMatch = aiResponseText.match(/\*\*(.*?)\*\*/);
    if (outfitNameMatch && outfitNameMatch[1]) {
      onOutfitRecommendation(outfitNameMatch[1]);
    }
    
    const aiMessage: Message = { sender: 'ai', text: aiResponseText };
    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close AI Assistant' : 'Open AI Assistant'}
        className="fixed bottom-6 right-6 bg-brand-brown text-white rounded-full p-4 shadow-lg hover:bg-brand-dark transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-brown z-50"
      >
        {isOpen ? <CloseIcon className="w-8 h-8" /> : <ChatIcon className="w-8 h-8" />}
      </button>

      <div className={`fixed bottom-24 right-6 w-[90vw] max-w-sm h-[70vh] max-h-[500px] z-50 transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <div className="bg-brand-surface rounded-lg shadow-2xl flex flex-col h-full w-full overflow-hidden border border-brand-base">
          <header className="bg-white border-b border-brand-base p-4 font-bold text-lg flex justify-between items-center text-brand-text">
            AI Assistant
            <button onClick={() => setIsOpen(false)} aria-label="Close chat" className="text-brand-text/60 hover:text-brand-text">
                <CloseIcon className="w-6 h-6" />
            </button>
          </header>
          <main className="flex-1 p-4 overflow-y-auto bg-brand-surface/70">
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg ${msg.sender === 'user' ? 'bg-brand-brown text-white' : 'bg-brand-base text-brand-text'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                 <div className="flex justify-start">
                    <div className="max-w-[80%] p-3 rounded-lg bg-brand-base text-brand-text">
                      <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-brand-text/50 rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-brand-text/50 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                          <div className="w-2 h-2 bg-brand-text/50 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                      </div>
                    </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </main>
          <footer className="p-4 border-t border-brand-base bg-white">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask for an outfit..."
                className="flex-1 px-4 py-2 border border-brand-base rounded-full focus:outline-none focus:ring-2 focus:ring-brand-brown"
                disabled={isLoading}
                aria-label="Chat input"
              />
              <button
                type="submit"
                disabled={isLoading || input.trim() === ''}
                className="bg-brand-brown text-white rounded-full p-3 disabled:bg-brand-base disabled:cursor-not-allowed hover:bg-brand-dark transition"
                aria-label="Send message"
              >
                <SendIcon className="w-5 h-5" />
              </button>
            </form>
          </footer>
        </div>
      </div>
    </>
  );
};

export default AIAssistant;