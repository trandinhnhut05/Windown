/**
 * CƠ KHÍ - NHÔM KÍNH MẠNH NGHĨA WINDOW 2
 * JavaScript Controller - Interactive Features, Calculator, Tech Sparks & Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initStickyHeader();
  initMobileMenu();
  initScrollProgressBar();
  initHeroSparksCanvas();
  initScrollReveal();
  initCardHoverTilt();
  initBackToTop();
  initMetricsCounter();
  initPortfolioFilter();
  initQuoteCalculator();
  initFaqAccordion();
  initContactForm();
  initProjectLightbox();
  initPolicyModals();
});

/* 0. Theme Initialization (Industrial Technology – Premium) */
function initThemeToggle() {
  document.documentElement.removeAttribute('data-theme');
  const toggleBtn = document.getElementById('theme-toggle-btn');
  if (!toggleBtn) return;
  toggleBtn.addEventListener('click', () => {
    // Optional toggle handler if needed
  });
}

/* 1. Sticky Header */
function initStickyHeader() {
  const header = document.querySelector('.header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* 2. Top Scroll Progress Indicator */
function initScrollProgressBar() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${scrollPercent}%`;
  }, { passive: true });
}

/* 3. Hero Section Canvas Sparks & Embers (Chân thực theo tia lửa cơ khí hàn cắt) */
function initHeroSparksCanvas() {
  const canvas = document.getElementById('hero-sparks-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const maxParticles = 38;
  let isHeroVisible = true;

  function resizeCanvas() {
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class SparkParticle {
    constructor(initial = false) {
      this.reset(initial);
    }

    reset(initial = false) {
      // Sparks emanate across and especially concentrate towards right-mid (near tool/craftsman)
      this.x = initial ? Math.random() * width : (width * 0.4 + Math.random() * width * 0.6);
      this.y = initial ? Math.random() * height : height * 0.4 + Math.random() * (height * 0.6);
      this.size = Math.random() * 2 + 0.6;
      this.speedY = -(Math.random() * 1.6 + 0.5);
      this.speedX = (Math.random() - 0.7) * 2.2; // slight drift towards left
      this.alpha = Math.random() * 0.75 + 0.25;
      this.fade = Math.random() * 0.007 + 0.003;
      
      // Architectural Glass & Aluminum Precision Glint Palette (Soft Tech Blue, Sky Blue, White Shimmer)
      const colors = ['#0866E8', '#38BDF8', '#60A5FA', '#93C5FD', '#FFFFFF'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.alpha = Math.random() * 0.45 + 0.15;
      this.fade = Math.random() * 0.005 + 0.002;
    }

    update() {
      this.x += this.speedX + Math.sin(this.y * 0.015) * 0.4;
      this.y += this.speedY;
      this.alpha -= this.fade;

      if (this.alpha <= 0 || this.y < -15 || this.x < -20 || this.x > width + 20) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = this.size * 4;
      ctx.shadowColor = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < maxParticles; i++) {
    particles.push(new SparkParticle(true));
  }

  const heroObserver = new IntersectionObserver((entries) => {
    isHeroVisible = entries[0].isIntersecting;
  }, { threshold: 0.1 });

  const heroSection = document.getElementById('hero');
  if (heroSection) heroObserver.observe(heroSection);

  function animate() {
    if (isHeroVisible) {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
    }
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

/* 4. Scroll Reveal Animations */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));
}

/* 5. 3D Card Hover Perspective Tilt Effect */
function initCardHoverTilt() {
  const cards = document.querySelectorAll('.service-card, .calc-card, .contact-info-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}

/* 6. Back-To-Top Button */
function initBackToTop() {
  const backToTopBtn = document.getElementById('btn-back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 450) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* 7. Mobile Menu Navigation */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    const isOpen = navMenu.classList.contains('open');
    toggleBtn.setAttribute('aria-expanded', isOpen);
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', false);
    });
  });
}

/* 8. Number Counter Animation */
function initMetricsCounter() {
  const counters = document.querySelectorAll('.metric-number');
  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        counters.forEach(counter => {
          const target = parseInt(counter.getAttribute('data-target') || '0', 10);
          const suffix = counter.getAttribute('data-suffix') || '';
          let count = 0;
          const duration = 1800; // ms
          const stepTime = 25;
          const totalSteps = duration / stepTime;
          const increment = target / totalSteps;

          const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
              counter.textContent = target.toLocaleString('vi-VN') + suffix;
              clearInterval(timer);
            } else {
              counter.textContent = Math.floor(count).toLocaleString('vi-VN') + suffix;
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.3 });

  const metricsSection = document.querySelector('.metrics-section');
  if (metricsSection) {
    observer.observe(metricsSection);
  }
}

/* 9. Product Portfolio Filter & Dynamic Load More Controller */
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productItems = Array.from(document.querySelectorAll('.product-item'));
  const loadMoreWrap = document.getElementById('gallery-load-more-wrap');
  const loadMoreBtn = document.getElementById('btn-load-more-projects');
  const loadMoreText = loadMoreBtn ? loadMoreBtn.querySelector('.btn-load-more-text') : null;
  const loadMoreBadge = document.getElementById('load-more-badge');
  const loadMoreArrow = loadMoreBtn ? loadMoreBtn.querySelector('.btn-load-more-icon-arrow') : null;
  const showingCountEl = document.getElementById('gallery-showing-count');
  const totalCountEl = document.getElementById('gallery-total-count');
  const progressFill = document.getElementById('gallery-progress-fill');

  const INITIAL_VISIBLE_COUNT = 8;
  const BATCH_SIZE = 12;

  let currentCategory = 'all';
  let visibleCount = INITIAL_VISIBLE_COUNT;

  // Tự động tính toán số lượng chính xác cho từng tab bộ lọc từ danh mục thực tế
  filterBtns.forEach(btn => {
    const filterKey = btn.getAttribute('data-filter');
    const countEl = btn.querySelector('.filter-count');
    if (countEl) {
      if (filterKey === 'all') {
        countEl.textContent = productItems.length;
      } else {
        const count = productItems.filter(item => item.getAttribute('data-category') === filterKey).length;
        countEl.textContent = count;
      }
    }
  });

  // Hỗ trợ chuyển danh mục từ bên ngoài (ví dụ từ Service card)
  window.filterGalleryCategory = function(catKey) {
    const targetBtn = Array.from(filterBtns).find(b => b.getAttribute('data-filter') === catKey);
    if (targetBtn) {
      targetBtn.click();
      const gallerySection = document.getElementById('gallery');
      if (gallerySection) {
        gallerySection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  function updateGalleryDisplay(animateNew = false, prevVisibleCount = 0) {
    // 1. Lọc danh sách sản phẩm theo tab đang chọn
    const matchingItems = productItems.filter(item => {
      const cat = item.getAttribute('data-category');
      return currentCategory === 'all' || cat === currentCategory;
    });

    const totalMatching = matchingItems.length;
    const isAllShown = visibleCount >= totalMatching;

    // 2. Ẩn tất cả sản phẩm
    productItems.forEach(item => {
      item.style.display = 'none';
    });

    // 3. Hiển thị các sản phẩm thỏa mãn bộ lọc trong giới hạn visibleCount
    matchingItems.forEach((item, index) => {
      if (index < visibleCount) {
        item.style.display = 'flex';

        // Hiệu ứng mượt mà khi bấm nút "Xem thêm" mở rộng danh sách
        if (animateNew && index >= prevVisibleCount) {
          item.animate([
            { opacity: 0, transform: 'translateY(22px) scale(0.96)' },
            { opacity: 1, transform: 'translateY(0) scale(1)' }
          ], {
            duration: 360,
            delay: (index - prevVisibleCount) * 45,
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
            fill: 'both'
          });
        }
      }
    });

    // 4. Cập nhật số lượng và thanh tiến độ hiển thị
    const currentlyShowing = Math.min(visibleCount, totalMatching);
    if (showingCountEl) showingCountEl.textContent = currentlyShowing;
    if (totalCountEl) totalCountEl.textContent = totalMatching;

    if (progressFill && totalMatching > 0) {
      const percent = Math.min(100, Math.round((currentlyShowing / totalMatching) * 100));
      progressFill.style.width = `${percent}%`;
    }

    // 5. Cập nhật trạng thái hiển thị của nút "Xem thêm"
    if (!loadMoreWrap || !loadMoreBtn) return;

    if (totalMatching <= INITIAL_VISIBLE_COUNT) {
      // Số lượng sản phẩm ít hơn hoặc bằng giới hạn hiển thị ban đầu -> Ẩn nút xem thêm
      loadMoreWrap.style.display = 'none';
    } else {
      loadMoreWrap.style.display = 'flex';

      if (isAllShown) {
        // Đã hiển thị toàn bộ -> chuyển sang trạng thái "Thu gọn danh sách"
        loadMoreBtn.classList.add('is-collapsed-state');
        loadMoreBtn.setAttribute('aria-expanded', 'true');
        if (loadMoreText) loadMoreText.textContent = 'Thu Gọn Danh Sách';
        if (loadMoreBadge) loadMoreBadge.style.display = 'none';
        if (loadMoreArrow) {
          loadMoreArrow.style.transform = 'rotate(180deg)';
        }
      } else {
        // Vẫn còn sản phẩm -> hiển thị nút "Xem thêm" cùng số lượng còn lại
        const remaining = totalMatching - currentlyShowing;
        loadMoreBtn.classList.remove('is-collapsed-state');
        loadMoreBtn.setAttribute('aria-expanded', 'false');
        if (loadMoreText) loadMoreText.textContent = 'Xem Thêm Công Trình';
        if (loadMoreBadge) {
          loadMoreBadge.textContent = `+${remaining}`;
          loadMoreBadge.style.display = 'inline-flex';
        }
        if (loadMoreArrow) {
          loadMoreArrow.style.transform = 'rotate(0deg)';
        }
      }
    }
  }

  // Sự kiện khi bấm nút Xem Thêm / Thu Gọn
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      const matchingItems = productItems.filter(item => {
        const cat = item.getAttribute('data-category');
        return currentCategory === 'all' || cat === currentCategory;
      });

      const totalMatching = matchingItems.length;

      if (visibleCount >= totalMatching) {
        // Đang mở hết -> bấm để thu gọn lại số lượng ban đầu
        visibleCount = INITIAL_VISIBLE_COUNT;
        updateGalleryDisplay(false);

        // Cuộn mượt mà về đầu phần công trình tiêu biểu
        const gallerySection = document.getElementById('gallery');
        if (gallerySection) {
          const headerOffset = 90;
          const elementPosition = gallerySection.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      } else {
        // Mở rộng thêm 1 đợt sản phẩm tiếp theo
        const prevCount = visibleCount;
        visibleCount += BATCH_SIZE;
        updateGalleryDisplay(true, prevCount);
      }
    });
  }

  // Sự kiện khi bấm các tab lọc phân loại
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      currentCategory = btn.getAttribute('data-filter') || 'all';
      visibleCount = INITIAL_VISIBLE_COUNT; // Đặt lại số lượng hiển thị ban đầu khi đổi danh mục
      updateGalleryDisplay(false);
    });
  });

  // Khởi tạo trạng thái ban đầu
  updateGalleryDisplay(false);
}

/* 10. Interactive Quote Estimator */
function initQuoteCalculator() {
  const serviceSelect = document.getElementById('calc-service');
  const materialSelect = document.getElementById('calc-material');
  const quantityInput = document.getElementById('calc-qty');
  const glassSelect = document.getElementById('calc-glass');
  const priceDisplay = document.getElementById('calc-price-display');

  if (!serviceSelect || !materialSelect || !quantityInput || !glassSelect || !priceDisplay) return;

  function calculateEstimate() {
    const serviceRate = parseFloat(serviceSelect.value) || 1850000;
    const materialMultiplier = parseFloat(materialSelect.value) || 1.0;
    const qty = Math.max(1, parseFloat(quantityInput.value) || 1);
    const glassMultiplier = parseFloat(glassSelect.value) || 1.0;

    let unitCost = (serviceRate * materialMultiplier * glassMultiplier);
    
    let discount = 1.0;
    if (qty >= 50) discount = 0.88;
    else if (qty >= 25) discount = 0.93;
    else if (qty >= 10) discount = 0.96;

    const totalEstimate = Math.round(unitCost * qty * discount);

    priceDisplay.textContent = totalEstimate.toLocaleString('vi-VN') + ' đ';
    priceDisplay.animate([
      { transform: 'scale(1.06)', color: '#5EA2FF' },
      { transform: 'scale(1)', color: '#1677FF' }
    ], { duration: 220 });
  }

  serviceSelect.addEventListener('change', calculateEstimate);
  materialSelect.addEventListener('change', calculateEstimate);
  quantityInput.addEventListener('input', calculateEstimate);
  glassSelect.addEventListener('change', calculateEstimate);

  calculateEstimate();
}

/* 11. FAQ Accordion */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-header');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      faqItems.forEach(i => {
        i.classList.remove('active');
        const btn = i.querySelector('.faq-header');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* 12. Contact Form Handling */
function initContactForm() {
  const contactForm = document.getElementById('consultation-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Đang gửi yêu cầu...</span>';

    setTimeout(() => {
      alert('Cảm ơn Quý khách! Cơ Khí - Nhôm Kính Mạnh Nghĩa Window 2 đã nhận được yêu cầu. Chúng tôi sẽ liên hệ tư vấn và gửi báo giá qua số Hotline: 0704 682 789 - 0899 082 777!');
      contactForm.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }, 1000);
  });
}

/* 13. Project Lightbox Modal Gallery */
function initProjectLightbox() {
  const modal = document.getElementById('project-lightbox');
  if (!modal) return;

  const backdrop = document.getElementById('lightbox-backdrop');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');
  const imgEl = document.getElementById('lightbox-img');
  const categoryEl = document.getElementById('lightbox-category');
  const counterEl = document.getElementById('lightbox-counter');
  const titleEl = document.getElementById('lightbox-title');
  const descEl = document.getElementById('lightbox-desc');
  const specsEl = document.getElementById('lightbox-specs');
  const locationEl = document.getElementById('lightbox-location');
  const zaloCta = document.getElementById('lightbox-zalo-cta');

  const allItems = Array.from(document.querySelectorAll('.product-item'));
  let currentList = [];
  let currentIndex = 0;

  function getVisibleItems() {
    const visible = allItems.filter(item => item.style.display !== 'none');
    return visible.length > 0 ? visible : allItems;
  }

  function updateLightboxContent() {
    if (!currentList[currentIndex]) return;
    const item = currentList[currentIndex];

    const img = item.querySelector('.product-image img');
    const title = item.getAttribute('data-title') || item.querySelector('h4')?.textContent || 'Công trình tiêu biểu';
    const desc = item.getAttribute('data-desc') || item.querySelector('.product-desc')?.textContent || '';
    const specs = item.getAttribute('data-specs') || item.querySelector('.product-spec')?.textContent || '-';
    const loc = item.getAttribute('data-location') || item.querySelector('.product-loc')?.textContent || 'Đà Nẵng';
    const badge = item.getAttribute('data-badge') || item.querySelector('.product-badge')?.textContent || 'Dự án thực tế';

    if (img && imgEl) {
      imgEl.style.opacity = '0.3';
      imgEl.src = img.src;
      imgEl.alt = title;
      imgEl.onload = () => { imgEl.style.opacity = '1'; };
    }

    if (categoryEl) categoryEl.textContent = badge;
    if (counterEl) counterEl.textContent = `${currentIndex + 1} / ${currentList.length}`;
    if (titleEl) titleEl.textContent = title;
    if (descEl) descEl.textContent = desc;
    if (specsEl) specsEl.textContent = specs;
    if (locationEl) locationEl.textContent = loc;

    if (zaloCta) {
      const hotline = '0704682789';
      zaloCta.href = `https://zalo.me/${hotline}`;
      zaloCta.title = `Tư vấn báo giá cho mẫu ${title}`;
    }
  }

  function openLightbox(item) {
    currentList = getVisibleItems();
    currentIndex = currentList.indexOf(item);
    if (currentIndex === -1) {
      currentIndex = 0;
      currentList = [item];
    }

    updateLightboxContent();
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function showPrev() {
    if (currentList.length <= 1) return;
    currentIndex = (currentIndex - 1 + currentList.length) % currentList.length;
    updateLightboxContent();
  }

  function showNext() {
    if (currentList.length <= 1) return;
    currentIndex = (currentIndex + 1) % currentList.length;
    updateLightboxContent();
  }

  allItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      openLightbox(item);
    });
  });

  if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });
  if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (backdrop) backdrop.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowLeft') showPrev();
    else if (e.key === 'ArrowRight') showNext();
  });
}

/* 14. Policy Modals (Chính sách bảo hành & Quy trình thanh toán) */
function initPolicyModals() {
  const warrantyModal = document.getElementById('modal-warranty');
  const paymentModal = document.getElementById('modal-payment');
  const btnWarranty = document.getElementById('btn-open-warranty');
  const btnPayment = document.getElementById('btn-open-payment');

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (btnWarranty && warrantyModal) {
    btnWarranty.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(warrantyModal);
    });
  }

  if (btnPayment && paymentModal) {
    btnPayment.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(paymentModal);
    });
  }

  [warrantyModal, paymentModal].forEach(modal => {
    if (!modal) return;
    const closeBtn = modal.querySelector('.policy-close');
    const backdrop = modal.querySelector('.policy-backdrop');

    if (closeBtn) closeBtn.addEventListener('click', () => closeModal(modal));
    if (backdrop) backdrop.addEventListener('click', () => closeModal(modal));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(warrantyModal);
      closeModal(paymentModal);
    }
  });
}
