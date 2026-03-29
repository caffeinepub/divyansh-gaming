import { Badge } from "@/components/ui/badge";
import {
  Award,
  ExternalLink,
  Gamepad2,
  Headphones,
  ShoppingCart,
  Star,
} from "lucide-react";
import { motion } from "motion/react";

interface GearProduct {
  id: string;
  name: string;
  category: "headset" | "controller";
  price: string;
  rating: number;
  reviews: number;
  badge?: string;
  emoji: string;
  affiliateUrl: string;
  description: string;
  color: "cyan" | "purple";
}

const products: GearProduct[] = [
  {
    id: "hyperx-cloud2",
    name: "HyperX Cloud II",
    category: "headset",
    price: "₹5,499",
    rating: 4.8,
    reviews: 12400,
    badge: "Best Seller",
    emoji: "🎧",
    affiliateUrl: "https://www.amazon.in/dp/B00SAYCVTQ?tag=divyanshgaming-21",
    description:
      "7.1 Surround Sound, memory foam ear cushions, detachable noise-cancelling mic",
    color: "cyan",
  },
  {
    id: "logitech-g432",
    name: "Logitech G432",
    category: "headset",
    price: "₹3,299",
    rating: 4.5,
    reviews: 8750,
    badge: "Top Pick",
    emoji: "🎧",
    affiliateUrl: "https://www.amazon.in/dp/B07X2NLQH5?tag=divyanshgaming-21",
    description:
      "7.1 DTS Headphone:X 2.0, leatherette & cloth ear pads, flip-to-mute mic",
    color: "cyan",
  },
  {
    id: "razer-kraken-x",
    name: "Razer Kraken X",
    category: "headset",
    price: "₹2,799",
    rating: 4.3,
    reviews: 6200,
    emoji: "🎧",
    affiliateUrl: "https://www.amazon.in/dp/B07FRBFNHM?tag=divyanshgaming-21",
    description:
      "Ultra-light 250g design, 7.1 surround, oval ear cushions, flexible mic",
    color: "cyan",
  },
  {
    id: "xbox-wireless",
    name: "Xbox Wireless Controller",
    category: "controller",
    price: "₹5,499",
    rating: 4.9,
    reviews: 24000,
    badge: "Best Seller",
    emoji: "🎮",
    affiliateUrl: "https://www.amazon.in/dp/B08DF248LD?tag=divyanshgaming-21",
    description:
      "Textured grip, hybrid D-pad, Bluetooth & USB-C, 40hr battery life",
    color: "purple",
  },
  {
    id: "ps5-dualsense",
    name: "PS5 DualSense",
    category: "controller",
    price: "₹6,999",
    rating: 4.8,
    reviews: 19800,
    badge: "Top Pick",
    emoji: "🎮",
    affiliateUrl: "https://www.amazon.in/dp/B08FC6C75H?tag=divyanshgaming-21",
    description:
      "Haptic feedback, adaptive triggers, built-in microphone, Create button",
    color: "purple",
  },
  {
    id: "8bitdo-pro2",
    name: "8BitDo Pro 2",
    category: "controller",
    price: "₹3,499",
    rating: 4.6,
    reviews: 5400,
    emoji: "🎮",
    affiliateUrl: "https://www.amazon.in/dp/B09M3VXZK9?tag=divyanshgaming-21",
    description:
      "Works with Switch, PC, Android, Raspberry Pi. Retro design, modern features",
    color: "purple",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className="w-3.5 h-3.5"
          fill={
            star <= Math.floor(rating)
              ? "currentColor"
              : star - 0.5 <= rating
                ? "currentColor"
                : "none"
          }
          style={{ color: "oklch(0.85 0.18 85)" }}
        />
      ))}
      <span className="text-xs font-mono ml-1 text-foreground/60">
        {rating}/5
      </span>
    </div>
  );
}

