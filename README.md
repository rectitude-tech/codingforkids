# 🤖 KodoKids — Petualangan Coding & Kode Rahasia Anak

> **Media pembelajaran coding interaktif untuk anak usia 5 tahun ke atas**, dengan 4 mode permainan berbasis Vue 3 + TypeScript + Tailwind CSS — dapat dijalankan secara offline dari GitHub Pages tanpa database.

---

## 🎮 Mode Permainan

| Mode | Deskripsi | Konsep Koding |
|---|---|---|
| 🤖 **Petualangan Robot** | Susun blok perintah untuk memandu Bobi si Robot mengambil bintang | Algoritma, Urutan, Looping |
| 🔍 **Detektif Kode Rahasia** | Pecahkan sandi emoji, lukisan piksel 0&1, pola logika | Decoding, Kriptografi Dasar, Pola |
| 🩺 **Dokter Bug** | Temukan & perbaiki perintah yang salah (bug) | Debugging, Pemecahan Masalah |
| 🏆 **Simulasi Lomba Coding** | 5 soal gaya Bebras Junior — cetak sertifikat juara! | Logika Komputasional, Lomba |

## 🚀 Stack Teknologi

- **Vue 3** + Composition API + `<script setup lang="ts">`
- **TypeScript** (full type safety)
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **Vite** (build tool, ~1.5 detik build time)
- **Web Audio API** — sound effects tanpa file MP3 eksternal
- **Web Speech API** — narasi suara Bahasa Indonesia untuk anak yang masih belajar membaca
- **canvas-confetti** — animasi kembang api saat level selesai
- **LocalStorage** — menyimpan progress bintang & XP tanpa backend/database

## 📦 Cara Menjalankan Lokal

```bash
npm install
npm run dev
```

## 🔨 Build untuk Produksi

```bash
npm run build
```

Output ada di folder `dist/`.

## 🌐 Deploy ke GitHub Pages

1. **Push ke branch `main`** — GitHub Actions (`/.github/workflows/deploy.yml`) akan otomatis build & deploy ke `https://<username>.github.io/<repo-name>/`

2. **Aktifkan GitHub Pages**: Masuk ke repo GitHub → *Settings* → *Pages* → Source: **GitHub Actions**

## 📚 Konsep Koding yang Dipelajari

| Konsep | Istilah Pemrograman | Implementasi dalam Game |
|---|---|---|
| Langkah berurutan | Sequencing / Algoritma | Blok Maju ⬆️, Belok ➡️⬅️ |
| Pengulangan | Looping / Iteration | Tombol 🔁 Ulangi 3x |
| Simbol & kode | Encoding / Decoding | Sandi Emoji & Piksel 0&1 |
| Perbaikan kode | Debugging | Mode Dokter Bug 🩺 |
| Percabangan logika | If/Else Conditional | Soal Simulasi Lomba 🏆 |

---

*Dibuat dengan ❤️ untuk ananda tercinta — KodoKids Academy 🤖*
