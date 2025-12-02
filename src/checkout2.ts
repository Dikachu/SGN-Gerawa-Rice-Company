type CartItem = {
    readonly id: string;
    imageSrc: string;
    name: string;
    price: number;
    quantity: number;
};

type HTMLElementType = {
    [key: string]: HTMLElement | HTMLInputElement | null;
};

type Coupon = {
    [key: string]: number
}


class Checkout {
    private coupons: Coupon = {};
    private cartItems: CartItem[];
    private element: HTMLElementType = {};
    private SHIPPING_FEE: number;

    constructor() {
        // this.coupons = (): string[] => {
        //     fetch('api/coupons/get')
        //     .then((res)=>{
        //         const response = res.json()

        //         return [...response.data]
        //     })
        //     return ['one', 'two']
        // }

        this.coupons = {
            "COUPON1": 20,
            "COUPON2": 10,
            "COUPON3": 30,
        }

        this.element = {
            checkoutSummary: document.getElementById('checkoutSummary'),
            couponCode: document.getElementById('couponCode'),
            couponMessage: document.getElementById('couponMessage'),
            discountRow: document.getElementById('discountRow'),
            applyCoupon: document.getElementById('applyCoupon'),
            placeOrder: document.getElementById('placeOrder'),
            checkoutItems: document.getElementById('checkoutItems')
        }

        this.SHIPPING_FEE = 1500

        this.cartItems = JSON.parse(localStorage.getItem('products') ?? '[]');

        (window as any).removeCoupon = () => this.removeCoupon();

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadItems();
    }

    setupEventListeners() {
        this.element.applyCoupon?.addEventListener('click', ()=> {
            this.applyCoupon();
        })

        this.element.placeOrder?.addEventListener('click', ()=> {
            this.processOrder();
        })
    }

    loadItems() {
        if (this.cartItems.length > 0) {
            this.element.checkoutItems!.innerHTML = '';
            this.cartItems.forEach(item => {
                const itemDiv = `
                <div class="cart-item" data-id="${item.id}">
                    <div class="item-image">
                        <img src="${item.imageSrc}" alt="${item.name}">
                    </div>
                    <div class="item-details">
                        <h4 class="item-name">
                            ${item.name}
                        </h4>
                        <div class="item-price">₦${item.price.toLocaleString()}</div>
                        <p>
                            <strong>Quantity:</strong> ${item.quantity}
                        </p>
                    </div>
                    <div class="item-actions">
                        <button class="remove-button" onclick="removeFromCart('${item.id}')">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                                <path
                                    d="M232.7 69.9L224 96L128 96C110.3 96 96 110.3 96 128C96 145.7 110.3 160 128 160L512 160C529.7 160 544 145.7 544 128C544 110.3 529.7 96 512 96L416 96L407.3 69.9C402.9 56.8 390.7 48 376.9 48L263.1 48C249.3 48 237.1 56.8 232.7 69.9zM512 208L128 208L149.1 531.1C150.7 556.4 171.7 576 197 576L443 576C468.3 576 489.3 556.4 490.9 531.1L512 208z" />
                            </svg>
                        </button>
                    </div>
                </div>
                `;
                this.element.checkoutItems!.innerHTML += itemDiv;
                this.displaySummary();
            });
        }
    }

    displaySummary() {
        let subtotal = 0;

        this.cartItems?.forEach(item => {
            subtotal += item.price * item.quantity;
        });

        let totalShipping = this.cartItems.length * this.SHIPPING_FEE;
        const total = subtotal + totalShipping;

        const subtotalTextEl = this.element.checkoutSummary?.querySelector('.subtotalText') as HTMLElement | null;
        if (subtotalTextEl) {
            subtotalTextEl.textContent = `Subtotal (${this.cartItems.length}) item(s)`;
        }

        const subtotalEl = this.element.checkoutSummary?.querySelector('.subtotal') as HTMLElement | null;
        if (subtotalEl) {
            subtotalEl.textContent = `₦ ${subtotal.toLocaleString()}`;
        }

        const shippingEl = this.element.checkoutSummary?.querySelector('.shipping') as HTMLElement | null;
        if (shippingEl) {
            shippingEl.textContent = `₦ ${totalShipping.toLocaleString()}`;
        }

        const totalEl = this.element.checkoutSummary?.querySelector('.checkoutTotal') as HTMLElement | null;
        if (totalEl) {
            totalEl.textContent = `₦ ${total.toLocaleString()}`;
        }
    }

    applyCoupon() {
        let code = (this.element.couponCode as HTMLInputElement).value.trim().toUpperCase()

        if (this.coupons[code]) {
            let discount = this.coupons[code]

            let subtotal = 0;

            this.cartItems?.forEach(item => {
                subtotal += item.price * item.quantity;
            });

            let discountAmount = subtotal * (discount / 100);
            let totalShipping = this.cartItems.length * this.SHIPPING_FEE;
            const total = subtotal + totalShipping;
            const newTotal = total - discountAmount

            this.element.discountRow!.style.display = 'flex'

            const discountAmountEl = this.element.discountRow?.querySelector('.discountAmount') as HTMLElement | null;
            if (discountAmountEl) {
                discountAmountEl.textContent = `₦ ${discountAmount.toLocaleString()}`;
            }

            const totalEl = this.element.checkoutSummary?.querySelector('.checkoutTotal') as HTMLElement | null;
            if (totalEl) {
                totalEl.textContent = `₦ ${newTotal.toLocaleString()}`;
            }

            this.element.couponMessage!.innerHTML = `
            <div class="applied-coupon">
                <span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM17.4571 9.45711L11 15.9142L6.79289 11.7071L8.20711 10.2929L11 13.0858L16.0429 8.04289L17.4571 9.45711Z"></path></svg>
                    Coupon "${code}" applied! ${discount}% off
                </span>
                <button class="remove-coupon" onclick="removeCoupon()">
                    &times;
                </button>
            </div>
            `
        }else {
            this.element.couponMessage!.innerHTML = `
            <div style="color: #dc3545; margin-top: 10px;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 9.5C12.8284 9.5 13.5 8.82843 13.5 8C13.5 7.17157 12.8284 6.5 12 6.5C11.1716 6.5 10.5 7.17157 10.5 8C10.5 8.82843 11.1716 9.5 12 9.5ZM14 15H13V10.5H10V12.5H11V15H10V17H14V15Z"></path></svg>
                Invalid coupon code
            </div>
            `
            setTimeout(() => this.element.couponMessage!.innerHTML = '', 5000);
        }
    }

    removeCoupon() {
        (this.element.couponCode as HTMLInputElement).value = '';
        this.element.discountRow!.style.display = '';
        this.element.couponMessage!.innerHTML = '';
        this.displaySummary();
    }

    processOrder() {
        window.location.href = 'track.html'
    }
}

document.addEventListener('DOMContentLoaded', ()=> {
    new Checkout();
})