<script setup lang="ts">
import { ref } from 'vue';
import { Volume2, VolumeX, Mic, MicOff, Trophy, HelpCircle, User, Sparkles } from '@lucide/vue';
import { soundManager } from '../utils/audio';

const props = defineProps<{
  userName: string;
  userAvatar: string;
  totalXP: number;
  currentMode: string;
}>();

const emit = defineEmits<{
  (e: 'goHome'): void;
  (e: 'openBadges'): void;
  (e: 'openGuide'): void;
  (e: 'resetProgress'): void;
  (e: 'updateProfile', name: string, avatar: string): void;
}>();

const isMuted = ref(soundManager.getMuted());
const isVoiceEnabled = ref(soundManager.getVoiceEnabled());
const showProfileModal = ref(false);

const tempName = ref(props.userName);
const tempAvatar = ref(props.userAvatar);
const avatarOptions = ['🤖', '🐒', '🐱', '🦖', '👑', '🚀', '🧙‍♂️', '🦸‍♀️'];

const toggleSound = () => {
  isMuted.value = !isMuted.value;
  soundManager.setMuted(isMuted.value);
  if (!isMuted.value) {
    soundManager.playClick();
  }
};

const toggleVoice = () => {
  isVoiceEnabled.value = !isVoiceEnabled.value;
  soundManager.setVoiceEnabled(isVoiceEnabled.value);
  if (isVoiceEnabled.value) {
    soundManager.speak('Suara narasi diaktifkan!');
  }
};

const saveProfile = () => {
  emit('updateProfile', tempName.value || 'Juara Cilik', tempAvatar.value);
  showProfileModal.value = false;
  soundManager.playStar();
};
</script>

<template>
  <header class="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-lg sticky top-0 z-40 px-3 py-2 sm:px-6 sm:py-3 rounded-b-2xl">
    <div class="max-w-6xl mx-auto flex items-center justify-between gap-2">
      
      <!-- Brand Logo / Home button -->
      <button 
        @click="emit('goHome'); soundManager.playClick();"
        class="flex items-center gap-2 font-bold text-xl sm:text-2xl tracking-wide hover:scale-105 transition transform cursor-pointer focus:outline-none"
      >
        <div class="bg-white text-3xl p-1 sm:p-2 rounded-2xl shadow-md border-2 border-yellow-300 animate-bounce">
          🤖
        </div>
        <div class="flex flex-col text-left">
          <span class="text-yellow-300 font-extrabold text-lg sm:text-2xl leading-none tracking-wider drop-shadow-md">KodoKids</span>
          <span class="text-xs sm:text-sm font-semibold opacity-90 text-teal-100 hidden sm:inline">Belajar Coding & Kode Rahasia</span>
        </div>
      </button>

      <!-- Player Profile & XP Bar -->
      <div class="flex items-center gap-2 sm:gap-4">
        
        <!-- Profile Widget -->
        <button 
          @click="showProfileModal = true; tempName = userName; tempAvatar = userAvatar; soundManager.playClick();"
          class="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/40 transition cursor-pointer"
          title="Ubah Profil"
        >
          <span class="text-2xl sm:text-3xl animate-pulse">{{ userAvatar }}</span>
          <div class="hidden md:flex flex-col text-left">
            <span class="font-bold text-xs sm:text-sm leading-tight text-yellow-200">{{ userName }}</span>
            <span class="text-[10px] text-white/90 flex items-center gap-1 font-semibold">
              <Sparkles class="w-3 h-3 text-yellow-300 fill-yellow-300" /> {{ totalXP }} XP
            </span>
          </div>
        </button>

        <!-- Badges Button -->
        <button 
          @click="emit('openBadges'); soundManager.playClick();"
          class="bg-yellow-400 hover:bg-yellow-300 text-amber-900 font-extrabold px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1.5 text-xs sm:text-sm transition transform hover:scale-105 active:scale-95 cursor-pointer border-2 border-amber-500"
        >
          <Trophy class="w-4 h-4 text-amber-900 fill-amber-900" />
          <span class="hidden sm:inline">Piala</span>
        </button>

        <!-- Sound & Voice Toggles -->
        <div class="flex items-center gap-1 bg-white/20 p-1 rounded-xl backdrop-blur-sm">
          <!-- Mute/Unmute Audio -->
          <button 
            @click="toggleSound"
            class="p-2 rounded-lg hover:bg-white/30 text-white transition cursor-pointer"
            :title="isMuted ? 'Nyalakan Suara' : 'Matikan Suara'"
          >
            <Volume2 v-if="!isMuted" class="w-5 h-5 text-yellow-300" />
            <VolumeX v-else class="w-5 h-5 text-red-300" />
          </button>

          <!-- Voice Prompts TTS -->
          <button 
            @click="toggleVoice"
            class="p-2 rounded-lg hover:bg-white/30 text-white transition cursor-pointer"
            :title="isVoiceEnabled ? 'Matikan Suara Narator' : 'Nyalakan Suara Narator'"
          >
            <Mic v-if="isVoiceEnabled" class="w-5 h-5 text-green-300" />
            <MicOff v-else class="w-5 h-5 text-slate-300" />
          </button>
        </div>

        <!-- Parent Guide Button -->
        <button 
          @click="emit('openGuide'); soundManager.playClick();"
          class="p-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 border border-cyan-400 text-white shadow transition transform hover:scale-105 cursor-pointer"
          title="Panduan Orang Tua / Guru"
        >
          <HelpCircle class="w-5 h-5" />
        </button>

      </div>
    </div>
  </header>

  <!-- Profile Edit Modal -->
  <div v-if="showProfileModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-pop-in">
    <div class="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border-4 border-emerald-400 text-center relative">
      <h3 class="text-2xl font-extrabold text-slate-800 mb-2 flex items-center justify-center gap-2">
        <User class="w-7 h-7 text-emerald-500" /> Profil Juara Cilik
      </h3>
      <p class="text-sm text-slate-600 mb-4">Pilih nama & maskot karakter favoritmu!</p>

      <!-- Avatar Selector -->
      <div class="flex flex-wrap justify-center gap-3 mb-5">
        <button 
          v-for="av in avatarOptions" 
          :key="av"
          @click="tempAvatar = av; soundManager.playClick();"
          class="text-4xl p-2 rounded-2xl border-4 transition transform cursor-pointer"
          :class="tempAvatar === av ? 'border-yellow-400 bg-yellow-50 scale-110 shadow-lg' : 'border-slate-200 hover:scale-105'"
        >
          {{ av }}
        </button>
      </div>

      <!-- Name Input -->
      <div class="mb-6">
        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Nama Panggilan</label>
        <input 
          v-model="tempName" 
          type="text" 
          maxlength="15" 
          class="w-full text-center text-xl font-extrabold p-3 rounded-2xl border-2 border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200 outline-none text-slate-800 bg-slate-50"
        />
      </div>

      <div class="flex gap-3">
        <button 
          @click="showProfileModal = false" 
          class="flex-1 py-3 rounded-2xl font-bold bg-slate-200 hover:bg-slate-300 text-slate-700 transition cursor-pointer"
        >
          Batal
        </button>
        <button 
          @click="saveProfile" 
          class="flex-1 py-3 rounded-2xl font-extrabold bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg transition cursor-pointer"
        >
          Simpan ⭐️
        </button>
      </div>
    </div>
  </div>
</template>
