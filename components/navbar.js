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

    this.innerHTML = `
      <nav class="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b-4 border-blue-100 shadow-sm" aria-label="Navigasi Utama">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-20">
            
            <!-- Brand Logo -->
            <a href="index.html" class="flex items-center space-x-3 group cursor-pointer">
              <div class="w-12 h-12 rounded-2xl bg-blue-600 border-2 border-blue-700 shadow-[0_4px_0_0_#1E40AF] group-hover:-translate-y-0.5 transition-transform flex items-center justify-center text-white">
                <i class="ph-duotone ph-robot text-3xl" aria-hidden="true"></i>
              </div>
              <div class="flex flex-col">
                <span class="text-2xl font-extrabold font-display text-blue-600 tracking-tight leading-none">
                  EduBot
                </span>
                <span class="text-xs font-bold text-amber-600 tracking-wide">
                  Teman Belajar Pintar
                </span>
              </div>
            </a>

            <!-- Desktop Nav Items -->
            <div class="hidden md:flex items-center space-x-1 lg:space-x-2">
              <a href="index.html" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                isHome ? 'bg-blue-50 text-blue-700 border-2 border-blue-200' : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50 border-2 border-transparent'
              }">
                <i class="ph-duotone ph-house-line text-lg" aria-hidden="true"></i>
                <span>Beranda</span>
              </a>
              <a href="quiz.html" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                isQuiz ? 'bg-blue-50 text-blue-700 border-2 border-blue-200' : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50 border-2 border-transparent'
              }">
                <i class="ph-duotone ph-puzzle-piece text-lg" aria-hidden="true"></i>
                <span>Tes Gaya Belajar</span>
              </a>
              <a href="teacher.html" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                isTeacher ? 'bg-blue-50 text-blue-700 border-2 border-blue-200' : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50 border-2 border-transparent'
              }">
                <i class="ph-duotone ph-chart-bar text-lg" aria-hidden="true"></i>
                <span>Dashboard Guru</span>
              </a>
              <a href="about.html" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                isAbout ? 'bg-blue-50 text-blue-700 border-2 border-blue-200' : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50 border-2 border-transparent'
              }">
                <i class="ph-duotone ph-book-open-text text-lg" aria-hidden="true"></i>
                <span>Tentang</span>
              </a>
              <a href="quiz.html" class="ml-3 inline-flex items-center gap-2 px-5 py-2.5 clay-btn-primary text-sm font-bold">
                <span>Mulai Tes</span>
                <i class="ph-bold ph-rocket-launch text-base" aria-hidden="true"></i>
              </a>
            </div>

            <!-- Mobile Hamburger Button -->
            <button id="menu-btn" type="button" class="md:hidden w-11 h-11 rounded-xl border-2 border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center justify-center cursor-pointer" aria-label="Buka menu navigasi" aria-expanded="false">
              <i class="ph-bold ph-list text-2xl" aria-hidden="true"></i>
            </button>

          </div>
        </div>

        <!-- Mobile Nav Menu -->
        <div id="mobile-menu" class="hidden md:hidden bg-white border-t-2 border-blue-100 px-4 pt-3 pb-5 space-y-2 shadow-lg">
          <a href="index.html" class="flex items-center gap-3 px-4 py-3 rounded-xl font-bold ${isHome ? 'bg-blue-50 text-blue-700 border-2 border-blue-200' : 'text-slate-700 hover:bg-slate-50'}">
            <i class="ph-duotone ph-house-line text-xl" aria-hidden="true"></i>
            <span>Beranda</span>
          </a>
          <a href="quiz.html" class="flex items-center gap-3 px-4 py-3 rounded-xl font-bold ${isQuiz ? 'bg-blue-50 text-blue-700 border-2 border-blue-200' : 'text-slate-700 hover:bg-slate-50'}">
            <i class="ph-duotone ph-puzzle-piece text-xl" aria-hidden="true"></i>
            <span>Tes Gaya Belajar</span>
          </a>
          <a href="teacher.html" class="flex items-center gap-3 px-4 py-3 rounded-xl font-bold ${isTeacher ? 'bg-blue-50 text-blue-700 border-2 border-blue-200' : 'text-slate-700 hover:bg-slate-50'}">
            <i class="ph-duotone ph-chart-bar text-xl" aria-hidden="true"></i>
            <span>Dashboard Guru</span>
          </a>
          <a href="about.html" class="flex items-center gap-3 px-4 py-3 rounded-xl font-bold ${isAbout ? 'bg-blue-50 text-blue-700 border-2 border-blue-200' : 'text-slate-700 hover:bg-slate-50'}">
            <i class="ph-duotone ph-book-open-text text-xl" aria-hidden="true"></i>
            <span>Tentang</span>
          </a>
          <div class="pt-2">
            <a href="quiz.html" class="flex items-center justify-center gap-2 w-full py-3.5 clay-btn-primary font-bold">
              <span>Mulai Tes Sekarang</span>
              <i class="ph-bold ph-rocket-launch text-lg" aria-hidden="true"></i>
            </a>
          </div>
        </div>
      </nav>
    `;

    const menuBtn = this.querySelector('#menu-btn');
    const mobileMenu = this.querySelector('#mobile-menu');
    if (menuBtn && mobileMenu) {
      menuBtn.addEventListener('click', () => {
        const isHidden = mobileMenu.classList.toggle('hidden');
        menuBtn.setAttribute('aria-expanded', String(!isHidden));
      });
    }
  }
}

customElements.define('custom-navbar', CustomNavbar);
