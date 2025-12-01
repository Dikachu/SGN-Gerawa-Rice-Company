class Checkout {
    coupons = {};
    cartItems;
    element = {};
    SHIPPING_FEE;
    constructor() {
        this.coupons = {
            "COUPON1": 20,
            "COUPON2": 10,
            "COUPON3": 30,
        };
        this.element = {
            checkoutSummary: document.getElementById('checkoutSummary'),
            couponCode: document.getElementById('couponCode'),
            couponMessage: document.getElementById('couponMessage'),
            discountRow: document.getElementById('discountRow'),
            applyCoupon: document.getElementById('applyCoupon'),
            placeOrder: document.getElementById('placeOrder')
        };
        this.SHIPPING_FEE = 1500;
        this.cartItems = JSON.parse(localStorage.getItem('products') ?? '[]');
        window.removeCoupon = () => this.removeCoupon();
        this.init();
    }
    init() {
        this.setupEventListeners();
        this.displaySummary();
    }
    setupEventListeners() {
        this.element.applyCoupon?.addEventListener('click', () => {
            this.applyCoupon();
        });
        this.element.placeOrder?.addEventListener('click', () => {
            this.processOrder();
        });
    }
    displaySummary() {
        let subtotal = 0;
        this.cartItems?.forEach(item => {
            subtotal += item.price * item.quantity;
        });
        let totalShipping = this.cartItems.length * this.SHIPPING_FEE;
        const total = subtotal + totalShipping;
        const subtotalTextEl = this.element.checkoutSummary?.querySelector('.subtotalText');
        if (subtotalTextEl) {
            subtotalTextEl.textContent = `Subtotal (${this.cartItems.length}) item(s)`;
        }
        const subtotalEl = this.element.checkoutSummary?.querySelector('.subtotal');
        if (subtotalEl) {
            subtotalEl.textContent = `₦ ${subtotal.toLocaleString()}`;
        }
        const shippingEl = this.element.checkoutSummary?.querySelector('.shipping');
        if (shippingEl) {
            shippingEl.textContent = `₦ ${totalShipping.toLocaleString()}`;
        }
        const totalEl = this.element.checkoutSummary?.querySelector('.checkoutTotal');
        if (totalEl) {
            totalEl.textContent = `₦ ${total.toLocaleString()}`;
        }
    }
    applyCoupon() {
        let code = this.element.couponCode.value.trim().toUpperCase();
        if (this.coupons[code]) {
            let discount = this.coupons[code];
            let subtotal = 0;
            this.cartItems?.forEach(item => {
                subtotal += item.price * item.quantity;
            });
            let discountAmount = subtotal * (discount / 100);
            let totalShipping = this.cartItems.length * this.SHIPPING_FEE;
            const total = subtotal + totalShipping;
            const newTotal = total - discountAmount;
            this.element.discountRow.style.display = 'flex';
            const discountAmountEl = this.element.discountRow?.querySelector('.discountAmount');
            if (discountAmountEl) {
                discountAmountEl.textContent = `₦ ${discountAmount.toLocaleString()}`;
            }
            const totalEl = this.element.checkoutSummary?.querySelector('.checkoutTotal');
            if (totalEl) {
                totalEl.textContent = `₦ ${newTotal.toLocaleString()}`;
            }
            this.element.couponMessage.innerHTML = `
            <div class="applied-coupon">
                <span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM17.4571 9.45711L11 15.9142L6.79289 11.7071L8.20711 10.2929L11 13.0858L16.0429 8.04289L17.4571 9.45711Z"></path></svg>
                    Coupon "${code}" applied! ${discount}% off
                </span>
                <button class="remove-coupon" onclick="removeCoupon()">
                    &times;
                </button>
            </div>
            `;
        }
        else {
            this.element.couponMessage.innerHTML = `
            <div style="color: #dc3545; margin-top: 10px;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 9.5C12.8284 9.5 13.5 8.82843 13.5 8C13.5 7.17157 12.8284 6.5 12 6.5C11.1716 6.5 10.5 7.17157 10.5 8C10.5 8.82843 11.1716 9.5 12 9.5ZM14 15H13V10.5H10V12.5H11V15H10V17H14V15Z"></path></svg>
                Invalid coupon code
            </div>
            `;
            setTimeout(() => this.element.couponMessage.innerHTML = '', 5000);
        }
    }
    removeCoupon() {
        this.element.couponCode.value = '';
        this.element.discountRow.style.display = '';
        this.element.couponMessage.innerHTML = '';
        this.displaySummary();
    }
    processOrder() {
        window.location.href = 'track.html';
    }
}
document.addEventListener('DOMContentLoaded', () => {
    new Checkout();
});
export {};
//# sourceMappingURL=checkout.js.map