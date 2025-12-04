// Layout functionality
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle') as HTMLButtonElement;
    const sidebar = document.getElementById('sidebar') as HTMLElement;
    const contentWrapper = document.querySelector('.content-wrapper') as HTMLElement;

    // Toggle sidebar on mobile
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            if (window.innerWidth <= 768) {
                if (!sidebar.contains(target) && !menuToggle.contains(target)) {
                    sidebar.classList.remove('active');
                }
            }
        });
    }

    // Set active nav item based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        const link = item as HTMLAnchorElement;
        if (link.getAttribute('href') === currentPage) {
            navItems.forEach(nav => nav.classList.remove('active'));
            link.classList.add('active');
        }
    });

    // Close sidebar on nav click (mobile)
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
            }
        });
    });
});