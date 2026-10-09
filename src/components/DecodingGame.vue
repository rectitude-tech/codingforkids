<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { ChevronLeft, Volume2, HelpCircle } from '@lucide/vue';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/audio';
import { DECODING_LEVELS } from '../data/levels';
import type { CipherLevel } from '../data/levels';

const props = defineProps<{
  initialLevelId?: number;
  levelStars: Record<string, number>;
}>();

const emit = defineEmits<{
  (e: 'backToHome'): void;
  (e: 'levelComplete', levelId: number, stars: number): void;
}>();

const currentLevelIndex = ref<number>(
  props.initialLevelId ? Math.max(0, DECODING_LEVELS.findIndex(l => l.id === props.initialLevelId)) : 0
);

const level = computed<CipherLevel>(() => DECODING_LEVELS[currentLevelIndex.value]);

// User Answer state
const selectedChoice = ref<string | null>(null);
const userPixelState = ref<number[][]>([]);
const isCorrect = ref<boolean | null>(null);
const showHint = ref<boolean>(false);

const initLevel = () => {
  selectedChoice.value = null;
  isCorrect.value = null;
  showHint.value = false;

  if (level.value.type === 'pixel-decode' && level.value.pixelGrid) {
    // Initialize 0 grid
    const rows = level.value.pixelGrid.length;
    const cols = level.value.pixelGrid[0].length;
    userPixelState.value = Array.from({ length: rows }, () => Array(cols).fill(0));
  }

  soundManager.speak(level.value.description);
};

watch(currentLevelIndex, () => {
  initLevel();
}, { immediate: true });

// Toggle pixel cell
const togglePixelCell = (r: number, c: number) => {
  if (isCorrect.value) return;
  userPixelState.value[r][c] = userPixelState.value[r][c] === 1 ? 0 : 1;
  soundManager.playClick();
};

// Check Pixel answer
const checkPixelAnswer = () => {
  if (!level.value.pixelGrid) return;
  let match = true;
  for (let r = 0; r < level.value.pixelGrid.length; r++) {
    for (let c = 0; c < level.value.pixelGrid[r].length; c++) {
      if (userPixelState.value[r][c] !== level.value.pixelGrid[r][c]) {
        match = false;
        break;
      }
    }
  }

  if (match) {
    isCorrect.value = true;
    soundManager.playSuccess();
    soundManager.speak('Hebat! Gambar piksel berhasil diwarnai!');
    confetti({ particleCount: 90, spread: 60 });
    emit('levelComplete', level.value.id, 3);
  } else {
    isCorrect.value = false;
    soundManager.playError();
    soundManager.speak('Masih ada kotak yang keliru. Coba periksa angka 1 dan 0 lagi!');
  }
};

// Select Multiple Choice option
const selectOption = (opt: string) => {
  selectedChoice.value = opt;
  soundManager.playClick();

  const correct = level.value.type === 'emoji-cipher' 
    ? opt === level.value.targetWord 
    : opt === level.value.correctAnswer;

  if (correct) {
    isCorrect.value = true;
    soundManager.playSuccess();
    soundManager.speak('Luar biasa! Sandi rahasia berhasil dipecahkan!');
    confetti({ particleCount: 100, spread: 70 });
    emit('levelComplete', level.value.id, 3);
  } else {
    isCorrect.value = false;
    soundManager.playError();
    soundManager.speak('Jawaban belum pas. Coba lagi ya!');
  }
};

const speakPrompt = () => {
  soundManager.speak(level.value.description);
};

const nextLevel = () => {
  if (currentLevelIndex.value < DECODING_LEVELS.length - 1) {
    currentLevelIndex.value++;
  }
};

