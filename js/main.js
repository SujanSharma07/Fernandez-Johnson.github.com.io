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
});

// Set current year in footer
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

// Navbar scroll effect
function handleScroll() {
    // Change navbar on scroll
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Show/hide scroll to top button
    if (window.scrollY > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
}

// Toggle mobile navigation
function toggleMobileNav() {
    mobileNav.classList.toggle('active');
    
    // Toggle icon between bars and X
    const icon = mobileNavToggle.querySelector('i');
    if (mobileNav.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
}

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Switch testimonials
function showTestimonial(index) {
    // Hide all testimonials
    testimonials.forEach(testimonial => {
        testimonial.classList.remove('active');
    });
    
    // Remove active class from all dots
    testimonialDots.forEach(dot => {
        dot.classList.remove('active');
    });
    
    // Show selected testimonial and activate dot
    testimonials[index].classList.add('active');
    testimonialDots[index].classList.add('active');
}

// Form handling with EmailJS for contact form
function handleContactForm(event) {
    event.preventDefault();
    
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submit-btn');
    const formMessages = document.getElementById('form-messages');
    
    // Clear previous messages
    formMessages.innerHTML = '';
    
    // Basic validation
    let isValid = true;
    
    // Get form fields
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    
    // Reset previous error styling
    const formControls = form.querySelectorAll('.form-control');
    formControls.forEach(control => control.classList.remove('error'));
    
    // Validate name
    if (!name.value.trim()) {
        showError(name, 'Name is required');
        isValid = false;
    }
    
    // Validate email
    if (!email.value.trim()) {
        showError(email, 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email.value.trim())) {
        showError(email, 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate message
    if (!message.value.trim()) {
        showError(message, 'Message is required');
        isValid = false;
    }
    
    // If not valid, prevent form submission
    if (!isValid) {
        return false;
    }
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    // Get all form data
    const formData = {
        user_name: name.value,
        user_email: email.value,
        user_phone: document.getElementById('phone').value,
        service: document.getElementById('service').value || 'Not specified',
        message: message.value,
        to_email: 'sujansharma202@gmail.com'  // The email address to send to
    };
    
    // Send the email using EmailJS
    // Replace these values with your actual EmailJS service ID and template ID
    // You'll need to create these in your EmailJS account
    emailjs.send('service_id', 'template_id', formData)
        .then(function(response) {
            // Success message
            formMessages.innerHTML = `
                <div class="alert-success">
                    <i class="fas fa-check-circle"></i> Your message has been sent successfully! We will contact you soon.
                </div>
            `;
            
            // Reset form
            form.reset();
            
            // Reset button
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
            
            console.log('SUCCESS!', response.status, response.text);
        }, function(error) {
            // Error message
            formMessages.innerHTML = `
                <div class="alert-error">
                    <i class="fas fa-exclamation-circle"></i> Oops! An error occurred while sending your message. Please try again.
                </div>
            `;
            
            // Reset button
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
            
            console.log('FAILED...', error);
        });
    
    return false;
}

// Helper function to show form error
function showError(field, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
    field.classList.add('error');
}

// Helper function to show success message (used for non-EmailJS fallback)
function showSuccessMessage(form) {
    // Clear form fields
    form.reset();
    
    // Create success message
    const successDiv = document.createElement('div');
    successDiv.className = 'alert-success';
    successDiv.innerHTML = '<i class="fas fa-check-circle"></i> Your message has been sent successfully! We will contact you soon.';
    
    // Add success message to form
    document.getElementById('form-messages').innerHTML = '';
    document.getElementById('form-messages').appendChild(successDiv);
    
    // Remove success message after 5 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

// Helper function to validate email
function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

// Add event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Load event listeners
    window.addEventListener('scroll', handleScroll);
    
    // Mobile navigation toggle
    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', toggleMobileNav);
    }
    
    // Scroll to top button
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', scrollToTop);
    }
    
    // Testimonial navigation
    testimonialDots.forEach((dot, index) => {
        dot.addEventListener('click', () => showTestimonial(index));
    });
    
    // Automatically switch testimonials every 5 seconds
    let currentTestimonial = 0;
    const testimonialsInterval = setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }, 5000);
    
    // Contact form handling with EmailJS
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Skip links that are just "#"
            if (this.getAttribute('href') === '#') return;
            
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Close mobile nav if open
                if (mobileNav.classList.contains('active')) {
                    toggleMobileNav();
                }
                
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Account for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Handle page load
    handleScroll();
});