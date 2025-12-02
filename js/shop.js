document.addEventListener('DOMContentLoaded', () => {
    const filter = document.getElementById('filter');

    // Function to handle the structural changes based on screen size (desktop vs mobile)
    function setFilterVisibility() {
        if (!filter) return;

        if (window.innerWidth <= 768) {
            filter.classList.add('hidden');
        } else {
            filter.classList.remove('hidden');
        }
    }

    // Function to handle the click-outside-filter behavior on mobile
    const handleOutsideClick = (e) => {
        if (e.target === filter) {
            filter.classList.add('hidden');
        }
    };

    // Function for initial setup (only run ONCE)
    function setupFilterListeners() {
        const toggleFilter = document.getElementById('toggleFilter');
        const closeFilter = document.getElementById('closeFilter');

        if (!toggleFilter || !filter || !closeFilter) {
            console.error('Filter elements not found!');
            return;
        }

        toggleFilter.addEventListener('click', () => {
            filter.classList.toggle('hidden');
        });

        closeFilter.addEventListener('click', () => {
            filter.classList.add('hidden');
        });
        filter.addEventListener('click', handleOutsideClick);

        setFilterVisibility();

        window.addEventListener('resize', setFilterVisibility);
    }

    // Run the initial setup function ONCE
    setupFilterListeners();

    // Collapsible filter sections
    const filterHeaders = document.querySelectorAll('.filter-section h4');

    filterHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.parentElement;
            content.classList.toggle('collapsed');
        });
    });
});









