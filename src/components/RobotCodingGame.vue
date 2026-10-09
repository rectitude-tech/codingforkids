<script setup lang="ts">
import { ref, computed, onUnmounted, watch } from 'vue';
import { Play, RotateCcw, Trash2, ChevronLeft, Volume2 } from '@lucide/vue';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/audio';
import { ROBOT_LEVELS } from '../data/levels';
import type { GridLevel, Direction } from '../data/levels';

const props = defineProps<{
  initialLevelId?: number;
  levelStars: Record<string, number>;
}>();

const emit = defineEmits<{
  (e: 'backToHome'): void;
  (e: 'levelComplete', levelId: number, stars: number): void;
}>();

const currentLevelIndex = ref<number>(
  props.initialLevelId ? Math.max(0, ROBOT_LEVELS.findIndex(l => l.id === props.initialLevelId)) : 0
);

const level = computed<GridLevel>(() => ROBOT_LEVELS[currentLevelIndex.value]);

// Program state
const programBlocks = ref<string[]>([]);
const isRunning = ref(false);
const activeBlockIndex = ref<number | null>(null);

// Mascot live position & direction
const mascotPos = ref<{ x: number; y: number; dir: Direction }>({ x: 0, y: 0, dir: 'RIGHT' });
const collectedItems = ref<Set<string>>(new Set());

let runTimer: number | null = null;

// Initialize level state
const resetLevelState = () => {
  if (runTimer) clearInterval(runTimer);
  isRunning.value = false;
  activeBlockIndex.value = null;
  mascotPos.value = { ...level.value.startPos };
  collectedItems.value = new Set();
};

watch(currentLevelIndex, () => {
  programBlocks.value = [];
  resetLevelState();
  soundManager.speak(level.value.description);
}, { immediate: true });

onUnmounted(() => {
  if (runTimer) clearInterval(runTimer);
});

// Add command block
const addBlock = (type: string) => {
  if (isRunning.value) return;
  if (programBlocks.value.length >= 12) {
    soundManager.playError();
    return;
  }
  programBlocks.value.push(type);
  soundManager.playClick();
};

// Remove block at index
const removeBlock = (index: number) => {
  if (isRunning.value) return;
  programBlocks.value.splice(index, 1);
  soundManager.playClick();
};

const clearBlocks = () => {
  if (isRunning.value) return;
  programBlocks.value = [];
  soundManager.playClick();
};

// Rotation angle for CSS transform
const mascotRotationDegree = computed(() => {
  switch (mascotPos.value.dir) {
    case 'RIGHT': return 0;
    case 'DOWN': return 90;
    case 'LEFT': return 180;
    case 'UP': return 270;
  }
});

// Movement helper
const moveForwardInDir = (pos: { x: number; y: number; dir: Direction }) => {
  const newPos = { ...pos };
  if (pos.dir === 'RIGHT') newPos.x += 1;
  if (pos.dir === 'LEFT') newPos.x -= 1;
  if (pos.dir === 'DOWN') newPos.y += 1;
  if (pos.dir === 'UP') newPos.y -= 1;
  return newPos;
};

const turnLeft = (dir: Direction): Direction => {
  if (dir === 'RIGHT') return 'UP';
  if (dir === 'UP') return 'LEFT';
  if (dir === 'LEFT') return 'DOWN';
  return 'RIGHT';
};

const turnRight = (dir: Direction): Direction => {
  if (dir === 'RIGHT') return 'DOWN';
  if (dir === 'DOWN') return 'LEFT';
  if (dir === 'LEFT') return 'UP';
  return 'RIGHT';
};

