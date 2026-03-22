import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { playClick } from "../hooks/useSoundEffects";

const OWNED_KEY = "dg_owned_items";
const VIP_KEY = "dg_vip_status";

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
      {/* Rarity badge */}
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

      {/* Icon */}
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

function PurchaseModal({
  item,
  onConfirm,
  onClose,
}: { item: ShopItem; onConfirm: () => void; onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      data-ocid="shop.dialog"
    >
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        role="button"
        tabIndex={-1}
        aria-label="Close modal"
      />
      <motion.div
        className="relative rounded-2xl p-6 max-w-sm w-full"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        style={{
          background: "oklch(0.1 0.04 270)",
          border: "1.5px solid oklch(0.8 0.25 60 / 0.6)",
          boxShadow:
            "0 0 40px oklch(0.8 0.25 60 / 0.25), 0 20px 60px black/0.8",
        }}
      >
        <div className="text-center mb-5">
          <div className="text-5xl mb-3">{item.icon}</div>
          <h3
            className="text-xl font-black mb-1"
            style={{ color: "oklch(0.97 0.02 240)" }}
          >
            {item.name}
          </h3>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
            {item.description}
          </p>
        </div>

        <div
          className="rounded-xl p-3 mb-5 text-center"
          style={{
            background: "oklch(0.15 0.06 60 / 0.4)",
            border: "1px solid oklch(0.8 0.25 60 / 0.3)",
          }}
        >
          <div
            className="text-2xl font-black"
            style={{ color: "oklch(0.85 0.25 60)" }}
          >
            🪙 {item.coins} coins / ₹{item.inr}
          </div>
          <div
            className="mt-2 text-xs px-3 py-1 rounded-full inline-block"
            style={{
              background: "oklch(0.15 0.06 160 / 0.5)",
              color: "oklch(0.7 0.2 160)",
              border: "1px solid oklch(0.4 0.15 160 / 0.5)",
            }}
          >
            🎮 Demo mode — no real payment
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            data-ocid="shop.cancel_button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
            style={{
              background: "oklch(0.15 0.03 270)",
              color: "rgba(255,255,255,0.6)",
              border: "1px solid oklch(0.25 0.05 270)",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            data-ocid="shop.confirm_button"
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl text-sm font-black transition-all hover:scale-105 active:scale-95"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.8 0.25 60), oklch(0.65 0.3 40))",
              color: "#000",
              boxShadow: "0 0 20px oklch(0.8 0.25 60 / 0.5)",
            }}
          >
            ✓ Confirm Purchase
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function VIPCard() {
  const [isVIP, setIsVIP] = useState(
    () => localStorage.getItem(VIP_KEY) === "true",
  );
  const [showConfirm, setShowConfirm] = useState(false);

  const activateVIP = () => {
    localStorage.setItem(VIP_KEY, "true");
    setIsVIP(true);
    setShowConfirm(false);
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
        {/* Gold shimmer bg */}
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
                  setShowConfirm(true);
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
        {showConfirm && (
          <PurchaseModal
            item={{
              id: "vip",
              name: "VIP Player Status",
              description: "Unlock all VIP perks on DIVYANSH GAMING.",
              icon: "👑",
              coins: 0,
              inr: 199,
            }}
            onConfirm={activateVIP}
            onClose={() => setShowConfirm(false)}
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

  const handleConfirm = () => {
    if (buyingItem) {
      setOwned(buyingItem.id);
      setBuyingItem(null);
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
      {/* BG glows */}
      <div
        className="absolute top-0 left-1/4 w-96 h-64 rounded-full blur-3xl pointer-events-none opacity-10"
        style={{ background: "oklch(0.8 0.25 60)" }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-80 h-48 rounded-full blur-3xl pointer-events-none opacity-8"
        style={{ background: "oklch(0.65 0.3 300)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
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

        {/* Tabs */}
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

        {/* VIP Tab */}
        {activeTab === "vip" && <VIPCard />}

        {/* Item Grid */}
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

      {/* Purchase Modal */}
      <AnimatePresence>
        {buyingItem && (
          <PurchaseModal
            item={buyingItem}
            onConfirm={handleConfirm}
            onClose={() => setBuyingItem(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
