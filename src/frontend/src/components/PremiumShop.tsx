import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { playClick } from "../hooks/useSoundEffects";

const OWNED_KEY = "dg_owned_items";
const VIP_KEY = "dg_vip_status";
const PURCHASES_KEY = "dgPurchases";

function getOwned(): Set<string> {
  try {
    const raw = localStorage.getItem(OWNED_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function setOwned(id: string) {
  const s = getOwned();
  s.add(id);
  localStorage.setItem(OWNED_KEY, JSON.stringify([...s]));
  // Also save to dgPurchases
  try {
    const existing: string[] = JSON.parse(
      localStorage.getItem(PURCHASES_KEY) ?? "[]",
    );
    if (!existing.includes(id)) {
      existing.push(id);
      localStorage.setItem(PURCHASES_KEY, JSON.stringify(existing));
    }
  } catch {
    /* ignore */
  }
}

interface ShopItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  coins: number;
  inr: number;
  rarity?: string;
}

const AVATAR_ITEMS: ShopItem[] = [
  {
    id: "neon-crown",
    name: "Neon Crown",
    description: "Glow above the rest with this electric crown hat.",
    icon: "👑",
    coins: 199,
    inr: 49,
    rarity: "Rare",
  },
  {
    id: "dragon-wings",
    name: "Dragon Wings",
    description: "Spread legendary wings on your avatar's back.",
    icon: "🐉",
    coins: 299,
    inr: 79,
    rarity: "Epic",
  },
  {
    id: "galaxy-skin",
    name: "Galaxy Skin",
    description: "Wrap your avatar in the cosmos itself.",
    icon: "🌌",
    coins: 149,
    inr: 39,
    rarity: "Uncommon",
  },
  {
    id: "fire-aura",
    name: "Fire Aura",
    description: "Blaze trails with a pulsing flame aura effect.",
    icon: "🔥",
    coins: 249,
    inr: 69,
    rarity: "Epic",
  },
  {
    id: "cyber-mask",
    name: "Cyber Mask",
    description: "High-tech visor for true cyber warriors.",
    icon: "🥽",
    coins: 179,
    inr: 49,
    rarity: "Rare",
  },
  {
    id: "legendary-cape",
    name: "Legendary Cape",
    description: "A flowing cape worn only by true legends.",
    icon: "🦸",
    coins: 399,
    inr: 99,
    rarity: "Legendary",
  },
];

const BADGE_ITEMS: ShopItem[] = [
  {
    id: "gold-champion",
    name: "Gold Champion Badge",
    description: "Shine like a champion in every leaderboard.",
    icon: "🥇",
    coins: 299,
    inr: 79,
    rarity: "Rare",
  },
  {
    id: "diamond-elite",
    name: "Diamond Elite Badge",
    description: "Reserved for the absolute elite players only.",
    icon: "💎",
    coins: 499,
    inr: 129,
    rarity: "Epic",
  },
  {
    id: "creators-choice",
    name: "Creator's Choice Badge",
    description: "Hand-picked by Divyansh Yadav himself.",
    icon: "⭐",
    coins: 349,
    inr: 89,
    rarity: "Epic",
  },
  {
    id: "legend-badge",
    name: "Legend Badge",
    description: "The highest honour on DIVYANSH GAMING.",
    icon: "🏆",
    coins: 699,
    inr: 179,
    rarity: "Legendary",
  },
];

const THEME_ITEMS: ShopItem[] = [
  {
    id: "cyberpunk-gold",
    name: "Cyberpunk Gold",
    description: "Neon streets in a blaze of golden light.",
    icon: "🌆",
    coins: 199,
    inr: 49,
    rarity: "Rare",
  },
  {
    id: "blood-moon",
    name: "Blood Moon",
    description: "Crimson night sky — dark, dramatic, iconic.",
    icon: "🌑",
    coins: 199,
    inr: 49,
    rarity: "Rare",
  },
  {
    id: "galaxy-theme",
    name: "Galaxy Theme",
    description: "Play through the stars with cosmic hues.",
    icon: "🪐",
    coins: 249,
    inr: 69,
    rarity: "Epic",
  },
  {
    id: "holographic",
    name: "Holographic",
    description: "Rainbow prism iridescence everywhere.",
    icon: "🌈",
    coins: 299,
    inr: 79,
    rarity: "Epic",
  },
];

const RARITY_COLORS: Record<string, string> = {
  Uncommon: "oklch(0.7 0.25 160)",
  Rare: "oklch(0.65 0.25 240)",
  Epic: "oklch(0.65 0.3 300)",
  Legendary: "oklch(0.8 0.25 60)",
};

// ── Stripe-style Checkout Modal ────────────────────────────────────────────────
type CheckoutStep = "form" | "processing" | "success";

function StripeCheckoutModal({
  item,
  onSuccess,
  onClose,
}: {
  item: ShopItem;
  onSuccess: () => void;
  onClose: () => void;
}) {
  const [step, setStep] = useState<CheckoutStep>("form");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatCardNumber = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatExpiry = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!cardName.trim()) e.cardName = "Name is required";
    if (cardNumber.replace(/\s/g, "").length < 16)
      e.cardNumber = "Enter a valid 16-digit card number";
    if (expiry.length < 5) e.expiry = "Enter valid expiry (MM/YY)";
    if (cvv.length < 3) e.cvv = "Enter valid CVV";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePay = () => {
    if (!validate()) return;
    setStep("processing");
    setTimeout(() => {
      setStep("success");
      onSuccess();
    }, 2200);
  };

  const cardBrand = (() => {
    const num = cardNumber.replace(/\s/g, "");
    if (num.startsWith("4")) return "VISA";
    if (num.startsWith("5")) return "MC";
    if (num.startsWith("3")) return "AMEX";
    return null;
  })();

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      data-ocid="shop.dialog"
    >
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
        onClick={step !== "processing" ? onClose : undefined}
        onKeyDown={(e) =>
          e.key === "Escape" && step !== "processing" && onClose()
        }
        role="button"
        tabIndex={-1}
        aria-label="Close modal"
      />
      <motion.div
        className="relative rounded-2xl w-full max-w-md overflow-hidden"
        initial={{ scale: 0.88, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.88, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 240, damping: 22 }}
        style={{
          background: "oklch(0.09 0.025 270)",
          border: "1.5px solid oklch(0.82 0.18 200 / 0.35)",
          boxShadow: "0 0 60px oklch(0.82 0.18 200 / 0.15), 0 30px 80px black",
        }}
      >
        {/* Stripe-style header bar */}
        <div
          className="flex items-center justify-between px-5 py-3 border-b"
          style={{ borderColor: "oklch(0.22 0.04 275)" }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{
                background: "oklch(0.82 0.18 200)",
                boxShadow: "0 0 8px oklch(0.82 0.18 200)",
              }}
            />
            <span
              className="text-xs font-mono tracking-widest uppercase"
              style={{ color: "oklch(0.82 0.18 200)" }}
            >
              Secure Checkout
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="text-xs font-mono px-2 py-0.5 rounded"
              style={{
                background: "oklch(0.14 0.03 270)",
                color: "oklch(0.65 0.1 270)",
              }}
            >
              🔒 SSL
            </span>
            <span
              className="text-xs font-bold"
              style={{ color: "oklch(0.55 0.15 270)" }}
            >
              powered by Stripe
            </span>
          </div>
        </div>

        <div className="p-5">
          {/* Item summary */}
          <div
            className="flex items-center gap-3 rounded-xl p-3 mb-5"
            style={{
              background: "oklch(0.12 0.03 270)",
              border: "1px solid oklch(0.2 0.04 270)",
            }}
          >
            <div className="text-3xl">{item.icon}</div>
            <div className="flex-1">
              <div
                className="font-bold text-sm"
                style={{ color: "oklch(0.97 0.02 240)" }}
              >
                {item.name}
              </div>
              <div
                className="text-xs"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                {item.description}
              </div>
            </div>
            <div className="text-right">
              <div
                className="font-black text-lg"
                style={{ color: "oklch(0.85 0.25 60)" }}
              >
                ₹{item.inr}
              </div>
              <div
                className="text-xs"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                INR
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === "form" && (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-4"
              >
                {/* Card Name */}
                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-xs font-mono tracking-widest uppercase"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                    htmlFor="checkout-name"
                  >
                    Cardholder Name
                  </label>
                  <input
                    id="checkout-name"
                    type="text"
                    placeholder="Divyansh Yadav"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="px-3 py-2.5 rounded-lg text-sm outline-none transition-all"
                    style={{
                      background: "oklch(0.13 0.03 270)",
                      border: `1.5px solid ${errors.cardName ? "oklch(0.62 0.24 15)" : "oklch(0.25 0.05 270)"}`,
                      color: "oklch(0.95 0.03 270)",
                    }}
                    data-ocid="shop.checkout.input"
                  />
                  {errors.cardName && (
                    <span
                      className="text-xs"
                      style={{ color: "oklch(0.65 0.2 15)" }}
                    >
                      {errors.cardName}
                    </span>
                  )}
                </div>

                {/* Card Number */}
                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-xs font-mono tracking-widest uppercase"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                    htmlFor="checkout-cardnum"
                  >
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      id="checkout-cardnum"
                      type="text"
                      inputMode="numeric"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) =>
                        setCardNumber(formatCardNumber(e.target.value))
                      }
                      className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all font-mono"
                      style={{
                        background: "oklch(0.13 0.03 270)",
                        border: `1.5px solid ${errors.cardNumber ? "oklch(0.62 0.24 15)" : "oklch(0.25 0.05 270)"}`,
                        color: "oklch(0.95 0.03 270)",
                        paddingRight: cardBrand ? "52px" : "12px",
                      }}
                      data-ocid="shop.checkout.input"
                    />
                    {cardBrand && (
                      <span
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black px-1.5 py-0.5 rounded"
                        style={{
                          background: "oklch(0.2 0.04 270)",
                          color: "oklch(0.82 0.18 200)",
                        }}
                      >
                        {cardBrand}
                      </span>
                    )}
                  </div>
                  {errors.cardNumber && (
                    <span
                      className="text-xs"
                      style={{ color: "oklch(0.65 0.2 15)" }}
                    >
                      {errors.cardNumber}
                    </span>
                  )}
                </div>

                {/* Expiry + CVV */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label
                      className="text-xs font-mono tracking-widest uppercase"
                      style={{ color: "rgba(255,255,255,0.4)" }}
                      htmlFor="checkout-expiry"
                    >
                      Expiry
                    </label>
                    <input
                      id="checkout-expiry"
                      type="text"
                      inputMode="numeric"
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      className="px-3 py-2.5 rounded-lg text-sm outline-none font-mono"
                      style={{
                        background: "oklch(0.13 0.03 270)",
                        border: `1.5px solid ${errors.expiry ? "oklch(0.62 0.24 15)" : "oklch(0.25 0.05 270)"}`,
                        color: "oklch(0.95 0.03 270)",
                      }}
                      data-ocid="shop.checkout.input"
                    />
                    {errors.expiry && (
                      <span
                        className="text-xs"
                        style={{ color: "oklch(0.65 0.2 15)" }}
                      >
                        {errors.expiry}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label
                      className="text-xs font-mono tracking-widest uppercase"
                      style={{ color: "rgba(255,255,255,0.4)" }}
                      htmlFor="checkout-cvv"
                    >
                      CVV
                    </label>
                    <input
                      id="checkout-cvv"
                      type="password"
                      inputMode="numeric"
                      placeholder="•••"
                      value={cvv}
                      onChange={(e) =>
                        setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
                      }
                      className="px-3 py-2.5 rounded-lg text-sm outline-none font-mono"
                      style={{
                        background: "oklch(0.13 0.03 270)",
                        border: `1.5px solid ${errors.cvv ? "oklch(0.62 0.24 15)" : "oklch(0.25 0.05 270)"}`,
                        color: "oklch(0.95 0.03 270)",
                      }}
                      data-ocid="shop.checkout.input"
                    />
                    {errors.cvv && (
                      <span
                        className="text-xs"
                        style={{ color: "oklch(0.65 0.2 15)" }}
                      >
                        {errors.cvv}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-1">
                  <button
                    type="button"
                    data-ocid="shop.cancel_button"
                    onClick={onClose}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
                    style={{
                      background: "oklch(0.14 0.03 270)",
                      color: "rgba(255,255,255,0.55)",
                      border: "1px solid oklch(0.24 0.05 270)",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    data-ocid="shop.confirm_button"
                    onClick={handlePay}
                    className="flex-1 py-2.5 rounded-xl text-sm font-black transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.82 0.18 200), oklch(0.65 0.22 240))",
                      color: "#000",
                      boxShadow: "0 0 20px oklch(0.82 0.18 200 / 0.4)",
                    }}
                  >
                    💳 Pay ₹{item.inr}
                  </button>
                </div>
              </motion.div>
            )}

            {step === "processing" && (
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-4 py-8"
                data-ocid="shop.loading_state"
              >
                <motion.div
                  className="w-12 h-12 rounded-full border-2 border-transparent"
                  style={{
                    borderTopColor: "oklch(0.82 0.18 200)",
                    borderRightColor: "oklch(0.65 0.22 295 / 0.5)",
                  }}
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 0.8,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                />
                <div
                  className="text-sm font-mono"
                  style={{ color: "rgba(255,255,255,0.6)" }}
                >
                  Processing payment…
                </div>
                <div
                  className="text-xs"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                >
                  Do not close this window
                </div>
              </motion.div>
            )}

            {step === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4 py-6 text-center"
                data-ocid="shop.success_state"
              >
                <motion.div
                  className="text-5xl"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.3, 1] }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  ✅
                </motion.div>
                <div
                  className="font-black text-xl"
                  style={{ color: "oklch(0.82 0.18 200)" }}
                >
                  Payment Successful!
                </div>
                <div
                  className="text-sm"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                >
                  <strong style={{ color: "oklch(0.97 0.02 240)" }}>
                    {item.name}
                  </strong>{" "}
                  is now in your collection.
                </div>
                <button
                  type="button"
                  data-ocid="shop.close_button"
                  onClick={onClose}
                  className="mt-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all hover:scale-105"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.82 0.18 200), oklch(0.65 0.22 240))",
                    color: "#000",
                    boxShadow: "0 0 20px oklch(0.82 0.18 200 / 0.4)",
                  }}
                >
                  🎮 Start Playing
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ItemCard({
  item,
  onBuy,
}: { item: ShopItem; onBuy: (item: ShopItem) => void }) {
  const [owned] = useState(() => getOwned().has(item.id));
  const rarityColor = RARITY_COLORS[item.rarity ?? "Uncommon"];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-xl p-4 flex flex-col gap-3 cursor-default"
      style={{
        background: "oklch(0.1 0.03 270)",
        border: owned
          ? "1.5px solid oklch(0.7 0.25 160)"
          : `1.5px solid ${rarityColor}55`,
        boxShadow: owned
          ? "0 0 18px oklch(0.7 0.25 160 / 0.25)"
          : `0 0 14px ${rarityColor}22`,
      }}
    >
      <div
        className="absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full"
        style={{
          background: `${rarityColor}22`,
          color: rarityColor,
          border: `1px solid ${rarityColor}55`,
        }}
      >
        {item.rarity}
      </div>
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
        style={{
          background: `${rarityColor}18`,
          border: `1px solid ${rarityColor}33`,
        }}
      >
        {item.icon}
      </div>
      <div>
        <h3
          className="font-bold text-sm"
          style={{ color: "oklch(0.97 0.02 240)" }}
        >
          {item.name}
        </h3>
        <p
          className="text-xs mt-0.5 leading-relaxed"
          style={{ color: "rgba(255,255,255,0.45)" }}
        >
          {item.description}
        </p>
      </div>
      <div className="mt-auto flex items-center justify-between gap-2">
        <div>
          <span
            className="text-xs font-mono font-bold"
            style={{ color: rarityColor }}
          >
            🪙 {item.coins}
          </span>
          <span
            className="text-xs ml-1"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            / ₹{item.inr}
          </span>
        </div>
        {owned ? (
          <div
            className="text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1"
            style={{
              background: "oklch(0.15 0.08 160)",
              color: "oklch(0.7 0.25 160)",
              border: "1px solid oklch(0.4 0.2 160)",
            }}
            data-ocid="shop.owned.button"
          >
            ✓ Owned
          </div>
        ) : (
          <button
            type="button"
            data-ocid="shop.buy_button"
            onClick={() => {
              playClick();
              onBuy(item);
            }}
            className="text-xs font-bold px-3 py-1.5 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              background: `linear-gradient(135deg, ${rarityColor}, oklch(0.65 0.3 300))`,
              color: "#000",
              boxShadow: `0 0 14px ${rarityColor}55`,
            }}
          >
            Buy Now
          </button>
        )}
      </div>
    </motion.div>
  );
}

