<script setup lang="ts">
import { computed } from 'vue';
import { Play, Star, Cpu, Sparkles } from '@lucide/vue';
import { soundManager } from '../utils/audio';
import { ROBOT_LEVELS, DECODING_LEVELS, DEBUG_LEVELS } from '../data/levels';

const props = defineProps<{
  levelStars: Record<string, number>;
  userName: string;
  userAvatar: string;
}>();

const emit = defineEmits<{
  (e: 'selectGame', mode: 'robot' | 'decoding' | 'debug' | 'competition', levelId?: number): void;
  (e: 'openGuide'): void;
}>();

// Helper to count stars
const getStarsForLevel = (mode: string, id: number) => {
  return props.levelStars[`${mode}-${id}`] || 0;
};

const robotTotalStars = computed(() => {
  return ROBOT_LEVELS.reduce((acc, lvl) => acc + getStarsForLevel('robot', lvl.id), 0);
});

const decodingTotalStars = computed(() => {
  return DECODING_LEVELS.reduce((acc, lvl) => acc + getStarsForLevel('decoding', lvl.id), 0);
});

const debugTotalStars = computed(() => {
  return DEBUG_LEVELS.reduce((acc, lvl) => acc + getStarsForLevel('debug', lvl.id), 0);
});

const playMode = (mode: 'robot' | 'decoding' | 'debug' | 'competition') => {
  soundManager.playClick();
  emit('selectGame', mode);
};
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 py-6 space-y-8 animate-pop-in">
    
    <!-- Hero Banner for Kids -->
    <div class="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border-4 border-yellow-300">
      
      <!-- Background floating decoration -->
      <div class="absolute -right-8 -bottom-8 opacity-20 text-9xl select-none pointer-events-none">
        🚀
      </div>

      <div class="space-y-3 max-w-xl text-center md:text-left z-10">
        <div class="inline-flex items-center gap-2 bg-yellow-400 text-amber-950 font-extrabold px-4 py-1 rounded-full text-xs sm:text-sm uppercase tracking-wider shadow-md">
          <Sparkles class="w-4 h-4 fill-amber-950" /> Persiapan Lomba & Belajar Coding Cilik
        </div>
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-white drop-shadow-md">
          Halo {{ userName }} {{ userAvatar }}!
        </h1>
        <p class="text-indigo-100 text-base sm:text-lg font-medium">
          Siap petualangan hari ini? Bantu Bobi si Robot memecahkan teka-teki logika, mengumpulkan bintang, dan menjadi Juara Koding! 🌟
        </p>
        <div class="pt-2 flex flex-wrap gap-3 justify-center md:justify-start">
          <button 
            @click="playMode('robot')"
            class="btn-kid bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-extrabold px-6 py-3 rounded-2xl text-lg flex items-center gap-2 cursor-pointer shadow-lg border-2 border-yellow-500"
            style="--btn-shadow: #d97706"
          >
            <Play class="w-6 h-6 fill-slate-900" /> Mulai Main!
          </button>
          <button 
            @click="emit('openGuide')"
            class="bg-white/20 hover:bg-white/30 text-white font-bold px-5 py-3 rounded-2xl text-base flex items-center gap-2 cursor-pointer transition backdrop-blur-md"
          >
            📖 Panduan Belajar
          </button>
        </div>
      </div>

      <!-- Mascot Card -->
      <div class="relative z-10 flex flex-col items-center">
        <div class="w-32 h-32 sm:w-40 sm:h-40 bg-white/20 backdrop-blur-md rounded-3xl p-4 flex items-center justify-center border-4 border-yellow-300 shadow-xl animate-float">
          <span class="text-7xl sm:text-8xl select-none">🤖</span>
        </div>
        <span class="mt-2 bg-amber-400 text-amber-950 font-extrabold px-4 py-1 rounded-full text-xs shadow">
          Bobi si Robot 🚀
        </span>
      </div>
    </div>

    <!-- Game Categories Section -->
    <div class="space-y-4">
      <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-800 flex items-center gap-3">
        <Cpu class="w-8 h-8 text-indigo-600" /> Pilih Mode Permainan
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <!-- Mode 1: Petualangan Robot (Grid Coding) -->
        <div 
          @click="playMode('robot')"
          class="bg-gradient-to-br from-emerald-400 to-teal-600 rounded-3xl p-6 text-white shadow-xl hover:shadow-2xl transition transform hover:-translate-y-1.5 cursor-pointer border-4 border-emerald-300 relative overflow-hidden group"
        >
          <div class="flex justify-between items-start mb-4">
            <div class="p-3 bg-white/20 rounded-2xl backdrop-blur-sm text-4xl shadow-inner">
              🤖
            </div>
            <div class="bg-emerald-900/40 backdrop-blur-md px-3 py-1 rounded-full font-extrabold text-xs flex items-center gap-1 text-yellow-300 border border-emerald-400">
              <Star class="w-4 h-4 fill-yellow-300" /> {{ robotTotalStars }} / {{ ROBOT_LEVELS.length * 3 }} Bintang
            </div>
          </div>

          <h3 class="text-2xl font-extrabold mb-2 group-hover:text-yellow-200 transition">
            1. Petualangan Robot
          </h3>
          <p class="text-emerald-100 text-sm font-medium mb-6">
            Susun langkah panah (Maju, Belok, Loop 🔁) untuk memandu Bobi mengambil Bintang dan menghindari halangan!
          </p>

          <div class="flex items-center justify-between pt-2 border-t border-emerald-400/50">
            <span class="text-xs font-bold text-emerald-100">10 Level Algoritma</span>
            <span class="btn-kid bg-yellow-400 text-amber-950 px-4 py-2 rounded-xl text-sm font-extrabold flex items-center gap-1 shadow">
              Main <Play class="w-4 h-4 fill-amber-950" />
            </span>
          </div>
        </div>

        <!-- Mode 2: Detektif Kode Rahasia (Decoding) -->
        <div 
          @click="playMode('decoding')"
          class="bg-gradient-to-br from-purple-500 to-indigo-700 rounded-3xl p-6 text-white shadow-xl hover:shadow-2xl transition transform hover:-translate-y-1.5 cursor-pointer border-4 border-purple-300 relative overflow-hidden group"
        >
          <div class="flex justify-between items-start mb-4">
            <div class="p-3 bg-white/20 rounded-2xl backdrop-blur-sm text-4xl shadow-inner">
              🔍
            </div>
            <div class="bg-purple-900/40 backdrop-blur-md px-3 py-1 rounded-full font-extrabold text-xs flex items-center gap-1 text-yellow-300 border border-purple-400">
              <Star class="w-4 h-4 fill-yellow-300" /> {{ decodingTotalStars }} / {{ DECODING_LEVELS.length * 3 }} Bintang
            </div>
          </div>

          <h3 class="text-2xl font-extrabold mb-2 group-hover:text-yellow-200 transition">
            2. Detektif Kode Rahasia
          </h3>
          <p class="text-purple-100 text-sm font-medium mb-6">
            Pecahkan sandi emoji rahasia, lukisan piksel 0 & 1, dan tebak pola logis untuk menemukan peti harta!
          </p>

          <div class="flex items-center justify-between pt-2 border-t border-purple-400/50">
            <span class="text-xs font-bold text-purple-100">6 Level Sandi & Pola</span>
            <span class="btn-kid bg-yellow-400 text-amber-950 px-4 py-2 rounded-xl text-sm font-extrabold flex items-center gap-1 shadow">
              Main <Play class="w-4 h-4 fill-amber-950" />
            </span>
          </div>
        </div>

        <!-- Mode 3: Dokter Bug (Debugging) -->
        <div 
          @click="playMode('debug')"
          class="bg-gradient-to-br from-amber-400 to-orange-600 rounded-3xl p-6 text-white shadow-xl hover:shadow-2xl transition transform hover:-translate-y-1.5 cursor-pointer border-4 border-amber-300 relative overflow-hidden group"
        >
          <div class="flex justify-between items-start mb-4">
            <div class="p-3 bg-white/20 rounded-2xl backdrop-blur-sm text-4xl shadow-inner">
              🩺
            </div>
            <div class="bg-amber-900/40 backdrop-blur-md px-3 py-1 rounded-full font-extrabold text-xs flex items-center gap-1 text-yellow-300 border border-amber-400">
              <Star class="w-4 h-4 fill-yellow-300" /> {{ debugTotalStars }} / {{ DEBUG_LEVELS.length * 3 }} Bintang
            </div>
          </div>

          <h3 class="text-2xl font-extrabold mb-2 group-hover:text-yellow-200 transition">
            3. Dokter Bug (Troubleshooting)
          </h3>
          <p class="text-amber-100 text-sm font-medium mb-6">
            Program robot sedang rusak dan salah jalan! Temukan perintah yang salah (Bug) dan perbaiki sampai benar!
          </p>

          <div class="flex items-center justify-between pt-2 border-t border-amber-400/50">
            <span class="text-xs font-bold text-amber-100">Perbaiki Kesalahan</span>
            <span class="btn-kid bg-yellow-400 text-amber-950 px-4 py-2 rounded-xl text-sm font-extrabold flex items-center gap-1 shadow">
              Main <Play class="w-4 h-4 fill-amber-950" />
            </span>
          </div>
        </div>

        <!-- Mode 4: Simulasi Lomba Coding (Competition Challenge) -->
        <div 
          @click="playMode('competition')"
          class="bg-gradient-to-br from-pink-500 to-rose-700 rounded-3xl p-6 text-white shadow-xl hover:shadow-2xl transition transform hover:-translate-y-1.5 cursor-pointer border-4 border-pink-300 relative overflow-hidden group"
        >
          <div class="flex justify-between items-start mb-4">
            <div class="p-3 bg-white/20 rounded-2xl backdrop-blur-sm text-4xl shadow-inner">
              🏆
            </div>
            <div class="bg-pink-900/40 backdrop-blur-md px-3 py-1 rounded-full font-extrabold text-xs flex items-center gap-1 text-yellow-300 border border-pink-400 uppercase tracking-wide">
              🏅 Sertifikat Juara
            </div>
          </div>

          <h3 class="text-2xl font-extrabold mb-2 group-hover:text-yellow-200 transition">
            4. Simulasi Lomba Coding
          </h3>
          <p class="text-pink-100 text-sm font-medium mb-6">
            Latihan ujian Bebras Junior / Scratch Jr! Jawab 5 soal logika interaktif dan dapatkan Sertifikat Juara Cilik!
          </p>

          <div class="flex items-center justify-between pt-2 border-t border-pink-400/50">
            <span class="text-xs font-bold text-pink-100">Soal Logika Lomba</span>
            <span class="btn-kid bg-yellow-400 text-amber-950 px-4 py-2 rounded-xl text-sm font-extrabold flex items-center gap-1 shadow">
              Ikuti Ujian 🏆
            </span>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>
