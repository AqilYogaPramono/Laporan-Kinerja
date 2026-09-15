-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Sep 15, 2026 at 02:39 PM
-- Server version: 8.0.30
-- PHP Version: 8.4.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_laporan_kinerja_divisi`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int NOT NULL,
  `nama` varchar(255) NOT NULL,
  `nomor_admin` varchar(255) NOT NULL,
  `kata_sandi` varchar(255) NOT NULL,
  `waktu_dibuat` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `waktu_diedit` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `nama`, `nomor_admin`, `kata_sandi`, `waktu_dibuat`, `waktu_diedit`) VALUES
(1, 'Admin', 'ADM-001', '$2b$10$3eohVZL9o3zPR876ErC7rukGZiNCproGUpmqzsB2HTtQHZ19fzuyu', '2026-09-15 13:58:34', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `dokumen_kinerja`
--

CREATE TABLE `dokumen_kinerja` (
  `id` int NOT NULL,
  `id_laporan_kinerja` int NOT NULL,
  `nama_file` varchar(255) NOT NULL,
  `file` varchar(255) NOT NULL,
  `dibuat_oleh` varchar(255) NOT NULL,
  `dibuat_pada` datetime DEFAULT CURRENT_TIMESTAMP,
  `id_user` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `dokumen_kinerja`
--

INSERT INTO `dokumen_kinerja` (`id`, `id_laporan_kinerja`, `nama_file`, `file`, `dibuat_oleh`, `dibuat_pada`, `id_user`) VALUES
(1, 1, 'Daftar Nasabah Bermasalah', '1789482755188-509128613.pdf', 'Siti Aminah', '2026-09-15 21:32:35', 2),
(2, 1, 'Rekap Kredit Q3\', \'rekap-kredit-q3', '1789482797771-495211292.pdf', 'Budi Santoso', '2026-09-15 21:33:17', 1),
(3, 2, 'Data Stok Barang Aktual', '1789482944995-565826824.pdf', 'Dewi Lestari', '2026-09-15 21:35:45', 4),
(4, 2, 'Grafik Pendapatan Minimarket', '1789482975311-152146075.pdf', 'Agus Pratama', '2026-09-15 21:36:15', 3),
(5, 3, 'Data Anggota Terbaru', '1789483132655-518106484.pdf', 'Hendra Cipta', '2026-09-15 21:38:52', 6),
(6, 3, 'Hasil Penilaian Kinerja', '1789483172483-214774559.pdf', 'Rina Gunawan', '2026-09-15 21:39:32', 5);

-- --------------------------------------------------------

--
-- Table structure for table `laporan_kinerja`
--

CREATE TABLE `laporan_kinerja` (
  `id` int NOT NULL,
  `judul_laporan` varchar(255) NOT NULL,
  `dibuat_oleh` varchar(255) NOT NULL,
  `dibuat_pada` datetime DEFAULT CURRENT_TIMESTAMP,
  `terakhir_diedit_pada` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `terakhir_diedit_oleh` varchar(255) DEFAULT NULL,
  `id_user` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `laporan_kinerja`
--

INSERT INTO `laporan_kinerja` (`id`, `judul_laporan`, `dibuat_oleh`, `dibuat_pada`, `terakhir_diedit_pada`, `terakhir_diedit_oleh`, `id_user`) VALUES
(1, 'Laporan Penyaluran Kredit Q3 2026', 'Budi Santoso', '2026-09-15 21:29:38', '2026-09-15 21:33:17', 'Budi Santoso', 1),
(2, 'Laporan Pendapatan Minimarket Koperasi Q3 2026', 'Agus Pratama', '2026-09-15 21:30:14', '2026-09-15 21:36:15', 'Agus Pratama', 3),
(3, 'Laporan Rekrutmen Anggota Baru Koperasi Q3 2026', 'Rina Gunawan', '2026-09-15 21:31:02', '2026-09-15 21:39:32', 'Rina Gunawan', 5);

-- --------------------------------------------------------

--
-- Table structure for table `tim`
--

CREATE TABLE `tim` (
  `id` int NOT NULL,
  `nama_tim` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `tim`
--

INSERT INTO `tim` (`id`, `nama_tim`) VALUES
(3, 'Divisi Keanggotaan & SDM'),
(2, 'Divisi Ritel & Usaha'),
(1, 'Divisi Simpan Pinjam');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `nama` varchar(255) NOT NULL,
  `nomor_pegawai` varchar(255) NOT NULL,
  `jabatan` enum('Ketua','Staf') DEFAULT 'Staf',
  `kata_sandi` varchar(255) NOT NULL,
  `status` enum('Aktif','Non-Aktif','Proses') DEFAULT 'Proses',
  `waktu_dibuat` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `waktu_diedit` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `waktu_diverifikasi` datetime DEFAULT NULL,
  `id_tim` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `nama`, `nomor_pegawai`, `jabatan`, `kata_sandi`, `status`, `waktu_dibuat`, `waktu_diedit`, `waktu_diverifikasi`, `id_tim`) VALUES
(1, 'Budi Santoso', 'PEG-101', 'Ketua', '$2b$10$HPy3NYs4hv7YDgtxmMWIHOs1l.l7A6zrsvNhA.WP.W0ipOYOANbPu', 'Aktif', '2026-09-15 14:06:24', '2026-09-15 21:28:33', '2026-09-15 21:27:50', 1),
(2, 'Siti Aminah', 'PEG-102', 'Staf', '$2b$10$ntD7gK4YEaRj82rjDMStZ.qORB6Rhjz2TqC58gaxUlZ7625gjpuZm', 'Aktif', '2026-09-15 14:07:01', '2026-09-15 21:28:04', '2026-09-15 21:28:05', 1),
(3, 'Agus Pratama', 'PEG-103', 'Ketua', '$2b$10$aMkMyYvCQNTECtG4s6CEDeKoYvexNqBdQbZUpUUlJZHarkrmZiM7G', 'Aktif', '2026-09-15 14:07:44', '2026-09-15 21:28:43', '2026-09-15 21:28:10', 2),
(4, 'Dewi Lestari', 'PEG-104', 'Staf', '$2b$10$nYwAw/PQpeg2R/Ff92KGbOWIsScl5xG3kHy71hc6.O2T763N7bjPi', 'Aktif', '2026-09-15 21:17:34', '2026-09-15 21:28:16', '2026-09-15 21:28:17', 2),
(5, 'Rina Gunawan', 'PEG-105', 'Ketua', '$2b$10$Pn/ZCaxdjG987kSO1j0sUeYLpTbPOKoQT4eF7424A8.0IYS5DnC4m', 'Aktif', '2026-09-15 21:21:18', '2026-09-15 21:28:50', '2026-09-15 21:27:43', 3),
(6, 'Hendra Cipta', 'PEG-106', 'Staf', '$2b$10$BY1RlzPVTNNdseBWSc4U3OgZzDP5CLLhDQYyi76GyE.vpnwrMiUQu', 'Aktif', '2026-09-15 21:21:53', '2026-09-15 21:22:11', '2026-09-15 21:22:11', 3);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nomor_admin` (`nomor_admin`);

--
-- Indexes for table `dokumen_kinerja`
--
ALTER TABLE `dokumen_kinerja`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_laporan_kinerja` (`id_laporan_kinerja`);

--
-- Indexes for table `laporan_kinerja`
--
ALTER TABLE `laporan_kinerja`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_user` (`id_user`);

--
-- Indexes for table `tim`
--
ALTER TABLE `tim`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nama_tim` (`nama_tim`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nomor_pegawai` (`nomor_pegawai`),
  ADD KEY `id_tim` (`id_tim`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `dokumen_kinerja`
--
ALTER TABLE `dokumen_kinerja`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `laporan_kinerja`
--
ALTER TABLE `laporan_kinerja`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tim`
--
ALTER TABLE `tim`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `dokumen_kinerja`
--
ALTER TABLE `dokumen_kinerja`
  ADD CONSTRAINT `dokumen_kinerja_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `dokumen_kinerja_ibfk_2` FOREIGN KEY (`id_laporan_kinerja`) REFERENCES `laporan_kinerja` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `laporan_kinerja`
--
ALTER TABLE `laporan_kinerja`
  ADD CONSTRAINT `laporan_kinerja_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`id_tim`) REFERENCES `tim` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
