<script setup lang="ts">
import { Star } from '@lucide/vue';
import { soundManager } from '../utils/audio';

const props = defineProps<{
  stars: number;
  xpEarned: number;
}>();

const emit = defineEmits<{
  (e: 'nextLevel'): void;
  (e: 'replay'): void;
  (e: 'goHome'): void;
}>();
</script>

<template>
  <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-pop-in">
    <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border-4 border-yellow-400 text-center relative space-y-6">
      
      <!-- Mascot icon -->
      <div class="w-24 h-24 bg-yellow-100 rounded-full mx-auto flex items-center justify-center border-4 border-yellow-300 text-6xl animate-bounce shadow-inner">
        🥳
      </div>

      <div class="space-y-1">
        <h2 class="text-3xl font-extrabold text-amber-950">HEBAT SEKALAI!</h2>
        <p class="text-sm font-semibold text-slate-600">Kamu Berhasil Menyelesaikan Level Ini! 🎉</p>
      </div>

      <!-- Animated Star Rating -->
      <div class="flex justify-center gap-3">
        <Star 
          v-for="i in 3" 
          :key="i"
          class="w-12 h-12 transition transform duration-300"
          :class="i <= stars ? 'text-yellow-400 fill-yellow-400 scale-110 drop-shadow-md animate-pulse' : 'text-slate-200 fill-slate-200'"
        />
      </div>

      <div class="bg-amber-50 p-3 rounded-2xl border border-amber-200 font-extrabold text-amber-900 text-sm flex items-center justify-center gap-2">
        <Sparkles class="w-5 h-5 text-yellow-500 fill-yellow-400" />
        +{{ xpEarned }} XP Bonus Diraih!
      </div>

      <!-- Action buttons -->
      <div class="space-y-3">
        <button 
          @click="emit('nextLevel'); soundManager.playClick();"
          class="btn-kid w-full bg-yellow-400 hover:bg-yellow-300 text-amber-950 font-extrabold py-3.5 rounded-2xl text-lg shadow-lg border-2 border-yellow-500 cursor-pointer"
          style="--btn-shadow: #b45309"
        >
          Level Berikutnya ➡️
        </button>

        <div class="flex gap-3">
          <button 
            @click="emit('replay'); soundManager.playClick();"
            class="flex-1 py-3 rounded-2xl font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer text-sm"
          >
            Main Lagi 🔄
          </button>
          <button 
            @click="emit('goHome'); soundManager.playClick();"
            class="flex-1 py-3 rounded-2xl font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer text-sm"
          >
            Menu Utama 🏠
          </button>
        </div>
      </div>

    </div>
  </div>
</template>
