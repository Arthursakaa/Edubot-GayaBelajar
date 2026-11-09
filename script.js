// EduBot Gaya Belajar - Interactive Quiz Controller

const questions = [
    { text: "Saat guru menjelaskan pelajaran di depan kelas, aku paling suka...", options: ["Melihat gambar, bagan, atau tulisan di papan tulis", "Mendengarkan penjelasan cerita bapak/ibu guru", "Mencoba dan mempraktikkan langsung pelajarannya"] },
    { text: "Jika belajar di rumah, suasana yang paling bikin aku senang adalah...", options: ["Belajar sambil melihat video edukasi berwarna", "Belajar sambil mendengarkan musik atau suara bacaan", "Belajar sambil bergerak, membuat prakarya, atau bereksperimen"] },
    { text: "Saat menghafal materi pelajaran baru, caraku adalah...", options: ["Membaca catatan sambil menandai dengan spidol warna", "Membaca keras-keras atau mengulang kata-kataku sendiri", "Menulis materi di kertas sambil berjalan-jalan santai"] },
    { text: "Aku paling cepat paham suatu konsep pelajaran jika...", options: ["Ada gambar visual, diagram, atau video yang jelas", "Dijelaskan secara detail lewat tanya jawab seru", "Diberi contoh alat peraga yang bisa aku pegang langsung"] },
    { text: "Saat guru bertanya kuis di kelas, reaksiku biasanya...", options: ["Mengingat-ingat letak catatan di buku pelajaran", "Mengingat suara kalimat yang diucapkan guru tadi", "Langsung ingin maju ke depan dan mencoba mengerjakannya"] },
    { text: "Jika sedang bosan saat istirahat belajar, aku senang...", options: ["Menggambar, mewarnai, atau membaca komik seru", "Mengobrol dan bercanda asik bersama teman-teman", "Berlari-lari, olahraga, atau bermain game aktif"] },
    { text: "Aku paling mudah mengingat informasi baru jika...", options: ["Bentuk dan warnanya menarik perhatian mataku", "Punya nada suara, irama lagu, atau rima yang asik", "Pernah aku lakukan dan rasakan sendiri kegiatannya"] },
    { text: "Saat ada tugas proyek kelompok di sekolah, aku memilih...", options: ["Merancang poster, menggambar, dan menghias tampilan", "Menjadi pembicara presentasi di depan kelas", "Menyiapkan alat peraga dan melakukan demonstrasi"] },
    { text: "Saat belajar kelompok bersama teman-teman, aku cenderung...", options: ["Fokus melihat rangkuman materi di buku catatan", "Aktif mendengarkan dan mendiskusikan topik seru", "Banyak bergerak aktif dan menata perlengkapan belajar"] },
    { text: "Cara belajar yang paling menyenangkan buatku adalah...", options: ["Menonton video animasi dan melihat buku bergambar", "Mendengarkan dongeng sains atau cerita guru", "Bermain tebak peran dan eksperimen langsung"] }
];

let currentQuestion = 0;
let namaPeserta = "";
let selectedAvatar = "ph-robot";
let selectedClassId = null;
const userAnswers = new Array(questions.length).fill(null);
const scores = { visual: 0, auditory: 0, kinesthetic: 0 };

// DOM Elements
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const startBtn = document.getElementById("start-btn");
const namaInput = document.getElementById("nama-input");
const kelasSelect = document.getElementById("kelas-select");
const namaUser = document.getElementById("nama-user");
const userAvatarBadge = document.getElementById("user-avatar-badge");
const avatarButtons = document.querySelectorAll(".avatar-btn");

// Muat daftar kelas publik untuk dipilih siswa
function loadPublicClasses() {
    if (!kelasSelect) return;
    const API_BASE = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.protocol === "file:")
        ? "http://localhost:3000/api"
        : "https://edubot-gayabelajar-production.up.railway.app/api";

    fetch(`${API_BASE}/classes/public`)
        .then(res => res.json())
        .then(data => {
            if (data.success && data.data && data.data.length > 0) {
                data.data.forEach(cls => {
                    const opt = document.createElement("option");
                    opt.value = cls.id;
                    opt.textContent = `${cls.class_name} (${cls.class_code || cls.grade_level})${cls.teacher_name ? ' - ' + cls.teacher_name : ''}`;
                    kelasSelect.appendChild(opt);
                });
            }
        })
        .catch(err => console.warn("Tidak dapat memuat kelas:", err.message));
}
loadPublicClasses();

