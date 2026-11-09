class CustomNavbar extends HTMLElement {
  connectedCallback() {
    // Pastikan Phosphor Icons dimuat di <head>
    if (!document.querySelector('script[src*="@phosphor-icons/web"]')) {
      const phosphorScript = document.createElement('script');
      phosphorScript.src = 'https://unpkg.com/@phosphor-icons/web';
      document.head.appendChild(phosphorScript);
    }

    const currentPath = window.location.pathname;
    const isHome = currentPath.endsWith("index.html") || currentPath.endsWith("/") || currentPath === "";
    const isQuiz = currentPath.endsWith("quiz.html");
    const isTeacher = currentPath.endsWith("teacher.html");
    const isAbout = currentPath.endsWith("about.html");
    const isLogin = currentPath.endsWith("login.html");
    const isPortalGuru = isTeacher || isLogin;

    // Ambil data user dari localStorage jika login
    const token = localStorage.getItem("edubot_token");
    let user = null;
    try {
      user = JSON.parse(localStorage.getItem("edubot_user"));
    } catch {
      user = null;
    }
    const isLoggedIn = !!token && !!user;

    // Link Portal Guru: langsung ke dashboard jika sudah login, atau ke halaman login jika belum
    const portalGuruHref = isLoggedIn ? "teacher.html" : "login.html";

    this.innerHTML = `
      <nav class="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b-4 border-blue-100 shadow-sm" aria-label="Navigasi Utama">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-20">
            
            <!-- Brand Logo -->
            <a href="index.html" class="flex items-center space-x-3 group cursor-pointer" aria-label="EduBot - Kembali ke Beranda">
              <div class="w-12 h-12 rounded-2xl bg-blue-600 border-2 border-blue-700 shadow-[0_4px_0_0_#1E40AF] group-hover:-translate-y-0.5 transition-transform flex items-center justify-center text-white">
                <i class="ph-duotone ph-robot text-3xl" aria-hidden="true"></i>
              </div>
              <div class="flex flex-col">
                <span class="text-2xl font-extrabold font-display text-blue-600 tracking-tight leading-none font-baloo">
                  EduBot
                </span>
                <span class="text-xs font-bold text-amber-600 tracking-wide font-nunito">
                  Teman Belajar Pintar
                </span>
              </div>
            </a>

            <!-- Desktop Nav Items -->
            <div class="hidden md:flex items-center space-x-2">
              <a href="index.html" class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                isHome ? 'bg-blue-50 text-blue-700 border-2 border-blue-200' : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50 border-2 border-transparent'
              }">
                <i class="ph-duotone ph-house-line text-lg" aria-hidden="true"></i>
                <span>Beranda</span>
              </a>

              <a href="about.html" class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                isAbout ? 'bg-blue-50 text-blue-700 border-2 border-blue-200' : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50 border-2 border-transparent'
              }">
                <i class="ph-duotone ph-book-open-text text-lg" aria-hidden="true"></i>
                <span>Tentang VAK</span>
              </a>

              <a href="${portalGuruHref}" class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                isPortalGuru ? 'bg-blue-50 text-blue-700 border-2 border-blue-200' : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50 border-2 border-transparent'
              }">
                <i class="ph-duotone ph-chalkboard-teacher text-lg" aria-hidden="true"></i>
                <span>Portal Guru</span>
              </a>

              <!-- Divider Pemisah -->
              <div class="h-6 w-px bg-slate-200 mx-1"></div>

              <!-- Bagian Aksi Kanan (Status Akun jika login / CTA Kuis jika siswa) -->
              ${isLoggedIn ? `
                <div class="flex items-center gap-2">
                  <div class="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-50 border-2 border-blue-200 text-blue-900 text-xs font-bold shadow-xs">
                    <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <i class="ph-fill ph-user-circle text-blue-600 text-lg"></i>
                    <span class="max-w-[140px] truncate" title="${user.full_name || user.username}">${user.full_name || user.username}</span>
                  </div>
                  <button id="nav-btn-logout" type="button" class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border-2 border-red-200 bg-red-50 text-red-700 hover:bg-red-100 text-xs font-bold transition-colors cursor-pointer" title="Keluar dari akun guru">
                    <i class="ph-bold ph-sign-out text-sm"></i>
                    <span>Keluar</span>
                  </button>
                </div>
              ` : `
                <a href="quiz.html" class="inline-flex items-center gap-2 px-4 py-2.5 clay-btn-primary text-sm font-bold cursor-pointer ${
                  isQuiz ? 'ring-2 ring-blue-400' : ''
                }">
                  <span>Mulai Tes</span>
                  <i class="ph-bold ph-rocket-launch text-base" aria-hidden="true"></i>
                </a>
              `}
            </div>

            <!-- Mobile Hamburger Button -->
            <button id="menu-btn" type="button" class="md:hidden w-11 h-11 rounded-xl border-2 border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center justify-center cursor-pointer" aria-label="Buka menu navigasi" aria-expanded="false">
              <i class="ph-bold ph-list text-2xl" aria-hidden="true"></i>
            </button>

          </div>
        </div>

        <!-- Mobile Nav Menu -->
        <div id="mobile-menu" class="hidden md:hidden bg-white border-t-2 border-blue-100 px-4 pt-3 pb-5 space-y-2 shadow-lg">
          ${isLoggedIn ? `
            <div class="p-3 mb-2 rounded-2xl bg-blue-50 border-2 border-blue-200 flex items-center justify-between">
              <div class="flex items-center gap-2 text-blue-900 font-bold text-sm">
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <i class="ph-fill ph-user-circle text-blue-600 text-xl"></i>
                <span class="truncate max-w-[180px]">${user.full_name || user.username}</span>
              </div>
              <button id="mobile-btn-logout" type="button" class="px-3 py-1.5 rounded-xl bg-red-100 text-red-700 text-xs font-bold hover:bg-red-200 transition-colors">
                Keluar
              </button>
            </div>
          ` : ''}

          <a href="index.html" class="flex items-center gap-3 px-4 py-3 rounded-xl font-bold ${isHome ? 'bg-blue-50 text-blue-700 border-2 border-blue-200' : 'text-slate-700 hover:bg-slate-50'}">
            <i class="ph-duotone ph-house-line text-xl" aria-hidden="true"></i>
            <span>Beranda</span>
          </a>

          <a href="about.html" class="flex items-center gap-3 px-4 py-3 rounded-xl font-bold ${isAbout ? 'bg-blue-50 text-blue-700 border-2 border-blue-200' : 'text-slate-700 hover:bg-slate-50'}">
            <i class="ph-duotone ph-book-open-text text-xl" aria-hidden="true"></i>
            <span>Tentang VAK</span>
          </a>

          <a href="${portalGuruHref}" class="flex items-center gap-3 px-4 py-3 rounded-xl font-bold ${isPortalGuru ? 'bg-blue-50 text-blue-700 border-2 border-blue-200' : 'text-slate-700 hover:bg-slate-50'}">
            <i class="ph-duotone ph-chalkboard-teacher text-xl" aria-hidden="true"></i>
            <span>Portal Guru</span>
          </a>

          ${!isLoggedIn ? `
            <div class="pt-2">
              <a href="quiz.html" class="flex items-center justify-center gap-2 w-full py-3.5 clay-btn-primary font-bold">
                <span>Mulai Tes Sekarang</span>
                <i class="ph-bold ph-rocket-launch text-lg" aria-hidden="true"></i>
              </a>
            </div>
          ` : ''}
        </div>
      </nav>
    `;

    // Handler toggle hamburger menu
    const menuBtn = this.querySelector('#menu-btn');
    const mobileMenu = this.querySelector('#mobile-menu');
    if (menuBtn && mobileMenu) {
      menuBtn.addEventListener('click', () => {
        const isHidden = mobileMenu.classList.toggle('hidden');
        menuBtn.setAttribute('aria-expanded', String(!isHidden));
      });
    }

    // Handler tombol logout
    const handleLogout = () => {
      if (confirm("Apakah Anda yakin ingin keluar dari akun guru?")) {
        localStorage.removeItem("edubot_token");
        localStorage.removeItem("edubot_user");
        window.location.href = "login.html";
      }
    };

    const logoutBtn = this.querySelector('#nav-btn-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', handleLogout);
    }
    const mobileLogoutBtn = this.querySelector('#mobile-btn-logout');
    if (mobileLogoutBtn) {
      mobileLogoutBtn.addEventListener('click', handleLogout);
    }
  }
}

customElements.define('custom-navbar', CustomNavbar);
