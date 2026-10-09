export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface GridItem {
  x: number;
  y: number;
  type: 'star' | 'obstacle' | 'goal' | 'banana' | 'gem';
  icon?: string;
}

export interface GridLevel {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  gridSize: { width: number; height: number };
  startPos: { x: number; y: number; dir: Direction };
  goalPos: { x: number; y: number };
  items?: GridItem[];
  maxBlocksFor3Stars: number;
  allowedBlocks: Array<'MOVE' | 'LEFT' | 'RIGHT' | 'UP' | 'DOWN' | 'ACTION' | 'LOOP'>;
  theme: 'forest' | 'space' | 'candy' | 'ocean';
}

export interface CipherLevel {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  type: 'emoji-cipher' | 'pixel-decode' | 'pattern';
  // For Emoji Cipher
  cipherKey?: Record<string, string>; // emoji -> letter/word
  encryptedPrompt?: string[]; // array of emoji keys
  targetWord?: string;
  options?: string[]; // choices for missing part or word
  // For Pixel Decode
  pixelGrid?: number[][]; // 0 and 1
  pixelPalette?: { [key: number]: string };
  // For Pattern Recognition
  sequence?: string[];
  patternOptions?: string[];
  correctAnswer?: string;
  hint: string;
}

export interface DebugLevel {
  id: number;
  title: string;
  description: string;
  gridSize: { width: number; height: number };
  startPos: { x: number; y: number; dir: Direction };
  goalPos: { x: number; y: number };
  items?: GridItem[];
  initialBrokenBlocks: string[]; // e.g. ['MOVE', 'LEFT', 'MOVE']
  correctBlocks: string[];
  hint: string;
}

export interface CompetitionQuestion {
  id: number;
  title: string;
  question: string;
  imageIcon: string;
  options: { id: string; text: string; icon?: string; isCorrect: boolean }[];
  explanation: string;
}

