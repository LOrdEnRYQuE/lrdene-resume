"use client";

import { useState, useRef, useEffect } from "react";
import { useAction, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, X, MessageSquare, Zap } from "lucide-react";
import styles from "./ai-agent.module.css";

interface Message {
  role: "user" | "agent";
  content: string;
}

export default function AIAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "agent", content: "Hi! I'm your AI assistant. How can I help you with your project today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const chatAction = useAction(api.ai.chat);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await chatAction({ 
        message: userMessage,
        history: messages.map(m => ({ role: m.role === "agent" ? "assistant" : "user", content: m.content }))
      });
      
      setMessages(prev => [...prev, { role: "agent", content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "agent", content: "I'm sorry, I had an error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.agentWrapper}>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={styles.chatWindow}
          >
            <div className={styles.header}>
              <div className={styles.avatar}>
                <Bot size={18} color="#fff" />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700 }}>AI ASSISTANT</h4>
                <div className={styles.status}>
                  Online
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div className={styles.messages} ref={scrollRef}>
              {messages.map((msg, i) => (
                <div key={i} className={`${styles.message} ${msg.role === 'agent' ? styles.agentMessage : styles.userMessage}`}>
                  {msg.content}
                </div>
              ))}
              {isLoading && (
                <div className={`${styles.message} ${styles.agentMessage}`} style={{ opacity: 0.6 }}>
                  Thinking...
                </div>
              )}
            </div>

            <div className={styles.inputArea}>
              <input 
                type="text" 
                className={styles.input}
                placeholder="Type your message here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <button className={styles.sendBtn} onClick={handleSend} disabled={isLoading}>
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={styles.bubble}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X color="#fff" /> : <MessageSquare color="#fff" />}
      </motion.div>
    </div>
  );
}
