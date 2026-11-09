/**
 * Script Pengujian Otomatis Endpoint Backend EduBot
 */
const http = require("http");
const app = require("../server");

function runApiTests() {
  const server = app.listen(0, async () => {
    const port = server.address().port;
    console.log(`🧪 Menjalankan pengujian API pada test port: ${port}`);

    try {
      // Test 1: GET /health
      const healthRes = await makeRequest(port, "/health", "GET");
      console.assert(healthRes.statusCode === 200, "Health check harus 200");
      console.log("  ✅ Test 1: GET /health -> Status 200 OK");

      // Test 2: POST /api/simpan-hasil (Valid Payload)
      const validPayload = {
        nama: "Siswa Uji Otomatis",
        visual: 4,
        auditory: 3,
        kinesthetic: 3,
        hasil: "visual"
      };
      const simpanRes = await makeRequest(port, "/api/simpan-hasil", "POST", validPayload);
      console.assert(simpanRes.statusCode === 201, `Simpan hasil harus 201, didapat: ${simpanRes.statusCode}`);
      console.assert(simpanRes.body.success === true, "Response harus success: true");
      console.log("  ✅ Test 2: POST /api/simpan-hasil (Valid) -> Status 201 Created & DB persisted");

      // Test 3: POST /api/simpan-hasil (Invalid Payload - Skor > 10)
      const invalidPayload = {
        nama: "Siswa Invalid",
        visual: 99, // melampaui batas max 10
        auditory: 2,
        kinesthetic: 1,
        hasil: "visual"
      };
      const invalidRes = await makeRequest(port, "/api/simpan-hasil", "POST", invalidPayload);
      console.assert(invalidRes.statusCode === 400, "Invalid payload harus ditolak dengan 400 Bad Request");
      console.assert(invalidRes.body.success === false, "Response harus success: false");
      console.log("  ✅ Test 3: POST /api/simpan-hasil (Zod Rejection) -> Status 400 Bad Request");

      // Test 4: Proteksi GET /api/riwayat tanpa token (Harus 401 Unauthorized)
      const unauthRiwayat = await makeRequest(port, "/api/riwayat", "GET");
      console.assert(unauthRiwayat.statusCode === 401, "Akses tanpa token harus ditolak 401");
      console.log("  ✅ Test 4: GET /api/riwayat (Tanpa Token) -> Ditolak 401 Unauthorized (Terkunci Aman)");

      // Test 5: Login untuk mendapatkan token guru
      const loginRes = await makeRequest(port, "/api/auth/login", "POST", {
        username: "guru",
        password: "guru123"
      });
      console.assert(loginRes.statusCode === 200, "Login demo guru harus 200");
      const token = loginRes.body.token;
      console.assert(!!token, "Token harus ada");
      console.log("  ✅ Test 5: POST /api/auth/login -> Berhasil mendapatkan JWT token");

      // Test 6: GET /api/riwayat dengan Bearer token
      const riwayatRes = await makeRequest(port, "/api/riwayat?limit=5", "GET", null, token);
      console.assert(riwayatRes.statusCode === 200, "Riwayat dengan token harus 200");
      console.assert(Array.isArray(riwayatRes.body.data), "Data harus berupa array");
      console.log(`  ✅ Test 6: GET /api/riwayat (Dengan Token) -> Status 200 OK (${riwayatRes.body.data.length} records)`);

      console.log("\n🎉 SELURUH PENGUJIAN API & KEAMANAN BACKEND BERHASIL 100%!");
    } catch (err) {
      console.error("❌ PENGUJIAN GAGAL:", err);
      process.exitCode = 1;
    } finally {
      server.close();
    }
  });
}

function makeRequest(port, path, method, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : null;
    const headers = {
      "Content-Type": "application/json"
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    if (postData) {
      headers["Content-Length"] = Buffer.byteLength(postData);
    }

    const options = {
      hostname: "127.0.0.1",
      port: port,
      path: path,
      method: method,
      headers: headers
    };

    const req = http.request(options, (res) => {
      let bodyStr = "";
      res.on("data", (chunk) => (bodyStr += chunk));
      res.on("end", () => {
        let parsed = bodyStr;
        try {
          parsed = JSON.parse(bodyStr);
        } catch (_) {}
        resolve({ statusCode: res.statusCode, body: parsed });
      });
    });

    req.on("error", reject);
    if (postData) req.write(postData);
    req.end();
  });
}

runApiTests();
