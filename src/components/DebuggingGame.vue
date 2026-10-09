<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue';
import { ChevronLeft, Volume2, RotateCcw, Stethoscope } from '@lucide/vue';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/audio';
import { DEBUG_LEVELS } from '../data/levels';
import type { DebugLevel, Direction } from '../data/levels';

const props = defineProps<{
  initialLevelId?: number;
}>();

const emit = defineEmits<{
  (e: 'backToHome'): void;
  (e: 'levelComplete', levelId: number, stars: number): void;
}>();

const currentLevelIndex = ref<number>(0);
const level = computed<DebugLevel>(() => DEBUG_LEVELS[currentLevelIndex.value]);

// Editable blocks
const currentBlocks = ref<string[]>([]);
const isRunning = ref(false);
const mascotPos = ref<{ x: number; y: number; dir: Direction }>({ x: 0, y: 0, dir: 'RIGHT' });
let runTimer: number | null = null;

const initLevel = () => {
  if (runTimer) clearInterval(runTimer);
  currentBlocks.value = [...level.value.initialBrokenBlocks];
  mascotPos.value = { ...level.value.startPos };
  isRunning.value = false;
  soundManager.speak(level.value.description);
};

watch(currentLevelIndex, () => {
  initLevel();
}, { immediate: true });

onUnmounted(() => {
  if (runTimer) clearInterval(runTimer);
});

const mascotRotationDegree = computed(() => {
  switch (mascotPos.value.dir) {
    case 'RIGHT': return 0;
    case 'DOWN': return 90;
    case 'LEFT': return 180;
    case 'UP': return 270;
  }
});

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

// Add block
const addBlock = (type: string) => {
  if (isRunning.value) return;
  currentBlocks.value.push(type);
  soundManager.playClick();
};

// Replace block at index
const replaceBlock = (index: number, newType: string) => {
  if (isRunning.value) return;
  currentBlocks.value[index] = newType;
  soundManager.playClick();
};

// Delete block
const removeBlock = (index: number) => {
  if (isRunning.value) return;
  currentBlocks.value.splice(index, 1);
  soundManager.playClick();
};

const resetLevel = () => {
  initLevel();
  soundManager.playClick();
};

// Run program to test fix
const runFix = () => {
  if (isRunning.value) return;
  mascotPos.value = { ...level.value.startPos };
  isRunning.value = true;
  let step = 0;

  runTimer = window.setInterval(() => {
    if (step >= currentBlocks.value.length) {
      if (runTimer) clearInterval(runTimer);
      isRunning.value = false;

      // Check win
      if (mascotPos.value.x === level.value.goalPos.x && mascotPos.value.y === level.value.goalPos.y) {
        soundManager.playSuccess();
        soundManager.speak('Dokter Hebat! Bug berhasil diperbaiki!');
        confetti({ particleCount: 100, spread: 70 });
        emit('levelComplete', level.value.id, 3);
      } else {
        soundManager.playError();
        soundManager.speak('Bobi belum sampai ke Bintang. Periksa kodenya lagi ya!');
      }
      return;
    }

    const cmd = currentBlocks.value[step];
    if (cmd === 'MOVE') {
      const next = moveForwardInDir(mascotPos.value);
      if (next.x < 0 || next.x >= level.value.gridSize.width || next.y < 0 || next.y >= level.value.gridSize.height) {
        soundManager.playError();
        soundManager.speak('Oops! Menabrak dinding!');
        clearInterval(runTimer!);
        isRunning.value = false;
        return;
      }
      const obstacle = level.value.items?.find(it => it.type === 'obstacle' && it.x === next.x && it.y === next.y);
      if (obstacle) {
        soundManager.playError();
        soundManager.speak('Menabrak batu! Masih ada bug!');
        clearInterval(runTimer!);
        isRunning.value = false;
        return;
      }
      mascotPos.value = next;
      soundManager.playStep();
    } else if (cmd === 'LEFT') {
      mascotPos.value.dir = turnLeft(mascotPos.value.dir);
      soundManager.playClick();
    } else if (cmd === 'RIGHT') {
      mascotPos.value.dir = turnRight(mascotPos.value.dir);
      soundManager.playClick();
    }

    step++;
  }, 600);
};

