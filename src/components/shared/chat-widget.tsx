"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Mail, CheckCircle2 } from "lucide-react";
import Image from "next/image";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  time: string;
  isEmailForm?: boolean;
}

const quickReplies = [
  "Chci vést účetnictví",
  "Potřebuji daňové poradenství",
  "Zajímá mě ERP implementace",
  "Chci se domluvit na schůzce",
  "Jaké máte ceny?",
  "Kde vás najdu?",
];

const botResponses: Record<string, string> = {
  "Chci vést účetnictví":
    "Skvělé! Vedení účetnictví je naše hlavní služba. Nabízíme kompletní online účetnictví — od zpracování dokladů přes daňová přiznání až po reporting. Ceny začínají od 3 000 Kč/měsíc podle rozsahu. Chcete nezávaznou kalkulaci?",
  "Potřebuji daňové poradenství":
    "Rádi vám pomůžeme s daněmi! Zajišťujeme daňové přiznání (DPFO, DPPO), DPH, silniční daň i daňovou optimalizaci. Máte konkrétní otázku, nebo chcete domluvit konzultaci?",
  "Zajímá mě ERP implementace":
    "Specializujeme se na implementaci ABRA Flexi — od analýzy potřeb přes nastavení, migraci dat až po školení. Jaký systém aktuálně používáte? Rádi připravíme návrh řešení na míru.",
  "Chci se domluvit na schůzce":
    "Samozřejmě! Nabízíme osobní schůzku v naší kanceláři v Praze, nebo online hovor přes Google Meet / Teams. Jaký termín by vám vyhovoval?",
  "Jaké máte ceny?":
    "Naše ceny závisí na rozsahu služeb:\n\n• Daňová evidence: od 2 000 Kč/měsíc\n• Podvojné účetnictví: od 3 000 Kč/měsíc\n• Mzdy: od 300 Kč/zaměstnance\n• ERP implementace: individuální kalkulace\n\nRádi připravíme nezávaznou nabídku přímo pro vás.",
  "Kde vás najdu?":
    "Sídlíme v Praze — Václavské náměstí 1, 110 00 Praha 1. Kancelář je otevřená Po–Pá 8:00–17:00. Můžete nás také kontaktovat na info@fedicfinance.com nebo +420 777 123 456.",
};

// Keyword-based fallback matching
function findResponse(msg: string): string | null {
  const lower = msg.toLowerCase();
  if (lower.includes("účet") || lower.includes("faktur")) return botResponses["Chci vést účetnictví"];
  if (lower.includes("daň") || lower.includes("dph") || lower.includes("přiznání")) return botResponses["Potřebuji daňové poradenství"];
  if (lower.includes("erp") || lower.includes("flexi") || lower.includes("abra")) return botResponses["Zajímá mě ERP implementace"];
  if (lower.includes("schůz") || lower.includes("sejít") || lower.includes("konzultac")) return botResponses["Chci se domluvit na schůzce"];
  if (lower.includes("cen") || lower.includes("kolik") || lower.includes("stoj")) return botResponses["Jaké máte ceny?"];
  if (lower.includes("kde") || lower.includes("adres") || lower.includes("kontakt") || lower.includes("telefon")) return botResponses["Kde vás najdu?"];
  if (lower.includes("díky") || lower.includes("děkuj") || lower.includes("dík")) return "Rádi jsme pomohli! Pokud budete potřebovat cokoliv dalšího, neváhejte se ozvat. 🙂";
  if (lower.includes("ahoj") || lower.includes("dobrý den") || lower.includes("čau")) return "Dobrý den! Jak vám mohu pomoci? Můžete se zeptat na naše služby, ceny, nebo si domluvit schůzku.";
  return null;
}

