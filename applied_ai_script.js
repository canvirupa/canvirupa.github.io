document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('aiVisualizationCanvas');
    if (!canvas) {
        console.error('Error: Canvas element not found for AI visualization.');
        return;
    }
    const ctx = canvas.getContext('2d');

    let particlesArray;

    // Set canvas dimensions
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); // Initial resize

    // Particle class
    class Particle {
        constructor(x, y, size, color, speedX, speedY) {
            this.x = x;
            this.y = y;
            this.size = size;
            this.color = color;
            this.speedX = speedX;
            this.speedY = speedY;
        }

        // Method to draw individual particle
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fill();
        }

        // Method to update particle position
        update() {
            // Wall collision
            if (this.x + this.size > canvas.width || this.x - this.size < 0) {
                this.speedX = -this.speedX;
            }
            if (this.y + this.size > canvas.height || this.y - this.size < 0) {
                this.speedY = -this.speedY;
            }

            // Move particle
            this.x += this.speedX;
            this.y += this.speedY;

            this.draw();
        }
    }

    // Create particle array
    function initParticles() {
        particlesArray = [];
        const numberOfParticles = 50; // Adjust for density
        const baseColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim() || '#00A1FF';

        for (let i = 0; i < numberOfParticles; i++) {
            let size = Math.random() * 1.5 + 0.5; // Smaller particles
            let x = Math.random() * (canvas.width - size * 2) + size;
            let y = Math.random() * (canvas.height - size * 2) + size;
            let speedX = (Math.random() * 0.4 - 0.2); // Slow movement
            let speedY = (Math.random() * 0.4 - 0.2);
            
            // Create a slightly varying color from the accent color
            let colorVariation = Math.floor(Math.random() * 30) - 15; // -15 to +15
            let r = parseInt(baseColor.slice(1,3), 16) + colorVariation;
            let g = parseInt(baseColor.slice(3,5), 16) + colorVariation;
            let b = parseInt(baseColor.slice(5,7), 16) + colorVariation;
            // Clamp values
            r = Math.max(0, Math.min(255, r));
            g = Math.max(0, Math.min(255, g));
            b = Math.max(0, Math.min(255, b));
            let color = `rgba(${r},${g},${b}, ${Math.random() * 0.5 + 0.3})`; // Varying opacity

            particlesArray.push(new Particle(x, y, size, color, speedX, speedY));
        }
    }

    // Animation loop
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        requestAnimationFrame(animateParticles);
    }

    // Mouse interaction (optional - subtle effect)
    let mouse = {
        x: null,
        y: null,
        radius: 75 // Reduced radius for more subtle effect
    };

    window.addEventListener('mousemove', (event) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;
    });
    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Modify particle update for mouse interaction
    Particle.prototype.update = function() {
        // Wall collision
        if (this.x + this.size > canvas.width || this.x - this.size < 0) {
            this.speedX = -this.speedX;
        }
        if (this.y + this.size > canvas.height || this.y - this.size < 0) {
            this.speedY = -this.speedY;
        }

        // Mouse interaction
        if (mouse.x && mouse.y) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < mouse.radius + this.size) {
                if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                    this.x += 0.5; // Gently push away
                }
                if (mouse.x > this.x && this.x > this.size * 10) {
                    this.x -= 0.5;
                }
                if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                    this.y += 0.5;
                }
                if (mouse.y > this.y && this.y > this.size * 10) {
                    this.y -= 0.5;
                }
            }
        }

        // Move particle
        this.x += this.speedX;
        this.y += this.speedY;

        this.draw();
    };
    
    // Re-initialize particles on resize to adjust density and positions
    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles(); // Recreate particles for new canvas size
    });


    // Initialize and start animation
    initParticles();
    animateParticles();

    // Debug: Log if script runs
    console.log("Applied AI script loaded and hero animation started.");

    // --- Curriculum Accordion ---
    const moduleHeaders = document.querySelectorAll('.module-header');

    moduleHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const currentModule = header.parentElement; // .curriculum-module
            const toggleIcon = header.querySelector('.module-toggle-icon');
            const isOpen = currentModule.classList.contains('module-open');

            // Accordion Behavior - Close other open modules
            moduleHeaders.forEach(otherHeader => {
                const otherModule = otherHeader.parentElement;
                if (otherModule !== currentModule && otherModule.classList.contains('module-open')) {
                    otherModule.classList.remove('module-open');
                    otherHeader.querySelector('.module-toggle-icon').textContent = '+';
                    // Ensure CSS transition for max-height is respected when auto-closing
                    otherModule.querySelector('.module-content').style.maxHeight = null; 
                }
            });

            // Toggle current module
            if (isOpen) {
                currentModule.classList.remove('module-open');
                toggleIcon.textContent = '+';
                currentModule.querySelector('.module-content').style.maxHeight = null;
            } else {
                currentModule.classList.add('module-open');
                toggleIcon.textContent = '–';
                // Set max-height to scrollHeight for dynamic content height
                const content = currentModule.querySelector('.module-content');
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });
    console.log("Curriculum accordion initialized.");

    // --- Intersection Observer for Scroll Animations ---
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the element is visible
    };

    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                if (!prefersReducedMotion.matches) {
                    // Add a class to trigger the animation
                    entry.target.classList.add('is-visible');
                    
                    // Apply staggered delay if the parent has 'stagger-children'
                    if (entry.target.parentElement.classList.contains('stagger-children')) {
                        entry.target.style.transitionDelay = `${index * 100}ms`;
                    }
                } else {
                    // If reduced motion is preferred, just make it visible without animation
                    entry.target.classList.add('is-visible-no-animation');
                }
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, observerOptions);

    // Select elements to animate
    const animatedElements = document.querySelectorAll(
        '.fade-in-up, .slide-in-left, .slide-in-right, .scale-in, .feature-card, .instructor-profile, .testimonial-item, #value-prop h2, #value-prop p, #community .community-text, #community .community-visual-placeholder, #curriculum h2, #instructors h2, #testimonials h2, #enroll h2, #enroll .enroll-subtitle, #enroll .btn, #enroll .enroll-secondary-info, #faq h2'
    );
    
    animatedElements.forEach(el => {
        // Add a base class for initial state if not already animated by specific class
        if (!el.classList.contains('feature-card') && !el.classList.contains('instructor-profile') && !el.classList.contains('testimonial-item')) {
             el.classList.add('reveal-on-scroll'); // General class for initial hidden state
        }
        animationObserver.observe(el);
    });

    // Stagger parent setup
    const staggerParents = document.querySelectorAll('.features-grid, .instructors-grid, .testimonials-grid');
    staggerParents.forEach(parent => {
        parent.classList.add('stagger-children');
        // Children .feature-card, .instructor-profile, .testimonial-item are already targeted by animatedElements
    });

    console.log("Intersection Observer for scroll animations initialized.");

    // --- Smooth Scrolling for Navigation Links ---
    const navLinks = document.querySelectorAll('header nav ul li a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = document.querySelector('header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    console.log("Smooth scrolling initialized.");

    // --- Active Nav Link Highlighting ---
    const sections = document.querySelectorAll('main section[id]');
    const headerNavLinks = document.querySelectorAll('header nav ul li a');
    
    function highlightNavLinks() {
        let currentSectionId = '';
        const headerHeight = document.querySelector('header').offsetHeight;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 50; // Adjust offset as needed
            const sectionBottom = sectionTop + section.offsetHeight;
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionBottom) {
                currentSectionId = section.getAttribute('id');
            }
        });

        headerNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }
    window.addEventListener('scroll', highlightNavLinks);
    window.addEventListener('load', highlightNavLinks); // Initial check
    console.log("Active nav link highlighting initialized.");

    // --- FAQ Accordion ---
    const faqQuestionHeaders = document.querySelectorAll('.faq-question-header');

    faqQuestionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const currentFaqItem = header.parentElement; // .faq-item
            const toggleIcon = header.querySelector('.faq-toggle-icon');
            const answerContent = currentFaqItem.querySelector('.faq-answer-content');
            const isOpen = currentFaqItem.classList.contains('faq-open');

            // Optional: Accordion behavior - close other open FAQs
            // faqQuestionHeaders.forEach(otherHeader => {
            //     const otherFaqItem = otherHeader.parentElement;
            //     if (otherFaqItem !== currentFaqItem && otherFaqItem.classList.contains('faq-open')) {
            //         otherFaqItem.classList.remove('faq-open');
            //         otherHeader.querySelector('.faq-toggle-icon').textContent = '+';
            //         otherFaqItem.querySelector('.faq-answer-content').style.maxHeight = null;
            //     }
            // });

            if (isOpen) {
                currentFaqItem.classList.remove('faq-open');
                toggleIcon.textContent = '+';
                answerContent.style.maxHeight = null;
            } else {
                currentFaqItem.classList.add('faq-open');
                toggleIcon.textContent = '–';
                answerContent.style.maxHeight = answerContent.scrollHeight + "px";
            }
        });
    });
    console.log("FAQ accordion initialized.");

    // --- Dynamic Year in Footer ---
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
        console.log("Footer year updated.");
    } else {
        console.error("Error: Span with ID 'currentYear' not found in footer.");
    }
});
