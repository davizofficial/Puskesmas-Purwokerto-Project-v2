import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export const ALLOWED_POLI = [
  'Pemeriksaan Umum',
  'Gigi & Mulut',
  'Imunisasi',
  'Laboratorium',
  'Poli Gigi',
  'Poli Anak',
  'Poli KIA',
] as const;

export const ALLOWED_STATUS = [
  'Menunggu',
  'Sedang Diperiksa',
  'Selesai',
] as const;

/**
 * DTO untuk pendaftaran pasien baru.
 */
export class CreatePatientDto {
  @IsString({ message: 'Nama lengkap harus berupa teks.' })
  @IsNotEmpty({ message: 'Nama lengkap wajib diisi.' })
  @MinLength(3, { message: 'Nama lengkap minimal terdiri dari 3 karakter.' })
  nama: string;

  @IsString({ message: 'NIK harus berupa teks.' })
  @IsNotEmpty({ message: 'NIK wajib diisi.' })
  @Length(16, 16, { message: 'NIK harus berjumlah tepat 16 digit.' })
  nik: string;

  @IsOptional()
  @IsEmail({}, { message: 'Format email tidak valid.' })
  email?: string;

  @IsString({ message: 'Nomor telepon harus berupa teks.' })
  @IsNotEmpty({ message: 'Nomor telepon wajib diisi.' })
  @MinLength(10, { message: 'Nomor telepon minimal 10 digit.' })
  telepon: string;

  @IsString({ message: 'Alamat harus berupa teks.' })
  @IsNotEmpty({ message: 'Alamat lengkap wajib diisi.' })
  alamat: string;

  @IsString({ message: 'Jenis kelamin harus berupa teks.' })
  @IsIn(['Laki-laki', 'Perempuan', 'laki-laki', 'perempuan'], {
    message: 'Jenis kelamin harus Laki-laki atau Perempuan.',
  })
  jenisKelamin: string;

  @IsDateString({}, { message: 'Tanggal lahir harus berformat tanggal ISO (YYYY-MM-DD).' })
  tanggalLahir: string;

  @IsString({ message: 'Poli/layanan harus berupa teks.' })
  @IsIn(ALLOWED_POLI, {
    message: 'Pilihan poli/layanan tidak tersedia di Puskesmas Purwokerto.',
  })
  poli: string;

  @IsOptional()
  @IsString({ message: 'Keluhan harus berupa teks.' })
  keluhan?: string;

  @IsOptional()
  @IsIn(ALLOWED_STATUS, {
    message: 'Status antrean harus Menunggu, Sedang Diperiksa, atau Selesai.',
  })
  status?: 'Menunggu' | 'Sedang Diperiksa' | 'Selesai';

  @IsOptional()
  @IsBoolean({ message: 'Status aktif harus berupa boolean.' })
  aktif?: boolean;
}
