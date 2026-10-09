<script setup lang="ts">
import { Trophy, X, Lock } from '@lucide/vue';
import { soundManager } from '../utils/audio';
import { ALL_BADGES } from '../composables/useGameProgress';

const props = defineProps<{
  unlockedBadges: string[];
  totalXP: number;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();
</script>

<template>
  <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-pop-in">
    <div class="bg-white rounded-3xl p-6 max-w-xl w-full shadow-2xl border-4 border-yellow-400 text-center relative space-y-4">
      
      <button 
        @click="emit('close'); soundManager.playClick();"
        class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
      >
        <X class="w-6 h-6" />
      </button>

      <div class="flex items-center justify-center gap-2">
        <Trophy class="w-8 h-8 text-yellow-500 fill-yellow-400" />
        <h2 class="text-2xl font-extrabold text-slate-800">Ruang Piala & Lencana</h2>
      </div>

      <p class="text-xs sm:text-sm text-slate-600 font-medium">
        Kumpulkan XP dengan menyelesaikan level untuk membuka semua lencana pahlawan!
      </p>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto p-1">
        <div 
          v-for="badge in ALL_BADGES" 
          :key="badge.id"
          class="p-3 rounded-2xl border-2 flex items-center gap-3 transition text-left"
          :class="unlockedBadges.includes(badge.id) ? 'bg-yellow-50 border-yellow-300 shadow-sm' : 'bg-slate-50 border-slate-200 opacity-60'"
        >
          <div class="text-3xl p-2 rounded-xl bg-white border border-slate-200 shadow-inner shrink-0">
            <span v-if="unlockedBadges.includes(badge.id)">{{ badge.icon }}</span>
            <Lock v-else class="w-6 h-6 text-slate-400" />
          </div>

          <div>
            <h4 class="font-extrabold text-sm text-slate-800">{{ badge.name }}</h4>
            <p class="text-xs text-slate-500 font-medium leading-tight">{{ badge.description }}</p>
            <span class="text-[10px] font-bold text-amber-700 bg-yellow-200/60 px-2 py-0.5 rounded-full mt-1 inline-block">
              Butuh {{ badge.requiredXP }} XP
            </span>
          </div>
        </div>
      </div>

      <button 
        @click="emit('close'); soundManager.playClick();"
        class="w-full py-3 rounded-2xl font-extrabold bg-yellow-400 hover:bg-yellow-300 text-amber-950 shadow-md cursor-pointer"
      >
        Tutup
      </button>

    </div>
  </div>
</template>
