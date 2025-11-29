// Add active class to current nav item
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    // Add active class to current nav item
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Close mobile menu when clicking on a nav link
    const navLinksArray = Array.from(navLinks);
    const menuToggle = document.getElementById('navbarNav');
    const bsCollapse = new bootstrap.Collapse(menuToggle, {toggle: false});
    
    navLinksArray.forEach(l => {
        l.addEventListener('click', () => {
            if (menuToggle.classList.contains('show')) {
                bsCollapse.toggle();
            }
        });
    });

    // Add shadow to navbar on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });
});
