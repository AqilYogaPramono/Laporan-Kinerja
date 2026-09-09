CREATE TABLE admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    nomor_admin VARCHAR(255) UNIQUE NOT NULL,
    kata_sandi VARCHAR(255) NOT NULL,
    waktu_dibuat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    waktu_diedit DATETIME ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE tim (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_tim VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE manajer (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    nomor_pegawai VARCHAR(255) UNIQUE NOT NULL,
    kata_sandi VARCHAR(255) NOT NULL,
    status ENUM('Aktif', 'Non-Aktif', 'Proses') DEFAULT 'Proses',
    waktu_dibuat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    waktu_diedit DATETIME ON UPDATE CURRENT_TIMESTAMP,
    waktu_diverifikasi DATETIME,
    id_tim INT,
    FOREIGN KEY (id_tim) REFERENCES tim(id)
);

CREATE TABLE karyawan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    foto_profil VARCHAR(255),
    nomor_pegawai VARCHAR(255) UNIQUE NOT NULL,
    nomor_whatsapp VARCHAR(255) UNIQUE NOT NULL,
    kata_sandi VARCHAR(255) NOT NULL,
    status ENUM('Aktif', 'Non-Aktif', 'Proses') DEFAULT 'Proses',
    waktu_dibuat DATETIME DEFAULT CURRENT_TIMESTAMP,
    waktu_diedit DATETIME ON UPDATE CURRENT_TIMESTAMP,
    waktu_diverifikasi DATETIME,
    id_tim INT,
    FOREIGN KEY (id_tim) REFERENCES tim(id)
);

CREATE TABLE laporan_kinerja (
    id INT AUTO_INCREMENT PRIMARY KEY,
    judul_laporan VARCHAR(255) NOT NULL,
    dibuat_oleh VARCHAR(255) NOT NULL,
    dibuat_pada DATETIME DEFAULT CURRENT_TIMESTAMP,
    terakhir_diedit_pada DATETIME ON UPDATE CURRENT_TIMESTAMP,
    terakhir_diedit_oleh VARCHAR(255),
    id_karyawan INT,
    FOREIGN KEY (id_karyawan) REFERENCES karyawan(id) ON DELETE SET NULL
);

CREATE TABLE dokumen_kinerja (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_laporan_kinerja INT NOT NULL,
    tipe_file ENUM('Dokumen', 'Link'),
    nama_file VARCHAR(255) NOT NULL,
    file VARCHAR(255) NOT NULL,
    dibuat_oleh VARCHAR(255) NOT NULL,
    dibuat_pada DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_karyawan INT,
    FOREIGN KEY (id_karyawan) REFERENCES karyawan(id) ON DELETE SET NULL,
    FOREIGN KEY (id_laporan_kinerja) REFERENCES laporan_kinerja(id) ON DELETE CASCADE
);




