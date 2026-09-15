import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { SchoolLogoBadge } from './SchoolLogoBadge';
import {
  Bot,
  X,
  Send,
  User,
  Phone,
  HelpCircle,
  Sparkles,
  ArrowRight,
  PhoneCall,
  FileCheck,
  Building,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

interface ChatItem {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  canEscalate?: boolean;
}

export const AskAmaniChatbot: React.FC = () => {
  const { isChatbotOpen, setIsChatbotOpen, toggleChatbot, settings, openAdmissionModal, openEscalationModal } = useApp();

  const [messages, setMessages] = useState<ChatItem[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: "Hello 👋 Welcome to Amani Junior Academy and JSS. I'm the Amani Assistant. How can I help you today?",
      timestamp: 'Just now',
      canEscalate: true,
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [visitorPhone, setVisitorPhone] = useState('');
  const [showDirectContact, setShowDirectContact] = useState(false);

  // Quick suggestion chips
  const suggestions = [
    'What classes do you offer?',
    'Where is the school located in Mazeras?',
    'Who is the Director & Headteacher?',
    'How do I apply for JSS admission?',
    'What are the uniform colors?',
    'Speak with school leadership directly',
  ];

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isChatbotOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isChatbotOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: ChatItem = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    // Check if user specifically asks to speak with human
    const lower = text.toLowerCase();
    if (lower.includes('speak') || lower.includes('human') || lower.includes('call') || lower.includes('director') || lower.includes('headteacher')) {
      setShowDirectContact(true);
    }

    try {
      const response = await api.queryChatbot(text, visitorPhone);
      const botMsg: ChatItem = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        canEscalate: response.canEscalate ?? true,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const fallbackMsg: ChatItem = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `I'm sorry, I don't have that information at the moment. Would you like to speak directly with the school leadership? Deputy Headteacher Vitalice Odhiambo is available at 0746529712, Director Constance Mwaka Pole at 0718540922, and Headteacher Nadhiri Chacha Salim at 0114623408.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        canEscalate: true,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isChatbotOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full shadow-lg border border-amber-300 text-xs font-bold text-[#0F1E36] animate-bounce">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Ask Amani AI Assistant</span>
          </div>

          <button
            onClick={toggleChatbot}
            id="btn-floating-ask-amani"
            aria-label="Open Amani AI Assistant"
            className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0F1E36] via-[#1E3A8A] to-amber-600 text-white shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform duration-200 border-2 border-amber-400 group"
          >
            <div className="relative">
              <Bot className="w-7 h-7 text-amber-300 group-hover:rotate-12 transition-transform" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0F1E36]" />
            </div>
          </button>
        </div>
      )}

      {/* Chat Window */}
      {isChatbotOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[95vw] sm:w-[410px] h-[580px] max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0F1E36] to-[#1A2E4C] text-white p-4 flex items-center justify-between border-b-2 border-amber-500 shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-amber-400 bg-white/10 shrink-0">
                <img src="/amani_logo.jpg" alt="Amani Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="font-['Cinzel',serif] text-sm font-bold tracking-wide flex items-center gap-1.5">
                  <span>AMANI AI ASSISTANT</span>
                  <span className="px-1.5 py-0.2 bg-emerald-500/30 text-emerald-300 text-[10px] font-mono rounded">
                    ONLINE
                  </span>
                </div>
                <div className="text-[11px] text-amber-300 italic font-medium">"STRIVE TO ACHIEVE" &bull; Mazeras</div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setMessages([
                    {
                      id: 'welcome-reset',
                      sender: 'bot',
                      text: "Hello 👋 Welcome to Amani Junior Academy and JSS. I'm the Amani Assistant. How can I help you today?",
                      timestamp: 'Just now',
                      canEscalate: true,
                    },
                  ]);
                }}
                title="Reset conversation"
                className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={toggleChatbot}
                className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Leadership Alert Bar */}
          <div className="bg-amber-50 px-3 py-1.5 text-[11px] text-amber-900 border-b border-amber-200 flex items-center justify-between">
            <span className="flex items-center gap-1 font-semibold truncate mr-2">
              <PhoneCall className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span className="truncate">Deputy: 0746529712 | Dir: 0718540922</span>
            </span>
            <button
              onClick={() => openEscalationModal('Chatbot Direct Call')}
              className="font-bold text-amber-900 bg-amber-200/80 hover:bg-amber-300 px-2 py-0.5 rounded text-[10px] shrink-0 transition"
            >
              Talk to Amani
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
            {messages.map((m) => {
              const isBot = m.sender === 'bot';
              return (
                <div key={m.id} className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}>
                  <div className={`flex items-start gap-2 max-w-[85%] ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                        isBot
                          ? 'bg-[#0F1E36] text-amber-400 border border-amber-400/40'
                          : 'bg-amber-500 text-slate-950 font-extrabold'
                      }`}
                    >
                      {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>

                    <div
                      className={`p-3 rounded-2xl text-xs leading-relaxed shadow-sm ${
                        isBot
                          ? 'bg-white text-slate-800 rounded-tl-none border border-slate-200'
                          : 'bg-[#0F1E36] text-white rounded-tr-none'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{m.text}</p>
                      <div
                        className={`text-[9px] mt-1 text-right ${
                          isBot ? 'text-slate-400' : 'text-slate-300'
                        }`}
                      >
                        {m.timestamp}
                      </div>
                    </div>
                  </div>

                  {/* Human Handoff Quick Action buttons under bot response */}
                  {isBot && m.canEscalate && (
                    <div className="mt-2 ml-9 flex flex-wrap gap-1.5">
                      <button
                        onClick={() => openEscalationModal(m.text.slice(0, 40))}
                        className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-full text-[10px] font-bold flex items-center gap-1 border border-amber-300 transition"
                      >
                        <PhoneCall className="w-3 h-3 text-amber-700" />
                        <span>Talk to the School</span>
                      </button>
                      <button
                        onClick={() => openAdmissionModal()}
                        className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-full text-[10px] font-bold flex items-center gap-1 border border-emerald-300 transition"
                      >
                        <FileCheck className="w-3 h-3 text-emerald-700" />
                        <span>Admission Enquiry</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 text-slate-500 text-xs ml-2 py-1">
                <div className="w-6 h-6 rounded-full bg-[#0F1E36] flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                </div>
                <span className="italic">Amani Assistant is checking verified school facts...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestion Chips */}
          <div className="p-2 bg-slate-100/90 border-t border-slate-200 overflow-x-auto whitespace-nowrap flex gap-1.5 scrollbar-thin">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(s)}
                className="shrink-0 px-2.5 py-1 bg-white hover:bg-amber-50 hover:border-amber-300 text-slate-700 hover:text-[#0F1E36] rounded-full text-[11px] font-medium border border-slate-200 transition active:scale-95"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about admissions, JSS, fees, location..."
              className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 focus:bg-white text-slate-800"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="p-2.5 bg-[#0F1E36] hover:bg-amber-600 disabled:opacity-40 text-white rounded-lg transition active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
