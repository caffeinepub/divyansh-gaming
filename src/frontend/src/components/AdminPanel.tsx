import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Award,
  BarChart3,
  Download,
  Gamepad2,
  Lock,
  LogOut,
  Megaphone,
  RefreshCw,
  Shield,
  Star,
  Trash2,
  Trophy,
  Users,
  X,
  Youtube,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────
interface LeaderboardEntry {
  player: string;
  game: string;
  score: number;
  date: string;
}

interface Announcement {
  id: string;
  title: string;
  body: string;
  date: string;
}

interface YTVideo {
  id: string;
  title: string;
  url: string;
}

interface Champion {
  name: string;
  week: number;
  avatarColor: string;
}

interface TournamentData {
  players: string[];
}

// ─── Constants ────────────────────────────────────────────────────────────────
const ADMIN_PASSWORD = "DivyanshAdmin2026";
const ADMIN_SESSION_KEY = "dg_admin_session";

const MAIN_GAMES = [
  "Car Racing",
  "Space Shooter 3D",
  "Snake",
  "Breakout",
  "Pac-Maze",
  "Block Drop",
  "Flappy Bird",
  "Basketball",
  "Pong",
  "Memory",
];

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { player: "NeonRacer", game: "Car Racing", score: 8420, date: "2026-03-20" },
  {
    player: "StarDestroyer",
    game: "Space Shooter 3D",
    score: 15600,
    date: "2026-03-20",
  },
  { player: "SnakeMaster", game: "Snake", score: 3200, date: "2026-03-19" },
  { player: "BrickBuster", game: "Breakout", score: 5800, date: "2026-03-19" },
  { player: "PacHunter", game: "Pac-Maze", score: 4100, date: "2026-03-18" },
  { player: "BlockGod", game: "Block Drop", score: 9900, date: "2026-03-18" },
  { player: "FlappyKing", game: "Flappy Bird", score: 247, date: "2026-03-17" },
  { player: "HoopLegend", game: "Basketball", score: 1800, date: "2026-03-17" },
  { player: "PongPro", game: "Pong", score: 500, date: "2026-03-16" },
  { player: "MemoryAce", game: "Memory", score: 3600, date: "2026-03-16" },
];

