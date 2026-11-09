const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
const { registerSchema, loginSchema } = require("../validators/authValidator");

const JWT_SECRET = process.env.JWT_SECRET || "edubot_secret_key_jwt_super_secure_2026";
const TOKEN_EXPIRY = "7d";

/**
 * Helper untuk menandatangani JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      full_name: user.full_name,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );
};

/**
 * Registrasi akun Guru baru
 */
const register = async (req, res, next) => {
  try {
    const parseResult = registerSchema.safeParse(req.body);
    if (!parseResult.success) {
      const messages = parseResult.error.issues.map((i) => i.message);
      return res.status(400).json({
        success: false,
        error: "Validasi registrasi gagal",
        details: messages
      });
    }

    const { username, password, full_name, role } = parseResult.data;

    // 1. Periksa apakah username sudah terdaftar
    db.query(
      "SELECT id FROM users WHERE username = ? LIMIT 1",
      [username],
      async (checkErr, existingUsers) => {
        if (checkErr) {
          return next(checkErr);
        }

        if (existingUsers && existingUsers.length > 0) {
          return res.status(409).json({
            success: false,
            error: "Username sudah digunakan oleh akun lain. Silakan pilih username lain."
          });
        }

        // 2. Hash kata sandi dengan bcrypt (salt 10)
        try {
          const passwordHash = await bcrypt.hash(password, 10);

          // 3. Simpan akun ke database
          db.query(
            "INSERT INTO users (username, password_hash, full_name, role) VALUES (?, ?, ?, ?)",
            [username, passwordHash, full_name, role],
            (insertErr, insertResult) => {
              if (insertErr) {
                return next(insertErr);
              }

              const newUser = {
                id: insertResult.insertId,
                username,
                full_name,
                role
              };

              const token = generateToken(newUser);

              return res.status(201).json({
                success: true,
                message: "Akun guru berhasil didaftarkan!",
                token,
                user: newUser
              });
            }
          );
        } catch (hashError) {
          return next(hashError);
        }
      }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Login akun Guru
 */
const login = async (req, res, next) => {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      const messages = parseResult.error.issues.map((i) => i.message);
      return res.status(400).json({
        success: false,
        error: "Input login tidak lengkap",
        details: messages
      });
    }

    const { username, password } = parseResult.data;

    // Cari user berdasarkan username
    db.query(
      "SELECT id, username, password_hash, full_name, role FROM users WHERE username = ? LIMIT 1",
      [username],
      async (err, rows) => {
        if (err) {
          return next(err);
        }

        if (!rows || rows.length === 0) {
          return res.status(401).json({
            success: false,
            error: "Username atau kata sandi tidak sesuai"
          });
        }

        const user = rows[0];

        // Verifikasi kata sandi
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
          return res.status(401).json({
            success: false,
            error: "Username atau kata sandi tidak sesuai"
          });
        }

        const safeUser = {
          id: user.id,
          username: user.username,
          full_name: user.full_name,
          role: user.role
        };

        const token = generateToken(safeUser);

        return res.json({
          success: true,
          message: `Selamat datang kembali, ${safeUser.full_name}!`,
          token,
          user: safeUser
        });
      }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Verifikasi token aktif & ambil profil user saat ini
 */
const getMe = (req, res) => {
  // req.user disuntikkan oleh authMiddleware
  res.json({
    success: true,
    user: req.user
  });
};

module.exports = {
  register,
  login,
  getMe
};

