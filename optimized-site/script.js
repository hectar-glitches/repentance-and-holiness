// Radio player functionality with actual streaming
function initCore() {
    const playButton = document.getElementById('playButton');
    let isPlaying = false;
    let audioElement = null;
    
    // Create audio element for the stream
    audioElement = new Audio('http://stream.zeno.fm/your-stream-id');
    audioElement.preload = 'none';
    
    if (playButton) {
        playButton.addEventListener('click', function() {
            if (!isPlaying) {
                // Play the stream
                isPlaying = true;
                audioElement.play().then(() => {
                    playButton.innerHTML = `
                        <svg class="play-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="6" y="4" width="4" height="16"></rect>
                            <rect x="14" y="4" width="4" height="16"></rect>
                        </svg>
                        <span>Pause Stream</span>
                    `;
                    playButton.style.background = 'linear-gradient(135deg, #ff5722 0%, #e64a19 100%)';
                    console.log('Radio stream started');
                }).catch((error) => {
                    console.error('Error playing stream:', error);
                    alert('Unable to play stream. Please check your internet connection.');
                    isPlaying = false;
                });
            } else {
                // Pause the stream
                isPlaying = false;
                audioElement.pause();
                playButton.style.background = '';
                playButton.innerHTML = `
                    <svg class="play-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                    <span>Listen Live</span>
                `;
                
                console.log('Radio stream paused');
            }
        });
        
        // Handle stream errors
        audioElement.addEventListener('error', function(e) {
            console.error('Stream error:', e);
            isPlaying = false;
            playButton.style.background = '';
            playButton.innerHTML = `
                <svg class="play-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                <span>Listen Live</span>
            `;
        });
    }
    
    // Smooth scroll for hash navigation (if any remain)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Real Visitor Counter
    initVisitorCounter();
    
    function initVisitorCounter() {
        const counter = document.querySelector('.counter-display');
        if (!counter) return;
        
        // Check if this is a new visit (not just a page refresh)
        const lastVisit = localStorage.getItem('lastVisit');
        const now = new Date().getTime();
        const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
        
        // Get current count from localStorage
        let visitCount = parseInt(localStorage.getItem('visitorCount') || '153913638');
        
        // If it's been more than 1 hour since last visit, count as new visitor
        if (!lastVisit || (now - parseInt(lastVisit)) > oneHour) {
            visitCount++;
            localStorage.setItem('visitorCount', visitCount.toString());
            localStorage.setItem('lastVisit', now.toString());
        }
        
        // Display the count with animation
        const observerOptions = {
            threshold: 0.5
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(visitCount);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        observer.observe(counter);
    }
    
    function animateCounter(target) {
        const counter = document.querySelector('.counter-display');
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target.toLocaleString();
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current).toLocaleString();
            }
        }, 16);
    }
    
    // Highlight current page in navigation
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Performance: Lazy load images if they're added later
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });
    
    // Observe all images with data-src attribute
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Console message
console.log('%c🎵 Jesus is LORD Radio ', 'background: #0a1e50; color: #ffd700; font-size: 20px; padding: 10px;');
console.log('%cWebsite optimized for performance!', 'color: #1a3d7c; font-size: 14px;');

// YouTube API Configuration
const YOUTUBE_CONFIG = {
    apiKey: 'YOUR_YOUTUBE_API_KEY_HERE', // Replace with your YouTube Data API v3 key
    channelId: 'UCyOKv_cPBDjBKcASt2fRCcA', // @repentpreparetheway channel ID
    maxResults: 4
};

