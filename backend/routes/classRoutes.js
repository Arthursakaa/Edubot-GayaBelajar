const express = require("express");
const {
  getPublicClasses,
  getTeacherClasses,
  createClass,
  deleteClass
} = require("../controllers/classController");
const { requireAuth } = require("../middlewares/authMiddleware");

const router = express.Router();

// Endpoint publik untuk dropdown pilihan kelas saat siswa mulai kuis
router.get("/public", getPublicClasses);

// Endpoint guru untuk mengelola kelas binaan
router.get("/", requireAuth, getTeacherClasses);
router.post("/", requireAuth, createClass);
router.delete("/:id", requireAuth, deleteClass);

module.exports = router;

