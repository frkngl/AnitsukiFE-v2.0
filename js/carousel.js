'use strict'; // JavaScript motorunun kodu daha hızlı ve güvenli işlemesini sağlar

document.addEventListener('DOMContentLoaded', function () {

  // ==========================================
  // 1. BOOTSTRAP CAROUSEL & PROGRESS BAR (ANA SLIDER)
  // ==========================================
  
  const carouselEl = document.getElementById('carouselExampleCaptions');

  // Sayfada ana slider varsa çalıştır, yoksa atla (Hata önleyici)
  if (carouselEl) {
    const progressBar = document.querySelector('.progress-circle .progress-bar');
    const timer = document.querySelector('.timer');
    const intervalTime = 10000; // 10 Saniye

    let startTime = null;
    let animationFrameId = null;
    let currentSlideIndex = 0;
    
    const slides = carouselEl.querySelectorAll('.carousel-item');
    const totalSlides = slides.length;

    // Alt elemanlar eksikse durdur
    if (progressBar && timer && totalSlides > 0) {
      
      // Bootstrap Carousel Başlatma
      let carousel;
      try {
        carousel = new bootstrap.Carousel(carouselEl, {
          interval: false, // Otomatik geçişi JS ile biz yöneteceğiz
          pause: false,
          ride: false
        });
      } catch (e) {
        console.warn('Bootstrap Carousel yüklenemedi:', e);
      }

      // Slayt Değiştirme Fonksiyonu
      const goToSlide = (index) => {
        if (!carousel) return;
        carousel.to(index);
        currentSlideIndex = index;
        startProgress();
      };

      // Progress Bar Animasyonu (GPU Dostu)
      const startProgress = () => {
        const r = 15; // SVG circle yarıçapı
        const circumference = 2 * Math.PI * r;
        
        // CSS stillerini sıfırla
        progressBar.style.strokeDasharray = `${circumference}`;
        progressBar.style.strokeDashoffset = `${circumference}`;

        if (animationFrameId) cancelAnimationFrame(animationFrameId);

        startTime = performance.now();

        const updateProgress = (currentTime) => {
          if (!startTime) startTime = currentTime;
          const elapsed = currentTime - startTime;
          const remainingTime = Math.max(intervalTime - elapsed, 0);
          
          const progressFraction = Math.min(elapsed / intervalTime, 1);
          const progressOffset = circumference * (1 - progressFraction);
          
          // Görsel Güncelleme
          progressBar.style.strokeDashoffset = progressOffset;
          timer.textContent = Math.ceil(remainingTime / 1000);

          if (progressFraction >= 1) {
            const nextSlideIndex = (currentSlideIndex + 1) % totalSlides;
            goToSlide(nextSlideIndex);
          } else {
            animationFrameId = requestAnimationFrame(updateProgress);
          }
        };

        animationFrameId = requestAnimationFrame(updateProgress);
      };

      // --- SWIPE (KAYDIRMA) DESTEĞİ ---
      let startX = null;
      let isDragging = false;
      const swipeThreshold = 50;

      const handleStart = (e) => {
        const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        startX = clientX;
        isDragging = true;
      };

      const handleMove = (e) => {
        if (!isDragging || startX === null) return;
      };

      const handleEnd = (e) => {
        if (!isDragging || startX === null) return;

        const clientX = e.type.includes('mouse') ? e.clientX : (e.changedTouches ? e.changedTouches[0].clientX : startX);
        const deltaX = clientX - startX;

        if (Math.abs(deltaX) > swipeThreshold) {
          if (deltaX > 0) {
            // Sağdan sola (Önceki)
            const prevSlideIndex = (currentSlideIndex - 1 + totalSlides) % totalSlides;
            goToSlide(prevSlideIndex);
          } else {
            // Soldan sağa (Sonraki)
            const nextSlideIndex = (currentSlideIndex + 1) % totalSlides;
            goToSlide(nextSlideIndex);
          }
        }

        isDragging = false;
        startX = null;
      };

      // Event Listener'lar (Passive: true -> Kaydırma performansını artırır)
      carouselEl.addEventListener('mousedown', handleStart);
      carouselEl.addEventListener('mouseup', handleEnd);
      carouselEl.addEventListener('mouseleave', handleEnd);
      
      carouselEl.addEventListener('touchstart', handleStart, { passive: true });
      carouselEl.addEventListener('touchmove', handleMove, { passive: true });
      carouselEl.addEventListener('touchend', handleEnd);

      // Bootstrap Slide Olayını Dinle (Manuel tıklamalarda barı sıfırla)
      carouselEl.addEventListener('slid.bs.carousel', (e) => {
        currentSlideIndex = e.to;
        startProgress();
      });

      // Sekme Görünürlük Kontrolü (Pil Tasarrufu)
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          const currentTime = performance.now();
          const elapsedSinceStart = currentTime - startTime;

          if (elapsedSinceStart >= intervalTime) {
            const nextSlideIndex = (currentSlideIndex + 1) % totalSlides;
            goToSlide(nextSlideIndex);
          } else {
            animationFrameId = requestAnimationFrame(() => startProgress());
          }
        } else {
          if (animationFrameId) cancelAnimationFrame(animationFrameId);
        }
      });

      // İlk Başlatma
      startProgress();
    }
  }


  // ==========================================
  // 2. SPLIDE SLIDER YAPILANDIRMASI
  // ==========================================

  // Eğer Splide kütüphanesi yüklenmediyse dur (Hata önleyici)
  if (typeof Splide === 'undefined') return;

  // Ortak Ayarlar (Kod tekrarını azaltmak için)
  const commonSplideOptions = {
    type: 'slide',
    perMove: 1,
    pagination: false,
    // HTML'de loading="lazy" kullandığımız için Splide'ınkini kapatıyoruz (Çakışmayı önler)
    lazyLoad: false, 
  };

  // --- SPLIDE 1 (Son İzlenenler) ---
  const splide1El = document.getElementById('splide1');
  if (splide1El) {
    new Splide(splide1El, {
      ...commonSplideOptions,
      perPage: 7,
      padding: { left: '8px', right: '8px' },
      breakpoints: {
        2200: { perPage: 6 },
        1700: { perPage: 5 },
        1400: { perPage: 5 },
        1200: { perPage: 4 },
        700:  { perPage: 3, padding: { left: '10px', right: '10px' } },
        450:  { perPage: 2 },
      },
    }).mount();
  }

  // --- SPLIDE 2 & 3 (Ortak Büyük Slider Ayarları) ---
  const largeSliderBreakpoints = {
    2300: { perPage: 8 },
    1700: { perPage: 7 },
    1400: { perPage: 6 },
    1200: { perPage: 5 },
    1000: { perPage: 4 },
    700:  { perPage: 3 },
    450:  { perPage: 2 },
  };

  const splide2El = document.getElementById('splide2');
  if (splide2El) {
    new Splide(splide2El, {
      ...commonSplideOptions,
      perPage: 9,
      padding: { left: '10px', right: '10px' },
      breakpoints: largeSliderBreakpoints
    }).mount();
  }

  const splide3El = document.getElementById('splide3');
  if (splide3El) {
    new Splide(splide3El, {
      ...commonSplideOptions,
      perPage: 9,
      padding: { left: '10px', right: '10px' },
      breakpoints: largeSliderBreakpoints
    }).mount();
  }

});