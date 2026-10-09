<script setup lang="ts">
import { BookOpen, X, CheckCircle, Award, Lightbulb } from '@lucide/vue';
import { soundManager } from '../utils/audio';

const emit = defineEmits<{
  (e: 'close'): void;
}>();
</script>

<template>
  <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-pop-in">
    <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border-4 border-indigo-400 relative space-y-5 max-h-[90vh] overflow-y-auto">
      
      <button 
        @click="emit('close'); soundManager.playClick();"
        class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
      >
        <X class="w-6 h-6" />
      </button>

      <div class="flex items-center gap-3">
        <div class="p-3 bg-indigo-100 rounded-2xl text-indigo-700">
          <BookOpen class="w-8 h-8" />
        </div>
        <div>
          <h2 class="text-2xl font-extrabold text-slate-800">Panduan Orang Tua & Guru</h2>
          <p class="text-xs text-indigo-600 font-bold uppercase tracking-wider">Persiapan Lomba & Pembelajaran Koding Anak Usia 5 Tahun</p>
        </div>
      </div>

      <div class="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
        
        <div class="bg-indigo-50 p-4 rounded-2xl border border-indigo-200 space-y-2">
          <h3 class="font-extrabold text-indigo-900 text-base flex items-center gap-2">
            <Lightbulb class="w-5 h-5 text-yellow-500 fill-yellow-400" /> Mengapa Koding Penting untuk Usia 5 Tahun?
          </h3>
          <p class="text-slate-600 font-medium">
            Pembelajaran koding untuk anak usia dini (PAUD/TK) bukan tentang menghafal baris kode sintaks rumit, melainkan tentang <strong>Berpikir Komputasional (Computational Thinking)</strong>: memecahkan masalah besar menjadi langkah-langkah kecil yang logis dan runtut.
          </p>
        </div>

        <div class="space-y-3">
          <h4 class="font-extrabold text-slate-800 text-sm">🧠 Materi Yang Dipelajari Dalam Aplikasi Ini:</h4>
          
          <ul class="space-y-2">
            <li class="flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <CheckCircle class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong class="text-slate-900">1. Algoritma & Urutan (Sequencing):</strong> Anak belajar bahwa komputer hanya menjalankan instruksi dari atas ke bawah sesuai urutan (Maju ⬆️, Belok ➡️).
              </div>
            </li>
            <li class="flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <CheckCircle class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong class="text-slate-900">2. Pengulangan (Looping):</strong> Memahami cara menyingkat perintah berulang dengan tombol Loop 🔁 (misal: Maju 3x tanpa perlu menekan Maju 3 kali).
              </div>
            </li>
            <li class="flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <CheckCircle class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong class="text-slate-900">3. Pemecahan Kode Rahasia (Decoding & Cipher):</strong> Melatih pengenalan pola, pencocokan simbol ke karakter, dan representasi gambar berbasis kode piksel (0 & 1).
              </div>
            </li>
            <li class="flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <CheckCircle class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong class="text-slate-900">4. Perbaikan Kesalahan (Debugging):</strong> Mengajarkan anak agar tidak takut salah. Ketika robot menabrak, anak dilatih menganalisis di mana letak "bug" (kesalahan) dan memperbaikinya.
              </div>
            </li>
          </ul>
        </div>

        <div class="bg-yellow-50 p-4 rounded-2xl border border-yellow-300 space-y-2">
          <h4 class="font-extrabold text-amber-900 text-sm flex items-center gap-2">
            <Award class="w-5 h-5 text-yellow-600" /> Tips Persiapan Lomba (Bebras Jr & Scratch Jr Challenge):
          </h4>
          <p class="text-xs text-amber-800 font-medium">
            • Gunakan tombol <strong>Suara Narasi 🔊</strong> agar ananda tidak kesulitan jika masih dalam tahap belajar membaca.<br/>
            • Dampingi ananda saat pertama kali mencoba <strong>Simulasi Lomba</strong> untuk membangun rasa percaya diri.<br/>
            • Cetak <strong>Sertifikat Juara Koding</strong> sebagai bentuk apresiasi atas prestasi dan usahanya! 🏅
          </p>
        </div>

      </div>

      <button 
        @click="emit('close'); soundManager.playClick();"
        class="w-full py-3 rounded-2xl font-extrabold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md cursor-pointer"
      >
        Mengerti, Terima Kasih! 👍
      </button>

    </div>
  </div>
</template>
