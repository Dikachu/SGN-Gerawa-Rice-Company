document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const contentWrapper = document.querySelector('.content-wrapper');
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
        document.addEventListener('click', (e) => {
            const target = e.target;
            if (window.innerWidth <= 768) {
                if (!sidebar.contains(target) && !menuToggle.contains(target)) {
                    sidebar.classList.remove('active');
                }
            }
        });
    }
    const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        const link = item;
        if (link.getAttribute('href') === currentPage) {
            navItems.forEach(nav => nav.classList.remove('active'));
            link.classList.add('active');
        }
    });
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
            }
        });
    });
});
export {};
//# sourceMappingURL=layout.js.map