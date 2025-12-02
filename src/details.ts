class ProductPage {
    private qtyInput: HTMLInputElement | null;
    private decreaseBtn: HTMLElement | null;
    private increaseBtn: HTMLElement | null;
    private modal: HTMLElement | null;
    private openModalBtn: HTMLElement | null;

    constructor() {
        this.qtyInput = document.getElementById('quantity') as HTMLInputElement;
        this.decreaseBtn = document.getElementById('decreaseQty');
        this.increaseBtn = document.getElementById('increaseQty');
        this.modal = document.getElementById('reviewModal');
        this.openModalBtn = document.getElementById('writeReviewBtn');
    }

    public init(): void {
        this.handleQuantityButtons();
        this.handleModalOpen();
    }

    private handleQuantityButtons(): void {
        this.decreaseBtn?.addEventListener('click', () => {
            if (!this.qtyInput) return;
            const currentQty = parseInt(this.qtyInput.value);

            if (currentQty > 1) {
                this.qtyInput.value = (currentQty - 1).toString();
            }
        });

        this.increaseBtn?.addEventListener('click', () => {
            if (!this.qtyInput) return;
            const currentQty = parseInt(this.qtyInput.value);

            this.qtyInput.value = (currentQty + 1).toString();
        });
    }

    private handleModalOpen(): void {
        this.openModalBtn?.addEventListener('click', () => {
            this.modal?.classList.add('show');
        });
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const productPage = new ProductPage();
    productPage.init();
});