function getTime() {
  return new Date().toLocaleTimeString("cs-CZ", { hour: "2-digit", minute: "2-digit" });
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      text: "Dobrý den! 👋 Jsem virtuální asistent Fedic Finance. Jak vám mohu pomoci?",
      sender: "bot",
      time: getTime(),
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  function addBotResponse(text: string, isEmailForm?: boolean) {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), text, sender: "bot", time: getTime(), isEmailForm },
      ]);
    }, 600 + Math.random() * 600);
  }

  function handleSend(text?: string) {
    const msg = text || input.trim();
    if (!msg) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: msg, sender: "user", time: getTime() },
    ]);
    setInput("");

    const exact = botResponses[msg];
    if (exact) {
      addBotResponse(exact);
      return;
    }

    const fuzzy = findResponse(msg);
    if (fuzzy) {
      addBotResponse(fuzzy);
      return;
    }

    // Fallback with email capture offer
    addBotResponse(
      "Děkuji za zprávu! Na tuto otázku vám rádi odpovíme osobně. Zanechte nám email a ozveme se vám do 24 hodin, nebo nás kontaktujte přímo na info@fedicfinance.com.",
      true,
    );
  }

  function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: `📧 ${email}`, sender: "user", time: getTime() },
    ]);
    setEmail("");
    setEmailSent(true);
    addBotResponse("Děkujeme! Váš email jsme zaznamenali a ozveme se vám co nejdříve. Přejeme hezký den! 🙂");
  }

  return (
    <>
      {/* Chat bubble */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30"
          >
            <MessageCircle className="h-6 w-6" />
            <span className="absolute inset-0 animate-ping rounded-full bg-primary opacity-20" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 flex h-[500px] w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border bg-card shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-primary px-4 py-3 text-primary-foreground">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Image src="/logo.jpg" alt="FF" width={36} height={36} className="rounded-full" />
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-primary bg-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Fedic Finance</p>
                  <p className="text-xs opacity-80">Online · odpovídáme ihned</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-1 transition-colors hover:bg-primary-foreground/20"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                      msg.sender === "bot"
                        ? "bg-primary/10 text-primary"
                        : "bg-accent/20 text-accent-foreground"
                    }`}
                  >
                    {msg.sender === "bot" ? (
                      <Bot className="h-3.5 w-3.5" />
                    ) : (
                      <User className="h-3.5 w-3.5" />
                    )}
                  </div>
                  <div
                    className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      msg.sender === "bot"
                        ? "rounded-tl-sm bg-muted text-foreground"
                        : "rounded-tr-sm bg-primary text-primary-foreground"
                    }`}
                  >
                    <span className="whitespace-pre-line">{msg.text}</span>
                    <p
                      className={`mt-1 text-[10px] ${
                        msg.sender === "bot" ? "text-muted-foreground" : "text-primary-foreground/60"
                      }`}
                    >
                      {msg.time}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Email form inline */}
              {messages.some((m) => m.isEmailForm) && !emailSent && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <form onSubmit={handleEmailSubmit} className="flex gap-2 ml-9">
                    <div className="flex items-center gap-2 rounded-xl border bg-background px-3 py-2 flex-1">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="váš@email.cz"
                        className="flex-1 bg-transparent text-sm outline-none"
                        required
                      />
                    </div>
                    <button type="submit" className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <Send className="h-3.5 w-3.5" />
                    </button>
                  </form>
                </motion.div>
              )}

              {emailSent && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 ml-9 text-xs text-emerald-600">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Email zaznamenán
                </motion.div>
              )}

              {/* Typing indicator */}
              {typing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                  <div className="rounded-2xl rounded-tl-sm bg-muted px-4 py-3">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:0ms]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:150ms]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:300ms]" />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick replies */}
            {messages.length <= 1 && (
              <div className="flex flex-wrap gap-2 border-t px-4 py-3">
                {quickReplies.map((reply) => (
                  <button
                    key={reply}
                    onClick={() => handleSend(reply)}
                    className="rounded-full border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="border-t p-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Napište zprávu..."
                  className="flex-1 rounded-xl border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-all hover:shadow-lg disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
