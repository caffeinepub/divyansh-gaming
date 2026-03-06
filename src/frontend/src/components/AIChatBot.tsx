import { Bot, Send, X, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  playChatClose,
  playChatOpen,
  playClick,
  playNotification,
} from "../hooks/useSoundEffects";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
  id: string;
  from: "user" | "aria";
  text: string;
  timestamp: Date;
  index: number;
}

// ─── Accent colour cycle (cyan → violet → pink → gold → green) ───────────────
const ACCENT_COLORS = [
  {
    color: "oklch(0.75 0.2 200)",
    glow: "oklch(0.75 0.2 200 / 0.4)",
    label: "cyan",
  },
  {
    color: "oklch(0.7 0.28 300)",
    glow: "oklch(0.7 0.28 300 / 0.4)",
    label: "violet",
  },
  {
    color: "oklch(0.75 0.3 340)",
    glow: "oklch(0.75 0.3 340 / 0.4)",
    label: "pink",
  },
  {
    color: "oklch(0.82 0.22 60)",
    glow: "oklch(0.82 0.22 60 / 0.4)",
    label: "gold",
  },
  {
    color: "oklch(0.72 0.25 145)",
    glow: "oklch(0.72 0.25 145 / 0.4)",
    label: "green",
  },
];

// ─── Response Engine ──────────────────────────────────────────────────────────
const QUICK_REPLIES = [
  "Game Tips",
  "How to win?",
  "Leaderboard help",
  "Best games",
  "Racing tips",
];

function getARIAResponse(input: string): string {
  const lower = input.toLowerCase();

  if (/tip|tips|how to win/.test(lower)) {
    return "Pro tip: Practice makes perfect! Use Arrow keys or A/D in the racing game to dodge enemy cars. In mini-games, focus on timing over speed. Want tips for a specific game?";
  }
  if (/race|racing|car/.test(lower)) {
    return "In the Car Racing game: press Space to start, use Arrow keys or A/D to dodge. Enemy cars speed up over time — stay in the middle lane for maximum dodge options!";
  }
  if (/leaderboard|rank|score/.test(lower)) {
    return "The leaderboard tracks top players across all games. XxDivyanshxX currently holds #1 with 98,750 points in Ghost Protocol! Can you beat that?";
  }
  if (/game|games|best/.test(lower)) {
    return "DIVYANSH GAMING features 5 featured titles plus 10 mini-games! Top picks: Ghost Protocol (Tactical FPS, 10/10), Neon Phantoms (Action RPG, 9/10), Dragon's Ascent (Fantasy, 9/10). Which genre do you prefer?";
  }
  if (/news|update|season/.test(lower)) {
    return "Season 5 'Cyber Awakening' is LIVE! 100 tiers of rewards, legendary skins, and a Ghost Protocol Championship with a $50,000 prize pool. Check the News section for full details!";
  }
  if (/mini|mini-game/.test(lower)) {
    return "We have 10 mini-games: Snake, Brick Breaker, Flappy Bird, Whack-A-Mole, Memory Match, Reaction Test, Typing Test, Asteroid Shooter, Pong, and Color Match. Find them in the Mini Games section!";
  }
  if (/help|hello|hi/.test(lower)) {
    return "I'm ARIA, your gaming AI. I can help with game tips, leaderboard info, news updates, and more. What would you like to know?";
  }

  return "Interesting question, gamer! I'm still learning. Try asking about game tips, the leaderboard, racing strategies, or the latest news. I'm here to help you dominate!";
}

// ─── Typing Indicator ─────────────────────────────────────────────────────────
function TypingDots() {
  const dotColors = [
    "oklch(0.75 0.2 200)", // cyan
    "oklch(0.75 0.3 340)", // pink
    "oklch(0.7 0.28 300)", // violet
  ];
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: dotColors[i] }}
          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 0.8,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ─── Message Bubble ────────────────────────────────────────────────────────────
