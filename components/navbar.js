class CustomNavbar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <nav class="bg-white shadow-md sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4">
          <div class="flex justify-between items-center h-16">
            
            <a href="index.html" class="flex items-center text-2xl font-bold text-blue-600">
              <i data-feather="smile" class="mr-2"></i>
              Edubot
            </a>

            <div class="hidden md:flex space-x-6">
              <a href="index.html" class="text-gray-700 hover:text-blue-600 font-medium">Beranda</a>
              <a href="quiz.html" class="text-gray-700 hover:text-blue-600 font-medium">Tes Gaya Belajar</a>
              <a href="about.html" class="text-gray-700 hover:text-blue-600 font-medium">Tentang</a>
            </div>

            <button id="menu-btn" class="md:hidden">
              <i data-feather="menu"></i>
            </button>
          </div>
        </div>

        <div id="mobile-menu" class="hidden md:hidden bg-white border-t">
          <a href="index.html" class="block px-4 py-3 text-gray-700 hover:bg-blue-50">Beranda</a>
          <a href="quiz.html" class="block px-4 py-3 text-gray-700 hover:bg-blue-50">Tes Gaya Belajar</a>
          <a href="about.html" class="block px-4 py-3 text-gray-700 hover:bg-blue-50">Tentang</a>
        </div>
      </nav>
    `;

    feather.replace();

    this.querySelector('#menu-btn').addEventListener('click', () => {
      this.querySelector('#mobile-menu').classList.toggle('hidden');
    });
  }
}

customElements.define('custom-navbar', CustomNavbar);
