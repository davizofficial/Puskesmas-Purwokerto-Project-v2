import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto.js';
import { UpdatePatientDto } from './dto/update-patient.dto.js';
import { Patient } from './entities/patient.entity.js';

const createInitialPatients = (): Patient[] => [
  {
    id: 'PS-1042',
    nomorAntrean: 1,
    nama: 'Budi Santoso',
    nik: '3302101508920001',
    email: 'budi.santoso@example.com',
    telepon: '081234567890',
    alamat: 'Jln. Jend. Soedirman No. 12, Purwokerto',
    jenisKelamin: 'Laki-laki',
    tanggalLahir: '1992-08-15',
    poli: 'Pemeriksaan Umum',
    keluhan: 'Demam tinggi dan flu batuk berdahak sejak 3 hari',
    waktuDaftar: '08:15 WIB',
    status: 'Sedang Diperiksa',
    aktif: true,
    createdAt: new Date('2026-11-23T08:15:00+07:00'),
  },
  {
    id: 'PS-1043',
    nomorAntrean: 2,
    nama: 'Siti Rahmawati',
    nik: '3302104512950003',
    email: 'siti.rahmawati@example.com',
    telepon: '085678901234',
    alamat: 'Jln. Gatot Subroto No. 45, Purwokerto',
    jenisKelamin: 'Perempuan',
    tanggalLahir: '1995-12-05',
    poli: 'Gigi & Mulut',
    keluhan: 'Gigi geraham belakang berlubang dan nyeri saat makan',
    waktuDaftar: '08:30 WIB',
    status: 'Menunggu',
    aktif: true,
    createdAt: new Date('2026-11-23T08:30:00+07:00'),
  },
  {
    id: 'PS-1044',
    nomorAntrean: 3,
    nama: 'Muhammad Alif Pratama',
    nik: '3302102003180002',
    email: 'alif.pratama@example.com',
    telepon: '081398765432',
    alamat: 'Jln. HR Bunyamin No. 88, Purwokerto',
    jenisKelamin: 'Laki-laki',
    tanggalLahir: '2018-03-20',
    poli: 'Imunisasi',
    keluhan: 'Pemeriksaan imunisasi rutin & pemantauan gizi balita',
    waktuDaftar: '08:45 WIB',
    status: 'Menunggu',
    aktif: true,
    createdAt: new Date('2026-11-23T08:45:00+07:00'),
  },
  {
    id: 'PS-1045',
    nomorAntrean: 4,
    nama: 'Dewi Lestari',
    nik: '3302105407900004',
    email: 'dewi.lestari@example.com',
    telepon: '082134567891',
    alamat: 'Jln. Dr. Angka No. 34, Purwokerto',
    jenisKelamin: 'Perempuan',
    tanggalLahir: '1990-07-14',
    poli: 'Pemeriksaan Umum',
    keluhan: 'Kontrol tensi darah dan keluhan migrain berkala',
    waktuDaftar: '07:55 WIB',
    status: 'Selesai',
    aktif: false,
    createdAt: new Date('2026-11-23T07:55:00+07:00'),
  },
];

@Injectable()
export class PatientsService {
  private patients: Patient[] = createInitialPatients();
  private sequenceCounter = 1046;

  private normalizeGender(gender: string): 'Laki-laki' | 'Perempuan' {
    return gender.toLowerCase() === 'perempuan' ? 'Perempuan' : 'Laki-laki';
  }

  private formatWaktuSekarang(): string {
    const now = new Date();
    const jam = String(now.getHours()).padStart(2, '0');
    const menit = String(now.getMinutes()).padStart(2, '0');
    return `${jam}:${menit} WIB`;
  }

  create(createPatientDto: CreatePatientDto): Patient {
    const duplicateActive = this.patients.find(
      (p) => p.nik === createPatientDto.nik && p.status !== 'Selesai',
    );
    if (duplicateActive) {
      throw new ConflictException(
        `Pasien dengan NIK ${createPatientDto.nik} masih terdaftar dalam antrean aktif (${duplicateActive.id}).`,
      );
    }

    const nextId = `PS-${this.sequenceCounter++}`;
    const nextNomor =
      this.patients.length > 0
        ? Math.max(...this.patients.map((p) => p.nomorAntrean)) + 1
        : 1;

    const newPatient: Patient = {
      id: nextId,
      nomorAntrean: nextNomor,
      nama: createPatientDto.nama.trim(),
      nik: createPatientDto.nik.trim(),
      email: createPatientDto.email?.trim() || undefined,
      telepon: createPatientDto.telepon.trim(),
      alamat: createPatientDto.alamat.trim(),
      jenisKelamin: this.normalizeGender(createPatientDto.jenisKelamin),
      tanggalLahir: createPatientDto.tanggalLahir,
      poli: createPatientDto.poli,
      keluhan:
        createPatientDto.keluhan?.trim() ||
        'Pemeriksaan umum dan konsultasi dokter',
      waktuDaftar: this.formatWaktuSekarang(),
      status: createPatientDto.status ?? 'Menunggu',
      aktif: createPatientDto.aktif ?? true,
      createdAt: new Date(),
    };

    this.patients.unshift(newPatient);
    return newPatient;
  }

  findAll(): Patient[] {
    return this.patients;
  }

  findOne(id: string): Patient {
    const patient = this.patients.find((p) => p.id === id);
    if (!patient) {
      throw new NotFoundException(
        `Data pasien dengan nomor antrean ${id} tidak ditemukan.`,
      );
    }
    return patient;
  }

  update(id: string, updatePatientDto: UpdatePatientDto): Patient {
    const index = this.patients.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(
        `Data pasien dengan nomor antrean ${id} tidak ditemukan.`,
      );
    }

    const existing = this.patients[index];

    if (existing.status === 'Selesai' && updatePatientDto.status === 'Menunggu') {
      throw new BadRequestException(
        `Pasien ${id} yang sudah berstatus Selesai tidak dapat dikembalikan ke status Menunggu.`,
      );
    }

    if (updatePatientDto.nik && updatePatientDto.nik !== existing.nik) {
      const nikUsed = this.patients.find(
        (p) =>
          p.id !== id &&
          p.nik === updatePatientDto.nik &&
          p.status !== 'Selesai',
      );
      if (nikUsed) {
        throw new ConflictException(
          `NIK ${updatePatientDto.nik} sudah digunakan pada antrean aktif lain.`,
        );
      }
    }

    const updatedStatus = updatePatientDto.status ?? existing.status;

    const updated: Patient = {
      ...existing,
      ...updatePatientDto,
      jenisKelamin: updatePatientDto.jenisKelamin
        ? this.normalizeGender(updatePatientDto.jenisKelamin)
        : existing.jenisKelamin,
      status: updatedStatus,
      aktif:
        updatePatientDto.aktif !== undefined
          ? updatePatientDto.aktif
          : updatedStatus !== 'Selesai',
    };

    this.patients[index] = updated;
    return updated;
  }

  remove(id: string): { message: string; deleted: Patient } {
    const index = this.patients.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(
        `Data pasien dengan nomor antrean ${id} tidak ditemukan.`,
      );
    }

    const [deleted] = this.patients.splice(index, 1);
    return {
      message: `Data pasien ${id} (${deleted.nama}) berhasil dihapus.`,
      deleted,
    };
  }

  clearAll(): { message: string } {
    this.patients = [];
    return { message: 'Seluruh data antrean pasien telah dikosongkan.' };
  }

  resetSampleData(): Patient[] {
    this.patients = createInitialPatients();
    this.sequenceCounter = 1046;
    return this.patients;
  }
}