// -------------------------------------------------------------
// GRID CODING LEVELS (Petualangan Robot)
// -------------------------------------------------------------
export const ROBOT_LEVELS: GridLevel[] = [
  {
    id: 1,
    title: 'Langkah Pertama Bobi! 🤖',
    subtitle: 'Konsep: Urutan (Sequencing)',
    description: 'Bantu Robot Bobi melangkah maju 2 kali untuk mengambil Bintang Emas ⭐️!',
    gridSize: { width: 4, height: 4 },
    startPos: { x: 0, y: 1, dir: 'RIGHT' },
    goalPos: { x: 2, y: 1 },
    maxBlocksFor3Stars: 2,
    allowedBlocks: ['MOVE'],
    theme: 'forest'
  },
  {
    id: 2,
    title: 'Belok ke Kanan ➡️',
    subtitle: 'Konsep: Arah & Navigasi',
    description: 'Jalan maju, lalu belok ke kanan untuk mengambil Pisang Manis 🍌!',
    gridSize: { width: 4, height: 4 },
    startPos: { x: 1, y: 0, dir: 'RIGHT' },
    goalPos: { x: 2, y: 2 },
    items: [{ x: 2, y: 0, type: 'obstacle', icon: '🪨' }],
    maxBlocksFor3Stars: 3,
    allowedBlocks: ['MOVE', 'RIGHT', 'LEFT'],
    theme: 'forest'
  },
  {
    id: 3,
    title: 'Hindari Batu Raksasa! 🪨',
    subtitle: 'Konsep: Menghindari Halangan',
    description: 'Ada batu menghalangi jalan! Belok memutar untuk mencapai Bintang ⭐️.',
    gridSize: { width: 4, height: 4 },
    startPos: { x: 0, y: 0, dir: 'RIGHT' },
    goalPos: { x: 3, y: 0 },
    items: [
      { x: 1, y: 0, type: 'obstacle', icon: '🪨' },
      { x: 2, y: 0, type: 'obstacle', icon: '🪨' }
    ],
    maxBlocksFor3Stars: 6,
    allowedBlocks: ['MOVE', 'RIGHT', 'LEFT'],
    theme: 'forest'
  },
  {
    id: 4,
    title: 'Misi Permata Manis 💎',
    subtitle: 'Konsep: Jalur Kompleks',
    description: 'Bantu Dino Cilik berjalan di Istana Permen untuk mengambil Permata 💎!',
    gridSize: { width: 4, height: 4 },
    startPos: { x: 0, y: 3, dir: 'UP' },
    goalPos: { x: 3, y: 0 },
    items: [
      { x: 1, y: 2, type: 'obstacle', icon: '🍭' },
      { x: 2, y: 1, type: 'obstacle', icon: '🍫' }
    ],
    maxBlocksFor3Stars: 6,
    allowedBlocks: ['MOVE', 'RIGHT', 'LEFT'],
    theme: 'candy'
  },
  {
    id: 5,
    title: 'Kumpulkan Semua Bintang! ⭐️⭐️',
    subtitle: 'Konsep: Pengumpulan Item Multi-Step',
    description: 'Jelajahi luar angkasa dan kumpulkan Bintang & Permata!',
    gridSize: { width: 5, height: 5 },
    startPos: { x: 0, y: 0, dir: 'RIGHT' },
    goalPos: { x: 4, y: 4 },
    items: [
      { x: 2, y: 0, type: 'star', icon: '⭐️' },
      { x: 2, y: 2, type: 'obstacle', icon: '☄️' }
    ],
    maxBlocksFor3Stars: 8,
    allowedBlocks: ['MOVE', 'RIGHT', 'LEFT'],
    theme: 'space'
  },
  {
    id: 6,
    title: 'Keajaiban Pengulangan (Loop 🔁)',
    subtitle: 'Konsep: Perulangan (Looping)',
    description: 'Gunakan tombol Ulangi (Loop 🔁 3x) agar Bobi maju 3 langkah sekaligus tanpa repot!',
    gridSize: { width: 5, height: 4 },
    startPos: { x: 0, y: 1, dir: 'RIGHT' },
    goalPos: { x: 3, y: 1 },
    maxBlocksFor3Stars: 2,
    allowedBlocks: ['MOVE', 'LOOP'],
    theme: 'forest'
  },
  {
    id: 7,
    title: 'Kapal Selam Laut Dalam 🌊🐙',
    subtitle: 'Konsep: Loop & Belok',
    description: 'Hindari Gurita Tidur 🐙 di lautan dengan kombinasi Loop dan Belok!',
    gridSize: { width: 5, height: 5 },
    startPos: { x: 0, y: 4, dir: 'RIGHT' },
    goalPos: { x: 4, y: 0 },
    items: [
      { x: 2, y: 4, type: 'obstacle', icon: '🐙' },
      { x: 2, y: 3, type: 'obstacle', icon: '🐙' }
    ],
    maxBlocksFor3Stars: 6,
    allowedBlocks: ['MOVE', 'RIGHT', 'LEFT', 'LOOP'],
    theme: 'ocean'
  },
  {
    id: 8,
    title: 'Juara Koding Cilik! 👑',
    subtitle: 'Konsep: Tantangan Logika Lomba',
    description: 'Tunjukkan keahlianmu! Lewati rintangan dan capai Mahkota Juara 👑!',
    gridSize: { width: 5, height: 5 },
    startPos: { x: 0, y: 0, dir: 'RIGHT' },
    goalPos: { x: 4, y: 4 },
    items: [
      { x: 1, y: 1, type: 'obstacle', icon: '🪨' },
      { x: 3, y: 2, type: 'obstacle', icon: '☄️' },
      { x: 2, y: 4, type: 'star', icon: '⭐️' }
    ],
    maxBlocksFor3Stars: 8,
    allowedBlocks: ['MOVE', 'RIGHT', 'LEFT', 'LOOP'],
    theme: 'space'
  }
];

