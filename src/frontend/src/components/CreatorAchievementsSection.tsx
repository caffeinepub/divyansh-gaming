import { motion } from "motion/react";

const CERTIFICATES = [
  {
    id: 1,
    title: "Certificate of Excellence",
    subtitle: "Full-Stack Web Developer",
    body: "This certifies that Divyansh Yadav has demonstrated exceptional proficiency in full-stack web development including React, TypeScript, and backend architecture.",
    badge: "⭐ PRO DEVELOPER",
    badgeColor: "#ffd700",
    issuer: "Divyansh Gaming Academy",
    gradient: "linear-gradient(135deg, #1a0e00 0%, #2a1a00 40%, #1a0e00 100%)",
    borderColor: "#ffd700",
    accentColor: "#ffd700",
    seal: "🏅",
  },
  {
    id: 2,
    title: "Certificate of Achievement",
    subtitle: "Creative Web Designer & 3D Developer",
    body: "Awarded to Divyansh Yadav for outstanding mastery of 3D web experiences, React Three Fiber, and innovative UI/UX design.",
    badge: "🎨 3D DESIGNER",
    badgeColor: "#00ffcc",
    issuer: "Gaming Dev Institute",
    gradient: "linear-gradient(135deg, #001a14 0%, #002820 40%, #001a14 100%)",
    borderColor: "#00ffcc",
    accentColor: "#00ffcc",
    seal: "🎖️",
  },
  {
    id: 3,
    title: "Certificate of Innovation",
    subtitle: "Gaming Platform Creator",
    body: "Presented to Divyansh Yadav for creating and launching DIVYANSH GAMING — a full-featured gaming platform with 40+ games, achievements, and a thriving player community.",
    badge: "🚀 PLATFORM CREATOR",
    badgeColor: "#aa44ff",
    issuer: "Indie Dev Foundation",
    gradient: "linear-gradient(135deg, #0e0018 0%, #180028 40%, #0e0018 100%)",
    borderColor: "#aa44ff",
    accentColor: "#aa44ff",
    seal: "🏆",
  },
];

const DEV_BADGES = [
  { icon: "⚛️", label: "React Expert", color: "#00aaff" },
  { icon: "🟨", label: "JavaScript Pro", color: "#ffd700" },
  { icon: "🎮", label: "3D Web Dev", color: "#00ffcc" },
  { icon: "🔷", label: "TypeScript Master", color: "#44aaff" },
  { icon: "🌐", label: "Full Stack Dev", color: "#ff8800" },
  { icon: "🎨", label: "UI/UX Designer", color: "#ff44aa" },
  { icon: "⚡", label: "Performance Pro", color: "#ffff00" },
  { icon: "🏆", label: "Game Creator", color: "#ffd700" },
];

