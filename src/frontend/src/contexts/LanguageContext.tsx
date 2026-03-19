import { createContext, useContext, useEffect, useState } from "react";

export type Language = "en" | "hi" | "es" | "fr" | "ja" | "ar";

export const LANGUAGES: {
  code: Language;
  label: string;
  flag: string;
  dir?: "rtl";
}[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "ar", label: "العربية", flag: "🇸🇦", dir: "rtl" },
];

type Translations = {
  nav: {
    home: string;
    games: string;
    leaderboard: string;
    achievements: string;
    tournament: string;
    about: string;
    profile: string;
  };
  hero: {
    playNow: string;
    viewLeaderboard: string;
    replayIntro: string;
  };
  sections: {
    miniGames: string;
    leaderboard: string;
    achievements: string;
    tournament: string;
    about: string;
    avatar: string;
  };
  profile: {
    title: string;
    guest: string;
    player: string;
    displayName: string;
    saveChanges: string;
    language: string;
    resetProgress: string;
    clearProfile: string;
    upgradeProfile: string;
    xpLevel: string;
    scoresSubmitted: string;
    achievementsUnlocked: string;
    pickAvatar: string;
    confirmReset: string;
    confirmClear: string;
    close: string;
  };
  welcome: {
    title: string;
    subtitle: string;
    continueAsGuest: string;
    setupProfile: string;
    yourName: string;
    pickAvatar: string;
    letsPlay: string;
  };
};

