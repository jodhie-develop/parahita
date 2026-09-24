// Animasi sederhana saat scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.background = '#ffffff';
        header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.9)';
        header.style.boxShadow = 'none';
    }
});

// Klik tombol (hanya simulasi) - hanya ada di index.html
const primaryBtn = document.querySelector('.btn-primary');
if (primaryBtn) {
    primaryBtn.addEventListener('click', () => {
        alert('Directing to Quotation Form...');
    });
}

// Fungsi Counter Angka
const counters = document.querySelectorAll('.counter');
const speed = 200; // Semakin besar semakin lambat

counters.forEach(counter => {
    const updateCount = () => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText.replace(',', ''); // hapus koma jika ada

        // Hitung pertambahan
        const inc = target / speed;

        if (count < target) {
            // Tambahkan angka dan tampilkan dengan format ribuan
            counter.innerText = Math.ceil(count + inc).toLocaleString();
            setTimeout(updateCount, 1);
        } else {
            counter.innerText = target.toLocaleString();
        }
    };

    updateCount();
});

// Efek Transisi Navbar
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    header.style.background = window.scrollY > 50 ? '#fff' : 'rgba(255,255,255,0.9)';
});

// Hero Text Slider - hanya ada di index.html
const sliderData = [
    {
        main: '<span class="highlight-blue">Building Lasting</span> <span class="highlight-green">Trust</span>',
        sub: 'Carrier coordination, documentation, and tracking built for enterprise supply chains.'
    },
    {
        main: '<span class="highlight-blue">Delivering Excellence</span> <span class="highlight-green">in Quality</span>',
        sub: 'Connecting your business to the world with seamless commodity trading solutions.'
    },
    {
        main: '<span class="highlight-blue">Advancing</span> <span class="highlight-green">Sustainable Growth</span>',
        sub: 'Ensuring quality and reliability in every shipment of Indonesian commodities.'
    },
    {
        main: '<span class="highlight-blue">Empowering Strong</span> <span class="highlight-green">Communities</span>',
        sub: 'Ensuring quality and reliability in every shipment of Indonesian commodities.'
    }
];

let currentIndex = 0;
const mainTextEl = document.getElementById('hero-slider-text');
const subTextEl = document.getElementById('hero-subtext');

function updateSlider() {
    if (!mainTextEl || !subTextEl) return;

    // Tambah kelas animasi
    mainTextEl.classList.remove('fade-in');
    void mainTextEl.offsetWidth; // Trigger reflow agar animasi bisa diulang
    mainTextEl.classList.add('fade-in');

    // Update konten
    mainTextEl.innerHTML = sliderData[currentIndex].main;
    subTextEl.innerHTML = sliderData[currentIndex].sub;

    // Pindah ke index berikutnya
    currentIndex = (currentIndex + 1) % sliderData.length;
}

if (mainTextEl && subTextEl) {
    // Jalankan setiap 4 detik
    setInterval(updateSlider, 4000);
    // Panggil sekali di awal
    updateSlider();
}

// Hero Background Slider - hanya ada di index.html
const heroBgSlides = document.querySelectorAll('.hero-bg-slide');
if (heroBgSlides.length > 1) {
    let heroBgIndex = 0;
    setInterval(() => {
        heroBgSlides[heroBgIndex].classList.remove('active');
        heroBgIndex = (heroBgIndex + 1) % heroBgSlides.length;
        heroBgSlides[heroBgIndex].classList.add('active');
    }, 5000);
}

// Lightbox Controls - dipakai bersama oleh index.html (preview carousel) dan gallery.html (grid penuh)
function openLightbox(src, caption) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    if (!lightbox || !lightboxImg || !lightboxCaption) return;

    lightboxImg.src = src;
    lightboxCaption.innerText = caption;
    lightbox.classList.add('active');
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) lightbox.classList.remove('active');
}

// Close lightbox on clicking outside image
const lightboxEl = document.getElementById('lightbox');
if (lightboxEl) {
    lightboxEl.addEventListener('click', function (e) {
        if (e.target !== document.getElementById('lightbox-img')) {
            closeLightbox();
        }
    });
}
