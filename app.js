document.addEventListener('DOMContentLoaded', () => {
  const heroContent = document.querySelector('.hero-content');
  const heroImage = document.querySelector('.hero-image');

  // Animate hero section with GSAP
  gsap.from(heroContent, {
    opacity: 0,
    x: -50,
    duration: 1,
    ease: 'power3.out'
  });

  gsap.from(heroImage, {
    opacity: 0,
    x: 50,
    duration: 1,
    ease: 'power3.out'
  });

  // Feature hover effects
  const features = document.querySelectorAll('.feature');
  
  features.forEach(feature => {
    feature.addEventListener('mouseenter', () => {
      gsap.to(feature, {
        scale: 1.05,
        boxShadow: '0 15px 35px rgba(0,0,0,0.15)',
        duration: 0.3
      });
    });

    feature.addEventListener('mouseleave', () => {
      gsap.to(feature, {
        scale: 1,
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        duration: 0.3
      });
    });
  });
});