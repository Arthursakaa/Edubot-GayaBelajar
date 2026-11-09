const assert = require("assert");
const http = require("http");
const app = require("../server");

const PORT = 3098;
let server;

function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const headers = { "Content-Type": "application/json" };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const req = http.request(
      {
        hostname: "127.0.0.1",
        port: PORT,
        path,
        method,
        headers
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          let parsed;
          try {
            parsed = JSON.parse(data);
          } catch {
            parsed = data;
          }
          resolve({ status: res.statusCode, body: parsed });
        });
      }
    );

    req.on("error", reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log("🧪 Memulai Pengujian Otomatis Sistem Kelas (Priority 1)...");

  server = app.listen(PORT, "127.0.0.1");
  await new Promise((resolve) => setTimeout(resolve, 500));

  try {
    // 1. Ambil token guru
    const loginRes = await request("POST", "/api/auth/login", {
      username: "guru",
      password: "guru123"
    });
    assert.strictEqual(loginRes.status, 200);
    const teacherToken = loginRes.body.token;

    // 2. GET /api/classes/public (Publik untuk Siswa)
    console.log("▶ [Test 1] GET /api/classes/public");
    const pubRes = await request("GET", "/api/classes/public");
    assert.strictEqual(pubRes.status, 200);
    assert.ok(Array.isArray(pubRes.body.data));
    console.log(`  ✅ Berhasil memuat ${pubRes.body.data.length} kelas publik untuk kuis siswa.`);

    // 3. POST /api/classes tanpa token (Harus 401)
    console.log("▶ [Test 2] POST /api/classes (Tanpa Token)");
    const unauthRes = await request("POST", "/api/classes", {
      class_name: "Kelas Percobaan",
      grade_level: "Kelas 5",
      academic_year: "2025/2026"
    });
    assert.strictEqual(unauthRes.status, 401);
    console.log("  ✅ Berhasil memblokir pembuatan kelas tanpa izin guru.");

    // 4. POST /api/classes dengan token guru
    const randCode = "K5-" + Math.floor(Math.random() * 9000 + 1000);
    console.log(`▶ [Test 3] POST /api/classes (${randCode})`);
    const createRes = await request("POST", "/api/classes", {
      class_name: "Kelas 5B Cerdas",
      class_code: randCode,
      grade_level: "Kelas 5",
      academic_year: "2025/2026"
    }, teacherToken);
    assert.strictEqual(createRes.status, 201);
    assert.strictEqual(createRes.body.data.class_code, randCode);
    const createdClassId = createRes.body.data.id;
    console.log(`  ✅ Berhasil membuat kelas "${createRes.body.data.class_name}" (ID: ${createdClassId}).`);

    // 5. GET /api/classes (Kelas binaan guru)
    console.log("▶ [Test 4] GET /api/classes (Daftar Kelas Guru)");
    const teacherClassesRes = await request("GET", "/api/classes", null, teacherToken);
    assert.strictEqual(teacherClassesRes.status, 200);
    assert.ok(Array.isArray(teacherClassesRes.body.data));
    console.log(`  ✅ Berhasil memuat ${teacherClassesRes.body.data.length} kelas binaan guru.`);

    // 6. POST /api/simpan-hasil dengan class_code
    console.log("▶ [Test 5] POST /api/simpan-hasil (Siswa mengisi dengan kode kelas)");
    const simpanRes = await request("POST", "/api/simpan-hasil", {
      nama: "Siswa Binaan Kelas Baru",
      visual: 5,
      auditory: 3,
      kinesthetic: 2,
      hasil: "visual",
      class_code: randCode
    });
    assert.strictEqual(simpanRes.status, 201);
    assert.strictEqual(simpanRes.body.class_id, createdClassId);
    console.log(`  ✅ Berhasil menyimpan kuis siswa dengan relasi class_id: ${simpanRes.body.class_id}.`);

    // 7. GET /api/analytics?class_id=X (Analitik Terfilter Kelas)
    console.log(`▶ [Test 6] GET /api/analytics?class_id=${createdClassId}`);
    const filterAnalytics = await request("GET", `/api/analytics?class_id=${createdClassId}`, null, teacherToken);
    assert.strictEqual(filterAnalytics.status, 200);
    assert.strictEqual(filterAnalytics.body.class_id, createdClassId);
    assert.strictEqual(filterAnalytics.body.summary.total_siswa, 1);
    console.log(`  ✅ Berhasil memfilter analitik khusus kelas ${createdClassId} (Total: 1 siswa).`);

    console.log("\n🎉 SELURUH PENGUJIAN SISTEM KELAS & KODE KUIS (6/6) BERHASIL!");
  } catch (err) {
    console.error("❌ Test Gagal:", err);
    process.exitCode = 1;
  } finally {
    server.close();
    process.exit(process.exitCode || 0);
  }
}

runTests();

