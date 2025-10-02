-- Insert sample announcements
INSERT INTO public.announcements (title, content, excerpt, published) VALUES
('Selamat Datang di Tahun Ajaran Baru', 'Kami dengan bangga menyambut seluruh siswa dan orang tua dalam tahun ajaran baru ini. Mari bersama-sama menciptakan lingkungan belajar yang kondusif dan menyenangkan.', 'Sambutan untuk tahun ajaran baru dengan semangat belajar yang tinggi.', true),
('Pendaftaran Ekstrakurikuler Dibuka', 'Pendaftaran untuk berbagai kegiatan ekstrakurikuler telah dibuka. Silakan mendaftar sesuai minat dan bakat masing-masing siswa.', 'Kesempatan untuk mengembangkan bakat melalui kegiatan ekstrakurikuler.', true),
('Ujian Tengah Semester', 'Ujian tengah semester akan dilaksanakan pada minggu depan. Pastikan semua siswa mempersiapkan diri dengan baik.', 'Informasi penting mengenai jadwal ujian tengah semester.', true);

-- Insert sample gallery items
INSERT INTO public.gallery (title, description, category) VALUES
('Kegiatan Belajar Mengajar', 'Suasana pembelajaran yang aktif dan menyenangkan di kelas', 'Akademik'),
('Kegiatan Olahraga', 'Siswa-siswi sedang melakukan kegiatan olahraga di lapangan', 'Olahraga'),
('Kegiatan Seni', 'Pertunjukan seni dari siswa-siswi berbakat', 'Seni');

-- Insert sample extracurriculars
INSERT INTO public.extracurriculars (name, description, teacher_in_charge, schedule, location) VALUES
('Pramuka', 'Kegiatan kepramukaan untuk membentuk karakter dan kepemimpinan siswa', 'Pak Budi Santoso', 'Jumat 14:00-16:00', 'Lapangan Sekolah'),
('Basket', 'Ekstrakurikuler olahraga basket untuk mengembangkan kemampuan fisik dan kerjasama tim', 'Bu Sari Dewi', 'Selasa & Kamis 15:00-17:00', 'Lapangan Basket'),
('Paduan Suara', 'Kegiatan seni musik untuk mengembangkan bakat bernyanyi dan apresiasi musik', 'Bu Maya Indira', 'Rabu 14:00-16:00', 'Ruang Musik');

-- Insert sample staff
INSERT INTO public.staff (name, position, department, email) VALUES
('Dr. Ahmad Wijaya, S.Pd., M.Pd.', 'Kepala Sekolah', 'Manajemen', 'kepala@sekolah.sch.id'),
('Siti Nurhaliza, S.Pd.', 'Guru Matematika', 'Akademik', 'siti@sekolah.sch.id'),
('Budi Santoso, S.Pd.', 'Guru Bahasa Indonesia', 'Akademik', 'budi@sekolah.sch.id'),
('Maya Sari, S.Pd.', 'Guru Bahasa Inggris', 'Akademik', 'maya@sekolah.sch.id');