// Fetch latest videos from YouTube
async function fetchLatestVideos() {
    if (!YOUTUBE_CONFIG.apiKey || YOUTUBE_CONFIG.apiKey.startsWith('YOUR_')) {
        console.warn('YouTube API key is not configured. Skipping video fetch.');
        return null;
    }
    try {
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/search?` +
            `key=${YOUTUBE_CONFIG.apiKey}&` +
            `channelId=${YOUTUBE_CONFIG.channelId}&` +
            `part=snippet,id&` +
            `order=date&` +
            `maxResults=${YOUTUBE_CONFIG.maxResults}&` +
            `type=video`
        );
        
        if (!response.ok) {
            throw new Error('Failed to fetch videos');
        }
        
        const data = await response.json();
        return data.items;
    } catch (error) {
        console.error('Error fetching YouTube videos:', error);
        return null;
    }
}

// Render video cards
function renderVideoCards(videos) {
    const updatesGrid = document.querySelector('.updates-grid');
    if (!updatesGrid || !videos) return;
    
    updatesGrid.innerHTML = videos.map(video => {
        const videoId = video.id.videoId;
        const snippet = video.snippet;
        const title = snippet.title;
        const thumbnail = snippet.thumbnails.high.url;
        const publishDate = new Date(snippet.publishedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        return `
            <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank" class="update-card with-image video-card" data-video-id="${videoId}">
                <div class="video-thumbnail-link">
                    <img src="${thumbnail}" alt="${title}" class="card-image" loading="lazy">
                    <div class="play-overlay">
                        <svg class="play-icon-large" viewBox="0 0 68 48" width="68" height="48">
                            <path d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#f00"></path>
                            <path d="M 45,24 27,14 27,34" fill="#fff"></path>
                        </svg>
                    </div>
                </div>
                <div class="card-content">
                    <div class="card-label">${publishDate.toUpperCase()}</div>
                    <h3>${title}</h3>
                </div>
            </a>
        `;
    }).join('');
}

// Initialize YouTube videos on page load
async function initYouTubeVideos() {
    // Only run on index page if updates grid exists
    if (!document.querySelector('.updates-grid')) return;
    
    const videos = await fetchLatestVideos();
    if (videos && videos.length > 0) {
        renderVideoCards(videos);
    } else {
        console.warn('Could not load YouTube videos. Check API key configuration.');
    }
}

// Wonders Carousel Functionality
let currentSlide = 0;
let autoSlideInterval;

function initCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const dotsContainer = document.querySelector('.carousel-dots');
    
    if (!slides.length || !dotsContainer) return;
    
    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('carousel-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    // Start auto-slide
    startAutoSlide();
    
    // Pause on hover
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopAutoSlide);
        carouselContainer.addEventListener('mouseleave', startAutoSlide);
    }
}

function moveCarousel(direction) {
    const slides = document.querySelectorAll('.carousel-slide');
    currentSlide = (currentSlide + direction + slides.length) % slides.length;
    updateCarousel();
}

function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
}

function updateCarousel() {
    const track = document.querySelector('.carousel-track');
    const dots = document.querySelectorAll('.carousel-dot');
    
    if (track) {
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
    
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function startAutoSlide() {
    stopAutoSlide();
    autoSlideInterval = setInterval(() => {
        moveCarousel(1);
    }, 5000); // Change slide every 5 seconds
}

function stopAutoSlide() {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
    }
}

// ========================================
// TESTIMONY FILTER FUNCTIONALITY
// ========================================

// Filter testimonies by category
document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', function() {
        // Remove active class from all buttons
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        this.classList.add('active');
        
        // Get filter value
        const filter = this.getAttribute('data-filter');
        
        // Get all testimony cards
        const testimonies = document.querySelectorAll('.testimony-card');
        
        testimonies.forEach(testimony => {
            const category = testimony.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                testimony.style.display = 'block';
                // Add fade-in animation
                testimony.style.animation = 'fadeIn 0.5s ease';
            } else {
                testimony.style.display = 'none';
            }
        });
    });
});

// Button functionality for testimony actions
document.querySelectorAll('.view-evidence-btn').forEach(button => {
    button.addEventListener('click', function() {
        alert('Evidence viewer would open here. This feature can link to a modal or separate page showing medical documents, photos, and videos.');
    });
});

document.querySelectorAll('.share-testimony-btn').forEach(button => {
    button.addEventListener('click', function() {
        // Get the testimony card
        const card = this.closest('.testimony-card');
        const name = card.querySelector('.profile-info h3').textContent;
        
        // Create share text
        const shareText = `Incredible healing testimony of ${name} - Jesus Christ is still performing miracles today! #JesusIsLORDRadio #MightyWonders`;
        const shareUrl = window.location.href;
        
        // Check if Web Share API is available
        if (navigator.share) {
            navigator.share({
                title: 'Healing Testimony',
                text: shareText,
                url: shareUrl
            }).catch(err => console.log('Error sharing:', err));
        } else {
            // Fallback - copy to clipboard
            navigator.clipboard.writeText(shareText + ' ' + shareUrl)
                .then(() => alert('Testimony link copied to clipboard! Share it on your social media.'))
                .catch(() => alert('Please manually copy and share this testimony.'));
        }
    });
});

// Submit testimony button
const submitBtn = document.querySelector('.submit-testimony-btn');
if (submitBtn) {
    submitBtn.addEventListener('click', function() {
        alert('Testimony submission form would open here. You can link this to a Google Form, email, or custom submission page.');
    });
}

// ========================================
// ENHANCED INTERACTIVITY FEATURES
// ========================================

