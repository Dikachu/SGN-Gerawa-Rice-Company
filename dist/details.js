class ProductPage {
    qtyInput;
    decreaseBtn;
    increaseBtn;
    modal;
    openModalBtn;
    constructor() {
        this.qtyInput = document.getElementById('quantity');
        this.decreaseBtn = document.getElementById('decreaseQty');
        this.increaseBtn = document.getElementById('increaseQty');
        this.modal = document.getElementById('reviewModal');
        this.openModalBtn = document.getElementById('writeReviewBtn');
    }
    init() {
        this.handleQuantityButtons();
        this.handleModalOpen();
    }
    handleQuantityButtons() {
        this.decreaseBtn?.addEventListener('click', () => {
            if (!this.qtyInput)
                return;
            const currentQty = parseInt(this.qtyInput.value);
            if (currentQty > 1) {
                this.qtyInput.value = (currentQty - 1).toString();
            }
        });
        this.increaseBtn?.addEventListener('click', () => {
            if (!this.qtyInput)
                return;
            const currentQty = parseInt(this.qtyInput.value);
            this.qtyInput.value = (currentQty + 1).toString();
        });
    }
    handleModalOpen() {
        this.openModalBtn?.addEventListener('click', () => {
            this.modal?.classList.add('show');
        });
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const productPage = new ProductPage();
    productPage.init();
});
export {};
//# sourceMappingURL=details.js.map