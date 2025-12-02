import { cartManager } from './cart.js';

type HTMLElementType = {
    [key: string]: HTMLElement | HTMLInputElement | null;
};

class Checkout {
    private element: HTMLElementType = {};

    constructor() {
        this.element = {
            checkoutSummary: document.getElementById('checkoutSummary'),
            couponCode: document.getElementById('couponCode'),
            couponMessage: document.getElementById('couponMessage'),
            discountRow: document.getElementById('discountRow'),
            applyCoupon: document.getElementById('applyCoupon'),
            placeOrder: document.getElementById('placeOrder'),
            checkoutItems: document.getElementById('checkoutItems')
        };

        // Expose methods to window
        (window as any).removeCoupon = () => this.removeCoupon();

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupCartListener();
        this.loadItems();
        this.restoreCoupon();
    }

    setupEventListeners() {
        this.element.applyCoupon?.addEventListener('click', () => {
            this.applyCoupon();
        });

        this.element.placeOrder?.addEventListener('click', () => {
            this.processOrder();
        });
    }

    // Listen to cart updates from CartManager
    setupCartListener(): void {
        window.addEventListener('cartUpdated', ((e: CustomEvent) => {
            this.loadItems();
        }) as EventListener);
    }

    loadItems() {
        const cartItems = cartManager.getItems();

        if (!this.element.checkoutItems) return;

        if (cartItems.length > 0) {
            document.querySelector('main')!.classList.remove('empty')
            this.element.checkoutItems.innerHTML = '';

            cartItems.forEach(item => {
                const itemDiv = `
                <div class="cart-item" data-id="${item.id}">
                    <div class="item-image">
                        <img src="${item.imageSrc}" alt="${item.name}">
                    </div>
                    <div class="item-details">
                        <h4 class="item-name">${item.name}</h4>
                        <div class="item-price">₦${item.price.toLocaleString()}</div>
                        <p><strong>Quantity:</strong> ${item.quantity}</p>
                    </div>
                    <div class="item-actions">
                        <button class="remove-button" onclick="removeFromCart('${item.id}')">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                                <path d="M232.7 69.9L224 96L128 96C110.3 96 96 110.3 96 128C96 145.7 110.3 160 128 160L512 160C529.7 160 544 145.7 544 128C544 110.3 529.7 96 512 96L416 96L407.3 69.9C402.9 56.8 390.7 48 376.9 48L263.1 48C249.3 48 237.1 56.8 232.7 69.9zM512 208L128 208L149.1 531.1C150.7 556.4 171.7 576 197 576L443 576C468.3 576 489.3 556.4 490.9 531.1L512 208z" />
                            </svg>
                        </button>
                    </div>
                </div>
                `;
                this.element.checkoutItems!.innerHTML += itemDiv;
            });
        } else {
            document.querySelector('main')!.classList.add('empty')
            document.querySelector('main')!.innerHTML = `
                <section>
                    <h1>
                        Your cart is empty
                    </h1>

                    <p>
                        Add items to continue with checkout.
                    </p>

                    <a href="shop.html" class="btn-primary">
                        Return to Shop
                    </a>
                </section>
            `;
        }

        this.displaySummary();
    }

    displaySummary() {
        const summary = cartManager.getCartSummary();
        const appliedCoupon = cartManager.getAppliedCoupon();

        const subtotalTextEl = this.element.checkoutSummary?.querySelector('.subtotalText') as HTMLElement | null;
        if (subtotalTextEl) {
            subtotalTextEl.textContent = `Subtotal (${summary.itemCount}) item(s)`;
        }

        const subtotalEl = this.element.checkoutSummary?.querySelector('.subtotal') as HTMLElement | null;
        if (subtotalEl) {
            subtotalEl.textContent = `₦ ${summary.subtotal.toLocaleString()}`;
        }

        const shippingEl = this.element.checkoutSummary?.querySelector('.shipping') as HTMLElement | null;
        if (shippingEl) {
            shippingEl.textContent = `₦ ${summary.shipping.toLocaleString()}`;
        }

        // Show/hide discount row
        if (this.element.discountRow) {
            if (appliedCoupon) {
                this.element.discountRow.style.display = 'flex';
                const discountAmountEl = this.element.discountRow.querySelector('.discountAmount') as HTMLElement | null;
                if (discountAmountEl) {
                    discountAmountEl.textContent = `₦ ${summary.discount.toLocaleString()}`;
                }
            } else {
                this.element.discountRow.style.display = 'none';
            }
        }

        const totalEl = this.element.checkoutSummary?.querySelector('.checkoutTotal') as HTMLElement | null;
        if (totalEl) {
            totalEl.textContent = `₦ ${summary.total.toLocaleString()}`;
        }
    }

    applyCoupon() {
        const code = (this.element.couponCode as HTMLInputElement).value;
        const result = cartManager.applyCoupon(code);

        if (!this.element.couponMessage) return;

        if (result.success) {
            this.element.couponMessage.innerHTML = `
            <div class="applied-coupon">
                <span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM17.4571 9.45711L11 15.9142L6.79289 11.7071L8.20711 10.2929L11 13.0858L16.0429 8.04289L17.4571 9.45711Z"></path>
                    </svg>
                    ${result.message}
                </span>
                <button class="remove-coupon" onclick="removeCoupon()">&times;</button>
            </div>
            `;
        } else {
            this.element.couponMessage.innerHTML = `
            <div style="color: #dc3545; margin-top: 10px;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 9.5C12.8284 9.5 13.5 8.82843 13.5 8C13.5 7.17157 12.8284 6.5 12 6.5C11.1716 6.5 10.5 7.17157 10.5 8C10.5 8.82843 11.1716 9.5 12 9.5ZM14 15H13V10.5H10V12.5H11V15H10V17H14V15Z"></path>
                </svg>
                ${result.message}
            </div>
            `;
            setTimeout(() => {
                if (this.element.couponMessage) {
                    this.element.couponMessage.innerHTML = '';
                }
            }, 5000);
        }
    }

    removeCoupon() {
        cartManager.removeCoupon();
        (this.element.couponCode as HTMLInputElement).value = '';

        if (this.element.couponMessage) {
            this.element.couponMessage.innerHTML = '';
        }
    }

    // Restore coupon display if one was already applied
    restoreCoupon() {
        const appliedCoupon = cartManager.getAppliedCoupon();

        if (appliedCoupon && this.element.couponMessage) {
            (this.element.couponCode as HTMLInputElement).value = appliedCoupon.code;

            this.element.couponMessage.innerHTML = `
            <div class="applied-coupon">
                <span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM17.4571 9.45711L11 15.9142L6.79289 11.7071L8.20711 10.2929L11 13.0858L16.0429 8.04289L17.4571 9.45711Z"></path>
                    </svg>
                    Coupon "${appliedCoupon.code}" applied! ${appliedCoupon.discount}% off
                </span>
                <button class="remove-coupon" onclick="removeCoupon()">&times;</button>
            </div>
            `;
        }
    }

    processOrder() {
        window.location.href = 'track.html';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Checkout();
});