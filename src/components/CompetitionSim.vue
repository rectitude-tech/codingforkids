<script setup lang="ts">
import { ref, computed } from 'vue';
import { ChevronLeft, Volume2, Trophy, Award, CheckCircle2, XCircle, Printer, RefreshCw } from '@lucide/vue';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/audio';
import { COMPETITION_QUESTIONS } from '../data/levels';
import type { CompetitionQuestion } from '../data/levels';

const props = defineProps<{
  userName: string;
  userAvatar: string;
}>();

const emit = defineEmits<{
  (e: 'backToHome'): void;
  (e: 'levelComplete', levelId: number, stars: number): void;
}>();

const currentIndex = ref(0);
const selectedAnswerId = ref<string | null>(null);
const userAnswers = ref<Record<number, string>>({});
const isSubmitted = ref(false);
const isFinished = ref(false);

const question = computed<CompetitionQuestion>(() => COMPETITION_QUESTIONS[currentIndex.value]);

const selectOption = (optId: string) => {
  if (isSubmitted.value) return;
  selectedAnswerId.value = optId;
  soundManager.playClick();
};

const submitAnswer = () => {
  if (!selectedAnswerId.value) return;
  userAnswers.value[question.value.id] = selectedAnswerId.value;
  isSubmitted.value = true;

  const chosen = question.value.options.find(o => o.id === selectedAnswerId.value);
  if (chosen?.isCorrect) {
    soundManager.playSuccess();
    soundManager.speak('Benar sekali! Kamu pintar!');
  } else {
    soundManager.playError();
    soundManager.speak('Belum tepat, mari baca penjelasannya ya!');
  }
};

const nextQuestion = () => {
  if (currentIndex.value < COMPETITION_QUESTIONS.length - 1) {
    currentIndex.value++;
    selectedAnswerId.value = null;
    isSubmitted.value = false;
  } else {
    // Finish exam
    isFinished.value = true;
    soundManager.playSuccess();
    confetti({ particleCount: 150, spread: 80 });

    const correctCount = totalScore.value / 20;
    const stars = correctCount >= 4 ? 3 : (correctCount >= 2 ? 2 : 1);
    emit('levelComplete', 99, stars);
  }
};

const totalScore = computed(() => {
  let score = 0;
  COMPETITION_QUESTIONS.forEach(q => {
    const userAns = userAnswers.value[q.id];
    const opt = q.options.find(o => o.id === userAns);
    if (opt?.isCorrect) score += 20;
  });
  return score;
});

const restartExam = () => {
  currentIndex.value = 0;
  selectedAnswerId.value = null;
  userAnswers.value = {};
  isSubmitted.value = false;
  isFinished.value = false;
  soundManager.playClick();
};

const printCertificate = () => {
  soundManager.playStar();
  window.print();
};

