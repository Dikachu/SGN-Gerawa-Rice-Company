class ProductFilter {
    private filter: HTMLElement | null;
    private toggleFilter: HTMLElement | null;
    private closeFilter: HTMLElement | null;
    private filterHeaders: NodeListOf<HTMLHeadingElement>;

    constructor() {
        this.filter = document.getElementById('filter');
        this.toggleFilter = document.getElementById('toggleFilter');
        this.closeFilter = document.getElementById('closeFilter');
        this.filterHeaders = document.querySelectorAll('.filter-section h4');
    }

    public init() {
        if (!this.filter || !this.toggleFilter || !this.closeFilter) {
            console.error('Filter elements missing in DOM.');
            return;
        }

        this.setupFilterListeners();
        this.setupCollapsibleSections();
        this.setFilterVisibility(); // run once on load

        window.addEventListener('resize', () => this.setFilterVisibility());
    }

    // Show or hide filter based on screen size
    private setFilterVisibility() {
        if (!this.filter) return;

        if (window.innerWidth <= 768) {
            this.filter.classList.add('hidden');
        } else {
            this.filter.classList.remove('hidden');
        }
    }

    // Close filter when clicking outside its inner container (mobile only)
    private handleOutsideClick = (e: Event) => {
        if (e.target === this.filter) {
            this.filter!.classList.add('hidden');
        }
    };

    private setupFilterListeners() {
        // Toggle button
        this.toggleFilter!.addEventListener('click', () => {
            this.filter!.classList.toggle('hidden');
        });

        // Close button
        this.closeFilter!.addEventListener('click', () => {
            this.filter!.classList.add('hidden');
        });

        // Outside click
        this.filter!.addEventListener('click', this.handleOutsideClick);
    }

    private setupCollapsibleSections() {
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

// --------------------------------------------
// HOW TO USE (inside your main init function)
// --------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    const filter = new ProductFilter();
    filter.init();
});