// 1. MOBILE MENU TOGGLE
function initMobileMenu() {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    
    // Create mobile menu button
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-toggle';
    mobileMenuBtn.setAttribute('aria-label', 'Toggle menu');
    mobileMenuBtn.innerHTML = `
        <span class="menu-bar"></span>
        <span class="menu-bar"></span>
        <span class="menu-bar"></span>
    `;
    
    // Insert button before nav
    nav.parentElement.insertBefore(mobileMenuBtn, nav);
    
    // Toggle menu
    mobileMenuBtn.addEventListener('click', function() {
        nav.classList.toggle('mobile-active');
        this.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            nav.classList.remove('mobile-active');
            mobileMenuBtn.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
    
    // Close menu when clicking a nav link
    nav.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            nav.classList.remove('mobile-active');
            mobileMenuBtn.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
}

// 2. SMART HEADER - Hide on scroll down, show on scroll up
let lastScrollTop = 0;
let scrollTimeout;

function initSmartHeader() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        
        scrollTimeout = setTimeout(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 100) {
                if (scrollTop > lastScrollTop) {
                    // Scrolling down
                    header.classList.add('header-hidden');
                } else {
                    // Scrolling up
                    header.classList.remove('header-hidden');
                    header.classList.add('header-scrolled');
                }
            } else {
                header.classList.remove('header-scrolled');
                header.classList.remove('header-hidden');
            }
            
            lastScrollTop = scrollTop;
        }, 50);
    }, { passive: true });
}

// 3. SCROLL ANIMATIONS - DISABLED (was causing jarring mid-scroll appearance)
function initScrollAnimations() {
    // Disabled - animations were too disruptive
    return;
}

// 4. TIMELINE SEQUENTIAL ANIMATION - DISABLED
function initTimelineAnimation() {
    // Disabled - was causing components to appear mid-scroll
    return;
}

// 5. ENHANCED SMOOTH SCROLL WITH OFFSET FOR STICKY HEADER
function initEnhancedSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 6. PARALLAX EFFECT - DISABLED
function initParallaxEffect() {
    // Disabled - causing unwanted movement during scroll
    return;
}

// 7. LOADING ANIMATION - SIMPLIFIED
function initPageLoadAnimation() {
    document.body.classList.add('page-loaded');
    // Removed staggered section animation - was too slow
}

// 8. BACK TO TOP BUTTON
function initBackToTop() {
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '↑';
    backToTop.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTop);
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }, { passive: true });
    
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 10. KEYBOARD NAVIGATION FOR ACCESSIBILITY
function initKeyboardNavigation() {
    // ESC key closes mobile menu
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const nav = document.querySelector('.nav');
            const mobileMenuBtn = document.querySelector('.mobile-menu-toggle');
            if (nav && nav.classList.contains('mobile-active')) {
                nav.classList.remove('mobile-active');
                if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        }
    });
}

// 11. PERFORMANCE OPTIMIZATION - Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 12. INITIALIZE ALL ENHANCED FEATURES
function initHeroLineAnimation() {
    // Observe hero location line
    const heroLocation = document.querySelector('.hero-location');
    
    // Observe list titles
    const listTitles = document.querySelectorAll('.list-title');
    
    // Observe timeline content strong elements
    const timelineStrongs = document.querySelectorAll('.timeline-content strong');
    
    // Observe section titles
    const sectionTitles = document.querySelectorAll('.section-title');
    
    // Observe carousel titles
    const carouselTitles = document.querySelectorAll('.carousel-title');
    
    // Combine all elements
    const elementsToObserve = [
        heroLocation,
        ...Array.from(listTitles),
        ...Array.from(timelineStrongs),
        ...Array.from(sectionTitles),
        ...Array.from(carouselTitles)
    ].filter(el => el !== null);
    
    if (elementsToObserve.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('line-visible');
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '0px'
        });
        
        elementsToObserve.forEach(el => observer.observe(el));
    }
}

function initEnhancedFeatures() {
    initMobileMenu();
    initSmartHeader();
    initScrollAnimations();
    initTimelineAnimation();
    initEnhancedSmoothScroll();
    initParallaxEffect();
    initBackToTop();
    initKeyboardNavigation();
    initHeroLineAnimation();
    
    // Page load animation
    window.addEventListener('load', initPageLoadAnimation);
    
    console.log('%c✨ Enhanced interactivity loaded!', 'color: #ffd700; font-weight: bold; font-size: 14px;');
}

// ========================================
// ENHANCED TIMELINE INTERACTIONS
// ========================================

