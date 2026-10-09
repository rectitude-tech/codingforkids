<script setup lang="ts">
import { ref } from 'vue';
import HeaderNavbar from './components/HeaderNavbar.vue';
import HomeDashboard from './components/HomeDashboard.vue';
import RobotCodingGame from './components/RobotCodingGame.vue';
import DecodingGame from './components/DecodingGame.vue';
import DebuggingGame from './components/DebuggingGame.vue';
import CompetitionSim from './components/CompetitionSim.vue';
import BadgesModal from './components/BadgesModal.vue';
import ParentGuideModal from './components/ParentGuideModal.vue';
import VictoryModal from './components/VictoryModal.vue';

import { useGameProgress } from './composables/useGameProgress';

const {
  userName,
  userAvatar,
  levelStars,
  unlockedBadges,
  totalXP,
  recordLevelComplete,
  resetProgress,
  updateProfile
} = useGameProgress();

// State
type GameView = 'home' | 'robot' | 'decoding' | 'debug' | 'competition';
const currentView = ref<GameView>('home');
const selectedLevelId = ref<number | undefined>(undefined);

// Modals
const showBadgesModal = ref(false);
const showGuideModal = ref(false);

// Victory Modal state
const showVictoryModal = ref(false);
const lastEarnedStars = ref(3);
const lastEarnedXP = ref(50);
const lastCompletedMode = ref<string>('robot');
const lastCompletedLevelId = ref<number>(1);

const handleSelectGame = (mode: GameView, levelId?: number) => {
  currentView.value = mode;
  selectedLevelId.value = levelId;
};

const handleLevelComplete = (levelId: number, stars: number) => {
  lastEarnedStars.value = stars;
  lastEarnedXP.value = 50 + stars * 20;
  lastCompletedMode.value = currentView.value;
  lastCompletedLevelId.value = levelId;

  recordLevelComplete(currentView.value, levelId, stars, 50);
  showVictoryModal.value = true;
};

const handleNextLevel = () => {
  showVictoryModal.value = false;
  // If next level is available, stay in game component; otherwise return home
  selectedLevelId.value = lastCompletedLevelId.value + 1;
};

const handleReplay = () => {
  showVictoryModal.value = false;
};

const handleGoHome = () => {
  showVictoryModal.value = false;
  currentView.value = 'home';
};
</script>

<template>
  <div class="min-h-screen flex flex-col bg-amber-50/60 pb-12 font-['Nunito',sans-serif]">
    
    <!-- Top Header -->
    <HeaderNavbar 
      :user-name="userName"
      :user-avatar="userAvatar"
      :total-x-p="totalXP"
      :current-mode="currentView"
      @go-home="currentView = 'home'"
      @open-badges="showBadgesModal = true"
      @open-guide="showGuideModal = true"
      @reset-progress="resetProgress"
      @update-profile="updateProfile"
    />

    <!-- Main View Switcher -->
    <main class="flex-grow py-4">
      
      <!-- Home Hub -->
      <HomeDashboard 
        v-if="currentView === 'home'"
        :level-stars="levelStars"
        :user-name="userName"
        :user-avatar="userAvatar"
        @select-game="handleSelectGame"
        @open-guide="showGuideModal = true"
      />

      <!-- Mode 1: Robot Coding -->
      <RobotCodingGame 
        v-else-if="currentView === 'robot'"
        :initial-level-id="selectedLevelId"
        :level-stars="levelStars"
        @back-to-home="currentView = 'home'"
        @level-complete="handleLevelComplete"
      />

      <!-- Mode 2: Decoding -->
      <DecodingGame 
        v-else-if="currentView === 'decoding'"
        :initial-level-id="selectedLevelId"
        :level-stars="levelStars"
        @back-to-home="currentView = 'home'"
        @level-complete="handleLevelComplete"
      />

      <!-- Mode 3: Debugging -->
      <DebuggingGame 
        v-else-if="currentView === 'debug'"
        :initial-level-id="selectedLevelId"
        @back-to-home="currentView = 'home'"
        @level-complete="handleLevelComplete"
      />

      <!-- Mode 4: Competition Simulation -->
      <CompetitionSim 
        v-else-if="currentView === 'competition'"
        :user-name="userName"
        :user-avatar="userAvatar"
        @back-to-home="currentView = 'home'"
        @level-complete="handleLevelComplete"
      />

    </main>

    <!-- Modals -->
    <BadgesModal 
      v-if="showBadgesModal"
      :unlocked-badges="unlockedBadges"
      :total-x-p="totalXP"
      @close="showBadgesModal = false"
    />

    <ParentGuideModal 
      v-if="showGuideModal"
      @close="showGuideModal = false"
    />

    <VictoryModal 
      v-if="showVictoryModal"
      :stars="lastEarnedStars"
      :xp-earned="lastEarnedXP"
      @next-level="handleNextLevel"
      @replay="handleReplay"
      @go-home="handleGoHome"
    />

    <!-- Footer -->
    <footer class="mt-auto text-center text-xs text-slate-500 py-4 font-semibold border-t border-amber-200/60">
      <p>KodoKids 🤖 Media Pembelajaran Coding & Kode Rahasia Ananda (5+ Tahun)</p>
      <p class="text-[11px] text-slate-400 mt-0.5">Siap diunggah ke GitHub Pages (github.io) Tanpa Database / Server Backend</p>
    </footer>

  </div>
</template>
