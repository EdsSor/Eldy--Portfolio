// === Portfolio Initialization ===
document.addEventListener('DOMContentLoaded', function() {
  initializePortfolio();
});

function initializePortfolio() {
  setupMobileMenu();
  setupSmoothScrolling();
  setupContactForm();
  setupScrollAnimations();
  initializeSkills();
  observeSkillsSection();
  initializeTypewriter();
  initializeRippleEffect(); // Add this line
}

// === Mobile Menu Functions ===
function setupMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (!mobileMenuBtn || !mobileMenu) return;

  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.add('hidden');
    }
  });

  // Close mobile menu when clicking nav links
  const mobileNavLinks = mobileMenu.querySelectorAll('a');
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });
  });
}

// === Smooth Scrolling ===
function setupSmoothScrolling() {
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
}

// === Contact Form Handler ===
function setupContactForm() {
  const contactForm = document.getElementById("contact-form");
  const alertBox = document.getElementById("form-alert");

  if (!contactForm || !alertBox) return;

  contactForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    
    // Show loading state
    showFormAlert('loading', 'Sending your message...');
    
    // Disable submit button to prevent multiple submissions
    const submitButton = this.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';

    try {
      const response = await fetch('send_email.php', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        showFormAlert('success', result.message);
        this.reset(); // Clear the form
      } else {
        showFormAlert('error', result.message || 'Failed to send message. Please try again.');
      }

    } catch (error) {
      console.error('Contact form error:', error);
      showFormAlert('error', 'Network error. Please check your connection and try again.');
    } finally {
      // Re-enable submit button
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  });
}

function showFormAlert(type, message) {
  const alertBox = document.getElementById("form-alert");
  if (!alertBox) return;

  let alertHTML = '';
  
  switch(type) {
    case 'loading':
      alertHTML = `
        <div class="flex items-center justify-center py-3 px-4 bg-blue-500/20 border border-blue-500/30 rounded-lg mb-4">
          <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
          <span class="ml-3 text-blue-300">${message}</span>
        </div>
      `;
      break;
    case 'success':
      alertHTML = `
        <div class="bg-green-500/20 border border-green-500/30 text-green-300 p-4 rounded-lg mb-4 flex items-start">
          <svg class="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
          </svg>
          <div>${message}</div>
        </div>
      `;
      break;
    case 'error':
      alertHTML = `
        <div class="bg-red-500/20 border border-red-500/30 text-red-300 p-4 rounded-lg mb-4 flex items-start">
          <svg class="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
          </svg>
          <div>${message}</div>
        </div>
      `;
      break;
  }

  alertBox.innerHTML = alertHTML;

  // Auto-hide success/error messages after 8 seconds
  if (type !== 'loading') {
    setTimeout(() => {
      alertBox.innerHTML = "";
    }, 8000);
  }
}

// === Scroll Animations ===
function setupScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in-up');
      }
    });
  }, observerOptions);

  // Observe elements for animation
  document.querySelectorAll('.skill-category, .project-card').forEach(el => {
    observer.observe(el);
  });
}

// === Skills Animation Functions ===
function initializeSkills() {
  const progressBars = document.querySelectorAll('.skill-progress');
  
  if (progressBars.length === 0) return;

  // Animate progress bars after a short delay
  setTimeout(() => {
    progressBars.forEach(bar => {
      const percent = bar.getAttribute('data-percent');
      if (percent) {
        bar.style.width = percent + '%';
      }
    });
  }, 500);
}

function observeSkillsSection() {
  const skillsSection = document.querySelector('#about');
  
  if (!skillsSection) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Re-animate all progress bars when section comes into view
        const progressBars = entry.target.querySelectorAll('.skill-progress');
        progressBars.forEach(bar => {
          const percent = bar.getAttribute('data-percent');
          if (percent) {
            bar.style.width = '0%';
            setTimeout(() => {
              bar.style.width = percent + '%';
            }, 200);
          }
        });
      }
    });
  }, { threshold: 0.3 });

  observer.observe(skillsSection);
}