// -------------------------------------------------------------
// DECODING & CIPHER LEVELS (Detektif Kode Rahasia)
// -------------------------------------------------------------
export const DECODING_LEVELS: CipherLevel[] = [
  {
    id: 1,
    title: 'Sandi Emoji Hewan 🐱🐶',
    subtitle: 'Tingkat: Detektif Pemula',
    description: 'Setiap emoji memiliki arti huruf! Pecahkan kode di bawah ini untuk menemukan nama hewan rahasia!',
    type: 'emoji-cipher',
    cipherKey: { '🍎': 'K', '🍌': 'A', '⭐️': 'T', '🐱': 'U', '🚀': 'C', '🎈': 'I', '🍓': 'N', '🍉': 'G' },
    encryptedPrompt: ['🚀', '🍎', '🐱', '🎈', '🍓', '🍉'],
    targetWord: 'KUCING',
    options: ['KUCING', 'ANJING', 'KELINCI', 'BURUNG'],
    hint: 'Lihat kunci jawaban: 🚀=K, 🍎=U, 🐱=C, 🎈=I, 🍓=N, 🍉=G'
  },
  {
    id: 2,
    title: 'Pola Rahasia Warna 🔴🔵',
    subtitle: 'Tingkat: Pengenalan Pola',
    description: 'Perhatikan urutan pola di bawah ini. Manakah emoji yang harus diisi di tanda tanya [ ? ]?',
    type: 'pattern',
    sequence: ['🔴', '🔵', '🔴', '🔵', '🔴', '?'],
    patternOptions: ['🔴', '🔵', '🟡', '🟢'],
    correctAnswer: '🔵',
    hint: 'Polanya selang-seling: Merah, Biru, Merah, Biru...'
  },
  {
    id: 3,
    title: 'Sandi Kata "ROBOT" 🤖',
    subtitle: 'Tingkat: Pemecahan Simbol',
    description: 'Tebak kata rahasia robot dengan mencocokkan simbol ke hurufnya!',
    type: 'emoji-cipher',
    cipherKey: { '🔴': 'R', '🟡': 'O', '🔵': 'B', '🟢': 'T' },
    encryptedPrompt: ['🔴', '🟡', '🔵', '🟡', '🟢'],
    targetWord: 'ROBOT',
    options: ['ROBOT', 'MOBIL', 'MOTOR', 'BALON'],
    hint: '🔴=R, 🟡=O, 🔵=B, 🟢=T'
  },
  {
    id: 4,
    title: 'Lukisan Piksel Bintang ⭐️',
    subtitle: 'Tingkat: Kode Piksel 0 & 1',
    description: 'Angka 1 berarti WARNA KUNING, Angka 0 berarti KOSONG. Warnai grid untuk membentuk gambar rahasia!',
    type: 'pixel-decode',
    pixelGrid: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 1, 0]
    ],
    pixelPalette: { 0: '#f8fafc', 1: '#facc15' },
    targetWord: 'BINTANG',
    hint: 'Klik kotak pada baris dan kolom yang memiliki angka 1!'
  },
  {
    id: 5,
    title: 'Sandi Gambar Hati ❤️',
    subtitle: 'Tingkat: Kode Piksel Gambar Hati',
    description: 'Warnai kotak angka 1 dengan warna MERAH untuk mengungkapkan gambar rahasia!',
    type: 'pixel-decode',
    pixelGrid: [
      [1, 0, 1],
      [1, 1, 1],
      [0, 1, 0]
    ],
    pixelPalette: { 0: '#f8fafc', 1: '#ef4444' },
    targetWord: 'HATI',
    hint: 'Warnai bagian berbentuk Hati ❤️!'
  },
  {
    id: 6,
    title: 'Pola Arah Panah ⬆️➡️',
    subtitle: 'Tingkat: Urutan Simbol',
    description: 'Lengkapi urutan gerakan berikut: Up, Right, Up, Right, Up, ...?',
    type: 'pattern',
    sequence: ['⬆️', '➡️', '⬆️', '➡️', '⬆️', '?'],
    patternOptions: ['⬆️', '➡️', '⬇️', '⬅️'],
    correctAnswer: '➡️',
    hint: 'Perhatikan bahwa panah berganti dari Atas ke Kanan!'
  }
];

// -------------------------------------------------------------
// DEBUGGING LEVELS (Dokter Bug)
// -------------------------------------------------------------
export const DEBUG_LEVELS: DebugLevel[] = [
  {
    id: 1,
    title: 'Bobi Salah Belok! 🛑',
    description: 'Program Bobi memiliki kesalahan (BUG)! Bobi ingin pergi ke Bintang, tetapi kodenya malah belok kiri. Perbaiki kodenya!',
    gridSize: { width: 4, height: 4 },
    startPos: { x: 0, y: 1, dir: 'RIGHT' },
    goalPos: { x: 2, y: 1 },
    initialBrokenBlocks: ['MOVE', 'LEFT', 'MOVE'],
    correctBlocks: ['MOVE', 'MOVE'],
    hint: 'Bobi tidak perlu belok, cukup maju 2 kali!'
  },
  {
    id: 2,
    title: 'Menabrak Batu 🪨',
    description: 'Oh tidak! Jika program dijalankan sekarang, Bobi akan menabrak batu. Ganti blok perintah agar Bobi selamat!',
    gridSize: { width: 4, height: 4 },
    startPos: { x: 0, y: 0, dir: 'RIGHT' },
    goalPos: { x: 2, y: 0 },
    items: [{ x: 1, y: 0, type: 'obstacle', icon: '🪨' }],
    initialBrokenBlocks: ['MOVE', 'MOVE'],
    correctBlocks: ['RIGHT', 'MOVE', 'LEFT', 'MOVE', 'LEFT', 'MOVE'],
    hint: 'Gunakan belokan untuk memutari batu!'
  }
];

