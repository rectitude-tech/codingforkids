import { ref } from 'vue';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requiredXP: number;
}

export const ALL_BADGES: Badge[] = [
  { id: 'b1', name: 'Langkah Perdana 🚀', description: 'Selesaikan level pertama di Petualangan Robot!', icon: '🌟', requiredXP: 50 },
  { id: 'b2', name: 'Master Algoritma 🤖', description: 'Kumpulkan 300 XP di Game Koding Grid!', icon: '👑', requiredXP: 300 },
  { id: 'b3', name: 'Detektif Kode 🔍', description: 'Pecahkan 3 Sandi Rahasia Emoji!', icon: '🔎', requiredXP: 500 },
  { id: 'b4', name: 'Dokter Bug 🐞', description: 'Perbaiki kesalahan program di Dokter Bug!', icon: '🩺', requiredXP: 700 },
  { id: 'b5', name: 'Bintang Lomba 🏆', description: 'Selesaikan Simulasi Lomba dengan Nilai Sempurna!', icon: '🏆', requiredXP: 1000 }
];

const STORAGE_KEY = 'kodokids_progress_v1';

export function useGameProgress() {
  const userName = ref<string>('Juara Cilik');
  const userAvatar = ref<string>('🤖');
  const levelStars = ref<Record<string, number>>({});
  const unlockedBadges = ref<string[]>(['b1']);
  const totalXP = ref<number>(100);

  // Load from LocalStorage
  const loadProgress = () => {
    try {
      const dataStr = localStorage.getItem(STORAGE_KEY);
      if (dataStr) {
        const data = JSON.parse(dataStr);
        if (data.userName) userName.value = data.userName;
        if (data.userAvatar) userAvatar.value = data.userAvatar;
        if (data.levelStars) levelStars.value = data.levelStars;
        if (data.unlockedBadges) unlockedBadges.value = data.unlockedBadges;
        if (data.totalXP !== undefined) totalXP.value = data.totalXP;
      }
    } catch (e) {
      console.error('Failed to load progress from localStorage', e);
    }
  };

  // Save to LocalStorage
  const saveProgress = () => {
    try {
      const payload = {
        userName: userName.value,
        userAvatar: userAvatar.value,
        levelStars: levelStars.value,
        unlockedBadges: unlockedBadges.value,
        totalXP: totalXP.value
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.error('Failed to save progress', e);
    }
  };

  // Record Level Completion
  const recordLevelComplete = (modeKey: string, levelId: number, starsEarned: number, xpBonus: number = 50) => {
    const key = `${modeKey}-${levelId}`;
    const previousStars = levelStars.value[key] || 0;

    if (starsEarned > previousStars) {
      levelStars.value[key] = starsEarned;
    }

    // Add XP
    totalXP.value += xpBonus + starsEarned * 20;

    // Check Badges
    ALL_BADGES.forEach((badge) => {
      if (totalXP.value >= badge.requiredXP && !unlockedBadges.value.includes(badge.id)) {
        unlockedBadges.value.push(badge.id);
      }
    });

    saveProgress();
  };

  // Reset Progress
  const resetProgress = () => {
    userName.value = 'Juara Cilik';
    userAvatar.value = '🤖';
    levelStars.value = {};
    unlockedBadges.value = ['b1'];
    totalXP.value = 100;
    saveProgress();
  };

  const updateProfile = (name: string, avatar: string) => {
    userName.value = name;
    userAvatar.value = avatar;
    saveProgress();
  };

  // Initialize
  loadProgress();

  return {
    userName,
    userAvatar,
    levelStars,
    unlockedBadges,
    totalXP,
    recordLevelComplete,
    resetProgress,
    updateProfile
  };
}
