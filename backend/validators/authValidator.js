const { z } = require("zod");

const registerSchema = z.object({
  username: z
    .string({ required_error: "Username wajib diisi" })
    .trim()
    .min(3, "Username minimal 3 karakter")
    .max(50, "Username maksimal 50 karakter")
    .regex(/^[a-zA-Z0-9_]+$/, "Username hanya boleh huruf, angka, dan underscore"),
  password: z
    .string({ required_error: "Kata sandi wajib diisi" })
    .min(6, "Kata sandi minimal 6 karakter")
    .max(100, "Kata sandi maksimal 100 karakter"),
  full_name: z
    .string({ required_error: "Nama lengkap wajib diisi" })
    .trim()
    .min(2, "Nama lengkap minimal 2 karakter")
    .max(100, "Nama lengkap maksimal 100 karakter"),
  role: z.enum(["teacher", "admin"]).default("teacher")
});

const loginSchema = z.object({
  username: z
    .string({ required_error: "Username wajib diisi" })
    .trim()
    .min(1, "Username wajib diisi"),
  password: z
    .string({ required_error: "Kata sandi wajib diisi" })
    .min(1, "Kata sandi wajib diisi")
});

module.exports = {
  registerSchema,
  loginSchema
};