function ProductCard({
  product,
  index,
}: { product: GearProduct; index: number }) {
  const isCyan = product.color === "cyan";
  const glowColor = isCyan ? "oklch(0.75 0.25 200)" : "oklch(0.65 0.28 300)";
  const borderColor = isCyan
    ? "oklch(0.75 0.25 200 / 0.4)"
    : "oklch(0.65 0.28 300 / 0.4)";
  const hoverBorderColor = isCyan
    ? "oklch(0.75 0.25 200 / 0.9)"
    : "oklch(0.65 0.28 300 / 0.9)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      viewport={{ once: true }}
      data-ocid={`gear.item.${index + 1}`}
      className="relative group rounded-xl p-5 flex flex-col gap-3 transition-all duration-300 cursor-default"
      style={{
        background: "oklch(0.1 0.02 270 / 0.8)",
        border: `1px solid ${borderColor}`,
        backdropFilter: "blur(8px)",
      }}
      whileHover={{
        y: -4,
        boxShadow: `0 0 24px ${glowColor}40, 0 8px 32px rgba(0,0,0,0.4)`,
        borderColor: hoverBorderColor,
      }}
    >
      {/* Category badge */}
      {product.badge && (
        <div
          className="absolute -top-3 left-4 px-3 py-0.5 rounded-full text-xs font-bold tracking-wider flex items-center gap-1"
          style={{
            background: isCyan
              ? "oklch(0.75 0.25 200)"
              : "oklch(0.65 0.28 300)",
            color: "oklch(0.08 0.02 270)",
            boxShadow: `0 0 12px ${glowColor}80`,
          }}
        >
          <Award className="w-3 h-3" />
          {product.badge}
        </div>
      )}

      {/* Emoji visual */}
      <div
        className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl mx-auto"
        style={{
          background: isCyan
            ? "oklch(0.75 0.25 200 / 0.12)"
            : "oklch(0.65 0.28 300 / 0.12)",
          border: `1px solid ${borderColor}`,
        }}
      >
        {product.emoji}
      </div>

      {/* Info */}
      <div className="flex-1">
        <div className="flex items-start gap-2 mb-1">
          {product.category === "headset" ? (
            <Headphones
              className="w-3.5 h-3.5 mt-0.5 flex-shrink-0"
              style={{ color: glowColor }}
            />
          ) : (
            <Gamepad2
              className="w-3.5 h-3.5 mt-0.5 flex-shrink-0"
              style={{ color: glowColor }}
            />
          )}
          <h3 className="font-display font-bold text-sm text-foreground leading-tight">
            {product.name}
          </h3>
        </div>
        <p className="text-xs text-foreground/50 mb-2 leading-relaxed">
          {product.description}
        </p>
        <StarRating rating={product.rating} />
        <p className="text-xs text-foreground/40 mt-0.5">
          {product.reviews.toLocaleString()} reviews
        </p>
      </div>

      {/* Price + CTA */}
      <div
        className="flex items-center justify-between pt-2 border-t"
        style={{ borderColor }}
      >
        <span
          className="text-xl font-display font-black"
          style={{ color: glowColor }}
        >
          {product.price}
        </span>
        <a
          href={product.affiliateUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-ocid={`gear.buy.button.${index + 1}`}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 hover:scale-105 active:scale-95"
          style={{
            background: isCyan
              ? "oklch(0.75 0.25 200 / 0.2)"
              : "oklch(0.65 0.28 300 / 0.2)",
            border: `1px solid ${borderColor}`,
            color: glowColor,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = isCyan
              ? "oklch(0.75 0.25 200 / 0.35)"
              : "oklch(0.65 0.28 300 / 0.35)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = isCyan
              ? "oklch(0.75 0.25 200 / 0.2)"
              : "oklch(0.65 0.28 300 / 0.2)";
          }}
        >
          <ShoppingCart className="w-3 h-3" />
          Buy on Amazon
          <ExternalLink className="w-2.5 h-2.5" />
        </a>
      </div>
    </motion.div>
  );
}

export default function GamingGear() {
  const headsets = products.filter((p) => p.category === "headset");
  const controllers = products.filter((p) => p.category === "controller");

  return (
    <section id="gaming-gear" className="py-20 relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 50%, oklch(0.65 0.28 300 / 0.04) 0%, transparent 70%)",
        }}
      />

      <div className="container px-4 md:px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <Gamepad2
              className="w-7 h-7"
              style={{ color: "oklch(0.75 0.25 200)" }}
            />
            <h2
              className="font-display font-black text-3xl md:text-4xl tracking-tight"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.75 0.25 200), oklch(0.65 0.28 300))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Top Gaming Gear
            </h2>
            <Headphones
              className="w-7 h-7"
              style={{ color: "oklch(0.65 0.28 300)" }}
            />
          </div>
          <p className="text-foreground/60 font-body max-w-xl mx-auto">
            Gear up with the best headsets and controllers for the ultimate
            gaming experience.
          </p>
        </motion.div>

        {/* Headsets */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-5">
            <Headphones
              className="w-5 h-5"
              style={{ color: "oklch(0.75 0.25 200)" }}
            />
            <h3
              className="font-display font-bold text-lg tracking-wider"
              style={{ color: "oklch(0.75 0.25 200)" }}
            >
              HEADSETS
            </h3>
            <div
              className="flex-1 h-px"
              style={{
                background:
                  "linear-gradient(90deg, oklch(0.75 0.25 200 / 0.5), transparent)",
              }}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {headsets.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>

        {/* Controllers */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-5">
            <Gamepad2
              className="w-5 h-5"
              style={{ color: "oklch(0.65 0.28 300)" }}
            />
            <h3
              className="font-display font-bold text-lg tracking-wider"
              style={{ color: "oklch(0.65 0.28 300)" }}
            >
              CONTROLLERS
            </h3>
            <div
              className="flex-1 h-px"
              style={{
                background:
                  "linear-gradient(90deg, oklch(0.65 0.28 300 / 0.5), transparent)",
              }}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {controllers.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i + 3} />
            ))}
          </div>
        </div>

        {/* Affiliate disclosure */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center text-xs italic text-foreground/35 mt-6"
        >
          As an Amazon Associate, we earn from qualifying purchases. Prices may
          vary.
        </motion.p>
      </div>
    </section>
  );
}
