const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Create Default Admin User
  // Password: AndreAsia_123
  const hashedPassword = await bcrypt.hash("AndreAsia_123", 10);
  const user = await prisma.user.upsert({
    where: { email: "fakhruzaandrian561@gmail.com" },
    update: {
      password: hashedPassword,
      name: "Andrian Fakhruza",
    },
    create: {
      email: "fakhruzaandrian561@gmail.com",
      password: hashedPassword,
      name: "Andrian Fakhruza",
    },
  });
  console.log("Admin user created/updated:", user.email);

  // 2. Create Categories
  const categoriesData = [
    { name: "Web App", slug: "web-app", type: "website" },
    { name: "Desain Web", slug: "desain-web", type: "website" },
    { name: "UI/UX", slug: "ui-ux", type: "desain" },
    { name: "Identitas Visual", slug: "identitas-visual", type: "desain" },
  ];

  const categories = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categories[cat.slug] = created;
  }
  console.log("Categories seeded");

  // 3. Create Realistic Projects
  const projectsData = [
    {
      title: "Nusantara Capital Dashboard",
      slug: "nusantara-capital-dashboard",
      summary: "Platform analitik keuangan terdesentralisasi dengan visualisasi data densitas tinggi dan performa 60fps.",
      categoryId: categories["web-app"].id,
      tags: "Fintech, Dashboard, Design System, Data Viz",
      role: "Lead Product Designer & Frontend Dev",
      tools: "Next.js, TypeScript, Tailwind CSS, TanStack Query, Framer Motion",
      liveUrl: "https://nusantara-capital.example.com",
      repoUrl: "https://github.com/andrian/nusantara-dashboard",
      featured: true,
      status: "published",
      order: 1,
      cover: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80",
      gallery: JSON.stringify([
        {
          url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80",
          caption: "Overview tampilan dashboard utama dengan mode kontras tinggi",
        },
        {
          url: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1600&q=80",
          caption: "Modul analitik likuiditas dan riwayat aliran kas multi-aset",
        },
        {
          url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80",
          caption: "Sistem komponen UI dan token warna desain finansial",
        },
      ]),
      content: `## Latar Belakang & Masalah
Pasar keuangan modern bergerak sangat cepat, namun trader institusional seringkali harus berhadapan dengan antarmuka kuno yang lambat, sarat beban kognitif tinggi, dan sulit dikustomisasi. Nusantara Capital membutuhkan konsol analitik baru yang sanggup menyajikan ribuan data point per detik tanpa lag, dengan keterbacaan tipografi kelas atas.

## Pendekatan & Proses
1. **Audit Kognitif & Observasi Pengguna:** Mengamati alur kerja 14 trader aktif untuk memetakan hierarki informasi kritis saat fluktuasi pasar tinggi.
2. **Fondasi Tipografi & Sistem Token:** Mengembangkan palet warna monokromatik dengan aksen rust tajam hanya untuk sinyal eksekusi penting, dipadukan font tabular numerals untuk angka desimal.
3. **Optimasi Rendering:** Memisahkan state streaming berfrekuensi tinggi menggunakan virtualisasi tabel dan Canvas overlay.

## Solusi & Hasil
- **Peningkatan Efisiensi Transaksi:** Waktu rata-rata trader dalam mengonfirmasi pesanan menurun sebesar 38%.
- **Zero Stutter:** Latensi pembaruan chart dipangkas hingga di bawah 16ms (mencapai performa murni 60fps).
- **Skalabilitas Desain:** Lebih dari 80 komponen UI modular dirilis dalam design system internal.`,
    },
    {
      title: "Karsa Audio — Spatial Player",
      slug: "karsa-audio-spatial-player",
      summary: "Aplikasi pemutar audio spasial minimalis untuk penikmat musik ambient dan desainer suara independen.",
      categoryId: categories["ui-ux"].id,
      tags: "Mobile App, Audio, Interaction Design, Minimalist",
      role: "Solo UI/UX Designer & Prototyper",
      tools: "Figma, React Native, Web Audio API, Tailwind CSS",
      liveUrl: "https://karsaaudio.example.com",
      repoUrl: "https://github.com/andrian/karsa-audio",
      featured: true,
      status: "published",
      order: 2,
      cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1600&q=80",
      gallery: JSON.stringify([
        {
          url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1600&q=80",
          caption: "Tampilan Now Playing dengan visualisator spektrum gelombang halus",
        },
        {
          url: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1600&q=80",
          caption: "Koleksi album dan navigasi gesture-driven satu tangan",
        },
      ]),
      content: `## Latar Belakang & Masalah
Layanan streaming raksasa saat ini terlalu dipenuhi banner promosi, podcast rekomendasi paksa, dan tata letak yang berisik. Karsa Audio lahir dari kerinduan terhadap ruang mendengarkan yang murni, hening, dan intim.

## Pendekatan & Proses
- Mengeliminasi tombol-tombol yang tidak esensial; interaksi volume dan scrubbing frekuensi digantikan oleh gestur taktil fluid.
- Merancang dynamic ambient backdrop yang bereaksi secara organik terhadap dominasi warna cover album tanpa efek blur murahan.
- Menguji micro-haptic feedback untuk memberikan rasa putaran analog pada slider digital.

## Hasil
- Meraih 50.000+ unduhan pada rilis beta publik.
- Dinominasikan pada Awwwards Mobile Excellence dan featured di beberapa media kurasi desain internasional.`,
    },
    {
      title: "Studio Arkha — Architectural Portfolio",
      slug: "studio-arkha-architecture",
      summary: "Website portofolio editorial untuk firma arsitektur kontemporer dengan tata letak asimetris dan navigasi spasial.",
      categoryId: categories["desain-web"].id,
      tags: "Editorial, Architecture, Web Development, Micro-interactions",
      role: "Creative Director & Web Developer",
      tools: "Next.js, Tailwind CSS, Framer Motion, Lenis Smooth Scroll",
      liveUrl: "https://studioarkha.example.com",
      repoUrl: null,
      featured: true,
      status: "published",
      order: 3,
      cover: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
      gallery: JSON.stringify([
        {
          url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
          caption: "Hero section proyek residensial dengan grid tipografi Swiss",
        },
        {
          url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80",
          caption: "Detail studi material dan denah arsitektur interaktif",
        },
      ]),
      content: `## Latar Belakang & Masalah
Studio Arkha mengerjakan karya arsitektur tropis modern yang sarat presisi proporsi ruang dan materialitas beton-kayu. Namun website portofolio lama mereka terasa generik dan datar, gagal menyampaikan kemegahan tekstur ruang.

## Pendekatan & Proses
- Menggunakan pendekatan majalah arsitektur fisik: grid asimetris 12-kolom dengan whitespace lega yang sengaja dibiarkan bernapas.
- Transisi halaman halus tanpa flicker menggunakan App Router Next.js dan shared element zoom.
- Optimasi gambar resolusi tinggi dengan kompresi WebP/AVIF multi-tier untuk memastikan skor LCP tetap di bawah 1.8 detik.

## Hasil
- Inkuiri klien komersial bertiket tinggi meningkat 250% dalam dua kuartal pertama.
- Skor Google PageSpeed 98/100 di Desktop dan 94/100 di Mobile.`,
    },
    {
      title: "Alur — Collaborative Task Canvas",
      slug: "alur-collaborative-canvas",
      summary: "Kanvas manajemen tugas berbasis spasial tanpa batas untuk tim desain produk jarak jauh.",
      categoryId: categories["web-app"].id,
      tags: "Web App, SaaS, Realtime, Productivity",
      role: "Frontend Architect & Design Lead",
      tools: "React, TypeScript, Tailwind CSS, WebSockets, Canvas API",
      liveUrl: "https://alurapp.example.com",
      repoUrl: "https://github.com/andrian/alur-canvas",
      featured: false,
      status: "published",
      order: 4,
      cover: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1600&q=80",
      gallery: JSON.stringify([
        {
          url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1600&q=80",
          caption: "Workspace kanvas tak terbatas dengan multi-kursor aktif",
        },
      ]),
      content: `## Latar Belakang & Masalah
Tim kreatif seringkali frustrasi dengan papan Kanban konvensional yang kaku. Gagasan desain tidak selalu mengalir linier dari kiri ke kanan.

## Pendekatan & Proses
- Mendesain pengalaman kanvas bebas dengan zoom semantik tingkat tinggi.
- Mengimplementasikan sinkronisasi kursor multi-pengguna dengan latensi ultra-rendah.
- Menguji pintasan keyboard cepat untuk mempercepat alur kerja pengguna mahir (power-users).

## Hasil
- Diadopsi oleh lebih dari 15 agensi desain ternama di Asia Tenggara.
- Skor kepuasan pengguna (NPS) mencapai 72.`,
    },
    {
      title: "Kopi Seduh Identity & Packaging",
      slug: "kopi-seduh-identity",
      summary: "Identitas visual dan sistem kemasan kopi artisan nusantara yang menggabungkan aksara lokal dengan estetika modern.",
      categoryId: categories["identitas-visual"].id,
      tags: "Branding, Packaging, Typography, Print",
      role: "Brand Designer",
      tools: "Illustrator, Photoshop, InDesign",
      liveUrl: null,
      repoUrl: null,
      featured: false,
      status: "published",
      order: 5,
      cover: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1600&q=80",
      gallery: JSON.stringify([
        {
          url: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1600&q=80",
          caption: "Seri kemasan kopi drip bag edisi single origin Flores",
        },
      ]),
      content: `## Latar Belakang & Masalah
Kopi Seduh adalah roastery spesialis kopi lokal yang ingin memperluas jangkauan ke pasar ritel premium internasional tanpa kehilangan akar budaya Nusantara.

## Pendekatan & Proses
- Meneliti motif ukiran tradisional dan menyaringnya menjadi geometri minimalis modern.
- Menentukan palet warna tanah (earthy warm tones) dengan foil stamping perunggu ramah lingkungan.

## Hasil
- Penjualan kemasan ritel meningkat 180% pada kuartal pertama.`,
    },
  ];

  for (const proj of projectsData) {
    await prisma.project.upsert({
      where: { slug: proj.slug },
      update: proj,
      create: proj,
    });
  }
  console.log("Projects seeded");

  // 4. Create Blog Posts
  const postsData = [
    {
      title: "Mengapa Portofolio Desainer Tidak Boleh Menggunakan Template AI Generik",
      slug: "portofolio-tanpa-template-ai-generik",
      excerpt: "Refleksi mendalam tentang pentingnya tipografi berkarakter, studi kasus berbasis narasi, dan mengapa kartu seragam gradien ungu justru mengikis kredibilitas desainer.",
      cover: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1600&q=80",
      tags: "Desain, Opini, Portofolio, UX",
      status: "published",
      readingTime: "6 min",
      content: `Sebagai desainer atau engineer, portofolio bukan sekadar daftar tautan karya—ia adalah pernyataan filosofis Anda tentang bagaimana Anda memandang estetika, hierarki, dan fungsionalitas.

Namun jika Anda memperhatikan lanskap web belakangan ini, ada gelombang keseragaman yang menjemukan:
- Gradien ungu-ke-biru neon yang identik di setiap hero section.
- Kartu dengan glassmorphism tebal dan border menyala yang mengalihkan perhatian dari konten karya itu sendiri.
- Teks pembuka generik yang hampir selalu berbunyi *"Crafting intuitive digital experiences with passion"*.

### Tipografi sebagai Pembeda Utama
Jika Anda menghapus warna aksen dan ikon dekoratif, apakah website Anda masih memiliki karakter? 

Tipografi yang baik tidak membutuhkan trik visual murahan. Memilih pasangan typeface yang tepat—misalnya font display berkarakter kuat yang dipadukan dengan teks sans-serif dengan legibilitas tinggi—memberikan ritme editorial yang matang dan percaya diri.

### Karya sebagai Pusat Perhatian, Bukan Dekorasi
Tujuan utama pengunjung (klien atau tim recruiter) adalah melihat **bagaimana Anda berpikir**. Mereka ingin melihat:
1. Apa masalah nyata yang dihadapi bisnis atau pengguna?
2. Kompromi teknis atau desain apa yang Anda buat?
3. Apa bukti terukur bahwa solusi Anda berhasil?

Jika kartu proyek Anda terlalu kecil karena tertutup blob animasi dan efek blur yang berat, Anda sedang merugikan karya terbaik Anda sendiri.

### Kesimpulan
Buatlah website yang tenang, deliberate, dan berakar pada konten nyata. Biarkan karya Anda yang berbicara paling lantang.`,
    },
    {
      title: "Membangun Design System yang Bertahan Lama di Next.js & Tailwind",
      slug: "design-system-nextjs-tailwind",
      excerpt: "Panduan praktis menstrukturkan token warna, komposisi tipografi skala fluid, dan komponen UI yang fleksibel tanpa terjebak over-engineering.",
      cover: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1600&q=80",
      tags: "Frontend, Design System, Tailwind, Next.js",
      status: "published",
      readingTime: "8 min",
      content: `Banyak tim memulai proyek dengan ambisi membangun design system raksasa seperti Polaris atau Carbon, hanya untuk kemudian tenggelam dalam abstraksi berlebih sebelum produk pertama mereka sempat dirilis ke publik.

Berikut adalah pendekatan pragmatis yang saya terapkan dalam membangun fondasi desain sistem untuk proyek skala menengah ke atas:

### 1. Desain Token yang Berorientasi Semantik
Hindari memberi nama warna berdasarkan warna fisiknya semata. Alih-alih:
\`\`\`css
/* Hindari */
--color-blue-500: #2563eb;

/* Gunakan Token Semantik */
--color-action-primary: #D84315;
--color-surface-elevated: #FFFFFF;
--color-border-subtle: #E6E3DB;
\`\`\`

Dengan token semantik, implementasi Dark Mode menjadi sangat elegan dan tidak memerlukan puluhan perkondisian manual di setiap komponen.

### 2. Komposisi Komponen over Konfigurasi Kompleks
Alih-alih membuat satu komponen \`<Button />\` dengan 25 props berbeda, pecah menjadi pola komposisi yang dapat diprediksi:
- Gunakan utility helper seperti \`clsx\` dan \`tailwind-merge\` untuk menggabungkan class dengan aman tanpa konflik urutan CSS.
- Manfaatkan Radix Primitives untuk komponen interaktif yang membutuhkan aksesibilitas (a11y) tinggi seperti Dialog, Dropdown, dan Tooltip.

### 3. Jaga Bundle Size Tetap Ringan
Pilihlah library animasi dengan bijak. Gunakan CSS transitions untuk interaksi mikro sederhana (hover, focus), dan simpan Framer Motion untuk transisi layout yang memang membutuhkan interpolasi fisik yang presisi.`,
    },
    {
      title: "Mikro-Interaksi Bermakna: Keseimbangan Estetika dan Aksesibilitas",
      slug: "mikro-interaksi-dan-aksesibilitas",
      excerpt: "Cara menerapkan animasi UI yang terasa organik dan tetap menghormati preferensi pengguna prefers-reduced-motion.",
      cover: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&q=80",
      tags: "Aksesibilitas, Animasi, Web UX",
      status: "published",
      readingTime: "5 min",
      content: `Animasi di web seringkali disalahartikan sebagai sarana pamer keahlian teknis developer, bukan sebagai alat bantu navigasi kognitif bagi pengguna.

### Kapan Animasi Benar-Benar Membantu?
Animasi yang fungsional memenuhi setidaknya satu dari tiga kriteria ini:
1. **Kontinuitas Spasial:** Menjelaskan dari mana sebuah elemen muncul dan ke mana ia pergi saat ditutup.
2. **Umpan Balik Taktil Segera:** Memberitahu bahwa input pengguna telah diterima (misalnya tombol simpan yang berubah halus menjadi status tersimpan).
3. **Fokus Hierarki:** Mengarahkan pandangan mata ke elemen yang baru saja berubah status.

### Selalu Hormati Prefers-Reduced-Motion
Sebagian pengguna mengalami gangguan vestibular di mana gerakan layar yang berlebihan dapat memicu pusing atau mual. Di Tailwind dan CSS modern, kita dapat mengatasinya dengan sangat mudah:

\`\`\`css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
\`\`\`

Desain yang hebat adalah desain yang inklusif dan tidak mengorbankan kenyamanan siapa pun.`,
    },
  ];

  for (const post of postsData) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
  }
  console.log("Blog posts seeded");

  // 5. Create Sample Contact Message
  const existingMessage = await prisma.message.findFirst();
  if (!existingMessage) {
    await prisma.message.create({
      data: {
        name: "Rian Pratama",
        email: "rian@tokokreatif.id",
        subject: "Kolaborasi Redesign Platform E-Commerce",
        body: "Halo Andrian, saya sangat terkesan dengan studi kasus Nusantara Capital. Kami saat ini sedang merencanakan redesign total platform e-commerce kami dan ingin mendiskusikan kemungkinan kolaborasi untuk kuartal mendatang. Kapan waktu yang baik untuk call santai?",
        isRead: false,
      },
    });
    console.log("Sample message created");
  }

  // 6. Seed About Profile
  const existingProfile = await prisma.aboutProfile.findFirst();
  if (!existingProfile) {
    await prisma.aboutProfile.create({
      data: {
        name: "Andrian Fakhruza",
        tagline: "Web Developer & UI Designer berbasis di Lhokseumawe, Aceh.",
        bio1: "Saya merupakan lulusan Teknik Informatika dari Politeknik Negeri Lhokseumawe dengan ketertarikan dan pengalaman di bidang teknologi, khususnya Web Development dan UI Design.",
        bio2: "Saya memiliki kemampuan dalam membangun website serta merancang antarmuka pengguna yang modern, responsif, dan mudah digunakan. Saya memiliki semangat belajar yang tinggi, mampu bekerja secara efektif dalam tim maupun secara mandiri, serta terbuka terhadap perkembangan dan tantangan teknologi.",
        location: "Lhokseumawe, Aceh",
        cvUrl: "/cv-andrian-resume.pdf",
      },
    });
    console.log("About profile seeded");
  }

  // 7. Seed Experiences
  const existingExp = await prisma.experience.findFirst();
  if (!existingExp) {
    const experiencesData = [
      {
        period: "Pendidikan & Proyek",
        role: "Teknik Informatika",
        company: "Politeknik Negeri Lhokseumawe",
        description: "Mempelajari rekayasa perangkat lunak, algoritma, pemrograman web, pengolahan data, dan machine learning dengan fokus pada implementasi solusi teknologi praktis dan tepat guna.",
        order: 1,
      },
      {
        period: "Pengembangan Web & UI",
        role: "Web Developer & UI Designer",
        company: "Proyek Mandiri & Kolaborasi",
        description: "Merancang antarmuka pengguna yang intuitif, modern, dan responsif serta membangun aplikasi website performa tinggi menggunakan Next.js, React, dan Tailwind CSS.",
        order: 2,
      },
    ];
    for (const exp of experiencesData) {
      await prisma.experience.create({ data: exp });
    }
    console.log("Experiences seeded");
  }

  // 8. Seed Capabilities (Hard Skills & Soft Skills)
  await prisma.capability.deleteMany({});
  const capabilitiesData = [
    {
      title: "Hard Skills & Alat Teknis",
      skills: "Python\nFigma & UI/UX Design\nNext.js 15 & React\nTypeScript & JavaScript\nTailwind CSS\nEditing Video\nContent Creation\nMicrosoft Office\nREST API & Prisma ORM\nGit & Version Control",
      order: 1,
    },
    {
      title: "Soft Skills & Kolaborasi",
      skills: "Manajemen Waktu\nKemampuan Berkomunikasi\nDisiplin dan Bertanggung Jawab\nKemampuan Berkolaborasi\nKemampuan Berorganisasi\nProblem Solving & Berpikir Kritis\nAdaptabilitas & Kemauan Belajar",
      order: 2,
    },
  ];
  for (const cap of capabilitiesData) {
    await prisma.capability.create({ data: cap });
  }
  console.log("Capabilities updated");

  // 9. Seed Education
  await prisma.education.deleteMany({});
  const educationsData = [
    {
      institution: "Politeknik Negeri Lhokseumawe",
      degree: "Sarjana Terapan Teknik Informatika",
      period: "Agustus 2022 – Agustus 2026",
      score: "IPK: 3,67 / 4,00",
      description: "Fokus pada rekayasa perangkat lunak, pemrograman web modern, struktur data, pengolahan basis data, dan kecerdasan buatan.",
      order: 1,
    },
    {
      institution: "SMA Negeri Modal Bangsa Arun",
      degree: "MIPA / Sekolah Unggulan",
      period: "Juli 2019 – Mei 2022",
      score: "Nilai Akhir: 93,62",
      description: "Aktif dalam organisasi kepemimpinan sekolah dan pengembangan potensi akademik sains & teknologi.",
      order: 2,
    },
  ];
  for (const edu of educationsData) {
    await prisma.education.create({ data: edu });
  }
  console.log("Educations seeded");

  // 10. Seed Organizations
  await prisma.organization.deleteMany({});
  const organizationsData = [
    {
      role: "Ketua Bagian Perlengkapan dan Dekorasi",
      organization: "Pormatik (Pekan Olahraga & Seni Mahasiswa Informatika)",
      period: "2023",
      description: "• Merencanakan dan mengatur segala kebutuhan perlengkapan dan dekorasi untuk acara, termasuk pemilihan tema dan pengadaan peralatan.\n• Mengelola anggaran yang dialokasikan untuk perlengkapan dan dekorasi.\n• Memimpin dan mengkoordinasi tim dalam persiapan dan pelaksanaan dekorasi serta perlengkapan acara.",
      order: 1,
    },
    {
      role: "Ketua Palang Merah Remaja",
      organization: "SMA Negeri Modal Bangsa Arun",
      period: "2021 – 2022",
      description: "• Memimpin dan mengelola organisasi PMR, termasuk pembagian tugas dan pelatihan anggota.\n• Mengawasi pelaksanaan kegiatan dan memberikan pertolongan saat diperlukan di berbagai acara sekolah.\n• Menginisiasi latihan bersama dengan sekolah lain untuk bertukar pengalaman dan mempererat hubungan antar sekolah.",
      order: 2,
    },
    {
      role: "Anggota Divisi DigiHub",
      organization: "Komunitas Mahasiswa IT (Komit) PNL",
      period: "2024 – Sekarang",
      description: "• Bertanggung jawab dalam menyusun caption kreatif dan informatif untuk setiap konten yang dipublikasikan di media sosial komunitas.\n• Aktif terlibat dalam seluruh kegiatan Komit, baik sebagai peserta maupun tim pelaksana.",
      order: 3,
    },
  ];
  for (const org of organizationsData) {
    await prisma.organization.create({ data: org });
  }
  console.log("Organizations seeded");

  console.log("Seeding completed successfully!");

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
