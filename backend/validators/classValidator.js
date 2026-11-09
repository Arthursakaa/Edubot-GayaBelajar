const { z } = require("zod");

const createClassSchema = z.object({
  class_name: z
    .string({ required_error: "Nama kelas wajib diisi" })
    .trim()
    .min(2, "Nama kelas minimal 2 karakter")
    .max(100, "Nama kelas maksimal 100 karakter"),
  grade_level: z
    .string({ required_error: "Tingkat kelas wajib diisi" })
    .trim()
    .min(1, "Tingkat kelas minimal 1 karakter")
    .max(30, "Tingkat kelas maksimal 30 karakter"),
  academic_year: z
    .string({ required_error: "Tahun ajaran wajib diisi" })
    .trim()
    .min(4, "Tahun ajaran minimal 4 karakter (mis. 2025/2026)")
    .max(20, "Tahun ajaran maksimal 20 karakter"),
  class_code: z
    .string()
    .trim()
    .min(3, "Kode kelas minimal 3 karakter")
    .max(20, "Kode kelas maksimal 20 karakter")
    .regex(/^[a-zA-Z0-9_-]+$/, "Kode kelas hanya boleh huruf, angka, strip, atau underscore")
    .optional()
    .nullable()
});

module.exports = {
  createClassSchema
};

