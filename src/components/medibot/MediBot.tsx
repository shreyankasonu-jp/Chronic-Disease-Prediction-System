import { useEffect, useMemo, useRef, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Message type stored in localStorage-friendly format
interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  links?: { label: string; url: string }[];
  timestamp: number;
}

const STORAGE_KEY = "medibot-messages";

const QUICK_REPLIES: { label: string; value: string }[] = [
  { label: "Accuracy", value: "How accurate is this platform?" },
  { label: "How to use", value: "How do I use this platform?" },
  { label: "Pneumonia", value: "Tell me about pneumonia" },
  { label: "Stroke", value: "Tell me about stroke" },
  { label: "Diabetes", value: "Tell me about diabetes" },
  { label: "Book Doctor", value: "Where can I consult a doctor?" },
];

function getBotReply(inputRaw: string): Omit<ChatMessage, "id" | "sender" | "timestamp"> {
  const input = inputRaw.trim().toLowerCase();

  const linksAll = [
    { label: "Pneumonia – Pulmonologist", url: "https://www.practo.com/bangalore/pulmonologist" },
    { label: "Stroke – Stroke Specialist", url: "https://www.practo.com/bangalore/treatment-for-stroke?utm_source=opd_google_Pmax&utm_medium=&utm_campaign=21045690443&gad_source=1&gad_campaignid=21387241615&gbraid=0AAAAADgl2cI8W2vtFxgPegZJKDXbHDtY0&gclid=Cj0KCQjwzOvEBhDVARIsADHfJJSxyo3Y0k4P--4_0SGCkrBWndYMOhJBt4H1muDFCu7lNGcxYsR_fgYaArMEEALw_wcB" },
    { label: "Diabetes – Diabetologist", url: "https://www.practo.com/bangalore/diabetologist?utm_source=opd_google_Pmax&utm_medium=&utm_campaign=22055233835&gad_source=1&gad_campaignid=22055283002&gbraid=0AAAAADgl2cJ5kEcCnARoraoCWWNAMhCCl&gclid=Cj0KCQjwzOvEBhDVARIsADHfJJSDF4WrhRYcLIcX_51MYo0udCjDiqMjcwqR9jrkZqOj44xi5MRW8MQaAl_QEALw_wcB" },
  ];

  // Disease keyword detection
  if (input.includes("pneumonia")) {
    return {
      text:
        "Pneumonia is a lung infection caused by bacteria, viruses, or fungi. Early diagnosis is key for timely treatment. 💙",
      links: [{ label: "Consult a Pulmonologist", url: "https://www.practo.com/bangalore/pulmonologist" }],
    };
  }
  if (input.includes("stroke")) {
    return {
      text:
        "A stroke occurs when blood flow to the brain is blocked or reduced, causing brain damage. Early intervention saves lives. 🧠",
      links: [{ label: "Consult a Stroke Specialist", url: "https://www.practo.com/bangalore/treatment-for-stroke?utm_source=opd_google_Pmax&utm_medium=&utm_campaign=21045690443&gad_source=1&gad_campaignid=21387241615&gbraid=0AAAAADgl2cI8W2vtFxgPegZJKDXbHDtY0&gclid=Cj0KCQjwzOvEBhDVARIsADHfJJSxyo3Y0k4P--4_0SGCkrBWndYMOhJBt4H1muDFCu7lNGcxYsR_fgYaArMEEALw_wcB" }],
    };
  }
  if (input.includes("diabetes")) {
    return {
      text:
        "Diabetes affects how your body processes blood sugar. Lifestyle changes and medications can help manage it. 💉",
      links: [{ label: "Consult a Diabetologist", url: "https://www.practo.com/bangalore/diabetologist?utm_source=opd_google_Pmax&utm_medium=&utm_campaign=22055233835&gad_source=1&gad_campaignid=22055283002&gbraid=0AAAAADgl2cJ5kEcCnARoraoCWWNAMhCCl&gclid=Cj0KCQjwzOvEBhDVARIsADHfJJSDF4WrhRYcLIcX_51MYo0udCjDiqMjcwqR9jrkZqOj44xi5MRW8MQaAl_QEALw_wcB" }],
    };
  }

  // Common Q&A
  if (input.includes("how accurate") || input.includes("accuracy")) {
    return {
      text:
        "Our Pneumonia model is ~92.6% accurate, Stroke ~85%, and Diabetes ~88%. We continuously improve these with new data. ✅",
    };
  }

  if (input.includes("how do i use") || input.includes("use this platform") || input.includes("get started")) {
    return {
      text:
        "Select a disease, then upload an X-ray for Pneumonia or fill in your health details for Stroke/Diabetes, and press ‘Predict’. I’ll guide you! ✨",
    };
  }

  if (input.includes("consult") || input.includes("doctor") || input.includes("specialist")) {
    return {
      text: "Here are trusted consultation links:",
      links: linksAll,
    };
  }

  // Fallback
  return {
    text:
      "I’m still learning! But you can consult a specialist here. If you mention ‘pneumonia’, ‘stroke’, or ‘diabetes’, I’ll share more details.",
    links: linksAll,
  };
}