function MessageBubble({ message }: { message: Message }) {
  const isUser = message.from === "user";
  const accent = ACCENT_COLORS[message.index % ACCENT_COLORS.length];

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <motion.div
      className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {/* Avatar */}
      {!isUser && (
        <div
          className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${accent.color.replace(")", " / 0.3)")} , oklch(0.13 0.025 270))`,
            border: `1px solid ${accent.color.replace(")", " / 0.5)")}`,
            boxShadow: `0 0 10px ${accent.glow}`,
          }}
        >
          <Bot className="w-3.5 h-3.5" style={{ color: accent.color }} />
        </div>
      )}

      <div className="flex flex-col gap-0.5 max-w-[80%]">
        {/* Bubble */}
        <div
          className={`px-3 py-2 rounded-lg text-xs leading-relaxed ${
            isUser ? "font-body text-right" : "font-body text-left"
          }`}
          style={
            isUser
              ? {
                  background:
                    "linear-gradient(135deg, oklch(0.7 0.3 340 / 0.25), oklch(0.65 0.28 300 / 0.2))",
                  border: "1px solid oklch(0.75 0.3 340 / 0.45)",
                  color: "oklch(var(--foreground))",
                  borderBottomRightRadius: "2px",
                  boxShadow: "0 0 12px oklch(0.75 0.3 340 / 0.15)",
                }
              : {
                  background: "oklch(0.13 0.025 270 / 0.9)",
                  border: `1px solid ${accent.color.replace(")", " / 0.2)")}`,
                  color: "oklch(var(--foreground) / 0.9)",
                  borderBottomLeftRadius: "2px",
                  boxShadow: `0 0 8px ${accent.glow.replace("0.4)", "0.1)")}`,
                }
          }
        >
          {message.text}
        </div>
        {/* Timestamp */}
        <div
          className={`text-[10px] font-mono px-1 ${isUser ? "text-right" : "text-left"}`}
          style={{
            color: isUser
              ? "oklch(0.75 0.3 340 / 0.5)"
              : `${accent.color.replace(")", " / 0.45)")}`,
          }}
        >
          {formatTime(message.timestamp)}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "aria-greeting",
      from: "aria",
      text: "Hey Gamer! I'm ARIA, your gaming assistant. How can I level up your experience today? 🎮",
      timestamp: new Date(),
      index: 0,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const ariaMessageCount = useRef(1); // greeting is index 0
  const toggleTimestampsRef = useRef<number[]>([]);

  // Listen for custom open event (from nav link)
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("openAIChat", handleOpen);
    return () => window.removeEventListener("openAIChat", handleOpen);
  }, []);

  // Scroll after new messages or open state change
  // biome-ignore lint/correctness/useExhaustiveDependencies: ref mutation only, deps intentional for trigger
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isTyping, isOpen]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    playClick();

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      from: "user",
      text: trimmed,
      timestamp: new Date(),
      index: 0, // index not used for user messages styling
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // Simulate ARIA thinking for 1.5s
    setTimeout(() => {
      const response = getARIAResponse(trimmed);
      const msgIndex = ariaMessageCount.current;
      ariaMessageCount.current += 1;
      const ariaMsg: Message = {
        id: `aria-${Date.now()}`,
        from: "aria",
        text: response,
        timestamp: new Date(),
        index: msgIndex,
      };
      playNotification();
      setIsTyping(false);
      setMessages((prev) => [...prev, ariaMsg]);
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const hasUserMessages = messages.some((m) => m.from === "user");

  // Quick reply chip accent colours by index
  const chipColors = QUICK_REPLIES.map(
    (_, i) => ACCENT_COLORS[i % ACCENT_COLORS.length],
  );

  return (
    <>
      {/* Chat Panel — rainbow gradient border wrapper */}
      <AnimatePresence>
        {isOpen && (
          <div
            className="fixed bottom-20 right-4 sm:right-6 z-60 w-80 sm:w-96"
            style={{
              padding: "2px",
              background:
                "linear-gradient(135deg, #00ffff, #bf00ff, #ff00aa, #ffd700, #00ff88, #00ffff)",
              borderRadius: "14px",
              height: "484px", // 480 + 4px for border
              boxShadow:
                "0 0 40px oklch(0.75 0.2 200 / 0.15), 0 0 40px oklch(0.7 0.28 300 / 0.1), 0 20px 60px oklch(0 0 0 / 0.6)",
            }}
          >
            <motion.div
              data-ocid="chatbot.dialog"
              style={{
                height: "100%",
                background: "oklch(0.085 0.015 270 / 0.97)",
                backdropFilter: "blur(12px)",
                borderRadius: "12px",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* ── Header ────────────────────────────────────────────── */}
              <div
                className="flex-shrink-0 flex items-center justify-between px-4 py-3"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.7 0.2 200 / 0.2), oklch(0.65 0.28 300 / 0.2), oklch(0.7 0.3 340 / 0.2), oklch(0.8 0.25 60 / 0.15))",
                  borderBottom: "1px solid oklch(0.75 0.2 200 / 0.15)",
                }}
              >
                <div className="flex items-center gap-2.5">
                  {/* ARIA avatar — rainbow gradient */}
                  <div
                    className="relative w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.7 0.2 200 / 0.4), oklch(0.65 0.28 300 / 0.35), oklch(0.7 0.3 340 / 0.3))",
                      border: "1px solid oklch(0.75 0.3 340 / 0.6)",
                      boxShadow:
                        "0 0 12px oklch(0.7 0.28 300 / 0.4), 0 0 20px oklch(0.75 0.2 200 / 0.2)",
                    }}
                  >
                    <Bot
                      className="w-4 h-4"
                      style={{ color: "oklch(0.82 0.22 60)" }}
                    />
                    {/* Online dot — rainbow cycling via CSS animation */}
                    <span
                      className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 rainbow-dot"
                      style={{
                        borderColor: "oklch(0.085 0.015 270)",
                      }}
                    />
                  </div>

                  <div>
                    {/* ARIA rainbow gradient text */}
                    <div
                      className="font-mono font-bold text-sm tracking-widest"
                      style={{
                        background:
                          "linear-gradient(90deg, #00ffff, #bf00ff, #ff00aa)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      ARIA
                    </div>
                    <div className="font-body text-xs text-foreground/40 leading-none mt-0.5">
                      Gaming AI Assistant
                    </div>
                  </div>
                </div>

                {/* Close button */}
                <button
                  type="button"
                  data-ocid="chatbot.close_button"
                  className="w-7 h-7 rounded flex items-center justify-center transition-all duration-200 hover:bg-foreground/10"
                  style={{ color: "oklch(var(--foreground) / 0.4)" }}
                  onClick={() => {
                    playChatClose();
                    setIsOpen(false);
                  }}
                  aria-label="Close chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* ── Messages ──────────────────────────────────────────── */}
              <div
                className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-3"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "oklch(0.7 0.28 300 / 0.3) transparent",
                }}
              >
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} />
                ))}

                {/* Typing indicator */}
                <AnimatePresence>
                  {isTyping && (
                    <motion.div
                      className="flex items-end gap-2"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          background:
                            "linear-gradient(135deg, oklch(0.7 0.28 300 / 0.35), oklch(0.75 0.3 340 / 0.3))",
                          border: "1px solid oklch(0.75 0.3 340 / 0.5)",
                          boxShadow: "0 0 10px oklch(0.75 0.3 340 / 0.3)",
                        }}
                      >
                        <Bot
                          className="w-3.5 h-3.5"
                          style={{ color: "oklch(0.75 0.3 340)" }}
                        />
                      </div>
                      <div
                        className="rounded-lg"
                        style={{
                          background: "oklch(0.13 0.025 270)",
                          border: "1px solid oklch(0.7 0.28 300 / 0.2)",
                          borderBottomLeftRadius: "2px",
                        }}
                      >
                        <TypingDots />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div ref={messagesEndRef} />
              </div>

              {/* ── Quick Replies ─────────────────────────────────────── */}
              <AnimatePresence>
                {!hasUserMessages && !isTyping && (
                  <motion.div
                    className="flex-shrink-0 px-3 pb-2 flex flex-wrap gap-1.5"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {QUICK_REPLIES.map((reply, i) => {
                      const chipAccent = chipColors[i];
                      return (
                        <button
                          key={reply}
                          type="button"
                          className="px-2.5 py-1 rounded-full text-xs font-mono transition-all duration-200 active:scale-95"
                          style={{
                            border: `1px solid ${chipAccent.color.replace(")", " / 0.45)")}`,
                            color: chipAccent.color,
                            background: chipAccent.color.replace(
                              ")",
                              " / 0.06)",
                            ),
                            boxShadow: `0 0 8px ${chipAccent.glow.replace("0.4)", "0.15)")}`,
                          }}
                          onMouseEnter={(e) => {
                            (
                              e.currentTarget as HTMLButtonElement
                            ).style.background = chipAccent.color.replace(
                              ")",
                              " / 0.15)",
                            );
                          }}
                          onMouseLeave={(e) => {
                            (
                              e.currentTarget as HTMLButtonElement
                            ).style.background = chipAccent.color.replace(
                              ")",
                              " / 0.06)",
                            );
                          }}
                          onClick={() => sendMessage(reply)}
                        >
                          {reply}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Input Area ────────────────────────────────────────── */}
              <form
                onSubmit={handleSubmit}
                className="flex-shrink-0 flex items-center gap-2 px-3 pb-3 pt-1"
              >
                <div
                  className="flex-1 flex items-center rounded-lg overflow-hidden transition-all duration-300"
                  style={{
                    background: "oklch(0.12 0.02 270)",
                    border: inputFocused
                      ? "1px solid oklch(0.75 0.3 340 / 0.7)"
                      : "1px solid oklch(0.7 0.2 200 / 0.2)",
                    boxShadow: inputFocused
                      ? "0 0 12px oklch(0.75 0.3 340 / 0.25), 0 0 20px oklch(0.7 0.28 300 / 0.15)"
                      : "none",
                  }}
                >
                  <input
                    ref={inputRef}
                    type="text"
                    data-ocid="chatbot.input"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    placeholder="Ask ARIA anything..."
                    disabled={isTyping}
                    className="flex-1 bg-transparent px-3 py-2 text-xs font-body outline-none placeholder:text-foreground/25 disabled:opacity-50"
                    style={{ color: "oklch(var(--foreground) / 0.9)" }}
                    aria-label="Message input"
                  />
                  <Zap
                    className="w-3 h-3 mr-2 flex-shrink-0 animate-pulse-glow"
                    style={{
                      color: inputFocused
                        ? "oklch(0.82 0.22 60 / 0.6)"
                        : "oklch(0.75 0.2 200 / 0.3)",
                    }}
                  />
                </div>

                <button
                  type="submit"
                  data-ocid="chatbot.submit_button"
                  disabled={!inputValue.trim() || isTyping}
                  className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
                  style={{
                    background: inputValue.trim()
                      ? "linear-gradient(135deg, oklch(0.75 0.2 200 / 0.4), oklch(0.7 0.3 340 / 0.35))"
                      : "oklch(0.15 0.02 270)",
                    border: inputValue.trim()
                      ? "1px solid oklch(0.75 0.3 340 / 0.6)"
                      : "1px solid oklch(0.75 0.2 200 / 0.2)",
                    color: inputValue.trim()
                      ? "oklch(0.75 0.3 340)"
                      : "oklch(var(--foreground) / 0.3)",
                    boxShadow: inputValue.trim()
                      ? "0 0 14px oklch(0.75 0.3 340 / 0.3), 0 0 24px oklch(0.7 0.28 300 / 0.15)"
                      : "none",
                  }}
                  aria-label="Send message"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Toggle Button ─────────────────────────────────────────────── */}
      <div className="fixed bottom-4 right-4 sm:right-6 z-60 flex flex-col items-center gap-1">
        {/* Permanent Bot icon — always visible above the toggle button */}
        <motion.div
          className="flex flex-col items-center gap-0.5 pointer-events-none"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.7 0.2 200 / 0.3), oklch(0.65 0.28 300 / 0.3), oklch(0.7 0.3 340 / 0.25))",
              border: "1px solid oklch(0.75 0.3 340 / 0.6)",
              boxShadow:
                "0 0 12px oklch(0.7 0.28 300 / 0.5), 0 0 20px oklch(0.75 0.2 200 / 0.2)",
            }}
            animate={{
              boxShadow: [
                "0 0 12px oklch(0.7 0.28 300 / 0.5), 0 0 20px oklch(0.75 0.2 200 / 0.2)",
                "0 0 18px oklch(0.75 0.3 340 / 0.65), 0 0 30px oklch(0.7 0.28 300 / 0.3)",
                "0 0 12px oklch(0.7 0.28 300 / 0.5), 0 0 20px oklch(0.75 0.2 200 / 0.2)",
              ],
            }}
            transition={{
              duration: 2.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <Bot className="w-4 h-4" style={{ color: "#ffd700" }} />
          </motion.div>
          <span
            className="font-mono text-[9px] tracking-widest uppercase font-bold"
            style={{
              background: "linear-gradient(90deg, #00ffff, #bf00ff, #ff00aa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            ARIA
          </span>
        </motion.div>

        {/* Main toggle button */}
        <div className="relative">
          {/* Pulsing ring animation */}
          <>
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                border: "2px solid oklch(0.75 0.3 340 / 0.5)",
              }}
              animate={{ scale: [1, 1.5, 1.5], opacity: [0.5, 0, 0] }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeOut",
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                border: "2px solid oklch(0.7 0.28 300 / 0.3)",
              }}
              animate={{ scale: [1, 1.8, 1.8], opacity: [0.3, 0, 0] }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeOut",
                delay: 0.4,
              }}
            />
          </>

          {/* Rainbow spinning gradient ring — always visible */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              inset: "-3px",
              borderRadius: "50%",
              background:
                "conic-gradient(from 0deg, #00ffff, #bf00ff, #ff00aa, #ffd700, #00ff88, #00ffff)",
            }}
            animate={{ rotate: [0, 360] }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />

          {/* Button inner mask */}
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              inset: "2px",
              background: "oklch(0.085 0.015 270)",
              borderRadius: "50%",
              zIndex: 1,
            }}
          />

          <motion.button
            type="button"
            data-ocid="chatbot.open_modal_button"
            className="relative w-14 h-14 rounded-full flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.7 0.3 340 / 0.3), oklch(0.65 0.28 300 / 0.25), oklch(0.75 0.2 200 / 0.2))",
              border: "none",
              boxShadow:
                "0 0 25px oklch(0.7 0.3 340 / 0.5), 0 0 50px oklch(0.65 0.28 300 / 0.2)",
              zIndex: 2,
            }}
            onClick={() => {
              // Track rapid toggle for ARIA Clicker secret achievement
              const now = Date.now();
              const timestamps = [...toggleTimestampsRef.current, now].slice(
                -5,
              );
              toggleTimestampsRef.current = timestamps;
              if (
                timestamps.length === 5 &&
                timestamps[4] - timestamps[0] < 5000
              ) {
                toggleTimestampsRef.current = [];
                window.dispatchEvent(
                  new CustomEvent("secret-trigger", {
                    detail: { id: "secret_clicker" },
                  }),
                );
              }
              setIsOpen((prev) => {
                if (!prev) {
                  playChatOpen();
                } else {
                  playChatClose();
                }
                return !prev;
              });
            }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.93 }}
            aria-label={isOpen ? "Close AI chat" : "Open AI chat"}
            aria-expanded={isOpen}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <X
                    className="w-6 h-6"
                    style={{ color: "oklch(0.75 0.2 200)" }}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="bot"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <Bot className="w-6 h-6" style={{ color: "#ffd700" }} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Rainbow dot keyframe animation */}
      <style>{`
        @keyframes rainbowCycle {
          0%   { background: #00ffff; box-shadow: 0 0 6px #00ffff; }
          20%  { background: #bf00ff; box-shadow: 0 0 6px #bf00ff; }
          40%  { background: #ff00aa; box-shadow: 0 0 6px #ff00aa; }
          60%  { background: #ffd700; box-shadow: 0 0 6px #ffd700; }
          80%  { background: #00ff88; box-shadow: 0 0 6px #00ff88; }
          100% { background: #00ffff; box-shadow: 0 0 6px #00ffff; }
        }
        .rainbow-dot {
          animation: rainbowCycle 3s linear infinite;
        }
      `}</style>
    </>
  );
}
