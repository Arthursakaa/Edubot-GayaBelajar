feather.replace();

const questions = [
    { text:"Saat guru menjelaskan pelajaran, aku lebih suka…", options:["A. Melihat gambar atau tulisan","B. Mendengarkan penjelasan","C. Mencoba langsung"]},
    { text:"Jika belajar di rumah, aku senang…", options:["A. Melihat video","B. Mendengarkan orang lain","C. Belajar sambil bergerak"]},
    { text:"Saat menghafal pelajaran, aku…", options:["A. Melihat catatan","B. Membaca keras","C. Menulis sambil berjalan"]},
    { text:"Aku cepat paham jika…", options:["A. Ada gambar","B. Dijelaskan","C. Mencoba sendiri"]},
    { text:"Saat guru bertanya, aku…", options:["A. Melihat contoh","B. Mendengar ulang","C. Maju mencoba"]},
    { text:"Jika bosan belajar, aku…", options:["A. Menggambar","B. Mengobrol", "C. Bergerak"]},
    { text:"Aku mudah ingat jika…", options:["A. Ada warna","B. Dijelaskan suara","C. Dilakukan"]},
    { text:"Saat ada tugas, aku senang…", options:["A. Ada contoh","B. Dijelaskan","C. Langsung praktik"]},
    { text:"Belajar kelompok, aku…", options:["A. Melihat catatan","B. Mendengar teman","C. Aktif bergerak"]},
    { text:"Aku suka belajar dengan…", options:["A. Gambar & video","B. Penjelasan","C. Bermain"]}
];

let currentQuestion = 0;
let namaPeserta = "";
const userAnswers = new Array(questions.length).fill(null);
const scores = { visual:0, auditory:0, kinesthetic:0 };

/* ===== ELEMENT ===== */
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const startBtn = document.getElementById("start-btn");
const namaInput = document.getElementById("nama-input");
const namaUser = document.getElementById("nama-user");

const questionText = document.getElementById("question-text");
const answerButtons = document.querySelectorAll(".answer-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const progressFill = document.getElementById("progress-fill");
const progressPercent = document.getElementById("progress-percent");
const currentQuestionSpan = document.getElementById("current-question");

/* ===== FUNCTION ===== */
function showQuestion(index){
    const q = questions[index];
    questionText.textContent = q.text;

    answerButtons.forEach((btn, i) => {
        btn.textContent = q.options[i];
        btn.classList.remove("bg-blue-200", "border-blue-400");
        if(userAnswers[index] === btn.dataset.style){
            btn.classList.add("bg-blue-200", "border-blue-400");
        }
    });

    currentQuestionSpan.textContent = index + 1;
    const progress = ((index + 1) / questions.length) * 100;
    progressFill.style.width = progress + "%";
    progressPercent.textContent = Math.round(progress);

    prevBtn.classList.toggle("opacity-0", index === 0);

    nextBtn.innerHTML = index === questions.length - 1
        ? 'Lihat Hasil <i data-feather="award"></i>'
        : 'Selanjutnya <i data-feather="arrow-right"></i>';

    feather.replace();
}

function calculateScores(){
    scores.visual = 0;
    scores.auditory = 0;
    scores.kinesthetic = 0;
    userAnswers.forEach(ans => { 
        if(ans) scores[ans]++; 
    });
}

function calculateLearningStyle(){
    const max = Math.max(scores.visual, scores.auditory, scores.kinesthetic);
    const result = [];
    if(scores.visual === max) result.push("visual");
    if(scores.auditory === max) result.push("auditory");
    if(scores.kinesthetic === max) result.push("kinesthetic");
    return result.join("-");
}

/* ===== EVENT ===== */
startBtn.onclick = () => {
    if(!namaInput.value.trim()){
        alert("Nama tidak boleh kosong!");
        return;
    }

    namaPeserta = namaInput.value.trim();
    localStorage.setItem("nama_peserta", namaPeserta);
    namaUser.textContent = namaPeserta;

    startScreen.classList.add("hidden");
    quizScreen.classList.remove("hidden");

    showQuestion(0);
};

answerButtons.forEach(btn => {
    btn.onclick = () => {
        answerButtons.forEach(b => b.classList.remove("bg-blue-200", "border-blue-400"));
        btn.classList.add("bg-blue-200", "border-blue-400");
        userAnswers[currentQuestion] = btn.dataset.style;
    };
});

prevBtn.onclick = () => {
    if(currentQuestion > 0){
        currentQuestion--;
        showQuestion(currentQuestion);
    }
};

nextBtn.onclick = () => {
    if(!userAnswers[currentQuestion]){
        alert("Silakan pilih jawaban!");
        return;
    }

    if(currentQuestion < questions.length - 1){
        currentQuestion++;
        showQuestion(currentQuestion);
    } else {
        // PROSES KIRIM DATA
        nextBtn.disabled = true;
        nextBtn.textContent = "Sedang Memproses...";

        calculateScores();
        const hasilLokal = calculateLearningStyle();

        // Pastikan URL ini adalah URL Backend Node.js Anda
        const API_URL = "https://edubot-gayabelajar-production.up.railway.app";

        fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nama: namaPeserta,
                visual: scores.visual,
                auditory: scores.auditory,
                kinesthetic: scores.kinesthetic,
                hasil: hasilLokal
            })
        })
        .then(res => {
            if (!res.ok) throw new Error("Server bermasalah");
            return res.json();
        })
        .then(data => {
            console.log("✅ Berhasil simpan:", data);
            // Gunakan hasil dari ML (data.hasil) jika tersedia, jika tidak pakai hasil lokal
            const finalStyle = data.hasil || hasilLokal;
            window.location.href = `result.html?style=${finalStyle}`;
        })
        .catch(err => {
            console.error("❌ Gagal kirim ke database:", err);
            // Fallback: tetap arahkan ke halaman hasil meskipun gagal simpan ke DB
            window.location.href = `result.html?style=${hasilLokal}`;
        });
    }
};