// Run the sequence step-by-step
const runProgram = () => {
  if (programBlocks.value.length === 0 || isRunning.value) return;

  resetLevelState();
  isRunning.value = true;
  let step = 0;

  // Flatten blocks (e.g. LOOP converts to multiple MOVES)
  const flattened: string[] = [];
  programBlocks.value.forEach(blk => {
    if (blk === 'LOOP') {
      flattened.push('MOVE', 'MOVE', 'MOVE');
    } else {
      flattened.push(blk);
    }
  });

  runTimer = window.setInterval(() => {
    if (step >= flattened.length) {
      if (runTimer) clearInterval(runTimer);
      isRunning.value = false;
      activeBlockIndex.value = null;
      checkWinCondition();
      return;
    }

    activeBlockIndex.value = step;
    const cmd = flattened[step];

    if (cmd === 'MOVE') {
      const next = moveForwardInDir(mascotPos.value);
      // Check grid boundaries
      if (next.x < 0 || next.x >= level.value.gridSize.width || next.y < 0 || next.y >= level.value.gridSize.height) {
        soundManager.playError();
        soundManager.speak('Oops! Bobi tidak bisa keluar dari papan!');
        clearInterval(runTimer!);
        isRunning.value = false;
        return;
      }

      // Check obstacles
      const obstacle = level.value.items?.find(it => it.type === 'obstacle' && it.x === next.x && it.y === next.y);
      if (obstacle) {
        soundManager.playError();
        soundManager.speak('Awas! Bobi menabrak rintangan!');
        clearInterval(runTimer!);
        isRunning.value = false;
        return;
      }

      mascotPos.value = next;
      soundManager.playStep();

      // Check star collectibles
      const starItem = level.value.items?.find(it => it.type === 'star' && it.x === next.x && it.y === next.y);
      if (starItem) {
        collectedItems.value.add(`${next.x}-${next.y}`);
        soundManager.playStar();
      }
    } else if (cmd === 'LEFT') {
      mascotPos.value.dir = turnLeft(mascotPos.value.dir);
      soundManager.playClick();
    } else if (cmd === 'RIGHT') {
      mascotPos.value.dir = turnRight(mascotPos.value.dir);
      soundManager.playClick();
    }

    step++;
  }, 600); // 600ms per step
};

// Check if mascot reached goal
const checkWinCondition = () => {
  const atGoal = mascotPos.value.x === level.value.goalPos.x && mascotPos.value.y === level.value.goalPos.y;

  if (atGoal) {
    soundManager.playSuccess();
    soundManager.speak('Hore! Kamu hebat sekali!');

    // Confetti explosion
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Calculate stars (3 stars if program length <= maxBlocksFor3Stars)
    let stars = 3;
    if (programBlocks.value.length > level.value.maxBlocksFor3Stars) {
      stars = 2;
    }

    emit('levelComplete', level.value.id, stars);
  } else {
    soundManager.playError();
    soundManager.speak('Hampir sampai! Coba periksa kodenya lagi ya!');
  }
};

const speakDescription = () => {
  soundManager.speak(level.value.description);
};

