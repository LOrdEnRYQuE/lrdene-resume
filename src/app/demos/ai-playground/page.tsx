"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Car, 
  Home, 
  Scissors, 
  Sparkles, 
  Send, 
  ArrowRight
} from "lucide-react";
import { useAction, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import styles from "./playground.module.css";
import { Navbar } from "@/components/Navbar/Navbar";
import LocaleLink from "@/components/I18n/LocaleLink";

const PRIVACY_CONSENT_VERSION = "ai_playground_v1";

const NICHES = [
  {
    id: "car-dealer",
    name: "Car Dealer",
    description: "Helps clients find cars and book test drives.",
    icon: <Car size={24} />,
    color: "#00ffff"
  },
  {
    id: "broker",
    name: "Real Estate Broker",
    description: "Assists with property search and viewings.",
    icon: <Home size={24} />,
    color: "#a855f7"
  },
  {
    id: "salon",
    name: "Beauty Salon",
    description: "Manages bookings and service inquiries.",
    icon: <Scissors size={24} />,
    color: "#ec4899"
  },
  {
    id: "detailing",
    name: "Car Detailing",
    description: "Explains cleaning packages and bookings.",
    icon: <Sparkles size={24} />,
    color: "#3b82f6"
  }
];

type Message = {
  role: "user" | "agent";
  content: string;
};

export default function AIPlayground() {
  const [selectedNiche, setSelectedNiche] = useState(NICHES[0]);
  const [messages, setMessages] = useState<Message[]>([
    { role: "agent", content: `Hi! I'm your ${NICHES[0].name} assistant. How can I help you today?` }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [leadConsent, setLeadConsent] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatAction = useAction(api.ai.chat);
  const createLead = useMutation(api.ai.createLeadFromChat);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleNicheChange = (niche: typeof NICHES[0]) => {
    setSelectedNiche(niche);
    setMessages([{ 
      role: "agent", 
      content: `Switched to ${niche.name} mode. How can I help you with your ${niche.name.toLowerCase()} needs?` 
    }]);
  };

  // Extract info from chat logic (simplified for demo)
  const extractContactInfo = (text: string) => {
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    return emailMatch ? emailMatch[0] : null;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await chatAction({ 
        message: userMessage,
        history: messages.map(m => ({ role: m.role === "agent" ? "assistant" : "user", content: m.content })),
        niche: selectedNiche.id
      });
      
      setMessages(prev => [...prev, { role: "agent", content: response }]);

      // Check for lead info
      const email = extractContactInfo(userMessage);
      if (email && leadConsent) {
        await createLead({
          name: "Playground User", // We could ask for this too
          email,
          projectType: `AI Niche - ${selectedNiche.name}`,
          message: userMessage,
          niche: selectedNiche.id,
          privacyConsent: true,
          privacyConsentAt: Date.now(),
          privacyConsentVersion: PRIVACY_CONSENT_VERSION,
        });
        setMessages(prev => [...prev, { role: "agent", content: "Great! I've saved your info for the team to reach out." }]);
      } else if (email && !leadConsent) {
        setMessages(prev => [
          ...prev,
          { role: "agent", content: "I detected an email, but I will not store it until you enable the privacy consent option below." },
        ]);
      }
    } catch {
      setMessages(prev => [...prev, { role: "agent", content: "I'm sorry, I had an error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <Navbar />
      
      <section className={styles.header}>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          AI Agent Playground
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Select a niche below to interact with a specialized AI agent. 
          Each agent is trained with a unique persona and set of rules.
        </motion.p>
      </section>

      <div className={styles.grid}>
        {NICHES.map((niche, i) => (
          <motion.div
            key={niche.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`${styles.nicheCard} ${selectedNiche.id === niche.id ? styles.active : ""}`}
            onClick={() => handleNicheChange(niche)}
          >
            <div className={styles.iconWrapper} style={{ color: niche.color }}>
              {niche.icon}
            </div>
            <h3>{niche.name}</h3>
            <p>{niche.description}</p>
            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', opacity: 0.8 }}>
              Try this agent <ArrowRight size={14} />
            </div>
          </motion.div>
        ))}
      </div>

      <section className={styles.chatSection}>
        <div className={styles.chatHeader}>
          <div className={styles.iconWrapper} style={{ width: '40px', height: '40px', color: selectedNiche.color }}>
            {selectedNiche.icon}
          </div>
          <div>
            <h4 style={{ margin: 0 }}>{selectedNiche.name} Assistant</h4>
            <span style={{ fontSize: '0.8rem', color: '#00ffff' }}>Live Test Mode</span>
          </div>
        </div>

        <div className={styles.messages} ref={scrollRef}>
          {messages.map((msg, i) => (
            <div 
              key={i} 
              className={`${styles.message} ${msg.role === 'agent' ? styles.agentMessage : styles.userMessage}`}
            >
              <div style={{ fontSize: '0.7rem', opacity: 0.6, marginBottom: '4px' }}>
                {msg.role === 'agent' ? selectedNiche.name : 'You'}
              </div>
              {msg.content}
            </div>
          ))}
          {isLoading && (
            <div className={styles.agentMessage} style={{ opacity: 0.6, padding: '1rem' }}>
              Thinking...
            </div>
          )}
        </div>

        <div className={styles.inputArea}>
          <input 
            type="text" 
            className={styles.input}
            placeholder={`Ask the ${selectedNiche.name} anything...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button className={styles.sendButton} onClick={handleSend} disabled={isLoading}>
            <Send size={20} />
          </button>
        </div>
        <label className={styles.consentRow}>
          <input type="checkbox" checked={leadConsent} onChange={(e) => setLeadConsent(e.target.checked)} />
          <span>
            Allow saving my email from chat when detected. I have read the{" "}
            <LocaleLink href="/privacy" className={styles.privacyLink}>
              Privacy Policy
            </LocaleLink>
            .
          </span>
        </label>
      </section>
    </main>
  );
}
