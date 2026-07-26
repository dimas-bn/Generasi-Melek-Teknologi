# GELETEK — GEnerasi MeLEk TEKnologi

Direktori data kelas ampuan untuk mata pelajaran **Informatika** serta
**Koding dan Kecerdasan Artifisial (KKA)** — SMA Negeri 1 Baturetno,
Tahun Ajaran 2026/2027.

Dibangun oleh **Dimas Bagus Nurdiansyah**.

## Isi proyek

```
geletek/
├── index.html      # struktur halaman
├── style.css       # tema visual (dark, futuristik)
├── script.js       # logika interaktif (grid kelas, jaringan SVG, pencarian, modal)
├── data.js         # data siswa per kelas (sumber: file Excel yang diunggah)
└── vercel.json     # konfigurasi ringan untuk deploy Vercel
```

Situs ini **statis murni** (HTML/CSS/JS biasa) — tidak butuh proses build,
server, atau database. Semua data dimuat langsung dari `data.js`.

## Cara deploy ke Vercel (domain geletek.vercel.app)

**Opsi A — lewat Vercel CLI (paling cepat)**
```bash
npm install -g vercel
cd geletek
vercel login
vercel --prod
```
Saat ditanya nama proyek, isi `geletek` agar domain default menjadi
`geletek.vercel.app` (jika nama tersebut masih tersedia).

**Opsi B — lewat GitHub + dashboard Vercel**
1. Unggah folder ini ke sebuah repository GitHub.
2. Buka [vercel.com/new](https://vercel.com/new), pilih repo tersebut.
3. Framework Preset: pilih **Other** (situs statis, tanpa build command).
4. Klik **Deploy**.
5. Di **Settings → Domains**, atur/pastikan domain `geletek.vercel.app`.

## Cara memperbarui data siswa

Buka `data.js`, cari kelas dan nama siswa yang ingin diubah, lalu sunting
langsung objek JSON di dalamnya (format `{ "no": 1, "nama": "..." }`).
Setelah disimpan, deploy ulang (`vercel --prod` atau push ke GitHub) —
tidak perlu mengubah `index.html`, `style.css`, maupun `script.js`.

## Fitur

- Ringkasan 5 kelas ampuan dalam bentuk kartu "simpul" interaktif
- Diagram jaringan menghubungkan kelima kelas ke inti GELETEK
- Detail siswa per kelas (nomor presensi + nama) dalam modal, lengkap
  dengan kotak pencarian di dalam kelas tersebut
- Pencarian nama lintas seluruh kelas dari satu kotak pencarian
- Sepenuhnya responsif (desktop, tablet, mobile) dan mendukung
  `prefers-reduced-motion`