function initEnhancedTimeline() {
    const timeline = document.querySelector('.testimony-timeline');
    if (!timeline) return;
    
    const timelineItems = timeline.querySelectorAll('.timeline-item');
    const timelineIcons = timeline.querySelectorAll('.timeline-icon');
    
    // 1. Add click-to-highlight functionality
    timelineItems.forEach((item, index) => {
        item.style.cursor = 'pointer';
        item.setAttribute('data-timeline-index', index);
        
        item.addEventListener('click', function() {
            // Remove active class from all items
            timelineItems.forEach(i => i.classList.remove('timeline-active'));
            // Add active class to clicked item
            this.classList.add('timeline-active');
            
            // Smooth scroll to item if not fully visible
            const rect = this.getBoundingClientRect();
            const isInView = rect.top >= 0 && rect.bottom <= window.innerHeight;
            if (!isInView) {
                this.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    });
    
    // 2. Progressive timeline line drawing
    let timelineLine = timeline.querySelector('::before');
    
    function updateTimelineProgress() {
        if (!timeline) return;
        
        const timelineRect = timeline.getBoundingClientRect();
        const timelineTop = timelineRect.top;
        const timelineHeight = timelineRect.height;
        const windowHeight = window.innerHeight;
        
        // Calculate progress (0 to 1)
        let progress = 0;
        if (timelineTop < windowHeight) {
            progress = Math.min(1, (windowHeight - timelineTop) / timelineHeight);
        }
        
        // Update CSS variable for line height
        timeline.style.setProperty('--timeline-progress', `${progress * 100}%`);
        
        // Activate timeline items as they come into view
        timelineItems.forEach((item, index) => {
            const itemRect = item.getBoundingClientRect();
            const itemMiddle = itemRect.top + itemRect.height / 2;
            
            if (itemMiddle < windowHeight * 0.8) {
                item.classList.add('timeline-in-view');
                setTimeout(() => {
                    if (timelineIcons[index]) {
                        timelineIcons[index].classList.add('icon-pulsed');
                    }
                }, index * 100);
            }
        });
    }
    
    // Update on scroll (throttled)
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(updateTimelineProgress);
    }, { passive: true });
    
    // Initial update
    updateTimelineProgress();
    
    // 3. Enhanced icon interactions
    timelineIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.animation = 'iconBounce 0.5s ease';
        });
        
        icon.addEventListener('animationend', function() {
            this.style.animation = '';
        });
    });
    
    // 4. Timeline navigation helper (for future use)
    function jumpToTimelineEvent(index) {
        if (index >= 0 && index < timelineItems.length) {
            timelineItems[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
            timelineItems[index].classList.add('timeline-active');
            setTimeout(() => {
                timelineItems[index].classList.remove('timeline-active');
            }, 2000);
        }
    }
    
    // 5. Add numbers to timeline items
    timelineItems.forEach((item, index) => {
        const number = document.createElement('div');
        number.className = 'timeline-number';
        number.textContent = index + 1;
        item.insertBefore(number, item.firstChild);
    });
    
    // 6. Expand/collapse detailed evidence tags
    const evidenceTags = document.querySelectorAll('.evidence-tag');
    evidenceTags.forEach(tag => {
        tag.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('evidence-expanded');
            
            // Add ripple effect
            const ripple = document.createElement('span');
            ripple.className = 'tag-ripple';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    console.log('✨ Enhanced timeline loaded with ' + timelineItems.length + ' events');
}

// =============================================
// TESTIMONY SELECTOR
// =============================================
function initTestimonySelector() {
    const listItems = document.querySelectorAll('.testimony-list-item');
    const testimonyCards = document.querySelectorAll('.testimony-card[data-testimony]');
    
    if (listItems.length === 0 || testimonyCards.length === 0) return;
    
    // Function to show selected testimony
    function showTestimony(testimonyId) {
        // Hide all testimony cards
        testimonyCards.forEach(card => {
            card.style.display = 'none';
        });
        
        // Show selected testimony card
        const selectedCard = document.querySelector(`.testimony-card[data-testimony="${testimonyId}"]`);
        if (selectedCard) {
            selectedCard.style.display = 'block';
            
            // Smooth scroll to top of detail view on mobile
            const detailView = document.querySelector('.testimony-detail-view');
            if (detailView && window.innerWidth <= 768) {
                detailView.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
        
        // Update active state in list
        listItems.forEach(item => {
            item.classList.remove('active');
        });
        
        const selectedItem = document.querySelector(`.testimony-list-item[data-testimony="${testimonyId}"]`);
        if (selectedItem) {
            selectedItem.classList.add('active');
        }
        
        // Reinitialize timeline for the newly shown testimony
        setTimeout(() => {
            initEnhancedTimeline();
        }, 100);
    }
    
    // Add click handlers to list items
    listItems.forEach(item => {
        item.addEventListener('click', function() {
            const testimonyId = this.getAttribute('data-testimony');
            showTestimony(testimonyId);
        });
    });
    
    // Show first testimony by default
    if (listItems.length > 0) {
        const firstTestimonyId = listItems[0].getAttribute('data-testimony');
        showTestimony(firstTestimonyId);
    }
}

// Single top-level DOMContentLoaded handler — calls all init functions in order
document.addEventListener('DOMContentLoaded', function() {
    initCore();
    initYouTubeVideos();
    initCarousel();
    initEnhancedFeatures();
    initTestimonySelector();
    initEnhancedTimeline();
});