function Certificate({
  cert,
  index,
}: { cert: (typeof CERTIFICATES)[0]; index: number }) {
  return (
    <motion.div
      data-ocid={`creator.certificate.${index + 1}`}
      className="relative rounded-xl overflow-hidden"
      style={{
        background: cert.gradient,
        border: `2px solid ${cert.borderColor}40`,
        boxShadow: `0 0 0 1px ${cert.borderColor}20, 0 8px 40px ${cert.borderColor}15`,
        maxWidth: 480,
      }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      whileHover={{
        y: -4,
        boxShadow: `0 0 0 1px ${cert.borderColor}40, 0 16px 60px ${cert.borderColor}25`,
      }}
    >
      {/* Double border inner */}
      <div
        className="absolute inset-2 rounded-lg pointer-events-none"
        style={{ border: `1px solid ${cert.borderColor}25` }}
      />
      {/* Corner ornaments */}
      {[
        ["top-3 left-3", "text-left"],
        ["top-3 right-3", "text-right"],
        ["bottom-3 left-3", "text-left"],
        ["bottom-3 right-3", "text-right"],
      ].map(([pos]) => (
        <div
          key={pos}
          className={`absolute ${pos} text-base opacity-60`}
          style={{ color: cert.accentColor }}
        >
          ✦
        </div>
      ))}

      <div className="relative p-8">
        {/* Header row */}
        <div className="flex items-start justify-between mb-6">
          <div>
            {/* Issuer */}
            <p
              className="text-xs font-mono tracking-widest uppercase mb-2"
              style={{ color: `${cert.accentColor}80` }}
            >
              {cert.issuer}
            </p>
            {/* Certificate title */}
            <h3
              className="text-2xl font-bold leading-tight"
              style={{
                color: cert.accentColor,
                textShadow: `0 0 20px ${cert.accentColor}60`,
                fontFamily: "'Playfair Display', serif",
              }}
            >
              {cert.title}
            </h3>
            <p
              className="text-sm mt-1"
              style={{
                color: `${cert.accentColor}80`,
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
              }}
            >
              {cert.subtitle}
            </p>
          </div>
          <div
            className="text-4xl"
            style={{ filter: `drop-shadow(0 0 12px ${cert.accentColor})` }}
          >
            {cert.seal}
          </div>
        </div>

        {/* Divider */}
        <div
          className="mb-6"
          style={{
            height: 1,
            background: `linear-gradient(90deg, transparent, ${cert.accentColor}60, transparent)`,
          }}
        />

        {/* Recipient */}
        <div className="mb-5">
          <p
            className="text-xs font-mono uppercase tracking-widest mb-1"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            This is awarded to
          </p>
          <p
            className="text-3xl font-black"
            style={{
              color: "#ffffff",
              fontFamily: "'Playfair Display', serif",
              textShadow: `0 0 30px ${cert.accentColor}40`,
            }}
          >
            Divyansh Yadav
          </p>
        </div>

        {/* Body text */}
        <p
          className="text-sm leading-relaxed mb-6"
          style={{
            color: "rgba(255,255,255,0.65)",
            fontFamily: "'Georgia', serif",
          }}
        >
          {cert.body}
        </p>

        {/* Bottom row */}
        <div className="flex items-center justify-between">
          <span
            className="text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full"
            style={{
              background: `${cert.badgeColor}20`,
              border: `1px solid ${cert.badgeColor}50`,
              color: cert.badgeColor,
            }}
          >
            {cert.badge}
          </span>
          <div className="text-right">
            <div
              style={{
                height: 1,
                width: 80,
                background: `${cert.accentColor}60`,
                marginLeft: "auto",
                marginBottom: 4,
              }}
            />
            <p className="text-xs" style={{ color: `${cert.accentColor}80` }}>
              Authorized Signature
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function CreatorAchievementsSection() {
  return (
    <section
      id="creator-achievements"
      className="relative py-28 overflow-hidden"
    >
      {/* Background glows */}
      <div
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(255,215,0,0.06) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-10"
        style={{ background: "#aa44ff" }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section badge + heading */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-mono tracking-widest uppercase"
            style={{
              background: "rgba(255,215,0,0.1)",
              border: "1px solid rgba(255,215,0,0.3)",
              color: "#ffd700",
            }}
          >
            🏆 Creator's Hall of Fame
          </div>
          <h2
            className="font-display font-black text-4xl md:text-6xl mb-4"
            style={{
              color: "#ffffff",
              textShadow: "0 0 60px rgba(255,215,0,0.4)",
            }}
          >
            Achievements of Creator
          </h2>
          <p
            className="text-base max-w-xl mx-auto"
            style={{
              color: "rgba(255,255,255,0.45)",
              fontFamily: "Sora, sans-serif",
            }}
          >
            Celebrating the creator behind DIVYANSH GAMING and all that he has
            built.
          </p>
        </motion.div>

        {/* Creator card */}
        <motion.div
          className="relative mx-auto max-w-2xl rounded-2xl mb-16 overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #0a0a1a 0%, #12103a 50%, #0a0a1a 100%)",
            border: "1px solid rgba(255,215,0,0.3)",
            boxShadow: "0 0 60px rgba(255,215,0,0.1)",
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {/* Animated top border */}
          <div
            style={{
              height: 3,
              background:
                "linear-gradient(90deg, #aa44ff, #ffd700, #00ffcc, #ff4466, #aa44ff)",
              backgroundSize: "200% 100%",
            }}
          />
          <div className="p-8 flex flex-col sm:flex-row items-center gap-6">
            <div className="relative flex-shrink-0">
              <div
                className="text-7xl"
                style={{ filter: "drop-shadow(0 0 24px rgba(255,215,0,0.8))" }}
              >
                👨‍💻
              </div>
              <div className="absolute -bottom-2 -right-2 text-2xl">⭐</div>
            </div>
            <div>
              <p
                className="text-xs font-mono tracking-widest uppercase mb-1"
                style={{ color: "rgba(255,215,0,0.6)" }}
              >
                Creator & Developer
              </p>
              <h3
                className="text-3xl font-black mb-2"
                style={{
                  color: "#ffffff",
                  fontFamily: "'Playfair Display', serif",
                  textShadow: "0 0 30px rgba(255,215,0,0.5)",
                }}
              >
                Divyansh Yadav
              </h3>
              <p
                className="text-sm font-semibold mb-3"
                style={{ color: "#ffd700" }}
              >
                Full-Stack Developer &amp; Gaming Platform Creator
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: "rgba(255,255,255,0.6)",
                  fontFamily: "Sora, sans-serif",
                }}
              >
                Age 12 | Built DIVYANSH GAMING from scratch | Passionate about
                games, code, and creating amazing experiences for players
                worldwide.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {["React", "TypeScript", "3D / R3F", "Game Dev"].map(
                  (skill) => (
                    <span
                      key={skill}
                      className="text-xs px-2 py-0.5 rounded-full font-mono"
                      style={{
                        background: "rgba(255,215,0,0.1)",
                        border: "1px solid rgba(255,215,0,0.3)",
                        color: "#ffd700",
                      }}
                    >
                      {skill}
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Certificates */}
        <motion.h3
          className="text-center text-2xl font-bold mb-8"
          style={{ color: "rgba(255,255,255,0.8)" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          🎓 Professional Certificates
        </motion.h3>
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {CERTIFICATES.map((cert, i) => (
            <Certificate key={cert.id} cert={cert} index={i} />
          ))}
        </div>

        {/* Developer badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3
            className="text-center text-2xl font-bold mb-8"
            style={{ color: "rgba(255,255,255,0.8)" }}
          >
            🛠️ Developer Skills &amp; Badges
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {DEV_BADGES.map((badge, i) => (
              <motion.div
                key={badge.label}
                data-ocid={`creator.badge.${i + 1}`}
                className="flex items-center gap-2 px-5 py-3 rounded-full font-bold text-sm cursor-default"
                style={{
                  background: `${badge.color}12`,
                  border: `1px solid ${badge.color}40`,
                  color: badge.color,
                  boxShadow: `0 0 0 0 ${badge.color}`,
                }}
                whileHover={{
                  scale: 1.1,
                  boxShadow: `0 0 24px ${badge.color}50`,
                  background: `${badge.color}25`,
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
              >
                <span className="text-xl">{badge.icon}</span>
                {badge.label}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