function updateAllSkillBars() {
  const progressBars = document.querySelectorAll('.skill-progress');
  
  progressBars.forEach(bar => {
    const percent = bar.getAttribute('data-percent');
    if (percent) {
      bar.style.width = '0%';
      setTimeout(() => {
        bar.style.width = percent + '%';
      }, 100);
    }
  });
}

// === Typewriter Effect ===
function initializeTypewriter() {
  const typewriterElement = document.getElementById("typewriter-text");
  if (!typewriterElement) return;

  const text = "Eldy Soriano II";
  let index = 0;
  let isDeleting = false;

  function typeWriter() {
    if (!isDeleting && index < text.length) {
      // Typing phase
      typewriterElement.textContent += text.charAt(index);
      index++;
      setTimeout(typeWriter, 120); // Typing speed
    } else if (!isDeleting && index === text.length) {
      // Pause at the end before deleting
      setTimeout(() => {
        isDeleting = true;
        typeWriter();
      }, 2000); // Pause duration before deleting
    } else if (isDeleting && index > 0) {
      // Deleting phase
      typewriterElement.textContent = text.substring(0, index - 1);
      index--;
      setTimeout(typeWriter, 80); // Deleting speed (faster than typing)
    } else if (isDeleting && index === 0) {
      // Reset for next loop
      isDeleting = false;
      setTimeout(typeWriter, 500); // Pause before starting again
    }
  }

  // Start typewriter effect after a delay to sync with animations
  setTimeout(typeWriter, 1000);
}

// === Ripple Effect Functions ===
function initializeRippleEffect() {
  // Add click event listener for ripple effect
  document.addEventListener('click', function(e) {
    // Don't create ripples on interactive elements
    if (!isClickableElement(e.target)) {
      createRipple(e.clientX, e.clientY);
    }
  });

  // Touch support for mobile devices
  document.addEventListener('touchstart', function(e) {
    if (!isClickableElement(e.target)) {
      e.preventDefault();
      const touch = e.touches[0];
      createRipple(touch.clientX, touch.clientY);
    }
  }, { passive: false });
}

function isClickableElement(element) {
  // Check if the element or its parent is clickable
  const clickableSelectors = [
    'button', 'a', 'input', 'textarea', 'select', 
    '[onclick]', '[role="button"]', '.btn', 
    '.nav-link', '.social-icon'
  ];
  
  return clickableSelectors.some(selector => 
    element.matches && element.matches(selector) || 
    element.closest && element.closest(selector)
  );
}

function createRipple(x, y) {
  // Create multiple ripples for layered effect
  for (let i = 1; i <= 3; i++) {
    const ripple = document.createElement('div');
    ripple.classList.add('ripple', `ripple-${i}`);
    
    // Vary sizes for more natural effect
    const baseSize = 100;
    const size = baseSize + (Math.random() * 50);
    ripple.style.width = size + 'px';
    ripple.style.height = size + 'px';
    
    // Position at click coordinates
    ripple.style.left = (x - size / 2) + 'px';
    ripple.style.top = (y - size / 2) + 'px';
    
    // Add to document
    document.body.appendChild(ripple);
    
    // Clean up after animation
    setTimeout(() => {
      if (ripple && ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 2000); // Slightly longer to ensure animation completes
  }
}

// === Utility Functions ===
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

// === Error Handling ===
window.addEventListener('error', function(e) {
  console.error('Portfolio Error:', e.error);
});

// === Performance Optimization ===
// Preload critical images
function preloadImages() {
  const criticalImages = [
    'img/logo.png',
    'img/eds.jpeg',
    'img/edspo.png'
  ];

  criticalImages.forEach(src => {
    const img = new Image();
    img.src = src;
  });
}

// Initialize preloading
document.addEventListener('DOMContentLoaded', preloadImages);