function VIPCard() {
  const [isVIP, setIsVIP] = useState(
    () => localStorage.getItem(VIP_KEY) === "true",
  );
  const [showCheckout, setShowCheckout] = useState(false);

  const activateVIP = () => {
    localStorage.setItem(VIP_KEY, "true");
    setOwned("vip");
    setIsVIP(true);
    setShowCheckout(false);
  };

  return (
    <>
      <motion.div
        className="relative rounded-2xl p-6 overflow-hidden mb-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{
          background: "oklch(0.1 0.04 60)",
          border: "2px solid oklch(0.8 0.25 60 / 0.7)",
          boxShadow:
            "0 0 50px oklch(0.8 0.25 60 / 0.2), 0 0 100px oklch(0.8 0.25 60 / 0.08)",
        }}
      >
        <div
          className="absolute inset-0 opacity-8 pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.8 0.25 60 / 0.15) 0%, transparent 60%, oklch(0.8 0.25 60 / 0.1) 100%)",
          }}
        />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl"
              style={{
                background: "oklch(0.15 0.1 60)",
                border: "2px solid oklch(0.8 0.25 60 / 0.5)",
                boxShadow: "0 0 20px oklch(0.8 0.25 60 / 0.4)",
              }}
            >
              👑
            </div>
            <div>
              <div
                className="text-2xl font-black tracking-widest"
                style={{
                  background:
                    "linear-gradient(90deg, oklch(0.85 0.25 60), oklch(0.95 0.15 80), oklch(0.85 0.25 60))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundSize: "200%",
                }}
              >
                VIP PLAYER
              </div>
              <div
                className="text-xs mt-1"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                Exclusive perks · Limited availability
              </div>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              "👑 Special VIP rank badge in leaderboard",
              "✨ Highlighted leaderboard row",
              "🖼️ Exclusive VIP avatar frame",
              "🏆 Priority in Hall of Champions",
              "🎨 Access to VIP-only themes",
            ].map((perk) => (
              <div
                key={perk}
                className="flex items-center gap-2 text-xs font-medium"
                style={{ color: "oklch(0.88 0.12 80)" }}
              >
                <span>{perk}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="text-center">
              <div
                className="text-2xl font-black"
                style={{ color: "oklch(0.85 0.25 60)" }}
              >
                ₹199
              </div>
              <div
                className="text-xs"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                per month
              </div>
            </div>
            {isVIP ? (
              <div
                className="px-6 py-2.5 rounded-full text-sm font-black flex items-center gap-2"
                style={{
                  background: "oklch(0.15 0.1 60)",
                  color: "oklch(0.85 0.25 60)",
                  border: "2px solid oklch(0.7 0.25 60)",
                }}
                data-ocid="shop.vip.owned_state"
              >
                👑 VIP ACTIVE
              </div>
            ) : (
              <button
                type="button"
                data-ocid="shop.vip.primary_button"
                onClick={() => {
                  playClick();
                  setShowCheckout(true);
                }}
                className="px-6 py-2.5 rounded-full text-sm font-black transition-all hover:scale-105 active:scale-95"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.85 0.25 60), oklch(0.7 0.3 40))",
                  color: "#000",
                  boxShadow: "0 0 25px oklch(0.8 0.25 60 / 0.6)",
                }}
              >
                ✦ Go VIP
              </button>
            )}
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showCheckout && (
          <StripeCheckoutModal
            item={{
              id: "vip",
              name: "VIP Player Status",
              description: "Unlock all VIP perks on DIVYANSH GAMING.",
              icon: "👑",
              coins: 0,
              inr: 199,
            }}
            onSuccess={activateVIP}
            onClose={() => setShowCheckout(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default function PremiumShop() {
  const [activeTab, setActiveTab] = useState<
    "vip" | "avatar" | "badges" | "themes"
  >("vip");
  const [buyingItem, setBuyingItem] = useState<ShopItem | null>(null);
  const [, forceUpdate] = useState(0);

  const handleBuy = (item: ShopItem) => {
    setBuyingItem(item);
  };

  const handleSuccess = () => {
    if (buyingItem) {
      setOwned(buyingItem.id);
      forceUpdate((n) => n + 1);
    }
  };

  const tabs = [
    { key: "vip", label: "👑 VIP", color: "oklch(0.85 0.25 60)" },
    { key: "avatar", label: "🎭 Avatar Items", color: "oklch(0.7 0.25 300)" },
    { key: "badges", label: "🏅 Badges", color: "oklch(0.7 0.25 240)" },
    { key: "themes", label: "🎨 Themes", color: "oklch(0.7 0.25 160)" },
  ] as const;

  const items =
    activeTab === "avatar"
      ? AVATAR_ITEMS
      : activeTab === "badges"
        ? BADGE_ITEMS
        : activeTab === "themes"
          ? THEME_ITEMS
          : [];

  return (
    <section id="premium-shop" className="relative py-24 overflow-hidden">
      <div
        className="absolute top-0 left-1/4 w-96 h-64 rounded-full blur-3xl pointer-events-none opacity-10"
        style={{ background: "oklch(0.8 0.25 60)" }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-80 h-48 rounded-full blur-3xl pointer-events-none opacity-8"
        style={{ background: "oklch(0.65 0.3 300)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-mono tracking-widest uppercase"
            style={{
              background: "oklch(0.15 0.06 60)",
              border: "1px solid oklch(0.8 0.25 60 / 0.4)",
              color: "oklch(0.85 0.25 60)",
            }}
          >
            💎 Premium Content
          </div>
          <h2
            className="font-display font-black text-4xl md:text-5xl mb-4"
            style={{
              background:
                "linear-gradient(90deg, oklch(0.85 0.25 60), oklch(0.97 0.02 240), oklch(0.85 0.25 60))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Premium Shop
          </h2>
          <p
            className="text-base max-w-xl mx-auto"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            Unlock exclusive items, badges, themes, and VIP status to dominate
            DIVYANSH GAMING.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              data-ocid={`shop.${tab.key}.tab`}
              onClick={() => {
                playClick();
                setActiveTab(tab.key);
              }}
              className="px-4 py-2 rounded-full text-sm font-bold tracking-wide transition-all duration-200"
              style={{
                background:
                  activeTab === tab.key ? tab.color : "oklch(0.12 0.03 270)",
                border:
                  activeTab === tab.key
                    ? `1px solid ${tab.color}`
                    : "1px solid oklch(0.25 0.05 270)",
                color: activeTab === tab.key ? "#000" : "rgba(255,255,255,0.6)",
                boxShadow:
                  activeTab === tab.key ? `0 0 20px ${tab.color}55` : "none",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "vip" && <VIPCard />}

        {activeTab !== "vip" && (
          <motion.div
            key={activeTab}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {items.map((item) => (
              <ItemCard
                key={`${item.id}-${activeTab}`}
                item={item}
                onBuy={handleBuy}
              />
            ))}
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {buyingItem && (
          <StripeCheckoutModal
            item={buyingItem}
            onSuccess={handleSuccess}
            onClose={() => setBuyingItem(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
