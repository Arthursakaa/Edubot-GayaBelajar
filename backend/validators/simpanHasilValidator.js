const { z } = require("zod");

const simpanHasilSchema = z.object({
  nama: z
    .string({
      required_error: "Nama peserta wajib diisi",
      invalid_type_error: "Nama peserta harus berupa teks"
    })
    .trim()
    .min(1, "Nama peserta tidak boleh kosong")
    .max(100, "Nama peserta maksimal 100 karakter"),

  visual: z
    .number({
      required_error: "Skor visual wajib diisi",
      invalid_type_error: "Skor visual harus berupa angka"
    })
    .int("Skor visual harus berupa bilangan bulat")
    .min(0, "Skor visual minimal 0")
    .max(10, "Skor visual maksimal 10"),

  auditory: z
    .number({
      required_error: "Skor auditory wajib diisi",
      invalid_type_error: "Skor auditory harus berupa angka"
    })
    .int("Skor auditory harus berupa bilangan bulat")
    .min(0, "Skor auditory minimal 0")
    .max(10, "Skor auditory maksimal 10"),

  kinesthetic: z
    .number({
      required_error: "Skor kinesthetic wajib diisi",
      invalid_type_error: "Skor kinesthetic harus berupa angka"
    })
    .int("Skor kinesthetic harus berupa bilangan bulat")
    .min(0, "Skor kinesthetic minimal 0")
    .max(10, "Skor kinesthetic maksimal 10"),

  hasil: z
    .string({
      required_error: "Hasil lokal wajib diisi",
      invalid_type_error: "Hasil lokal harus berupa teks"
    })
    .trim()
    .min(1, "Hasil lokal tidak boleh kosong"),

  student_id: z.number().int().positive().nullable().optional(),
  class_id: z.number().int().positive().nullable().optional(),
  class_code: z.string().trim().max(30).nullable().optional()
});

module.exports = { simpanHasilSchema };