const speakDesc = () => {
  soundManager.speak(level.value.description);
};
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-4 space-y-4 animate-pop-in">
    
    <!-- Nav bar -->
    <div class="flex items-center justify-between gap-2 bg-white rounded-2xl p-3 shadow-md border-2 border-amber-200">
      <button 
        @click="emit('backToHome'); soundManager.playClick();"
        class="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-2 rounded-xl flex items-center gap-1 text-xs sm:text-sm cursor-pointer transition"
      >
        <ChevronLeft class="w-5 h-5" /> Menu Utama
      </button>

      <span class="font-extrabold text-amber-800 flex items-center gap-1 text-sm sm:text-base">
        <Stethoscope class="w-5 h-5 text-amber-600" /> Dokter Bug Level {{ level.id }}
      </span>

      <button @click="resetLevel" class="bg-amber-100 text-amber-800 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1">
        <RotateCcw class="w-4 h-4" /> Reset Kode Ruwet
      </button>
    </div>

    <!-- Description -->
    <div class="bg-gradient-to-r from-amber-500 to-orange-600 rounded-3xl p-5 text-white shadow-xl flex items-center justify-between gap-4 border-2 border-amber-300">
      <div class="space-y-1">
        <h2 class="text-xl sm:text-2xl font-extrabold text-white">{{ level.title }}</h2>
        <p class="text-xs sm:text-sm text-amber-100 font-medium">{{ level.description }}</p>
      </div>
      <button @click="speakDesc" class="bg-white/20 hover:bg-white/30 text-white p-3 rounded-2xl backdrop-blur-md">
        <Volume2 class="w-6 h-6 text-yellow-300" />
      </button>
    </div>

    <!-- Grid + Code Editor Layout -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      
      <!-- Grid -->
      <div class="bg-white rounded-3xl p-4 shadow-xl border-4 border-amber-200 flex flex-col items-center justify-center">
        <div 
          class="grid gap-2 p-3 bg-orange-50 rounded-2xl border-4 border-orange-200 shadow-inner"
          :style="{ gridTemplateColumns: `repeat(${level.gridSize.width}, minmax(0, 1fr))` }"
        >
          <template v-for="y in level.gridSize.height" :key="'dy-'+y">
            <div 
              v-for="x in level.gridSize.width" 
              :key="'dx-'+(x-1)+'-'+(y-1)"
              class="w-14 h-14 bg-white rounded-xl border-2 border-orange-200 flex items-center justify-center relative shadow-sm"
            >
              <div v-if="level.goalPos.x === (x-1) && level.goalPos.y === (y-1)" class="text-3xl animate-bounce">
                ⭐️
              </div>
              <template v-for="it in level.items" :key="'dit-'+it.x+'-'+it.y">
                <div v-if="it.x === (x-1) && it.y === (y-1) && it.type === 'obstacle'" class="text-3xl">
                  {{ it.icon || '🪨' }}
                </div>
              </template>
              <div 
                v-if="mascotPos.x === (x-1) && mascotPos.y === (y-1)"
                class="absolute inset-0 flex items-center justify-center text-3xl transition-all duration-500 transform"
                :style="{ transform: `rotate(${mascotRotationDegree}deg)` }"
              >
                🤖
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- Code Fixer -->
      <div class="bg-slate-50 rounded-3xl p-5 shadow-xl border-4 border-slate-200 space-y-4">
        <h3 class="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
          🐞 Kode Yang Sedang Rusak (Klik untuk ubah/hapus):
        </h3>

        <div class="space-y-2">
          <div 
            v-for="(blk, i) in currentBlocks" 
            :key="i"
            class="flex items-center justify-between p-3 bg-white rounded-2xl border-2 border-amber-300 shadow-sm font-bold text-sm"
          >
            <span class="text-slate-500">{{ i+1 }}.</span>
            <span class="text-slate-800 font-extrabold flex items-center gap-1">
              <span v-if="blk === 'MOVE'">⬆️ Maju</span>
              <span v-else-if="blk === 'RIGHT'">➡️ Belok Kanan</span>
              <span v-else-if="blk === 'LEFT'">⬅️ Belok Kiri</span>
            </span>

            <div class="flex gap-1">
              <button @click="replaceBlock(i, 'MOVE')" class="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold">⬆️</button>
              <button @click="replaceBlock(i, 'RIGHT')" class="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-lg text-xs font-bold">➡️</button>
              <button @click="replaceBlock(i, 'LEFT')" class="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-lg text-xs font-bold">⬅️</button>
              <button @click="removeBlock(i)" class="px-2 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-bold">❌</button>
            </div>
          </div>
        </div>

        <div class="flex gap-2">
          <button @click="addBlock('MOVE')" class="flex-1 py-2 bg-emerald-500 text-white rounded-xl text-xs font-extrabold">+ Maju ⬆️</button>
          <button @click="addBlock('RIGHT')" class="flex-1 py-2 bg-indigo-500 text-white rounded-xl text-xs font-extrabold">+ Kanan ➡️</button>
          <button @click="addBlock('LEFT')" class="flex-1 py-2 bg-indigo-500 text-white rounded-xl text-xs font-extrabold">+ Kiri ⬅️</button>
        </div>

        <button 
          @click="runFix"
          :disabled="isRunning || currentBlocks.length === 0"
          class="btn-kid w-full bg-yellow-400 hover:bg-yellow-300 text-amber-950 font-extrabold py-3 rounded-2xl text-lg shadow-lg border-2 border-yellow-500 cursor-pointer"
          style="--btn-shadow: #b45309"
        >
          Uji Coba Perbaikan! ▶️
        </button>
      </div>

    </div>

  </div>
</template>
