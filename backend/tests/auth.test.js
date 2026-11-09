const assert = require("assert");
const http = require("http");
const app = require("../server");

const PORT = 3099;
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
  console.log("🧪 Memulai Pengujian Otomatis Sistem Autentikasi Guru...");

  server = app.listen(PORT, "127.0.0.1");
  await new Promise((resolve) => setTimeout(resolve, 500));

  try {
    // Test 1: Login dengan akun demo guru
    console.log("▶ [Test 1] POST /api/auth/login (Kredensial Benar)");
    const loginRes = await request("POST", "/api/auth/login", {
      username: "guru",
      password: "guru123"
    });
    assert.strictEqual(loginRes.status, 200, "Status login harus 200");
    assert.strictEqual(loginRes.body.success, true, "Success harus true");
    assert.ok(loginRes.body.token, "Harus mengembalikan JWT token");
    assert.strictEqual(loginRes.body.user.username, "guru");
    const validToken = loginRes.body.token;
    console.log("  ✅ Berhasil login dan mendapatkan JWT token.");

    // Test 2: Login dengan password salah
    console.log("▶ [Test 2] POST /api/auth/login (Password Salah)");
    const wrongRes = await request("POST", "/api/auth/login", {
      username: "guru",
      password: "password_salah_123"
    });
    assert.strictEqual(wrongRes.status, 401, "Status harus 401 Unauthorized");
    assert.strictEqual(wrongRes.body.success, false);
    console.log("  ✅ Berhasil menolak login kredensial salah.");

    // Test 3: Verifikasi profil dengan Bearer token
    console.log("▶ [Test 3] GET /api/auth/me (Bearer Token Valid)");
    const meRes = await request("GET", "/api/auth/me", null, validToken);
    assert.strictEqual(meRes.status, 200, "Status harus 200 OK");
    assert.strictEqual(meRes.body.user.username, "guru");
    assert.strictEqual(meRes.body.user.role, "teacher");
    console.log("  ✅ Berhasil memverifikasi identitas guru dari token.");

    // Test 4: Verifikasi tanpa token
    console.log("▶ [Test 4] GET /api/auth/me (Tanpa Token)");
    const unauthRes = await request("GET", "/api/auth/me");
    assert.strictEqual(unauthRes.status, 401, "Harus 401 jika tanpa token");
    console.log("  ✅ Berhasil memblokir akses tanpa token.");

    // Test 5: Register akun guru baru
    const randomSuffix = Math.floor(Math.random() * 10000);
    const newUsername = `guru_test_${randomSuffix}`;
    console.log(`▶ [Test 5] POST /api/auth/register (${newUsername})`);
    const regRes = await request("POST", "/api/auth/register", {
      username: newUsername,
      password: "password123",
      full_name: "Ibu Guru Penguji",
      role: "teacher"
    });
    assert.strictEqual(regRes.status, 201, "Status registrasi harus 201");
    assert.ok(regRes.body.token, "Harus menyertakan token");
    console.log("  ✅ Berhasil mendaftarkan guru baru.");

    // Test 6: Register dengan username duplikat
    console.log("▶ [Test 6] POST /api/auth/register (Duplikat Username)");
    const dupRes = await request("POST", "/api/auth/register", {
      username: newUsername,
      password: "password123",
      full_name: "Ibu Guru Penguji 2",
      role: "teacher"
    });
    assert.strictEqual(dupRes.status, 409, "Harus 409 Conflict jika username sudah ada");
    console.log("  ✅ Berhasil mencegah registrasi username ganda.");

    console.log("\n🎉 SELURUH PENGUJIAN AUTENTIKASI (6/6) BERHASIL!");
  } catch (err) {
    console.error("❌ Test Gagal:", err);
    process.exitCode = 1;
  } finally {
    server.close();
    process.exit(process.exitCode || 0);
  }
}

runTests();

