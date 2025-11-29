document.addEventListener('DOMContentLoaded', function() {
    // Add shadow to navbar on scroll
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 10) {
                navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
            }
        });
    }

    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Mobile menu close when clicking on a nav link
    const navLinks = document.querySelectorAll('.nav-link');
    const menuToggle = document.getElementById('navbarNav');
    
    if (menuToggle) {
        const bsCollapse = new bootstrap.Collapse(menuToggle, {toggle: false});
        
        navLinks.forEach((link) => {
            link.addEventListener('click', () => { 
                if (window.innerWidth < 992) {
                    bsCollapse.toggle();
                }
            });
        });
    }

    // Search functionality
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchTerm = this.querySelector('input[type="search"]').value;
            if (searchTerm.trim() !== '') {
                // Add your search functionality here
                console.log('Searching for:', searchTerm);
                // Example: window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`;
            }
        });
    }

    // Cart functionality
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            // Add your cart toggle functionality here
            console.log('Cart clicked');
            // Example: window.location.href = '/cart';
        });
    }

    // Wishlist functionality
    const wishlistIcon = document.querySelector('.wishlist-icon');
    if (wishlistIcon) {
        wishlistIcon.addEventListener('click', function(e) {
            e.preventDefault();
            // Add your wishlist toggle functionality here
            console.log('Wishlist clicked');
            // Example: window.location.href = '/wishlist';
        });
    }
});

// Function to update cart count
function updateCartCount(count) {
    const cartBadge = document.querySelector('.cart-badge');
    if (cartBadge) {
        cartBadge.textContent = count;
        if (count > 0) {
            cartBadge.style.display = 'flex';
        } else {
            cartBadge.style.display = 'none';
        }
    }
}

// Example: Update cart count on page load
// You would typically get this from your backend
// updateCartCount(3);