const SAMPLE_PLAYERS = [
  "NeonRacer",
  "StarDestroyer",
  "SnakeMaster",
  "BrickBuster",
  "PacHunter",
  "BlockGod",
  "FlappyKing",
  "HoopLegend",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function ls<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function lsSet(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

function exportCsv(entries: LeaderboardEntry[]) {
  const header = "Rank,Player,Game,Score,Date";
  const rows = entries.map(
    (e, i) => `${i + 1},${e.player},${e.game},${e.score},${e.date}`,
  );
  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "leaderboard.csv";
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Admin Login ──────────────────────────────────────────────────────────────
function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [shaking, setShaking] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      lsSet(ADMIN_SESSION_KEY, true);
      onLogin();
    } else {
      setError("Incorrect password.");
      setShaking(true);
      setTimeout(() => setShaking(false), 600);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: "oklch(0.07 0.02 270)" }}
      data-ocid="admin.modal"
    >
      {/* Animated grid background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.65 0.25 195) 1px, transparent 1px), linear-gradient(90deg, oklch(0.65 0.25 195) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <motion.div
          animate={shaking ? { x: [-10, 10, -8, 8, -4, 4, 0] } : { x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-[380px] rounded-2xl overflow-hidden"
          style={{
            background: "oklch(0.1 0.02 270)",
            border: "1px solid oklch(0.65 0.25 195 / 0.4)",
            boxShadow:
              "0 0 40px oklch(0.65 0.25 195 / 0.15), 0 0 80px oklch(0.65 0.25 195 / 0.05)",
          }}
        >
          {/* Header glow strip */}
          <div
            className="h-1 w-full"
            style={{
              background:
                "linear-gradient(90deg, transparent, oklch(0.65 0.25 195), transparent)",
            }}
          />

          <div className="p-8">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{
                  background: "oklch(0.65 0.25 195 / 0.1)",
                  border: "1px solid oklch(0.65 0.25 195 / 0.3)",
                  boxShadow: "0 0 20px oklch(0.65 0.25 195 / 0.2)",
                }}
              >
                <Shield
                  className="w-8 h-8"
                  style={{ color: "oklch(0.65 0.25 195)" }}
                />
              </div>
            </div>

            <h1
              className="text-2xl font-bold text-center mb-1 font-display"
              style={{ color: "oklch(0.65 0.25 195)" }}
            >
              Admin Access
            </h1>
            <p
              className="text-center text-sm mb-6"
              style={{ color: "oklch(0.5 0.05 270)" }}
            >
              DIVYANSH GAMING Control Panel
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="admin-password"
                  className="text-xs font-medium"
                  style={{ color: "oklch(0.6 0.1 195)" }}
                >
                  ADMIN PASSWORD
                </Label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{ color: "oklch(0.5 0.1 195)" }}
                  />
                  <Input
                    id="admin-password"
                    type="password"
                    value={pw}
                    onChange={(e) => {
                      setPw(e.target.value);
                      setError("");
                    }}
                    placeholder="Enter admin password"
                    className="pl-10 bg-transparent"
                    style={{
                      border: error
                        ? "1px solid oklch(0.6 0.25 25)"
                        : "1px solid oklch(0.65 0.25 195 / 0.3)",
                      color: "oklch(0.9 0.05 195)",
                    }}
                    data-ocid="admin.input"
                    autoFocus
                  />
                </div>
                {error && (
                  <p
                    className="text-xs"
                    style={{ color: "oklch(0.6 0.25 25)" }}
                    data-ocid="admin.error_state"
                  >
                    {error}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full font-bold tracking-wide"
                style={{
                  background: "oklch(0.65 0.25 195 / 0.15)",
                  border: "1px solid oklch(0.65 0.25 195 / 0.6)",
                  color: "oklch(0.65 0.25 195)",
                  boxShadow: "0 0 12px oklch(0.65 0.25 195 / 0.2)",
                }}
                data-ocid="admin.submit_button"
              >
                Enter Admin Panel
              </Button>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ─── Dashboard Tab ────────────────────────────────────────────────────────────
function DashboardTab() {
  const leaderboard = ls<LeaderboardEntry[]>("dg_leaderboard", []);
  const champion = ls<Champion | null>("dg_champion", null);
  const announcements = ls<Announcement[]>("dg_announcements", []);
  const xpProfile = ls<{ level?: number; xp?: number } | null>(
    "dg_xp_profile",
    null,
  );

  const uniquePlayers = new Set(leaderboard.map((e) => e.player)).size;
  const totalScores = leaderboard.length;

  const gameCounts: Record<string, number> = {};
  for (const e of leaderboard) {
    gameCounts[e.game] = (gameCounts[e.game] ?? 0) + 1;
  }
  const mostPlayed =
    Object.entries(gameCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "N/A";

  const stats = [
    {
      label: "Total Players",
      value: uniquePlayers || "0",
      icon: <Users className="w-5 h-5" />,
      color: "195",
    },
    {
      label: "Scores Submitted",
      value: totalScores || "0",
      icon: <BarChart3 className="w-5 h-5" />,
      color: "280",
    },
    {
      label: "Current Champion",
      value: champion?.name ?? "None",
      icon: <Trophy className="w-5 h-5" />,
      color: "70",
    },
    {
      label: "Announcements",
      value: announcements.length || "0",
      icon: <Megaphone className="w-5 h-5" />,
      color: "320",
    },
    {
      label: "Active XP Level",
      value: xpProfile?.level ? `Level ${xpProfile.level}` : "N/A",
      icon: <Star className="w-5 h-5" />,
      color: "45",
    },
    {
      label: "Most Played",
      value: mostPlayed,
      icon: <Gamepad2 className="w-5 h-5" />,
      color: "150",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2
          className="text-xl font-bold mb-1"
          style={{ color: "oklch(0.65 0.25 195)" }}
        >
          Dashboard Overview
        </h2>
        <p className="text-sm" style={{ color: "oklch(0.5 0.05 270)" }}>
          Live stats from localStorage
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s) => (
          <Card
            key={s.label}
            className="relative overflow-hidden"
            style={{
              background: "oklch(0.1 0.015 270)",
              border: `1px solid oklch(0.65 0.25 ${s.color} / 0.25)`,
            }}
            data-ocid="admin.dashboard.card"
          >
            <div
              className="absolute inset-0 opacity-5"
              style={{
                background: `radial-gradient(circle at top right, oklch(0.65 0.25 ${s.color}), transparent 70%)`,
              }}
            />
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p
                    className="text-xs font-medium uppercase tracking-wider mb-2"
                    style={{ color: `oklch(0.55 0.1 ${s.color})` }}
                  >
                    {s.label}
                  </p>
                  <p
                    className="text-2xl font-bold"
                    style={{ color: "oklch(0.92 0.05 195)" }}
                  >
                    {String(s.value)}
                  </p>
                </div>
                <div
                  className="p-2 rounded-lg"
                  style={{
                    background: `oklch(0.65 0.25 ${s.color} / 0.1)`,
                    color: `oklch(0.65 0.25 ${s.color})`,
                  }}
                >
                  {s.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick info */}
      <Card
        style={{
          background: "oklch(0.1 0.015 270)",
          border: "1px solid oklch(0.65 0.25 195 / 0.2)",
        }}
      >
        <CardHeader className="pb-3">
          <CardTitle
            className="text-base"
            style={{ color: "oklch(0.65 0.25 195)" }}
          >
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            { label: "Admin Session", status: "Active", ok: true },
            { label: "LocalStorage", status: "Operational", ok: true },
            {
              label: "Leaderboard",
              status:
                leaderboard.length > 0
                  ? `${leaderboard.length} entries`
                  : "Empty",
              ok: true,
            },
            {
              label: "Tournament",
              status: champion ? `Week ${champion.week}` : "No active champion",
              ok: !!champion,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between py-1.5 border-b"
              style={{ borderColor: "oklch(0.65 0.25 195 / 0.08)" }}
            >
              <span
                className="text-sm"
                style={{ color: "oklch(0.65 0.08 270)" }}
              >
                {item.label}
              </span>
              <Badge
                className="text-xs"
                style={{
                  background: item.ok
                    ? "oklch(0.6 0.2 150 / 0.15)"
                    : "oklch(0.6 0.2 25 / 0.15)",
                  color: item.ok ? "oklch(0.7 0.2 150)" : "oklch(0.7 0.2 25)",
                  border: `1px solid ${item.ok ? "oklch(0.6 0.2 150 / 0.3)" : "oklch(0.6 0.2 25 / 0.3)"}`,
                }}
              >
                {item.status}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Games Tab ────────────────────────────────────────────────────────────────
function GamesTab() {
  const [featured, setFeatured] = useState<string[]>(() =>
    ls<string[]>("dg_featured_games", []),
  );
  const [disabled, setDisabled] = useState<string[]>(() =>
    ls<string[]>("dg_disabled_games", []),
  );

  function toggleFeatured(game: string) {
    const next = featured.includes(game)
      ? featured.filter((g) => g !== game)
      : [...featured, game];
    setFeatured(next);
    lsSet("dg_featured_games", next);
    toast.success(
      `${game} ${featured.includes(game) ? "removed from" : "added to"} Featured`,
    );
  }

  function toggleActive(game: string) {
    const next = disabled.includes(game)
      ? disabled.filter((g) => g !== game)
      : [...disabled, game];
    setDisabled(next);
    lsSet("dg_disabled_games", next);
    toast.success(
      `${game} ${disabled.includes(game) ? "enabled" : "disabled"}`,
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2
          className="text-xl font-bold mb-1"
          style={{ color: "oklch(0.65 0.25 195)" }}
        >
          Game Management
        </h2>
        <p className="text-sm" style={{ color: "oklch(0.5 0.05 270)" }}>
          Toggle featured status and enable/disable games
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {MAIN_GAMES.map((game, i) => {
          const isFeatured = featured.includes(game);
          const isActive = !disabled.includes(game);
          return (
            <Card
              key={game}
              className="relative overflow-hidden transition-all"
              style={{
                background: "oklch(0.1 0.015 270)",
                border: `1px solid ${isFeatured ? "oklch(0.75 0.2 70 / 0.4)" : "oklch(0.65 0.25 195 / 0.2)"}`,
                opacity: isActive ? 1 : 0.6,
              }}
              data-ocid={`admin.game.card.${i + 1}`}
            >
              {isFeatured && (
                <div className="absolute top-2 right-2">
                  <Badge
                    className="text-xs flex items-center gap-1"
                    style={{
                      background: "oklch(0.75 0.2 70 / 0.15)",
                      color: "oklch(0.75 0.2 70)",
                      border: "1px solid oklch(0.75 0.2 70 / 0.4)",
                    }}
                  >
                    <Star className="w-3 h-3 fill-current" /> Featured
                  </Badge>
                </div>
              )}
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-base font-bold"
                    style={{
                      background: "oklch(0.65 0.25 195 / 0.1)",
                      color: "oklch(0.65 0.25 195)",
                      border: "1px solid oklch(0.65 0.25 195 / 0.2)",
                    }}
                  >
                    {i + 1}
                  </div>
                  <div>
                    <p
                      className="font-semibold text-sm"
                      style={{ color: "oklch(0.9 0.05 195)" }}
                    >
                      {game}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "oklch(0.5 0.05 270)" }}
                    >
                      {isActive ? "Active" : "Disabled"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={isFeatured}
                      onCheckedChange={() => toggleFeatured(game)}
                      data-ocid={`admin.game.toggle.${i + 1}`}
                    />
                    <Label
                      className="text-xs"
                      style={{ color: "oklch(0.6 0.1 195)" }}
                    >
                      Featured
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={isActive}
                      onCheckedChange={() => toggleActive(game)}
                      data-ocid={`admin.game.toggle.${i + 1}`}
                    />
                    <Label
                      className="text-xs"
                      style={{ color: "oklch(0.6 0.1 195)" }}
                    >
                      Active
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ─── Leaderboard Tab ──────────────────────────────────────────────────────────
function LeaderboardTab() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>(() => {
    const saved = ls<LeaderboardEntry[]>("dg_leaderboard", []);
    return saved.length > 0 ? saved : MOCK_LEADERBOARD;
  });
  const [confirmClear, setConfirmClear] = useState(false);

  function deleteEntry(index: number) {
    const next = entries.filter((_, i) => i !== index);
    setEntries(next);
    lsSet("dg_leaderboard", next);
    toast.success("Entry deleted");
  }

  function clearAll() {
    setEntries([]);
    lsSet("dg_leaderboard", []);
    setConfirmClear(false);
    toast.success("All scores cleared");
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2
            className="text-xl font-bold mb-1"
            style={{ color: "oklch(0.65 0.25 195)" }}
          >
            Leaderboard
          </h2>
          <p className="text-sm" style={{ color: "oklch(0.5 0.05 270)" }}>
            {entries.length} entries total
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => exportCsv(entries)}
            className="text-xs"
            style={{
              borderColor: "oklch(0.65 0.25 195 / 0.3)",
              color: "oklch(0.65 0.25 195)",
            }}
            data-ocid="admin.leaderboard.button"
          >
            <Download className="w-3.5 h-3.5 mr-1" /> Export CSV
          </Button>
          <Dialog open={confirmClear} onOpenChange={setConfirmClear}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                variant="destructive"
                className="text-xs"
                data-ocid="admin.leaderboard.delete_button"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" /> Clear All
              </Button>
            </DialogTrigger>
            <DialogContent
              style={{
                background: "oklch(0.1 0.02 270)",
                border: "1px solid oklch(0.6 0.25 25 / 0.4)",
              }}
              data-ocid="admin.leaderboard.dialog"
            >
              <DialogHeader>
                <DialogTitle style={{ color: "oklch(0.6 0.25 25)" }}>
                  Clear All Scores?
                </DialogTitle>
                <DialogDescription style={{ color: "oklch(0.55 0.05 270)" }}>
                  This action cannot be undone. All {entries.length} leaderboard
                  entries will be permanently deleted.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => setConfirmClear(false)}
                  data-ocid="admin.leaderboard.cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={clearAll}
                  data-ocid="admin.leaderboard.confirm_button"
                >
                  Clear All Scores
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid oklch(0.65 0.25 195 / 0.2)" }}
        data-ocid="admin.leaderboard.table"
      >
        <Table>
          <TableHeader>
            <TableRow
              style={{
                borderColor: "oklch(0.65 0.25 195 / 0.15)",
                background: "oklch(0.12 0.02 270)",
              }}
            >
              <TableHead style={{ color: "oklch(0.65 0.25 195)" }}>
                Rank
              </TableHead>
              <TableHead style={{ color: "oklch(0.65 0.25 195)" }}>
                Player
              </TableHead>
              <TableHead style={{ color: "oklch(0.65 0.25 195)" }}>
                Game
              </TableHead>
              <TableHead style={{ color: "oklch(0.65 0.25 195)" }}>
                Score
              </TableHead>
              <TableHead style={{ color: "oklch(0.65 0.25 195)" }}>
                Date
              </TableHead>
              <TableHead style={{ color: "oklch(0.65 0.25 195)" }}>
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8"
                  style={{ color: "oklch(0.5 0.05 270)" }}
                >
                  No scores yet
                </TableCell>
              </TableRow>
            ) : (
              entries.map((e, i) => (
                <TableRow
                  key={`${e.player}-${e.game}-${i}`}
                  style={{ borderColor: "oklch(0.65 0.25 195 / 0.08)" }}
                  data-ocid={`admin.leaderboard.row.${i + 1}`}
                >
                  <TableCell
                    className="font-bold"
                    style={{
                      color:
                        i === 0
                          ? "oklch(0.75 0.2 70)"
                          : i === 1
                            ? "oklch(0.75 0.1 270)"
                            : i === 2
                              ? "oklch(0.65 0.2 50)"
                              : "oklch(0.6 0.05 270)",
                    }}
                  >
                    #{i + 1}
                  </TableCell>
                  <TableCell
                    className="font-medium"
                    style={{ color: "oklch(0.85 0.05 195)" }}
                  >
                    {e.player}
                  </TableCell>
                  <TableCell style={{ color: "oklch(0.65 0.1 195)" }}>
                    {e.game}
                  </TableCell>
                  <TableCell
                    className="font-mono font-bold"
                    style={{ color: "oklch(0.75 0.2 150)" }}
                  >
                    {e.score.toLocaleString()}
                  </TableCell>
                  <TableCell style={{ color: "oklch(0.55 0.05 270)" }}>
                    {e.date}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0"
                      onClick={() => deleteEntry(i)}
                      style={{ color: "oklch(0.6 0.2 25)" }}
                      data-ocid={`admin.leaderboard.delete_button.${i + 1}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ─── Tournament Tab ───────────────────────────────────────────────────────────
function TournamentTab() {
  const [champion, setChampion] = useState<Champion | null>(() =>
    ls<Champion | null>("dg_champion", null),
  );
  const [tournament, setTournament] = useState<TournamentData>(() =>
    ls<TournamentData>("dg_tournament", { players: [] }),
  );
  const [form, setForm] = useState({
    name: champion?.name ?? "",
    week: String(champion?.week ?? 1),
    color: champion?.avatarColor ?? "#06b6d4",
  });
  const [confirmReset, setConfirmReset] = useState(false);

  function saveChampion() {
    const newChamp: Champion = {
      name: form.name,
      week: Number(form.week),
      avatarColor: form.color,
    };
    setChampion(newChamp);
    lsSet("dg_champion", newChamp);
    toast.success("Champion updated!");
  }

  function resetTournament() {
    setChampion(null);
    setTournament({ players: [] });
    lsSet("dg_champion", null);
    lsSet("dg_tournament", { players: [] });
    setConfirmReset(false);
    toast.success("Tournament reset!");
  }

  function generateBracket() {
    const shuffled = [...SAMPLE_PLAYERS]
      .sort(() => Math.random() - 0.5)
      .slice(0, 8);
    const next = { players: shuffled };
    setTournament(next);
    lsSet("dg_tournament", next);
    toast.success("Random bracket generated!");
  }

  const bracketSlots = Array.from(
    { length: 8 },
    (_, i) => tournament.players[i] ?? "",
  );

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2
          className="text-xl font-bold mb-1"
          style={{ color: "oklch(0.65 0.25 195)" }}
        >
          Tournament Control
        </h2>
        <p className="text-sm" style={{ color: "oklch(0.5 0.05 270)" }}>
          Manage champion and bracket
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Champion section */}
        <Card
          style={{
            background: "oklch(0.1 0.015 270)",
            border: "1px solid oklch(0.75 0.2 70 / 0.25)",
          }}
        >
          <CardHeader className="pb-3">
            <CardTitle
              className="text-base flex items-center gap-2"
              style={{ color: "oklch(0.75 0.2 70)" }}
            >
              <Trophy className="w-4 h-4" /> Current Champion
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {champion ? (
              <div
                className="p-4 rounded-xl text-center"
                style={{
                  background: "oklch(0.75 0.2 70 / 0.08)",
                  border: "1px solid oklch(0.75 0.2 70 / 0.2)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-xl font-bold"
                  style={{ background: champion.avatarColor, color: "white" }}
                >
                  {champion.name[0]?.toUpperCase()}
                </div>
                <p
                  className="font-bold text-lg"
                  style={{ color: "oklch(0.9 0.1 70)" }}
                >
                  {champion.name}
                </p>
                <p className="text-xs" style={{ color: "oklch(0.6 0.1 70)" }}>
                  Week {champion.week} Champion
                </p>
              </div>
            ) : (
              <p
                className="text-center text-sm py-4"
                style={{ color: "oklch(0.5 0.05 270)" }}
              >
                No champion set
              </p>
            )}

            <div className="space-y-3">
              <div className="space-y-1">
                <Label
                  className="text-xs"
                  style={{ color: "oklch(0.6 0.1 195)" }}
                >
                  Player Name
                </Label>
                <Input
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="Champion name"
                  className="bg-transparent text-sm"
                  style={{
                    borderColor: "oklch(0.65 0.25 195 / 0.3)",
                    color: "oklch(0.9 0.05 195)",
                  }}
                  data-ocid="admin.tournament.input"
                />
              </div>
              <div className="space-y-1">
                <Label
                  className="text-xs"
                  style={{ color: "oklch(0.6 0.1 195)" }}
                >
                  Week Number
                </Label>
                <Input
                  type="number"
                  value={form.week}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, week: e.target.value }))
                  }
                  className="bg-transparent text-sm"
                  style={{
                    borderColor: "oklch(0.65 0.25 195 / 0.3)",
                    color: "oklch(0.9 0.05 195)",
                  }}
                  data-ocid="admin.tournament.input"
                />
              </div>
              <div className="space-y-1">
                <Label
                  className="text-xs"
                  style={{ color: "oklch(0.6 0.1 195)" }}
                >
                  Avatar Color
                </Label>
                <input
                  type="color"
                  value={form.color}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, color: e.target.value }))
                  }
                  className="w-full h-9 rounded-lg cursor-pointer"
                  style={{ border: "1px solid oklch(0.65 0.25 195 / 0.3)" }}
                />
              </div>
              <Button
                onClick={saveChampion}
                className="w-full text-sm"
                style={{
                  background: "oklch(0.65 0.25 195 / 0.15)",
                  border: "1px solid oklch(0.65 0.25 195 / 0.5)",
                  color: "oklch(0.65 0.25 195)",
                }}
                data-ocid="admin.tournament.save_button"
              >
                Set Champion
              </Button>
            </div>

            <Dialog open={confirmReset} onOpenChange={setConfirmReset}>
              <DialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full text-xs"
                  data-ocid="admin.tournament.delete_button"
                >
                  <RefreshCw className="w-3.5 h-3.5 mr-1" /> Reset Tournament
                </Button>
              </DialogTrigger>
              <DialogContent
                style={{
                  background: "oklch(0.1 0.02 270)",
                  border: "1px solid oklch(0.6 0.25 25 / 0.4)",
                }}
                data-ocid="admin.tournament.dialog"
              >
                <DialogHeader>
                  <DialogTitle style={{ color: "oklch(0.6 0.25 25)" }}>
                    Reset Tournament?
                  </DialogTitle>
                  <DialogDescription style={{ color: "oklch(0.55 0.05 270)" }}>
                    This will clear the current champion and all bracket data.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setConfirmReset(false)}
                    data-ocid="admin.tournament.cancel_button"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={resetTournament}
                    data-ocid="admin.tournament.confirm_button"
                  >
                    Reset
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Bracket */}
        <Card
          style={{
            background: "oklch(0.1 0.015 270)",
            border: "1px solid oklch(0.65 0.25 195 / 0.2)",
          }}
        >
          <CardHeader className="pb-3">
            <CardTitle
              className="text-base flex items-center gap-2"
              style={{ color: "oklch(0.65 0.25 195)" }}
            >
              <Users className="w-4 h-4" /> Tournament Bracket
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {(bracketSlots as string[]).map((player, i) => (
                <div
                  key={`bracket-position-${i}-${player || "empty"}`}
                  className="flex items-center gap-2 p-2.5 rounded-lg text-sm"
                  style={{
                    background: player
                      ? "oklch(0.65 0.25 195 / 0.08)"
                      : "oklch(0.12 0.01 270)",
                    border: `1px solid ${player ? "oklch(0.65 0.25 195 / 0.25)" : "oklch(0.65 0.25 195 / 0.1)"}`,
                  }}
                  data-ocid={`admin.tournament.item.${i + 1}`}
                >
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{
                      background: "oklch(0.65 0.25 195 / 0.2)",
                      color: "oklch(0.65 0.25 195)",
                    }}
                  >
                    {i + 1}
                  </span>
                  <span
                    style={{
                      color: player
                        ? "oklch(0.85 0.05 195)"
                        : "oklch(0.4 0.03 270)",
                    }}
                  >
                    {player || "Empty slot"}
                  </span>
                </div>
              ))}
            </div>
            <Button
              onClick={generateBracket}
              size="sm"
              className="w-full text-xs"
              style={{
                background: "oklch(0.65 0.25 280 / 0.15)",
                border: "1px solid oklch(0.65 0.25 280 / 0.4)",
                color: "oklch(0.7 0.2 280)",
              }}
              data-ocid="admin.tournament.button"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1" /> Generate Random Bracket
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ─── Content Tab ──────────────────────────────────────────────────────────────
function ContentTab() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(() =>
    ls<Announcement[]>("dg_announcements", []),
  );
  const [videos, setVideos] = useState<YTVideo[]>(() =>
    ls<YTVideo[]>("dg_yt_videos", []),
  );
  const [aForm, setAForm] = useState({ title: "", body: "" });
  const [vForm, setVForm] = useState({ title: "", url: "" });

  function addAnnouncement() {
    if (!aForm.title.trim()) return;
    const next = [
      ...announcements,
      {
        id: Date.now().toString(),
        title: aForm.title,
        body: aForm.body,
        date: new Date().toISOString().split("T")[0],
      },
    ];
    setAnnouncements(next);
    lsSet("dg_announcements", next);
    setAForm({ title: "", body: "" });
    toast.success("Announcement added!");
  }

  function deleteAnnouncement(id: string) {
    const next = announcements.filter((a) => a.id !== id);
    setAnnouncements(next);
    lsSet("dg_announcements", next);
    toast.success("Announcement deleted");
  }

  function addVideo() {
    if (!vForm.title.trim() || !vForm.url.trim()) return;
    const next = [
      ...videos,
      { id: Date.now().toString(), title: vForm.title, url: vForm.url },
    ];
    setVideos(next);
    lsSet("dg_yt_videos", next);
    setVForm({ title: "", url: "" });
    toast.success("Video added!");
  }

  function deleteVideo(id: string) {
    const next = videos.filter((v) => v.id !== id);
    setVideos(next);
    lsSet("dg_yt_videos", next);
    toast.success("Video deleted");
  }

  const pastChampions = ls<Champion[]>("dg_champion_history", []);

  return (
    <div className="p-6 space-y-8">
      {/* Announcements */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Megaphone
            className="w-5 h-5"
            style={{ color: "oklch(0.65 0.25 195)" }}
          />
          <h2
            className="text-xl font-bold"
            style={{ color: "oklch(0.65 0.25 195)" }}
          >
            Announcements
          </h2>
          <Badge
            style={{
              background: "oklch(0.65 0.25 195 / 0.1)",
              color: "oklch(0.65 0.25 195)",
              border: "1px solid oklch(0.65 0.25 195 / 0.3)",
            }}
          >
            {announcements.length}
          </Badge>
        </div>

        <Card
          style={{
            background: "oklch(0.1 0.015 270)",
            border: "1px solid oklch(0.65 0.25 195 / 0.2)",
          }}
        >
          <CardContent className="p-4 space-y-3">
            <Input
              placeholder="Announcement title"
              value={aForm.title}
              onChange={(e) =>
                setAForm((p) => ({ ...p, title: e.target.value }))
              }
              className="bg-transparent text-sm"
              style={{
                borderColor: "oklch(0.65 0.25 195 / 0.3)",
                color: "oklch(0.9 0.05 195)",
              }}
              data-ocid="admin.content.input"
            />
            <Textarea
              placeholder="Announcement body (optional)"
              value={aForm.body}
              onChange={(e) =>
                setAForm((p) => ({ ...p, body: e.target.value }))
              }
              rows={2}
              className="bg-transparent text-sm resize-none"
              style={{
                borderColor: "oklch(0.65 0.25 195 / 0.3)",
                color: "oklch(0.9 0.05 195)",
              }}
              data-ocid="admin.content.textarea"
            />
            <Button
              onClick={addAnnouncement}
              size="sm"
              className="text-xs"
              style={{
                background: "oklch(0.65 0.25 195 / 0.15)",
                border: "1px solid oklch(0.65 0.25 195 / 0.5)",
                color: "oklch(0.65 0.25 195)",
              }}
              data-ocid="admin.content.submit_button"
            >
              Add Announcement
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-2" data-ocid="admin.content.list">
          {announcements.length === 0 ? (
            <p
              className="text-sm text-center py-4"
              style={{ color: "oklch(0.5 0.05 270)" }}
              data-ocid="admin.content.empty_state"
            >
              No announcements yet
            </p>
          ) : (
            announcements.map((a, i) => (
              <div
                key={a.id}
                className="flex items-start justify-between p-3 rounded-lg"
                style={{
                  background: "oklch(0.1 0.015 270)",
                  border: "1px solid oklch(0.65 0.25 195 / 0.15)",
                }}
                data-ocid={`admin.content.item.${i + 1}`}
              >
                <div className="flex-1 min-w-0 mr-3">
                  <p
                    className="font-medium text-sm"
                    style={{ color: "oklch(0.85 0.05 195)" }}
                  >
                    {a.title}
                  </p>
                  {a.body && (
                    <p
                      className="text-xs mt-0.5 line-clamp-2"
                      style={{ color: "oklch(0.55 0.05 270)" }}
                    >
                      {a.body}
                    </p>
                  )}
                  <p
                    className="text-xs mt-1"
                    style={{ color: "oklch(0.45 0.04 270)" }}
                  >
                    {a.date}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0 flex-shrink-0"
                  onClick={() => deleteAnnouncement(a.id)}
                  style={{ color: "oklch(0.6 0.2 25)" }}
                  data-ocid={`admin.content.delete_button.${i + 1}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* YouTube Videos */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Youtube
            className="w-5 h-5"
            style={{ color: "oklch(0.6 0.25 25)" }}
          />
          <h2
            className="text-xl font-bold"
            style={{ color: "oklch(0.65 0.25 195)" }}
          >
            YouTube Videos
          </h2>
          <Badge
            style={{
              background: "oklch(0.6 0.25 25 / 0.1)",
              color: "oklch(0.6 0.25 25)",
              border: "1px solid oklch(0.6 0.25 25 / 0.3)",
            }}
          >
            {videos.length}
          </Badge>
        </div>

        <Card
          style={{
            background: "oklch(0.1 0.015 270)",
            border: "1px solid oklch(0.6 0.25 25 / 0.2)",
          }}
        >
          <CardContent className="p-4 space-y-3">
            <Input
              placeholder="Video title"
              value={vForm.title}
              onChange={(e) =>
                setVForm((p) => ({ ...p, title: e.target.value }))
              }
              className="bg-transparent text-sm"
              style={{
                borderColor: "oklch(0.6 0.25 25 / 0.3)",
                color: "oklch(0.9 0.05 195)",
              }}
              data-ocid="admin.content.input"
            />
            <Input
              placeholder="YouTube URL (e.g. https://youtu.be/...)"
              value={vForm.url}
              onChange={(e) => setVForm((p) => ({ ...p, url: e.target.value }))}
              className="bg-transparent text-sm"
              style={{
                borderColor: "oklch(0.6 0.25 25 / 0.3)",
                color: "oklch(0.9 0.05 195)",
              }}
              data-ocid="admin.content.input"
            />
            <Button
              onClick={addVideo}
              size="sm"
              className="text-xs"
              style={{
                background: "oklch(0.6 0.25 25 / 0.15)",
                border: "1px solid oklch(0.6 0.25 25 / 0.5)",
                color: "oklch(0.65 0.2 25)",
              }}
              data-ocid="admin.content.submit_button"
            >
              Add Video
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-2">
          {videos.length === 0 ? (
            <p
              className="text-sm text-center py-4"
              style={{ color: "oklch(0.5 0.05 270)" }}
              data-ocid="admin.content.empty_state"
            >
              No videos added yet
            </p>
          ) : (
            videos.map((v, i) => (
              <div
                key={v.id}
                className="flex items-center justify-between p-3 rounded-lg"
                style={{
                  background: "oklch(0.1 0.015 270)",
                  border: "1px solid oklch(0.6 0.25 25 / 0.15)",
                }}
                data-ocid={`admin.content.item.${i + 1}`}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <Youtube
                    className="w-4 h-4 flex-shrink-0"
                    style={{ color: "oklch(0.6 0.25 25)" }}
                  />
                  <div className="min-w-0">
                    <p
                      className="font-medium text-sm truncate"
                      style={{ color: "oklch(0.85 0.05 195)" }}
                    >
                      {v.title}
                    </p>
                    <p
                      className="text-xs truncate"
                      style={{ color: "oklch(0.5 0.05 270)" }}
                    >
                      {v.url}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0 flex-shrink-0 ml-2"
                  onClick={() => deleteVideo(v.id)}
                  style={{ color: "oklch(0.6 0.2 25)" }}
                  data-ocid={`admin.content.delete_button.${i + 1}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Hall of Champions History */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5" style={{ color: "oklch(0.75 0.2 70)" }} />
          <h2
            className="text-xl font-bold"
            style={{ color: "oklch(0.65 0.25 195)" }}
          >
            Champions History
          </h2>
        </div>
        {pastChampions.length === 0 ? (
          <p
            className="text-sm text-center py-4"
            style={{ color: "oklch(0.5 0.05 270)" }}
            data-ocid="admin.champions.empty_state"
          >
            No champion history available
          </p>
        ) : (
          <div className="space-y-2">
            {pastChampions.map((c, i) => (
              <div
                key={`${c.name}-${c.week}`}
                className="flex items-center gap-3 p-3 rounded-lg"
                style={{
                  background: "oklch(0.1 0.015 270)",
                  border: "1px solid oklch(0.75 0.2 70 / 0.15)",
                }}
                data-ocid={`admin.champions.item.${i + 1}`}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0"
                  style={{ background: c.avatarColor }}
                >
                  {c.name[0]?.toUpperCase()}
                </div>
                <div>
                  <p
                    className="font-medium text-sm"
                    style={{ color: "oklch(0.85 0.05 195)" }}
                  >
                    {c.name}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "oklch(0.55 0.1 70)" }}
                  >
                    Week {c.week} Champion
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Admin Panel Main ─────────────────────────────────────────────────────────
export default function AdminPanel({ onClose }: { onClose: () => void }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() =>
    ls<boolean>(ADMIN_SESSION_KEY, false),
  );
  const [activeTab, setActiveTab] = useState("dashboard");

  function handleLogout() {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    setIsLoggedIn(false);
    onClose();
  }

  if (!isLoggedIn) {
    return <AdminLogin onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col"
      style={{ background: "oklch(0.07 0.02 270)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      data-ocid="admin.panel"
    >
      {/* Animated grid bg */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.65 0.25 195) 1px, transparent 1px), linear-gradient(90deg, oklch(0.65 0.25 195) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Header */}
      <header
        className="relative z-10 flex items-center justify-between px-6 py-4 flex-shrink-0"
        style={{
          background: "oklch(0.08 0.02 270 / 0.95)",
          borderBottom: "1px solid oklch(0.65 0.25 195 / 0.2)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: "oklch(0.65 0.25 195 / 0.1)",
              border: "1px solid oklch(0.65 0.25 195 / 0.3)",
              boxShadow: "0 0 16px oklch(0.65 0.25 195 / 0.2)",
            }}
          >
            <Shield
              className="w-5 h-5"
              style={{ color: "oklch(0.65 0.25 195)" }}
            />
          </div>
          <div>
            <h1
              className="font-bold text-base leading-tight"
              style={{ color: "oklch(0.65 0.25 195)" }}
            >
              DIVYANSH GAMING
            </h1>
            <p className="text-xs" style={{ color: "oklch(0.5 0.08 195)" }}>
              Admin Control Panel
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            className="text-xs hidden sm:flex"
            style={{
              background: "oklch(0.6 0.2 150 / 0.15)",
              color: "oklch(0.7 0.2 150)",
              border: "1px solid oklch(0.6 0.2 150 / 0.3)",
            }}
          >
            Admin Session Active
          </Badge>
          <Button
            size="sm"
            variant="outline"
            onClick={handleLogout}
            className="text-xs flex items-center gap-1.5"
            style={{
              borderColor: "oklch(0.6 0.2 25 / 0.4)",
              color: "oklch(0.65 0.2 25)",
              background: "transparent",
            }}
            data-ocid="admin.panel.close_button"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exit Admin</span>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onClose}
            className="w-8 h-8 p-0"
            style={{ color: "oklch(0.5 0.05 270)" }}
            data-ocid="admin.panel.close_button"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Tabs */}
      <div className="relative z-10 flex-1 min-h-0">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="h-full flex flex-col"
        >
          <TabsList
            className="flex-shrink-0 w-full justify-start rounded-none px-6 h-12 gap-1"
            style={{
              background: "oklch(0.09 0.015 270)",
              borderBottom: "1px solid oklch(0.65 0.25 195 / 0.12)",
            }}
          >
            {[
              {
                value: "dashboard",
                label: "Dashboard",
                icon: <BarChart3 className="w-3.5 h-3.5" />,
              },
              {
                value: "games",
                label: "Games",
                icon: <Gamepad2 className="w-3.5 h-3.5" />,
              },
              {
                value: "leaderboard",
                label: "Leaderboard",
                icon: <Trophy className="w-3.5 h-3.5" />,
              },
              {
                value: "tournament",
                label: "Tournament",
                icon: <Award className="w-3.5 h-3.5" />,
              },
              {
                value: "content",
                label: "Content",
                icon: <Megaphone className="w-3.5 h-3.5" />,
              },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg transition-all"
                style={{
                  color:
                    activeTab === tab.value
                      ? "oklch(0.65 0.25 195)"
                      : "oklch(0.5 0.05 270)",
                  background:
                    activeTab === tab.value
                      ? "oklch(0.65 0.25 195 / 0.1)"
                      : "transparent",
                }}
                data-ocid={`admin.${tab.value}.tab`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <ScrollArea className="flex-1">
            <TabsContent value="dashboard" className="mt-0">
              <DashboardTab />
            </TabsContent>
            <TabsContent value="games" className="mt-0">
              <GamesTab />
            </TabsContent>
            <TabsContent value="leaderboard" className="mt-0">
              <LeaderboardTab />
            </TabsContent>
            <TabsContent value="tournament" className="mt-0">
              <TournamentTab />
            </TabsContent>
            <TabsContent value="content" className="mt-0">
              <ContentTab />
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>
    </motion.div>
  );
}