const speakQuestion = () => {
  soundManager.speak(`${question.value.title}. ${question.value.question}`);
};
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-4 space-y-4 animate-pop-in">
    
    <!-- Top Nav -->
    <div class="flex items-center justify-between gap-2 bg-white rounded-2xl p-3 shadow-md border-2 border-rose-200">
      <button 
        @click="emit('backToHome'); soundManager.playClick();"
        class="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-2 rounded-xl flex items-center gap-1 text-xs sm:text-sm cursor-pointer transition"
      >
        <ChevronLeft class="w-5 h-5" /> Menu Utama
      </button>

      <span class="font-extrabold text-rose-800 flex items-center gap-1 text-sm sm:text-base">
        <Trophy class="w-5 h-5 text-rose-600" /> Simulasi Lomba Koding Cilik
      </span>

      <span class="bg-rose-100 text-rose-800 font-extrabold px-3 py-1 rounded-xl text-xs">
        Soal {{ currentIndex + 1 }} / {{ COMPETITION_QUESTIONS.length }}
      </span>
    </div>

    <!-- Active Question View -->
    <div v-if="!isFinished" class="bg-white rounded-3xl p-6 shadow-xl border-4 border-rose-200 space-y-6">
      
      <!-- Question Title Banner -->
      <div class="bg-gradient-to-r from-rose-500 to-pink-600 rounded-2xl p-4 text-white shadow-md flex justify-between items-center">
        <div>
          <span class="bg-yellow-400 text-amber-950 font-extrabold px-3 py-0.5 rounded-full text-xs uppercase">
            {{ question.title }}
          </span>
          <h2 class="text-lg sm:text-xl font-extrabold mt-1 text-white">{{ question.question }}</h2>
        </div>
        <button @click="speakQuestion" class="p-2.5 bg-white/20 hover:bg-white/30 rounded-xl text-white">
          <Volume2 class="w-6 h-6 text-yellow-300" />
        </button>
      </div>

      <!-- Question Visual Card -->
      <div class="flex justify-center p-6 bg-pink-50 rounded-2xl border-2 border-pink-200 text-5xl sm:text-6xl tracking-widest font-extrabold text-slate-800 animate-pulse">
        {{ question.imageIcon }}
      </div>

      <!-- Multiple Choice Options -->
      <div class="space-y-3">
        <button 
          v-for="opt in question.options" 
          :key="opt.id"
          @click="selectOption(opt.id)"
          :disabled="isSubmitted"
          class="w-full text-left p-4 rounded-2xl border-3 font-extrabold text-base sm:text-lg flex items-center justify-between transition cursor-pointer shadow-sm"
          :class="[
            selectedAnswerId === opt.id ? 'border-rose-500 bg-rose-50 text-rose-900 ring-4 ring-rose-200' : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800',
            isSubmitted && opt.isCorrect ? 'bg-emerald-100 border-emerald-500 text-emerald-900' : '',
            isSubmitted && selectedAnswerId === opt.id && !opt.isCorrect ? 'bg-red-100 border-red-500 text-red-900' : ''
          ]"
        >
          <div class="flex items-center gap-3">
            <span class="w-8 h-8 rounded-xl bg-white border-2 border-slate-300 flex items-center justify-center text-sm font-extrabold shadow-inner">
              {{ opt.id }}
            </span>
            <span>{{ opt.text }}</span>
          </div>

          <span v-if="isSubmitted && opt.isCorrect" class="text-emerald-600 flex items-center gap-1 text-xs">
            <CheckCircle2 class="w-5 h-5 fill-emerald-600 text-white" /> Benar!
          </span>
          <span v-else-if="isSubmitted && selectedAnswerId === opt.id && !opt.isCorrect" class="text-red-600 flex items-center gap-1 text-xs">
            <XCircle class="w-5 h-5 fill-red-600 text-white" /> Kurang Tepat
          </span>
        </button>
      </div>

      <!-- Explanation Box -->
      <div v-if="isSubmitted" class="p-4 bg-amber-50 rounded-2xl border-2 border-amber-300 space-y-1 text-xs sm:text-sm text-amber-900">
        <span class="font-extrabold text-amber-950 flex items-center gap-1">
          💡 Penjelasan Logika:
        </span>
        <p class="font-medium">{{ question.explanation }}</p>
      </div>

      <!-- Action Button -->
      <div class="pt-2">
        <button 
          v-if="!isSubmitted"
          @click="submitAnswer"
          :disabled="!selectedAnswerId"
          class="btn-kid w-full bg-rose-500 hover:bg-rose-600 text-white font-extrabold py-3.5 rounded-2xl text-lg shadow-lg border-2 border-rose-600 cursor-pointer disabled:opacity-40"
          style="--btn-shadow: #9f1239"
        >
          Kirim Jawaban! ✨
        </button>

        <button 
          v-else
          @click="nextQuestion"
          class="btn-kid w-full bg-yellow-400 hover:bg-yellow-300 text-amber-950 font-extrabold py-3.5 rounded-2xl text-lg shadow-lg border-2 border-yellow-500 cursor-pointer"
          style="--btn-shadow: #b45309"
        >
          {{ currentIndex < COMPETITION_QUESTIONS.length - 1 ? 'Soal Berikutnya ➡️' : 'Lihat Hasil & Sertifikat! 🏆' }}
        </button>
      </div>

    </div>

    <!-- Final Certificate & Result View -->
    <div v-else class="space-y-6">
      
      <!-- Printable Certificate Card -->
      <div class="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 rounded-3xl p-8 shadow-2xl border-8 border-yellow-400 text-center relative overflow-hidden space-y-6">
        
        <div class="absolute -top-10 -right-10 opacity-10 text-9xl">🏆</div>

        <div class="flex items-center justify-center gap-2">
          <Award class="w-12 h-12 text-yellow-500 fill-yellow-400" />
          <h1 class="text-3xl sm:text-4xl font-extrabold text-amber-950 tracking-wider">
            SERTIFIKAT JUARA CODING
          </h1>
          <Award class="w-12 h-12 text-yellow-500 fill-yellow-400" />
        </div>

        <p class="text-xs sm:text-sm font-bold text-amber-800 uppercase tracking-widest">
          Dengan Ini Diberikan Kepada Peserta Terbaik:
        </p>

        <div class="inline-block bg-white px-8 py-3 rounded-2xl border-4 border-yellow-400 shadow-md">
          <span class="text-3xl sm:text-4xl font-extrabold text-slate-800">{{ userName }} {{ userAvatar }}</span>
        </div>

        <p class="text-sm sm:text-base font-semibold text-slate-700 max-w-lg mx-auto">
          Telah berhasil menyelesaikan <span class="font-extrabold text-rose-600">Simulasi Lomba Koding & Pemecahan Kode Rahasia Cilik</span> dengan nilai akhir:
        </p>

        <div class="text-5xl font-extrabold text-amber-600 bg-yellow-200/60 inline-block px-8 py-3 rounded-3xl border-2 border-yellow-400">
          {{ totalScore }} / 100
        </div>

        <div class="pt-4 flex justify-around text-xs font-bold text-slate-500 border-t border-yellow-300">
          <div>
            <span>Tanggal Ujian:</span>
            <p class="text-slate-800 font-extrabold text-sm">{{ new Date().toLocaleDateString('id-ID') }}</p>
          </div>
          <div>
            <span>Penyelenggara:</span>
            <p class="text-slate-800 font-extrabold text-sm">KodoKids Academy 🤖</p>
          </div>
        </div>
      </div>

      <!-- Action buttons -->
      <div class="flex flex-wrap gap-4 justify-center">
        <button 
          @click="printCertificate"
          class="btn-kid bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold px-6 py-3.5 rounded-2xl text-base flex items-center gap-2 shadow-lg border-2 border-emerald-600 cursor-pointer"
          style="--btn-shadow: #047857"
        >
          <Printer class="w-5 h-5" /> Cetak Sertifikat 🖨️
        </button>

        <button 
          @click="restartExam"
          class="bg-yellow-400 hover:bg-yellow-300 text-amber-950 font-extrabold px-6 py-3.5 rounded-2xl text-base flex items-center gap-2 shadow-lg border-2 border-yellow-500 cursor-pointer"
        >
          <RefreshCw class="w-5 h-5" /> Ulangi Simulasi 🔄
        </button>
      </div>

    </div>

  </div>
</template>
