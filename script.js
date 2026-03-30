/* ========================================
   Birthday Slideshow - Script
   ======================================== */

// State
let currentSlide = 0;
const totalSlides = 15;
let musicPlaying = false;
let particleInterval = null;

// Elements
const bgMusic = document.getElementById('bgMusic');
const landingPage = document.getElementById('landingPage');
const slideshowContainer = document.getElementById('slideshowContainer');
const musicToggle = document.getElementById('musicToggle');
const musicIcon = document.getElementById('musicIcon');
const slideVideo = document.getElementById('slideVideo');
const indicators = document.querySelectorAll('.indicator');
const slides = document.querySelectorAll('.slide');

// เล่นเพลงทันทีเมื่อคลิกที่หน้า landing
document.addEventListener('click', function startMusicOnFirstClick() {
    if (!musicPlaying) {
        playMusic();
    }
    document.removeEventListener('click', startMusicOnFirstClick);
}, { once: true });

// ========================================
// Start Slideshow
// ========================================
function startSlideshow() {
    // Hide landing
    landingPage.classList.add('hidden');
    
    // Show slideshow
    setTimeout(() => {
        slideshowContainer.classList.add('active');
        showSlide(0);
        
        // Start music if not already playing
        if (!musicPlaying) {
            playMusic();
        }
        
        // Start particles
        startParticles();
        
        // Burst confetti
        burstConfetti();
    }, 500);
    
    // Remove landing after transition
    setTimeout(() => {
        landingPage.style.display = 'none';
    }, 1500);
}

// ========================================
// Music Controls
// ========================================
function playMusic() {
    bgMusic.volume = 0.5;
    // เริ่มเพลงที่วินาทีที่ 35
    if (bgMusic.currentTime < 35 || bgMusic.ended) {
        bgMusic.currentTime = 35;
    }
    bgMusic.play().then(() => {
        musicPlaying = true;
        musicToggle.classList.add('playing');
        musicIcon.textContent = '🎵';
    }).catch(err => {
        console.log('Music autoplay prevented:', err);
        musicPlaying = false;
    });
}

// เมื่อเพลงจบ ให้ loop กลับไปที่วินาทีที่ 35
bgMusic.addEventListener('ended', () => {
    bgMusic.currentTime = 35;
    bgMusic.play();
});

function pauseMusic() {
    bgMusic.pause();
    musicPlaying = false;
    musicToggle.classList.remove('playing');
    musicIcon.textContent = '🔇';
}

function toggleMusic() {
    if (musicPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
}

// ========================================
// Slide Navigation
// ========================================
function showSlide(index) {
    // Clamp index
    if (index < 0) index = 0;
    if (index >= totalSlides) index = totalSlides - 1;
    
    // Handle video slide (index 3) - วิดีโอปิดเสียง เพลงเล่นต่อเนื่อง
    const wasVideoSlide = currentSlide === 13;
    const isVideoSlide = index === 13;
    
    // If leaving video slide, pause video
    if (wasVideoSlide && !isVideoSlide) {
        slideVideo.pause();
        slideVideo.currentTime = 0;
    }
    
    // If entering video slide, autoplay video (muted)
    if (isVideoSlide && !wasVideoSlide) {
        setTimeout(() => {
            slideVideo.play().catch(err => console.log('Video play error:', err));
        }, 600);
    }
    
    currentSlide = index;
    
    // Update slides
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
    
    // Update indicators
    indicators.forEach((ind, i) => {
        ind.classList.toggle('active', i === index);
    });
    
    // Confetti on final slide
    if (index === totalSlides - 1) {
        burstConfetti();
    }
}

function nextSlide() {
    if (currentSlide < totalSlides - 1) {
        showSlide(currentSlide + 1);
    }
}

function prevSlide() {
    if (currentSlide > 0) {
        showSlide(currentSlide - 1);
    }
}

function goToSlide(index) {
    showSlide(index);
}

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    if (landingPage.style.display !== 'none') return;
    
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        nextSlide();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        prevSlide();
    } else if (e.key === ' ') {
        e.preventDefault();
        toggleMusic();
    }
});

// Touch/Swipe Support
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const diff = touchStartX - touchEndX;
    const threshold = 50;
    
    if (Math.abs(diff) < threshold) return;
    
    if (diff > 0) {
        nextSlide(); // Swipe left = next
    } else {
        prevSlide(); // Swipe right = prev
    }
}

// ========================================
// Particle System
// ========================================
function startParticles() {
    const container = document.getElementById('particles');
    const emojis = ['❤️', '💖', '💕', '✨', '🌟', '💗', '🎀', '⭐'];
    
    particleInterval = setInterval(() => {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        
        const x = Math.random() * 100;
        const size = 0.5 + Math.random() * 1.2;
        const duration = 6 + Math.random() * 8;
        
        particle.style.left = x + '%';
        particle.style.bottom = '-20px';
        particle.style.fontSize = size + 'rem';
        particle.style.animationDuration = duration + 's';
        
        container.appendChild(particle);
        
        // Remove after animation
        setTimeout(() => {
            particle.remove();
        }, duration * 1000);
    }, 800);
}

// ========================================
// Confetti Effect
// ========================================
function burstConfetti() {
    const colors = ['#ff6b9d', '#c084fc', '#fbbf24', '#ff8fbf', '#fde68a', '#e84580'];
    const shapes = ['circle', 'square'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            const color = colors[Math.floor(Math.random() * colors.length)];
            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            const x = Math.random() * 100;
            const size = 5 + Math.random() * 10;
            const duration = 2 + Math.random() * 3;
            
            confetti.style.left = x + '%';
            confetti.style.top = '-10px';
            confetti.style.width = size + 'px';
            confetti.style.height = size + 'px';
            confetti.style.backgroundColor = color;
            confetti.style.borderRadius = shape === 'circle' ? '50%' : '2px';
            confetti.style.animationDuration = duration + 's';
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, duration * 1000);
        }, i * 50);
    }
}

// ========================================
// Video Event Listeners
// ========================================
slideVideo.addEventListener('ended', () => {
    // When video ends, go to next slide
    nextSlide();
});

// ========================================
// Landing Page Particles
// ========================================
(function landingParticles() {
    const container = document.getElementById('particles');
    const emojis = ['✨', '💖', '🌟', '⭐', '💕'];
    
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            createLandingParticle(container, emojis);
        }, i * 600);
    }
    
    const landingInterval = setInterval(() => {
        if (landingPage.style.display === 'none') {
            clearInterval(landingInterval);
            return;
        }
        createLandingParticle(container, emojis);
    }, 1200);
})();

function createLandingParticle(container, emojis) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    
    const x = Math.random() * 100;
    const duration = 8 + Math.random() * 6;
    
    particle.style.left = x + '%';
    particle.style.bottom = '-20px';
    particle.style.fontSize = (0.8 + Math.random() * 0.8) + 'rem';
    particle.style.animationDuration = duration + 's';
    
    container.appendChild(particle);
    
    setTimeout(() => {
        particle.remove();
    }, duration * 1000);
}
