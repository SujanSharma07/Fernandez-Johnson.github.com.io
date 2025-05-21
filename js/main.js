/**
 * Fernandez & Johnson - Main JavaScript
 */

// DOM Elements
const navbar = document.getElementById('navbar');
const scrollTopBtn = document.getElementById('scroll-top');
const mobileNavToggle = document.querySelector('.nav-toggle');
const mobileNav = document.querySelector('.mobile-nav');
const testimonialDots = document.querySelectorAll('.testimonial-dots .dot');
const testimonials = document.querySelectorAll('.testimonial');
const yearSpan = document.getElementById('current-year');

// Initialize AOS (Animate on Scroll)
AOS.init({
    duration: 800,
    once: false,
    easing: 'ease-in-out',
    offset: 120 // Added offset for better animation timing
});

// Set current year in footer
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

// Navbar scroll effect
function handleScroll() {
    const scrollY = window.scrollY || window.pageYOffset;
    
    // Change navbar on scroll
    navbar.classList.toggle('scrolled', scrollY > 50);
    
    // Show/hide scroll to top button
    scrollTopBtn.classList.toggle('visible', scrollY > 300);
}

// Toggle mobile navigation
function toggleMobileNav() {
    document.body.classList.toggle('nav-open'); // Added body class for better mobile handling
    mobileNav.classList.toggle('active');
    
    const icon = mobileNavToggle.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
}

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Testimonial management
let testimonialInterval;
let currentTestimonial = 0;

function showTestimonial(index) {
    currentTestimonial = index;
    
    testimonials.forEach((t, i) => t.classList.toggle('active', i === index));
    testimonialDots.forEach((d, i) => d.classList.toggle('active', i === index));
    
    // Reset auto-advance timer
    resetTestimonialInterval();
}

function startTestimonialInterval() {
    testimonialInterval = setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }, 5000);
}

function resetTestimonialInterval() {
    clearInterval(testimonialInterval);
    startTestimonialInterval();
}

// Form handling improvements
async function handleContactForm(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    const formMessages = document.getElementById('form-messages');

    // Clear previous messages
    formMessages.innerHTML = '';
    formMessages.classList.remove('success', 'error');

    // Validate form
    if (!validateForm(form)) return;

    try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

        // Using fetch instead of EmailJS for wider compatibility
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            formMessages.innerHTML = `
                <div class="alert-success">
                    <i class="fas fa-check-circle"></i> Message sent successfully!
                </div>
            `;
            form.reset();
        } else {
            throw new Error('Server error');
        }
    } catch (error) {
        formMessages.innerHTML = `
            <div class="alert-error">
                <i class="fas fa-exclamation-circle"></i> Error sending message. Please try again.
            </div>
        `;
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Send Message';
    }
}

// Enhanced validation
function validateForm(form) {
    let isValid = true;
    const elements = form.elements;

    for (let element of elements) {
        if (element.required && !element.value.trim()) {
            showError(element, 'This field is required');
            isValid = false;
        } else if (element.type === 'email' && !isValidEmail(element.value)) {
            showError(element, 'Invalid email address');
            isValid = false;
        }
    }

    return isValid;
}

// Helper functions
function showError(field, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
    field.classList.add('error');
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initial setup
    handleScroll();
    
    // Event listeners
    window.addEventListener('scroll', handleScroll);
    
    mobileNavToggle?.addEventListener('click', toggleMobileNav);
    scrollTopBtn?.addEventListener('click', scrollToTop);
    
    // Testimonial controls
    testimonialDots.forEach((dot, index) => {
        dot.addEventListener('click', () => showTestimonial(index));
    });
    
    if (testimonials.length > 0) {
        startTestimonialInterval();
    }

    // Form handling
    document.getElementById('contactForm')?.addEventListener('submit', handleContactForm);

    // Enhanced smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#0') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (!target) return;

            const headerOffset = navbar?.offsetHeight || 80;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            if (mobileNav.classList.contains('active')) {
                toggleMobileNav();
            }
        });
    });
});

// Resize observer for responsive adjustments
const resizeObserver = new ResizeObserver(entries => {
    handleScroll();
    AOS.refresh();
});

resizeObserver.observe(document.documentElement);