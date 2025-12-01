class ProductFilter {
    filter;
    toggleFilter;
    closeFilter;
    filterHeaders;
    constructor() {
        this.filter = document.getElementById('filter');
        this.toggleFilter = document.getElementById('toggleFilter');
        this.closeFilter = document.getElementById('closeFilter');
        this.filterHeaders = document.querySelectorAll('.filter-section h4');
    }
    init() {
        if (!this.filter || !this.toggleFilter || !this.closeFilter) {
            console.error('Filter elements missing in DOM.');
            return;
        }
        this.setupFilterListeners();
        this.setupCollapsibleSections();
        this.setFilterVisibility();
        window.addEventListener('resize', () => this.setFilterVisibility());
    }
    setFilterVisibility() {
        if (!this.filter)
            return;
        if (window.innerWidth <= 768) {
            this.filter.classList.add('hidden');
        }
        else {
            this.filter.classList.remove('hidden');
        }
    }
    handleOutsideClick = (e) => {
        if (e.target === this.filter) {
            this.filter.classList.add('hidden');
        }
    };
    setupFilterListeners() {
        this.toggleFilter.addEventListener('click', () => {
            this.filter.classList.toggle('hidden');
        });
        this.closeFilter.addEventListener('click', () => {
            this.filter.classList.add('hidden');
        });
        this.filter.addEventListener('click', this.handleOutsideClick);
    }
    setupCollapsibleSections() {
        this.filterHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const parent = header.parentElement;
                if (parent) {
                    parent.classList.toggle('collapsed');
                }
            });
        });
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const filter = new ProductFilter();
    filter.init();
});
export {};
//# sourceMappingURL=shop.js.map