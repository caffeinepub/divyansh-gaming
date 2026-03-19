import { Globe } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { LANGUAGES, useLanguage } from "../contexts/LanguageContext";
import { playClick, playHover } from "../hooks/useSoundEffects";

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = LANGUAGES.find((l) => l.code === language);

  return (
    <div ref={ref} className="relative" data-ocid="language.select">
      <button
        type="button"
        onClick={() => {
          playClick();
          setOpen((v) => !v);
        }}
        onMouseEnter={() => playHover()}
        aria-label="Select language"
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-cyan-400/30 hover:border-cyan-400/60 bg-transparent hover:bg-cyan-400/10 text-cyan-400 transition-all duration-200"
        style={{
          boxShadow: open
            ? "0 0 10px oklch(var(--neon-cyan) / 0.3)"
            : undefined,
        }}
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">{current?.flag}</span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <button
              type="button"
              aria-label="Close language selector"
              className="fixed inset-0 z-40 cursor-default"
              onClick={() => setOpen(false)}
              onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
              tabIndex={-1}
              style={{ background: "transparent", border: "none" }}
            />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 z-50 min-w-[180px] rounded-lg border border-cyan-400/30 overflow-hidden"
              style={{
                background: "oklch(0.085 0.015 270 / 0.98)",
                backdropFilter: "blur(16px)",
                boxShadow:
                  "0 0 20px oklch(var(--neon-cyan) / 0.2), 0 8px 32px rgba(0,0,0,0.6)",
              }}
            >
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  data-ocid={`language.${lang.code}.button`}
                  onClick={() => {
                    playClick();
                    setLanguage(lang.code);
                    setOpen(false);
                  }}
                  onMouseEnter={() => playHover()}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-150 ${
                    language === lang.code
                      ? "bg-cyan-400/15 text-cyan-300 font-semibold"
                      : "text-foreground/70 hover:text-cyan-300 hover:bg-cyan-400/10"
                  }`}
                >
                  <span className="text-base">{lang.flag}</span>
                  <span>{lang.label}</span>
                  {language === lang.code && (
                    <span className="ml-auto text-cyan-400">✓</span>
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