const questionText = document.getElementById("question-text");
const answerButtons = document.querySelectorAll(".answer-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const progressFill = document.getElementById("progress-fill");
const progressPercent = document.getElementById("progress-percent");
const currentQuestionSpan = document.getElementById("current-question");

// Toast Notification
function showNotice(message, isError = true) {
    const toast = document.getElementById("notice-toast");
    const textEl = document.getElementById("notice-text");
    const iconEl = document.getElementById("notice-icon");
    if (!toast || !textEl || !iconEl) {
        alert(message);
        return;
    }

    textEl.textContent = message;
    iconEl.className = isError ? "ph-fill ph-warning-circle text-xl" : "ph-fill ph-sparkle text-xl";
    toast.className = `fixed top-5 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3.5 rounded-2xl shadow-2xl flex items-center space-x-2.5 transition-all duration-300 text-white border-2 ${
        isError ? "bg-red-600 border-red-700" : "bg-blue-600 border-blue-700"
    }`;
    toast.classList.remove("hidden");

    setTimeout(() => {
        toast.classList.add("hidden");
    }, 3200);
}

// Badge Icon Picker Selection
if (avatarButtons) {
    avatarButtons.forEach(btn => {
        btn.onclick = () => {
            avatarButtons.forEach(b => {
                b.classList.remove("border-blue-600", "bg-blue-50", "text-blue-600");
                b.classList.add("border-slate-200", "bg-slate-50", "text-slate-700");
                b.setAttribute("aria-checked", "false");
            });
            btn.classList.remove("border-slate-200", "bg-slate-50", "text-slate-700");
            btn.classList.add("border-blue-600", "bg-blue-50", "text-blue-600");
            btn.setAttribute("aria-checked", "true");
            selectedAvatar = btn.dataset.avatar || "ph-robot";
        };
    });
}

function showQuestion(index) {
    const q = questions[index];
    questionText.textContent = q.text;

    answerButtons.forEach((btn, i) => {
        const labelEl = btn.querySelector(".option-label");
        if (labelEl) {
            labelEl.textContent = q.options[i];
        } else {
            btn.textContent = q.options[i];
        }

        // Reset styling
        btn.classList.remove(
            "border-blue-600", "bg-blue-50/80", "ring-2", "ring-blue-300",
            "border-amber-600", "bg-amber-50/80", "ring-amber-300",
            "border-emerald-600", "bg-emerald-50/80", "ring-emerald-300"
        );
        btn.classList.add("border-slate-200", "bg-white");

        // Set active style jika sudah dipilih
        if (userAnswers[index] === btn.dataset.style) {
            btn.classList.remove("border-slate-200", "bg-white");
            const style = btn.dataset.style;
            if (style === "visual") {
                btn.classList.add("border-blue-600", "bg-blue-50/80", "ring-2", "ring-blue-300");
            } else if (style === "auditory") {
                btn.classList.add("border-amber-600", "bg-amber-50/80", "ring-2", "ring-amber-300");
            } else {
                btn.classList.add("border-emerald-600", "bg-emerald-50/80", "ring-2", "ring-emerald-300");
            }
        }
    });

    currentQuestionSpan.textContent = index + 1;
    const progress = ((index + 1) / questions.length) * 100;
    progressFill.style.width = progress + "%";
    progressPercent.textContent = Math.round(progress);

    prevBtn.classList.toggle("opacity-0", index === 0);
    prevBtn.disabled = (index === 0);

    if (index === questions.length - 1) {
        nextBtn.innerHTML = `<span>Lihat Hasil Analisis</span> <i class="ph-bold ph-medal text-lg" aria-hidden="true"></i>`;
        nextBtn.className = "clay-btn-secondary px-7 py-3.5 font-extrabold text-sm md:text-base flex items-center gap-2";
    } else {
        nextBtn.innerHTML = `<span>Selanjutnya</span> <i class="ph-bold ph-arrow-right text-base" aria-hidden="true"></i>`;
        nextBtn.className = "clay-btn-primary px-7 py-3.5 font-extrabold text-sm md:text-base flex items-center gap-2";
    }
}

function calculateScores() {
    scores.visual = 0;
    scores.auditory = 0;
    scores.kinesthetic = 0;
    userAnswers.forEach(ans => {
        if (ans && scores[ans] !== undefined) {
            scores[ans]++;
        }
    });
}

function calculateLearningStyle() {
    const max = Math.max(scores.visual, scores.auditory, scores.kinesthetic);
    const result = [];
    if (scores.visual === max) result.push("visual");
    if (scores.auditory === max) result.push("auditory");
    if (scores.kinesthetic === max) result.push("kinesthetic");
    return result.join("-");
}

startBtn.onclick = () => {
    const inputVal = namaInput.value.trim();
    if (!inputVal) {
        showNotice("Nama kamu belum diisi, yuk tulis namamu dulu ya!");
        namaInput.focus();
        return;
    }

    namaPeserta = inputVal;
    selectedClassId = (kelasSelect && kelasSelect.value) ? Number(kelasSelect.value) : null;

    localStorage.setItem("nama_peserta", namaPeserta);
    localStorage.setItem("user_avatar_icon", selectedAvatar);
    localStorage.setItem("edubot_class_id", selectedClassId ? String(selectedClassId) : "");

    namaUser.textContent = namaPeserta;
    if (userAvatarBadge) {
        userAvatarBadge.className = `ph-duotone ${selectedAvatar} text-xl`;
    }

    startScreen.classList.add("hidden");
    quizScreen.classList.remove("hidden");

    showQuestion(0);
};

answerButtons.forEach(btn => {
    btn.onclick = () => {
        userAnswers[currentQuestion] = btn.dataset.style;
        showQuestion(currentQuestion);
    };
});

prevBtn.onclick = () => {
    if (currentQuestion > 0) {
        currentQuestion--;
        showQuestion(currentQuestion);
    }
};

nextBtn.onclick = () => {
    if (!userAnswers[currentQuestion]) {
        showNotice("Pilih salah satu jawaban yang paling cocok buat kamu ya!");
        return;
    }

    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        showQuestion(currentQuestion);
    } else {
        // Layar memproses hasil akhir
        nextBtn.disabled = true;
        nextBtn.innerHTML = `
            <i class="ph-bold ph-spinner-gap animate-spin text-lg" aria-hidden="true"></i>
            <span>Sedang Menganalisis...</span>
        `;

        calculateScores();
        const hasilLokal = calculateLearningStyle();

        localStorage.setItem("skor_visual", scores.visual);
        localStorage.setItem("skor_auditory", scores.auditory);
        localStorage.setItem("skor_kinesthetic", scores.kinesthetic);

        const API_URL = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.protocol === "file:")
            ? "http://localhost:3000/simpan-hasil"
            : "https://edubot-gayabelajar-production.up.railway.app/simpan-hasil";

        fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nama: namaPeserta,
                visual: scores.visual,
                auditory: scores.auditory,
                kinesthetic: scores.kinesthetic,
                hasil: hasilLokal,
                class_id: selectedClassId || null
            })
        })
        .then(res => {
            if (!res.ok) {
                return res.json().then(errData => {
                    throw new Error(errData.error || "Server mengalami kendala");
                });
            }
            return res.json();
        })
        .then(data => {
            console.log("Berhasil diproses & disimpan:", data);
            const finalStyle = data.hasil || hasilLokal;
            const source = data.source || "ml";
            localStorage.setItem("hasil_source", source);
            window.location.href = `result.html?style=${finalStyle}&source=${source}`;
        })
        .catch(err => {
            console.warn("Menggunakan analisis fallback:", err.message);
            localStorage.setItem("hasil_source", "offline-rule-based");
            window.location.href = `result.html?style=${hasilLokal}&source=offline`;
        });
    }
};