const T: Record<Language, Translations> = {
  en: {
    nav: {
      home: "Home",
      games: "Games",
      leaderboard: "Leaderboard",
      achievements: "Achievements",
      tournament: "Tournament",
      about: "About",
      profile: "Profile",
    },
    hero: {
      playNow: "Play Now",
      viewLeaderboard: "View Leaderboard",
      replayIntro: "Replay Intro",
    },
    sections: {
      miniGames: "Mini Games",
      leaderboard: "Leaderboard",
      achievements: "Achievements",
      tournament: "Tournament",
      about: "About",
      avatar: "Avatar",
    },
    profile: {
      title: "My Profile",
      guest: "Guest",
      player: "Player",
      displayName: "Display Name",
      saveChanges: "Save Changes",
      language: "Language",
      resetProgress: "Reset Progress",
      clearProfile: "Clear Profile",
      upgradeProfile: "Upgrade to Player",
      xpLevel: "Level",
      scoresSubmitted: "Scores Submitted",
      achievementsUnlocked: "Achievements",
      pickAvatar: "Pick Avatar",
      confirmReset: "Confirm Reset?",
      confirmClear: "Confirm Clear?",
      close: "Close",
    },
    welcome: {
      title: "Welcome to DIVYANSH GAMING",
      subtitle: "The ultimate neon cyberpunk gaming experience",
      continueAsGuest: "Continue as Guest",
      setupProfile: "Set Up Profile",
      yourName: "Your Name",
      pickAvatar: "Pick Your Avatar",
      letsPlay: "Let's Play!",
    },
  },
  hi: {
    nav: {
      home: "होम",
      games: "गेम्स",
      leaderboard: "लीडरबोर्ड",
      achievements: "उपलब्धियां",
      tournament: "टूर्नामेंट",
      about: "परिचय",
      profile: "प्रोफाइल",
    },
    hero: {
      playNow: "अभी खेलें",
      viewLeaderboard: "लीडरबोर्ड देखें",
      replayIntro: "इंट्रो दोबारा चलाएं",
    },
    sections: {
      miniGames: "मिनी गेम्स",
      leaderboard: "लीडरबोर्ड",
      achievements: "उपलब्धियां",
      tournament: "टूर्नामेंट",
      about: "परिचय",
      avatar: "अवतार",
    },
    profile: {
      title: "मेरी प्रोफाइल",
      guest: "गेस्ट",
      player: "प्लेयर",
      displayName: "नाम",
      saveChanges: "बदलाव सहेजें",
      language: "भाषा",
      resetProgress: "प्रगति रीसेट करें",
      clearProfile: "प्रोफाइल साफ करें",
      upgradeProfile: "प्लेयर बनें",
      xpLevel: "स्तर",
      scoresSubmitted: "स्कोर जमा",
      achievementsUnlocked: "उपलब्धियां",
      pickAvatar: "अवतार चुनें",
      confirmReset: "रीसेट करें?",
      confirmClear: "साफ करें?",
      close: "बंद करें",
    },
    welcome: {
      title: "DIVYANSH GAMING में आपका स्वागत है",
      subtitle: "नियॉन साइबरपंक गेमिंग अनुभव",
      continueAsGuest: "गेस्ट के रूप में जारी रखें",
      setupProfile: "प्रोफाइल बनाएं",
      yourName: "आपका नाम",
      pickAvatar: "अवतार चुनें",
      letsPlay: "खेलते हैं!",
    },
  },
  es: {
    nav: {
      home: "Inicio",
      games: "Juegos",
      leaderboard: "Clasificación",
      achievements: "Logros",
      tournament: "Torneo",
      about: "Acerca de",
      profile: "Perfil",
    },
    hero: {
      playNow: "Jugar Ahora",
      viewLeaderboard: "Ver Clasificación",
      replayIntro: "Repetir Intro",
    },
    sections: {
      miniGames: "Mini Juegos",
      leaderboard: "Clasificación",
      achievements: "Logros",
      tournament: "Torneo",
      about: "Acerca de",
      avatar: "Avatar",
    },
    profile: {
      title: "Mi Perfil",
      guest: "Invitado",
      player: "Jugador",
      displayName: "Nombre",
      saveChanges: "Guardar",
      language: "Idioma",
      resetProgress: "Reiniciar Progreso",
      clearProfile: "Borrar Perfil",
      upgradeProfile: "Subir a Jugador",
      xpLevel: "Nivel",
      scoresSubmitted: "Puntuaciones",
      achievementsUnlocked: "Logros",
      pickAvatar: "Elige Avatar",
      confirmReset: "¿Confirmar reinicio?",
      confirmClear: "¿Confirmar borrado?",
      close: "Cerrar",
    },
    welcome: {
      title: "Bienvenido a DIVYANSH GAMING",
      subtitle: "La experiencia de juego neon cyberpunk definitiva",
      continueAsGuest: "Continuar como Invitado",
      setupProfile: "Crear Perfil",
      yourName: "Tu Nombre",
      pickAvatar: "Elige tu Avatar",
      letsPlay: "¡A Jugar!",
    },
  },
  fr: {
    nav: {
      home: "Accueil",
      games: "Jeux",
      leaderboard: "Classement",
      achievements: "Succès",
      tournament: "Tournoi",
      about: "À propos",
      profile: "Profil",
    },
    hero: {
      playNow: "Jouer",
      viewLeaderboard: "Classement",
      replayIntro: "Rejouer l'Intro",
    },
    sections: {
      miniGames: "Mini-Jeux",
      leaderboard: "Classement",
      achievements: "Succès",
      tournament: "Tournoi",
      about: "À propos",
      avatar: "Avatar",
    },
    profile: {
      title: "Mon Profil",
      guest: "Invité",
      player: "Joueur",
      displayName: "Nom",
      saveChanges: "Sauvegarder",
      language: "Langue",
      resetProgress: "Réinitialiser",
      clearProfile: "Effacer le Profil",
      upgradeProfile: "Devenir Joueur",
      xpLevel: "Niveau",
      scoresSubmitted: "Scores",
      achievementsUnlocked: "Succès",
      pickAvatar: "Avatar",
      confirmReset: "Confirmer?",
      confirmClear: "Confirmer?",
      close: "Fermer",
    },
    welcome: {
      title: "Bienvenue sur DIVYANSH GAMING",
      subtitle: "L'expérience cyberpunk ultime",
      continueAsGuest: "Continuer en Invité",
      setupProfile: "Créer un Profil",
      yourName: "Votre Nom",
      pickAvatar: "Choisir un Avatar",
      letsPlay: "On Joue!",
    },
  },
  ja: {
    nav: {
      home: "ホーム",
      games: "ゲーム",
      leaderboard: "ランキング",
      achievements: "実績",
      tournament: "トーナメント",
      about: "について",
      profile: "プロフィール",
    },
    hero: {
      playNow: "今すぐプレイ",
      viewLeaderboard: "ランキング",
      replayIntro: "イントロ再生",
    },
    sections: {
      miniGames: "ミニゲーム",
      leaderboard: "ランキング",
      achievements: "実績",
      tournament: "トーナメント",
      about: "について",
      avatar: "アバター",
    },
    profile: {
      title: "マイプロフィール",
      guest: "ゲスト",
      player: "プレイヤー",
      displayName: "名前",
      saveChanges: "保存",
      language: "言語",
      resetProgress: "進行リセット",
      clearProfile: "プロフィール削除",
      upgradeProfile: "プレイヤーになる",
      xpLevel: "レベル",
      scoresSubmitted: "スコア",
      achievementsUnlocked: "実績",
      pickAvatar: "アバター選択",
      confirmReset: "リセット確認?",
      confirmClear: "削除確認?",
      close: "閉じる",
    },
    welcome: {
      title: "DIVYANSH GAMINGへようこそ",
      subtitle: "ネオンサイバーパンクゲーム体験",
      continueAsGuest: "ゲストで続ける",
      setupProfile: "プロフィール設定",
      yourName: "お名前",
      pickAvatar: "アバター選択",
      letsPlay: "プレイ開始!",
    },
  },
  ar: {
    nav: {
      home: "الرئيسية",
      games: "الألعاب",
      leaderboard: "المتصدرون",
      achievements: "الإنجازات",
      tournament: "البطولة",
      about: "حول",
      profile: "الملف",
    },
    hero: {
      playNow: "العب الآن",
      viewLeaderboard: "المتصدرون",
      replayIntro: "إعادة المقدمة",
    },
    sections: {
      miniGames: "ألعاب صغيرة",
      leaderboard: "المتصدرون",
      achievements: "الإنجازات",
      tournament: "البطولة",
      about: "حول",
      avatar: "الصورة الرمزية",
    },
    profile: {
      title: "ملفي الشخصي",
      guest: "ضيف",
      player: "لاعب",
      displayName: "الاسم",
      saveChanges: "حفظ",
      language: "اللغة",
      resetProgress: "إعادة التقدم",
      clearProfile: "مسح الملف",
      upgradeProfile: "ترقية للاعب",
      xpLevel: "المستوى",
      scoresSubmitted: "النقاط",
      achievementsUnlocked: "الإنجازات",
      pickAvatar: "اختر الصورة",
      confirmReset: "تأكيد الإعادة?",
      confirmClear: "تأكيد المسح?",
      close: "إغلاق",
    },
    welcome: {
      title: "مرحباً بك في DIVYANSH GAMING",
      subtitle: "تجربة الألعاب السيبرانية النيون",
      continueAsGuest: "المتابعة كضيف",
      setupProfile: "إنشاء ملف",
      yourName: "اسمك",
      pickAvatar: "اختر صورتك",
      letsPlay: "نلعب!",
    },
  },
};

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  dir: "ltr" | "rtl";
};

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: T.en,
  dir: "ltr",
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem("dg_language") as Language) || "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("dg_language", lang);
  };

  const dir = language === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.setAttribute("dir", dir);
  }, [dir]);

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, t: T[language], dir }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