const MediBot = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showTooltip, setShowTooltip] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);

  // Load from storage once
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as ChatMessage[];
        setMessages(parsed);
      } catch {
        // ignore
      }
    }
  }, []);

  // Initial greeting only if no messages exist
  useEffect(() => {
    if (messages.length === 0) {
      const greeting: ChatMessage = {
        id: crypto.randomUUID(),
        sender: "bot",
        text: "👋 Hi! I’m MediBot. How can I assist you today?",
        timestamp: Date.now(),
      };
      setMessages([greeting]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist to storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, open]);

  const sendMessage = (textValue?: string) => {
    const clean = (textValue ?? input).trim();
    if (!clean) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      sender: "user",
      text: clean,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Simulate bot thinking delay
    const reply = getBotReply(clean);
    setTimeout(() => {
      const botMsg: ChatMessage = {
        id: crypto.randomUUID(),
        sender: "bot",
        text: reply.text,
        links: reply.links,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 350);
  };

  const containerClasses =
    "fixed z-50 right-4 bottom-24 w-[calc(100%-2rem)] max-w-sm md:max-w-md glass rounded-xl shadow-glow border animate-enter";

  return (
    <>
      <style>{`
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-5px) scale(1.05); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
          50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.8); }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(20deg); }
          75% { transform: rotate(-20deg); }
        }
        
        @keyframes rainbow {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }
        
        .bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }
        
        .pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        
        .slide-in-right {
          animation: slideInRight 0.3s ease-out;
        }
        
        .animate-wave {
          animation: wave 1s ease-in-out infinite;
        }
        
        .animate-rainbow {
          animation: rainbow 3s linear infinite;
        }
      `}</style>
      
      {/* Floating trigger button with tooltip */}
      <div className="fixed z-50 bottom-4 right-4">
        {/* Compact Welcome tooltip */}
        {showTooltip && !open && (
          <div className="absolute bottom-20 right-0 mb-2 slide-in-right">
            <div className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-3 py-2 rounded-lg shadow-xl relative overflow-hidden max-w-xs">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-teal-400 opacity-20 animate-pulse"></div>
              <div className="relative z-10 flex items-center gap-2">
                <span className="text-lg animate-bounce">🤖</span>
                <div className="flex-1">
                  <div className="text-xs font-medium">Hi! Happy to serve you!</div>
                  <div className="text-xs opacity-80">Click for medical help</div>
                </div>
                <span className="animate-wave">👋</span>
              </div>
              {/* Arrow */}
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-blue-500"></div>
              {/* Close button */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTooltip(false);
                }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
              >
                ×
              </button>
            </div>
          </div>
        )}
        
        <button
          aria-label="Open MediBot chat"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpen((prev) => !prev);
            setShowTooltip(false);
          }}
          className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 via-teal-500 to-purple-500 text-white shadow-2xl hover:shadow-3xl bounce-gentle pulse-glow hover:scale-110 focus:outline-none transition-all duration-300 relative overflow-hidden group"
        >
          <span className="sr-only">Toggle MediBot</span>
          
          {/* Animated background rings */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-spin" style={{ animationDuration: '3s' }}></div>
          <div className="absolute inset-1 rounded-full bg-gradient-to-r from-teal-400 to-purple-400 opacity-0 group-hover:opacity-50 transition-opacity duration-300 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}></div>
          
          {/* Robot icon with enhanced design */}
          <div className="relative z-10 flex items-center justify-center h-full w-full">
            {open ? (
              <svg className="h-8 w-8 text-white group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <div className="relative">
                <svg className="h-8 w-8 text-white group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {/* Robot eyes */}
                <div className="absolute top-1 left-2 w-1 h-1 bg-white rounded-full animate-pulse"></div>
                <div className="absolute top-1 right-2 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              </div>
            )}
          </div>
          
          {/* Enhanced notification dot */}
          {!open && (
            <div className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-75"></div>
            </div>
          )}
          
          {/* Floating particles */}
          <div className="absolute -top-1 left-2 w-1 h-1 bg-white rounded-full animate-ping opacity-60" style={{ animationDelay: '0.2s' }}></div>
          <div className="absolute -bottom-1 right-2 w-1 h-1 bg-white rounded-full animate-ping opacity-60" style={{ animationDelay: '0.8s' }}></div>
          <div className="absolute top-1/2 -left-1 w-0.5 h-0.5 bg-white rounded-full animate-pulse opacity-80" style={{ animationDelay: '1.2s' }}></div>
        </button>
      </div>

      {/* Chat window */}
      {open && (
        <div className="fixed z-50 right-4 bottom-24 w-80 max-w-[calc(100vw-2rem)] bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden" role="dialog" aria-label="MediBot chat window">
          <style>{`
            @keyframes chat-shimmer {
              0% { background-position: -200% 0; }
              100% { background-position: 200% 0; }
            }
            
            @keyframes message-slide {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            
            .chat-shimmer {
              background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
              background-size: 200% 100%;
              animation: chat-shimmer 2s infinite;
            }
            
            .message-slide { animation: message-slide 0.3s ease-out; }
          `}</style>
          
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-teal-50/50 to-purple-50/50"></div>
          <div className="absolute inset-0 chat-shimmer"></div>
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b bg-gradient-to-r from-blue-500/10 via-teal-500/10 to-purple-500/10 backdrop-blur-sm">
            <style>{`
              @keyframes bot-pulse {
                0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
                50% { transform: scale(1.1); box-shadow: 0 0 30px rgba(59, 130, 246, 0.8); }
              }
              
              @keyframes status-glow {
                0%, 100% { opacity: 0.7; }
                50% { opacity: 1; }
              }
              
              .bot-pulse { animation: bot-pulse 2s ease-in-out infinite; }
              .status-glow { animation: status-glow 1.5s ease-in-out infinite; }
            `}</style>
            <div className="relative">
              <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg bot-pulse">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              {/* Robot eyes */}
              <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
              <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>
            <div className="flex-1">
              <div className="font-bold text-lg bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                MediBot AI
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 bg-green-500 rounded-full status-glow"></div>
                <span className="text-green-600 font-medium">Online & Ready to Assist</span>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setOpen(false)} 
              aria-label="Close chat"
              className="hover:bg-red-100 hover:text-red-600 transition-all duration-300 hover:scale-110"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>

          {/* Messages */}
          <div ref={listRef} className="p-4 space-y-4 overflow-y-auto relative z-10" style={{ maxHeight: "60vh" }}>
            {messages.map((m, index) => (
              <div key={m.id} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"} message-slide`} style={{ animationDelay: `${index * 0.1}s` }}>
                {m.sender === "bot" && (
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center mr-2 shadow-lg flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-lg relative overflow-hidden ${
                    m.sender === "user"
                      ? "bg-gradient-to-r from-blue-500 to-teal-500 text-white"
                      : "bg-white border border-gray-200 text-gray-800"
                  }`}
                >
                  {m.sender === "user" && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-teal-400 opacity-20"></div>
                  )}
                  {m.sender === "bot" && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-teal-50 opacity-50"></div>
                  )}
                  <div className="relative z-10 whitespace-pre-wrap font-medium">{m.text}</div>
                  {m.links && m.links.length > 0 && (
                    <ul className="mt-3 space-y-2 relative z-10">
                      {m.links.map((l) => (
                        <li key={l.url}>
                          <a
                            className="inline-flex items-center gap-2 text-sm bg-gradient-to-r from-blue-600 to-teal-600 text-white px-3 py-1.5 rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all duration-300 hover:scale-105 shadow-md"
                            href={l.url}
                            target="_blank"
                            rel="noreferrer noopener"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            {l.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {m.sender === "user" && (
                  <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center ml-2 shadow-lg flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick replies */}
          <div className="px-4 pb-3 relative z-10">
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
              {QUICK_REPLIES.map((q, index) => (
                <Button
                  key={q.label}
                  variant="outline"
                  size="sm"
                  className="shrink-0 bg-gradient-to-r from-blue-50 to-teal-50 border-blue-200 hover:from-blue-100 hover:to-teal-100 hover:border-blue-300 text-blue-700 hover:text-blue-800 transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md"
                  onClick={() => sendMessage(q.value)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {q.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t bg-gradient-to-r from-gray-50 to-blue-50 flex items-center gap-3 relative z-10">
            <div className="flex-1 relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Ask me anything about your health..."
                aria-label="Type your message"
                className="pr-12 border-2 border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 rounded-xl bg-white/80 backdrop-blur-sm transition-all duration-300"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
            <Button 
              onClick={() => sendMessage()} 
              aria-label="Send message"
              className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 rounded-xl p-3"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default MediBot;