const nextLevel = () => {
  if (currentLevelIndex.value < ROBOT_LEVELS.length - 1) {
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
  <div class="max-w-5xl mx-auto px-4 py-4 space-y-4 animate-pop-in">
    
    <!-- Top Navigation & Level Selector -->
    <div class="flex items-center justify-between gap-2 bg-white rounded-2xl p-3 shadow-md border-2 border-emerald-200">
      <button 
        @click="emit('backToHome'); soundManager.playClick();"
        class="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-2 rounded-xl flex items-center gap-1 text-xs sm:text-sm cursor-pointer transition"
      >
        <ChevronLeft class="w-5 h-5" /> Menu Utama
      </button>

      <!-- Level Indicators -->
      <div class="flex items-center gap-1 overflow-x-auto py-1 max-w-[50vw] sm:max-w-none">
        <button 
          v-for="(lvl, idx) in ROBOT_LEVELS" 
          :key="lvl.id"
          @click="currentLevelIndex = idx"
          class="w-8 h-8 rounded-xl font-extrabold text-xs flex items-center justify-center transition cursor-pointer shrink-0"
          :class="idx === currentLevelIndex ? 'bg-emerald-500 text-white shadow-md scale-110' : 'bg-slate-100 text-slate-600 hover:bg-emerald-100'"
        >
          {{ lvl.id }}
        </button>
      </div>

      <div class="flex items-center gap-2">
        <button 
          @click="prevLevel" 
          :disabled="currentLevelIndex === 0"
          class="p-2 rounded-xl bg-slate-100 disabled:opacity-30 cursor-pointer font-bold"
        >
          ⬅️
        </button>
        <button 
          @click="nextLevel" 
          :disabled="currentLevelIndex === ROBOT_LEVELS.length - 1"
          class="p-2 rounded-xl bg-slate-100 disabled:opacity-30 cursor-pointer font-bold"
        >
          ➡️
        </button>
      </div>
    </div>

    <!-- Story Banner & Narration -->
    <div class="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-3xl p-4 text-white shadow-xl flex items-center justify-between gap-4 border-2 border-emerald-300">
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <span class="bg-yellow-400 text-amber-950 font-extrabold px-3 py-0.5 rounded-full text-xs uppercase">
            Level {{ level.id }}
          </span>
          <span class="text-xs text-teal-100 font-semibold">{{ level.subtitle }}</span>
        </div>
        <h2 class="text-xl sm:text-2xl font-extrabold text-white">{{ level.title }}</h2>
        <p class="text-xs sm:text-sm text-teal-50 font-medium">{{ level.description }}</p>
      </div>

      <button 
        @click="speakDescription"
        class="bg-white/20 hover:bg-white/30 text-white p-3 rounded-2xl backdrop-blur-md transition cursor-pointer shrink-0"
        title="Dengarkan Perintah"
      >
        <Volume2 class="w-6 h-6 text-yellow-300" />
      </button>
    </div>

    <!-- Main Game Canvas Layout: Grid Board (Left/Top) & Block Editor (Right/Bottom) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      <!-- Left: Interactive Grid Board -->
      <div class="lg:col-span-6 bg-white rounded-3xl p-4 sm:p-6 shadow-xl border-4 border-emerald-200 flex flex-col items-center justify-center relative min-h-[320px]">
        
        <div 
          class="grid gap-2 p-3 bg-amber-100/60 rounded-2xl border-4 border-amber-300 shadow-inner relative max-w-full"
          :style="{
            gridTemplateColumns: `repeat(${level.gridSize.width}, minmax(0, 1fr))`,
            width: `${level.gridSize.width * 64}px`
          }"
        >
          <!-- Cell render loop -->
          <template v-for="y in level.gridSize.height" :key="'y-'+y">
            <div 
              v-for="x in level.gridSize.width" 
              :key="'x-'+(x-1)+'-'+(y-1)"
              class="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-50 rounded-xl border-2 border-emerald-200/80 flex items-center justify-center relative shadow-sm"
            >
              <!-- Goal Icon -->
              <div 
                v-if="level.goalPos.x === (x-1) && level.goalPos.y === (y-1)"
                class="text-3xl animate-pulse-glow"
              >
                ⭐️
              </div>

              <!-- Extra Collectible Star -->
              <template v-for="it in level.items" :key="'item-'+it.x+'-'+it.y">
                <div 
                  v-if="it.x === (x-1) && it.y === (y-1) && it.type === 'star' && !collectedItems.has(`${it.x}-${it.y}`)"
                  class="text-2xl animate-bounce"
                >
                  {{ it.icon || '⭐️' }}
                </div>
                <!-- Obstacle -->
                <div 
                  v-if="it.x === (x-1) && it.y === (y-1) && it.type === 'obstacle'"
                  class="text-3xl"
                >
                  {{ it.icon || '🪨' }}
                </div>
              </template>

              <!-- Mascot Character -->
              <div 
                v-if="mascotPos.x === (x-1) && mascotPos.y === (y-1)"
                class="absolute inset-0 flex items-center justify-center text-3xl sm:text-4xl transition-all duration-500 transform z-20"
                :style="{ transform: `rotate(${mascotRotationDegree}deg)` }"
              >
                🤖
              </div>
            </div>
          </template>
        </div>

        <div class="mt-4 text-xs font-bold text-slate-500 flex items-center gap-4">
          <span class="flex items-center gap-1"><span class="text-xl">🤖</span> Bobi</span>
          <span class="flex items-center gap-1"><span class="text-xl">⭐️</span> Bintang</span>
          <span class="flex items-center gap-1"><span class="text-xl">🪨</span> Rintangan</span>
        </div>
      </div>

      <!-- Right: Command Blocks Toolbox & Sequence Pipeline -->
      <div class="lg:col-span-6 bg-slate-50 rounded-3xl p-5 shadow-xl border-4 border-slate-200 space-y-4">
        
        <!-- Toolbox: Available Command Buttons -->
        <div>
          <h3 class="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2">
            1. Perintah Koding (Klik / Tap):
          </h3>
          <div class="flex flex-wrap gap-2">
            
            <button 
              @click="addBlock('MOVE')"
              class="btn-kid bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold px-4 py-2.5 rounded-2xl flex items-center gap-1.5 shadow-md cursor-pointer border-2 border-emerald-600 text-sm"
              style="--btn-shadow: #047857"
            >
              <span class="text-lg">⬆️</span> Maju
            </button>

            <button 
              v-if="level.allowedBlocks.includes('RIGHT')"
              @click="addBlock('RIGHT')"
              class="btn-kid bg-indigo-500 hover:bg-indigo-600 text-white font-extrabold px-4 py-2.5 rounded-2xl flex items-center gap-1.5 shadow-md cursor-pointer border-2 border-indigo-600 text-sm"
              style="--btn-shadow: #4338ca"
            >
              <span class="text-lg">➡️</span> Belok Kanan
            </button>

            <button 
              v-if="level.allowedBlocks.includes('LEFT')"
              @click="addBlock('LEFT')"
              class="btn-kid bg-indigo-500 hover:bg-indigo-600 text-white font-extrabold px-4 py-2.5 rounded-2xl flex items-center gap-1.5 shadow-md cursor-pointer border-2 border-indigo-600 text-sm"
              style="--btn-shadow: #4338ca"
            >
              <span class="text-lg">⬅️</span> Belok Kiri
            </button>

            <button 
              v-if="level.allowedBlocks.includes('LOOP')"
              @click="addBlock('LOOP')"
              class="btn-kid bg-purple-500 hover:bg-purple-600 text-white font-extrabold px-4 py-2.5 rounded-2xl flex items-center gap-1.5 shadow-md cursor-pointer border-2 border-purple-600 text-sm"
              style="--btn-shadow: #6b21a8"
            >
              <span class="text-lg">🔁</span> Ulangi 3x
            </button>

          </div>
        </div>

        <!-- Sequence Pipeline / Drop Zone -->
        <div class="bg-white rounded-2xl p-4 border-2 border-slate-200 min-h-[140px]">
          <div class="flex justify-between items-center mb-2">
            <span class="text-xs font-extrabold text-slate-600 uppercase">
              2. Urutan Langkah ({{ programBlocks.length }} / 12 block)
            </span>
            <button 
              @click="clearBlocks"
              class="text-xs text-red-500 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Trash2 class="w-3.5 h-3.5" /> Hapus Semua
            </button>
          </div>

          <!-- Empty State -->
          <div 
            v-if="programBlocks.length === 0" 
            class="h-20 flex items-center justify-center text-slate-400 font-medium text-xs border-2 border-dashed border-slate-300 rounded-xl"
          >
            Tekan tombol panah di atas untuk menambah perintah!
          </div>

          <!-- Block Sequence list -->
          <div v-else class="flex flex-wrap gap-2">
            <div 
              v-for="(blk, idx) in programBlocks" 
              :key="idx"
              @click="removeBlock(idx)"
              class="px-3 py-2 rounded-xl text-xs font-extrabold text-white flex items-center gap-1 cursor-pointer transition transform hover:scale-105 active:scale-95 shadow"
              :class="[
                blk === 'MOVE' ? 'bg-emerald-500 border border-emerald-600' : '',
                blk === 'RIGHT' || blk === 'LEFT' ? 'bg-indigo-500 border border-indigo-600' : '',
                blk === 'LOOP' ? 'bg-purple-500 border border-purple-600' : '',
                activeBlockIndex === idx ? 'ring-4 ring-yellow-400 scale-110' : ''
              ]"
            >
              <span>{{ idx + 1 }}.</span>
              <span v-if="blk === 'MOVE'">⬆️ Maju</span>
              <span v-else-if="blk === 'RIGHT'">➡️ Kanan</span>
              <span v-else-if="blk === 'LEFT'">⬅️ Kiri</span>
              <span v-else-if="blk === 'LOOP'">🔁 Ulangi</span>
            </div>
          </div>
        </div>

        <!-- Action Control Buttons: Run & Reset -->
        <div class="flex gap-3 pt-2">
          <button 
            @click="resetLevelState"
            :disabled="isRunning"
            class="btn-kid flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-extrabold py-3.5 rounded-2xl flex items-center justify-center gap-2 text-base cursor-pointer shadow border-2 border-slate-300"
            style="--btn-shadow: #94a3b8"
          >
            <RotateCcw class="w-5 h-5" /> Reset 🔄
          </button>

          <button 
            @click="runProgram"
            :disabled="isRunning || programBlocks.length === 0"
            class="btn-kid flex-2 bg-yellow-400 hover:bg-yellow-300 text-amber-950 font-extrabold py-3.5 rounded-2xl flex items-center justify-center gap-2 text-lg cursor-pointer shadow-lg border-2 border-yellow-500"
            style="--btn-shadow: #b45309"
          >
            <Play class="w-6 h-6 fill-amber-950" /> JALANKAN! ▶️
          </button>
        </div>

      </div>

    </div>

  </div>
</template>
