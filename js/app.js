'use strict'; // Kodun daha katı kurallarla ve hızlı çalışmasını sağlar

// ==========================================
// 1. LOADER (YÜKLEME EKRANI) ENTEGRASYONU
// ==========================================
window.addEventListener("load", () => {
    const loader = document.querySelector(".loader");

    // Eğer sayfada loader varsa işlemi yap
    if (loader) {
        // Loader'ı gizle (CSS'teki opacity transition başlar)
        loader.classList.add("loader-hidden");

        // Geçiş (transition) bittiğinde loader'ı DOM'dan tamamen kaldır
        loader.addEventListener("transitionend", () => {
            loader.remove(); 
        });
    }
});


// ==========================================
// 2. TAB SİSTEMİ (PERFORMANS ODAKLI)
// ==========================================
function setupTabs(buttonClass, contentClass) {
    const buttons = document.querySelectorAll(`.${buttonClass}`);
    
    // Eğer sayfada bu butondan yoksa fonksiyonu durdur
    if (buttons.length === 0) return;

    buttons.forEach(button => {
        button.addEventListener("click", function () {
            // 1. Aktif butonu bul ve pasif yap
            const activeBtn = document.querySelector(`.${buttonClass}.active`);
            if (activeBtn) {
                activeBtn.classList.remove("active");
            }
            
            // Tıklanan butonu aktif yap
            this.classList.add("active");

            // 2. Aktif içeriği bul ve gizle
            const activeContent = document.querySelector(`.${contentClass}.active`);
            if (activeContent) {
                activeContent.classList.remove("active");
            }

            // Hedef içeriği bul ve göster
            const targetId = this.getAttribute("data-target");
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.classList.add("active");
            }
        });
    });
}

// Fonksiyonları çağır
setupTabs("tab-btn", "content-text");
setupTabs("tab-btnn", "content-textt");
setupTabs("tab-btnnn", "content-texttt");


// ==========================================
// 3. NAVBAR AKTİF LİNK İŞARETLEME
// ==========================================
// Not: pathname kullanarak "?id=5" gibi uzantılarda bozulmasını engelledik
const currentPath = window.location.pathname; 
const navLinks = document.querySelectorAll('nav a');

navLinks.forEach(link => {
    // Linkin gittiği yol (pathname) ile şu anki yol eşleşiyor mu?
    // includes kullanmak bazen "/blog" altındaki "/blog/detay"ı da yakalamak için iyidir
    if (link.href.includes(currentPath) && currentPath !== "/") {
         link.classList.add('active');
    } 
    // Anasayfa kontrolü ("/" veya "/index.html")
    else if ((currentPath === "/" || currentPath.endsWith("index.html")) && link.getAttribute("href").includes("index.html")) {
        link.classList.add('active');
    }
    else {
        link.classList.remove('active');
    }
});