// -------------------------------------------------------------
// COMPETITION SIMULATOR QUESTIONS (Bebras / Scratch Jr Style)
// -------------------------------------------------------------
export const COMPETITION_QUESTIONS: CompetitionQuestion[] = [
  {
    id: 1,
    title: 'Soal 1: Jalur Terpendek 🗺️',
    question: 'Robot Kiki ingin mengambil Pisang 🍌. Urutan langkah mana yang paling cepat?',
    imageIcon: '🐒➡️🍌',
    options: [
      { id: 'A', text: 'Maju 2 kali ➡️➡️', isCorrect: true },
      { id: 'B', text: 'Belok Kiri ⬅️ lalu Maju 3 kali', isCorrect: false },
      { id: 'C', text: 'Maju 5 kali ➡️➡️➡️➡️➡️', isCorrect: false },
      { id: 'D', text: 'Mundur 2 kali ⬅️⬅️', isCorrect: false }
    ],
    explanation: 'Pisang berada 2 langkah lurus di depan Kiki, jadi cukup Maju 2 kali!'
  },
  {
    id: 2,
    title: 'Soal 2: Memecahkan Kode Rahasia 🔍',
    question: 'Jika ⭐️ = A dan 🌙 = B, maka kode ⭐️ 🌙 ⭐️ dibaca sebagai apa?',
    imageIcon: '⭐️🌙⭐️',
    options: [
      { id: 'A', text: 'ABA', isCorrect: true },
      { id: 'B', text: 'BAB', isCorrect: false },
      { id: 'C', text: 'AAB', isCorrect: false },
      { id: 'D', text: 'BBA', isCorrect: false }
    ],
    explanation: '⭐️ adalah A, 🌙 adalah B, ⭐️ adalah A. Maka dibaca A-B-A!'
  },
  {
    id: 3,
    title: 'Soal 3: Menemukan Bug (Kesalahan Kode) 🐞',
    question: 'Mimi ingin membuat lingkaran 🔴. Ia melukis Merah, Merah, Biru, Merah. Yang mana warna yang SALAH (Bug)?',
    imageIcon: '🔴🔴🔵🔴',
    options: [
      { id: 'A', text: 'Warna Biru 🔵 (Harusnya Merah 🔴)', isCorrect: true },
      { id: 'B', text: 'Warna Merah Pertama 🔴', isCorrect: false },
      { id: 'C', text: 'Semua Benar', isCorrect: false }
    ],
    explanation: 'Semua warna seharusnya Merah, jadi warna Biru adalah Bug (kesalahan)!'
  },
  {
    id: 4,
    title: 'Soal 4: Pengulangan (Loop) 🔁',
    question: 'Perintah [Ulangi 3x: Maju ➡️] sama artinya dengan perintah yang mana?',
    imageIcon: '🔁 3x ➡️',
    options: [
      { id: 'A', text: 'Maju, Maju, Maju ➡️➡️➡️', isCorrect: true },
      { id: 'B', text: 'Maju 1 kali saja ➡️', isCorrect: false },
      { id: 'C', text: 'Maju lalu Belok Kanan ➡️➡️', isCorrect: false }
    ],
    explanation: 'Ulangi 3x Maju artinya melakukan gerakan Maju sebanyak 3 kali berturut-turut.'
  },
  {
    id: 5,
    title: 'Soal 5: Logika Syarat (If / Else) 🚦',
    question: 'Aturan: Jika lampu MERAH 🔴 -> Berhenti. Jika GREEN 🟢 -> Maju. Sekarang lampu berwarna MERAH 🔴. Apa yang dilakukan robot?',
    imageIcon: '🔴 ➡️ ❓',
    options: [
      { id: 'A', text: 'Berhenti 🛑', isCorrect: true },
      { id: 'B', text: 'Maju ➡️', isCorrect: false },
      { id: 'C', text: 'Melompat 🦘', isCorrect: false }
    ],
    explanation: 'Karena lampunya Merah, sesuai syarat robot harus Berhenti!'
  }
];
