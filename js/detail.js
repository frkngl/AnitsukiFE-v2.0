'use strict';

document.addEventListener("DOMContentLoaded", function () {
    // 1. SVG İKONLARINI DEĞİŞKENLERE ATAYALIM (Okunabilirlik ve Temizlik)
    const ICONS = {
        play: '<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16"><path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393" /></svg>',
        pause: '<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-pause-fill" viewBox="0 0 16 16"><path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5m5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5"/></svg>',
        mute: '<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-volume-mute-fill" viewBox="0 0 16 16"><path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06m7.137 2.096a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0"/></svg>',
        unmute: '<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-volume-up-fill" viewBox="0 0 16 16"><path d="M11.536 14.01A8.47 8.47 0 0 0 14.026 8a8.47 8.47 0 0 0-2.49-6.01l-.708.707A7.48 7.48 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303z"/><path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.48 5.48 0 0 1 11.025 8a5.48 5.48 0 0 1-1.61 3.89z"/><path d="M8.707 11.182A4.5 4.5 0 0 0 10.025 8a4.5 4.5 0 0 0-1.318-3.182L8 5.525A3.5 3.5 0 0 1 9.025 8 3.5 3.5 0 0 1 8 10.475zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06"/></svg>'
    };

    // 2. DOM ELEMENTLERİNİ GÜVENLİ SEÇELİM
    const wrapper = document.querySelector('.videoimg');
    
    // Eğer sayfada bu element yoksa kodun hata vermesini engelle
    if (!wrapper) return;

    const video = wrapper.querySelector(".video");
    const playBigBtn = wrapper.querySelector(".playbutton");
    const playPauseBtn = wrapper.querySelector(".play-pause");
    const muteBtn = wrapper.querySelector(".mute");
    const box2 = wrapper.querySelector(".box2"); // Poster katmanı

    // 3. OYNAT / DURDUR MANTIĞI
    function togglePlay() {
        if (video.paused || video.ended) {
            video.play();
            // JS stili yerine CSS sınıfı ekliyoruz (Performans artışı)
            wrapper.classList.add('is-playing');
            playPauseBtn.innerHTML = ICONS.pause;
        } else {
            video.pause();
            wrapper.classList.remove('is-playing');
            playPauseBtn.innerHTML = ICONS.play;
        }
    }

    // 4. SES MANTIĞI
    function toggleMute() {
        video.muted = !video.muted;
        muteBtn.innerHTML = video.muted ? ICONS.mute : ICONS.unmute;
    }

    // 5. VIDEO BİTTİĞİNDE
    function handleVideoEnd() {
        wrapper.classList.remove('is-playing'); // Posteri geri getir
        playPauseBtn.innerHTML = ICONS.play;
    }

    // 6. OLAY DİNLEYİCİLERİ
    // .box2 (poster alanı) varsa tıklama özelliğini ona ver
    if (box2) {
        box2.addEventListener("click", togglePlay);
    } else if (playBigBtn) {
        // box2 yoksa direkt butona ver
        playBigBtn.addEventListener("click", togglePlay);
    }
    
    video.addEventListener("click", togglePlay);
    
    playPauseBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // Butona tıklayınca videonun click olayı tetiklenmesin
        togglePlay();
    });

    muteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleMute();
    });

    video.addEventListener("ended", handleVideoEnd);
});