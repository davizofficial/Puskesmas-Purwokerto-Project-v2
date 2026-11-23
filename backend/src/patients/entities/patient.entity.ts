export class Patient {
  id: string;
  nomorAntrean: number;
  nama: string;
  nik: string;
  email?: string;
  telepon: string;
  alamat: string;
  jenisKelamin: 'Laki-laki' | 'Perempuan';
  tanggalLahir: string;
  poli: string;
  keluhan: string;
  waktuDaftar: string;
  status: 'Menunggu' | 'Sedang Diperiksa' | 'Selesai';
  aktif: boolean;
  createdAt: Date;
}
