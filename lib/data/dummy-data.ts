export interface Announcement {
  id: string
  title: string
  content: string
  date: string
  author: string
  status: "draft" | "published"
  created_at: string
  updated_at: string
}

export interface GalleryItem {
  id: string
  title: string
  description: string
  image_url: string
  category: string
  created_at: string
  updated_at: string
}

export interface Staff {
  id: string
  name: string
  position: string
  department: string
  email: string
  phone: string
  image_url: string
  created_at: string
  updated_at: string
}

export interface Extracurricular {
  id: string
  name: string
  description: string
  instructor: string
  schedule: string
  image_url: string
  created_at: string
  updated_at: string
}

// Dummy data
export const dummyAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "Pengumuman Libur Semester",
    content: "Libur semester akan dimulai pada tanggal 15 Desember 2024 dan berakhir pada tanggal 8 Januari 2025.",
    date: "2024-12-01",
    author: "Admin Sekolah",
    status: "published",
    created_at: "2024-12-01T10:00:00Z",
    updated_at: "2024-12-01T10:00:00Z",
  },
  {
    id: "2",
    title: "Pendaftaran Ekstrakurikuler",
    content: "Pendaftaran ekstrakurikuler untuk semester genap dibuka mulai tanggal 10 Januari 2025.",
    date: "2024-12-05",
    author: "Koordinator Ekskul",
    status: "published",
    created_at: "2024-12-05T09:00:00Z",
    updated_at: "2024-12-05T09:00:00Z",
  },
]

export const dummyGallery: GalleryItem[] = [
  {
    id: "1",
    title: "Upacara Bendera",
    description: "Upacara bendera setiap hari Senin",
    image_url: "/upacara-bendera-sekolah.jpg",
    category: "Kegiatan Rutin",
    created_at: "2024-12-01T10:00:00Z",
    updated_at: "2024-12-01T10:00:00Z",
  },
  {
    id: "2",
    title: "Lomba Sains",
    description: "Kompetisi sains tingkat sekolah",
    image_url: "/lomba-sains-sekolah.jpg",
    category: "Kompetisi",
    created_at: "2024-12-02T10:00:00Z",
    updated_at: "2024-12-02T10:00:00Z",
  },
]

export const dummyStaff: Staff[] = [
  {
    id: "1",
    name: "Dr. Ahmad Wijaya",
    position: "Kepala Sekolah",
    department: "Manajemen",
    email: "ahmad.wijaya@sekolah.edu",
    phone: "081234567890",
    image_url: "/kepala-sekolah-pria.jpg",
    created_at: "2024-12-01T10:00:00Z",
    updated_at: "2024-12-01T10:00:00Z",
  },
  {
    id: "2",
    name: "Siti Nurhaliza, S.Pd",
    position: "Guru Matematika",
    department: "MIPA",
    email: "siti.nurhaliza@sekolah.edu",
    phone: "081234567891",
    image_url: "/guru-wanita-matematika.jpg",
    created_at: "2024-12-01T10:00:00Z",
    updated_at: "2024-12-01T10:00:00Z",
  },
]

export const dummyExtracurriculars: Extracurricular[] = [
  {
    id: "1",
    name: "Basket",
    description: "Ekstrakurikuler olahraga basket untuk mengembangkan kemampuan fisik dan kerjasama tim",
    instructor: "Budi Santoso, S.Pd",
    schedule: "Selasa & Kamis, 15:30-17:00",
    image_url: "/basket-sekolah.jpg",
    created_at: "2024-12-01T10:00:00Z",
    updated_at: "2024-12-01T10:00:00Z",
  },
  {
    id: "2",
    name: "Pramuka",
    description: "Kegiatan kepanduan untuk membentuk karakter dan kepemimpinan siswa",
    instructor: "Rina Sari, S.Pd",
    schedule: "Sabtu, 08:00-11:00",
    image_url: "/pramuka-sekolah.jpg",
    created_at: "2024-12-01T10:00:00Z",
    updated_at: "2024-12-01T10:00:00Z",
  },
]