const prevLevel = () => {
  if (currentLevelIndex.value > 0) {
    currentLevelIndex.value--;
  }
};
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-4 space-y-4 animate-pop-in">
    
    <!-- Header Nav -->
    <div class="flex items-center justify-between gap-2 bg-white rounded-2xl p-3 shadow-md border-2 border-purple-200">
      <button 
        @click="emit('backToHome'); soundManager.playClick();"
        class="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-2 rounded-xl flex items-center gap-1 text-xs sm:text-sm cursor-pointer transition"
      >
        <ChevronLeft class="w-5 h-5" /> Menu Utama
      </button>

      <!-- Level selector -->
      <div class="flex items-center gap-1 overflow-x-auto py-1">
        <button 
          v-for="(lvl, idx) in DECODING_LEVELS" 
          :key="lvl.id"
          @click="currentLevelIndex = idx"
          class="w-8 h-8 rounded-xl font-extrabold text-xs flex items-center justify-center transition cursor-pointer shrink-0"
          :class="idx === currentLevelIndex ? 'bg-purple-600 text-white shadow-md scale-110' : 'bg-slate-100 text-slate-600 hover:bg-purple-100'"
        >
          {{ lvl.id }}
        </button>
      </div>

      <div class="flex items-center gap-2">
        <button @click="prevLevel" :disabled="currentLevelIndex === 0" class="p-2 rounded-xl bg-slate-100 disabled:opacity-30 cursor-pointer">⬅️</button>
        <button @click="nextLevel" :disabled="currentLevelIndex === DECODING_LEVELS.length - 1" class="p-2 rounded-xl bg-slate-100 disabled:opacity-30 cursor-pointer">➡️</button>
      </div>
    </div>

    <!-- Title Banner -->
    <div class="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-3xl p-5 text-white shadow-xl flex items-center justify-between gap-4 border-2 border-purple-300">
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <span class="bg-yellow-400 text-amber-950 font-extrabold px-3 py-0.5 rounded-full text-xs uppercase">
            Detektif Level {{ level.id }}
          </span>
          <span class="text-xs text-purple-100 font-semibold">{{ level.subtitle }}</span>
        </div>
        <h2 class="text-xl sm:text-2xl font-extrabold text-white">{{ level.title }}</h2>
        <p class="text-xs sm:text-sm text-purple-100 font-medium">{{ level.description }}</p>
      </div>

      <button 
        @click="speakPrompt"
        class="bg-white/20 hover:bg-white/30 text-white p-3 rounded-2xl backdrop-blur-md transition cursor-pointer shrink-0"
      >
        <Volume2 class="w-6 h-6 text-yellow-300" />
      </button>
    </div>

    <!-- Mode 1: Emoji Cipher UI -->
    <div v-if="level.type === 'emoji-cipher'" class="bg-white rounded-3xl p-6 shadow-xl border-4 border-purple-200 space-y-6">
      
      <!-- Cipher Key Map Card -->
      <div class="bg-purple-50 p-4 rounded-2xl border-2 border-purple-200">
        <h4 class="text-xs font-extrabold text-purple-700 uppercase tracking-wider mb-3 text-center">
          🔑 Kunci Sandi Rahasia:
        </h4>
        <div class="flex flex-wrap justify-center gap-3">
          <div 
            v-for="(letter, emoji) in level.cipherKey" 
            :key="emoji"
            class="bg-white px-3 py-2 rounded-xl border border-purple-200 shadow-sm flex items-center gap-2 font-bold text-sm sm:text-base"
          >
            <span class="text-2xl">{{ emoji }}</span> = <span class="text-purple-700 font-extrabold text-lg">{{ letter }}</span>
          </div>
        </div>
      </div>

      <!-- Encrypted Prompt -->
      <div class="text-center space-y-2">
        <span class="text-xs font-bold text-slate-500 uppercase">Teka-Teki Simbol Rahasia:</span>
        <div class="flex justify-center items-center gap-2 sm:gap-4 p-4 bg-amber-50 rounded-2xl border-2 border-amber-300">
          <span 
            v-for="(em, i) in level.encryptedPrompt" 
            :key="i"
            class="text-4xl sm:text-5xl animate-bounce"
          >
            {{ em }}
          </span>
        </div>
      </div>

      <!-- Options -->
      <div class="space-y-2">
        <h4 class="text-xs font-extrabold text-slate-500 uppercase text-center">Pilih Kata Rahasia Yang Benar:</h4>
        <div class="grid grid-cols-2 gap-4">
          <button 
            v-for="opt in level.options" 
            :key="opt"
            @click="selectOption(opt)"
            class="btn-kid bg-purple-500 hover:bg-purple-600 text-white font-extrabold py-4 px-6 rounded-2xl text-lg sm:text-xl shadow-md border-2 border-purple-600 cursor-pointer"
            style="--btn-shadow: #581c87"
          >
            {{ opt }}
          </button>
        </div>
      </div>

    </div>

    <!-- Mode 2: Pixel Art Decode UI -->
    <div v-else-if="level.type === 'pixel-decode'" class="bg-white rounded-3xl p-6 shadow-xl border-4 border-purple-200 flex flex-col items-center space-y-6">
      
      <div class="text-center space-y-1">
        <span class="text-xs font-bold text-slate-500 uppercase">Petunjuk Angka:</span>
        <div class="flex gap-4 justify-center text-sm font-bold">
          <span class="bg-slate-100 px-3 py-1 rounded-full text-slate-700">0 = KOSONG (Putih)</span>
          <span class="bg-yellow-100 text-amber-800 px-3 py-1 rounded-full">1 = WARNA (Klik untuk mewarnai)</span>
        </div>
      </div>

      <!-- Target pixel reference vs Interactive canvas -->
      <div class="flex flex-col md:flex-row items-center gap-8">
        
        <!-- Target pattern guide -->
        <div class="space-y-2 text-center">
          <span class="text-xs font-bold text-slate-400 uppercase">Kode Baris Target:</span>
          <div class="p-3 bg-slate-100 rounded-2xl border border-slate-300 font-mono text-xs sm:text-sm space-y-1">
            <div v-for="(row, r) in level.pixelGrid" :key="r" class="tracking-widest font-extrabold text-slate-700">
              Baris {{ r+1 }}: {{ row.join(' ') }}
            </div>
          </div>
        </div>

        <!-- Interactive Paint Canvas -->
        <div class="space-y-2 text-center">
          <span class="text-xs font-bold text-purple-700 uppercase">Papan Lukismu:</span>
          <div class="p-4 bg-purple-50 rounded-2xl border-4 border-purple-300 shadow-inner grid gap-2">
            <div 
              v-for="(row, r) in userPixelState" 
              :key="'pr-'+r" 
              class="flex gap-2"
            >
              <button 
                v-for="(val, c) in row" 
                :key="'pc-'+r+'-'+c"
                @click="togglePixelCell(r, c)"
                class="w-14 h-14 rounded-xl border-2 transition transform active:scale-95 cursor-pointer shadow flex items-center justify-center font-extrabold text-lg"
                :style="{
                  backgroundColor: val === 1 ? (level.pixelPalette ? level.pixelPalette[1] : '#facc15') : '#ffffff',
                  borderColor: val === 1 ? '#eab308' : '#cbd5e1'
                }"
              >
                {{ val }}
              </button>
            </div>
          </div>
        </div>

      </div>

      <button 
        @click="checkPixelAnswer"
        class="btn-kid bg-yellow-400 hover:bg-yellow-300 text-amber-950 font-extrabold px-8 py-3.5 rounded-2xl text-lg shadow-lg border-2 border-yellow-500 cursor-pointer"
        style="--btn-shadow: #b45309"
      >
        Periksa Gambar! ✨
      </button>

    </div>

    <!-- Mode 3: Pattern Recognition UI -->
    <div v-else-if="level.type === 'pattern'" class="bg-white rounded-3xl p-6 shadow-xl border-4 border-purple-200 space-y-6">
      
      <div class="text-center space-y-3">
        <span class="text-xs font-bold text-slate-500 uppercase">Lengkapi Urutan Pola Berikut:</span>
        <div class="flex justify-center items-center gap-3 p-4 bg-indigo-50 rounded-2xl border-2 border-indigo-200 flex-wrap">
          <span 
            v-for="(item, i) in level.sequence" 
            :key="i"
            class="text-4xl sm:text-5xl p-2 bg-white rounded-2xl shadow-sm border border-indigo-100"
          >
            {{ item }}
          </span>
        </div>
      </div>

      <div class="space-y-2">
        <h4 class="text-xs font-extrabold text-slate-500 uppercase text-center">Pilih Simbol Yang Tepat untuk [ ? ]:</h4>
        <div class="flex flex-wrap justify-center gap-4">
          <button 
            v-for="opt in level.patternOptions" 
            :key="opt"
            @click="selectOption(opt)"
            class="btn-kid bg-indigo-500 hover:bg-indigo-600 text-white font-extrabold p-4 rounded-2xl text-4xl shadow-md border-2 border-indigo-600 cursor-pointer"
            style="--btn-shadow: #3730a3"
          >
            {{ opt }}
          </button>
        </div>
      </div>

    </div>

    <!-- Hint Section -->
    <div class="text-center">
      <button 
        @click="showHint = !showHint; soundManager.playClick();"
        class="text-xs font-bold text-purple-600 hover:underline inline-flex items-center gap-1 cursor-pointer"
      >
        <HelpCircle class="w-4 h-4" /> {{ showHint ? 'Sembunyikan Petunjuk' : 'Butuh Bantuan Petunjuk?' }}
      </button>
      <p v-if="showHint" class="mt-2 text-xs font-medium text-amber-700 bg-amber-50 p-3 rounded-xl border border-amber-200 max-w-md mx-auto">
        💡 {{ level.hint }}
      </p>
    </div>

  </div>
</template>
