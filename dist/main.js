class Initializer {
    element = {};
    promoTimeout;
    nodeList = {};
    cartItems;
    SHIPPING_FEE;
    constructor() {
        this.element = {
            cartCount: document.querySelector('.cart-count'),
            navToggle: document.getElementById('mobile-toggle'),
            nav: document.getElementById('nav'),
            closePromoBtn: document.getElementById('closePromo'),
            promoContainer: document.getElementById('promoContainer'),
            cart: document.getElementById('cartModal'),
            cartCon: document.getElementById('cartItems'),
            cartSummary: document.getElementById('cartSummary')
        };
        this.nodeList = {
            modals: document.querySelectorAll('.modal'),
            addToCartBtns: document.querySelectorAll('.add-to-cart'),
        };
        this.promoTimeout = 10000;
        this.SHIPPING_FEE = 1500;
        this.cartItems = JSON.parse(localStorage.getItem('products') ?? '[]');
        window.removeFromCart = (id) => this.removeFromCart(id);
        window.updateQuantity = (id, value) => this.updateQuantity(id, value);
        window.openCartModal = () => this.openCartModal();
        this.init();
    }
    init() {
        console.log("Initializer: Application started.");
        this.setupEventListeners();
        this.heroTypingEffect();
        setTimeout(() => {
            this.closePromo();
        }, this.promoTimeout);
        this.loadCartItems();
        this.indicateProductInCart();
    }
    setupEventListeners() {
        this.element.navToggle?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleNav();
        });
        document.addEventListener('click', (event) => {
            if (this.element.nav?.classList.contains('active') && event.target !== this.element.nav && !this.element.nav.contains(event.target)) {
                this.element.nav.classList.remove('active');
                this.element.nav.style.top = '';
            }
        });
        this.element.closePromoBtn?.addEventListener('click', () => {
            this.closePromo();
        });
        this.nodeList.modals?.forEach(modal => {
            const closeModalBtn = modal.querySelector('.close-button');
            closeModalBtn?.addEventListener('click', () => {
                modal?.classList.remove('show');
            });
        });
        document.addEventListener('keydown', (e) => {
            if (e.key !== "Escape")
                return;
            this.element.nav?.classList.contains('active') ? this.element.nav?.classList.remove('active') : null;
            this.closeAllModals();
        });
        window.addEventListener('click', (e) => {
            this.nodeList.modals?.forEach(modal => {
                if (e.target === modal) {
                    modal?.classList.remove('show');
                }
            });
        });
        this.nodeList.addToCartBtns?.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetProduct = e.target.closest('.product-container');
                let item = {
                    id: targetProduct?.getAttribute('data-id') || '',
                    imageSrc: targetProduct?.querySelector('img')?.getAttribute('src') || '',
                    name: targetProduct?.querySelector('.title')?.textContent?.trim() || '',
                    price: parseFloat(targetProduct?.querySelector('.price')?.textContent?.replace('₦', '').replace(',', '') || '0'),
                    quantity: parseInt(targetProduct?.querySelector('#quantity')?.value) || 1,
                };
                this.addToCart(item);
            });
        });
    }
    heroTypingEffect() {
        const element = document.getElementById("dynamicWord");
        if (!element)
            return;
        const words = [
            "Premium",
            "Perfectly Destoned",
            "Superior Sortexed",
            "Pure",
            "Proudly Nigerian",
            "Unmatched in Quality"
        ];
        let wordIndex = 0;
        let charIndex = 0;
        let deleting = false;
        const typingSpeed = 100;
        const deletingSpeed = 60;
        const delayBetweenWords = 1000;
        const type = () => {
            const currentWord = words[wordIndex];
            element.textContent = '';
            if (!deleting) {
                element.textContent = currentWord.substring(0, charIndex);
                charIndex++;
                if (charIndex > currentWord.length) {
                    deleting = true;
                    setTimeout(type, delayBetweenWords);
                    return;
                }
            }
            else {
                charIndex--;
                element.textContent = currentWord.substring(0, charIndex);
                if (charIndex < 0) {
                    deleting = false;
                    wordIndex = (wordIndex + 1) % words.length;
                }
            }
            setTimeout(type, deleting ? deletingSpeed : typingSpeed);
        };
        type();
    }
    toggleNav() {
        this.element.nav?.classList.toggle('active');
        if (document.getElementById('promoContainer') && window.scrollY === 0 && this.element.nav?.classList.contains('active')) {
            this.element.nav.style.top = '112px';
            console.log(document.getElementById('promoContainer'));
        }
        else {
            this.element.nav ? this.element.nav.style.top = '' : null;
        }
    }
    closePromo() {
        if (this.element.promoContainer) {
            this.element.promoContainer.style.transform = 'scale(0)';
            this.element.promoContainer.style.opacity = '0';
            setTimeout(() => {
                this.element.promoContainer?.remove();
            }, 300);
        }
    }
    openCartModal() {
        this.element.cart?.classList.add('show');
    }
    closeAllModals() {
        this.nodeList.modals?.forEach(modal => {
            modal?.classList.remove('show');
        });
    }
    loadCartItems() {
        this.element.cartCount.textContent = this.cartItems.length.toString();
        if (this.cartItems.length > 0) {
            this.element.cartCon.innerHTML = '';
            this.element.cartCon.classList.remove('empty');
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
                    </div>
                    <div class="item-actions">
                        <div class="quantity-control">
                            <button class="quantity-button" onclick="updateQuantity('${item.id}', -1)">
                                -
                            </button>
                            <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                            <button class="quantity-button" onclick="updateQuantity('${item.id}', 1)">
                                +
                            </button>
                        </div>
                        <button class="remove-button" onclick="removeFromCart('${item.id}')">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                                <path
                                    d="M232.7 69.9L224 96L128 96C110.3 96 96 110.3 96 128C96 145.7 110.3 160 128 160L512 160C529.7 160 544 145.7 544 128C544 110.3 529.7 96 512 96L416 96L407.3 69.9C402.9 56.8 390.7 48 376.9 48L263.1 48C249.3 48 237.1 56.8 232.7 69.9zM512 208L128 208L149.1 531.1C150.7 556.4 171.7 576 197 576L443 576C468.3 576 489.3 556.4 490.9 531.1L512 208z" />
                            </svg>
                        </button>
                    </div>
                </div>
                `;
                this.element.cartCon.innerHTML += itemDiv;
                this.displayCartSummary();
            });
        }
        else {
            this.element.cartCon.innerHTML = `
                <div class="empty-cart">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                        <path
                            d="M9 5.5a.5.5 0 0 0-1 0V7H6.5a.5.5 0 0 0 0 1H8v1.5a.5.5 0 0 0 1 0V8h1.5a.5.5 0 0 0 0-1H9z" />
                        <path
                            d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zm3.915 10L3.102 4h10.796l-1.313 7zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                    </svg>

                    <h2>Your cart is empty</h2>
                    <p>Add items to get started</p>
                    <button class="btn-primary">
                        Continue Shopping
                    </button>
                </div>
            `;
            this.element.cartCon.classList.add('empty');
        }
    }
    addToCart(item) {
        const existingItem = this.cartItems.find(cartItem => cartItem.id === item.id);
        if (!existingItem) {
            this.cartItems.push(item);
            localStorage.setItem('products', JSON.stringify(this.cartItems));
            this.loadCartItems();
            setTimeout(() => {
                this.indicateProductInCart();
            }, 0);
        }
    }
    removeFromCart(itemId) {
        this.cartItems = this.cartItems.filter(item => item.id !== itemId);
        localStorage.setItem('products', JSON.stringify(this.cartItems));
        this.loadCartItems();
        this.indicateProductInCart();
    }
    indicateProductInCart() {
        let alreadyInCartIds = this.cartItems.map((item) => Number(item.id));
        let products = document.querySelectorAll('.product-container');
        products?.forEach(product => {
            let btn = product.querySelector('.add-to-cart');
            if (alreadyInCartIds.includes(Number(product.dataset.id))) {
                btn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M1.18164 12C2.12215 6.87976 6.60812 3 12.0003 3C17.3924 3 21.8784 6.87976 22.8189 12C21.8784 17.1202 17.3924 21 12.0003 21C6.60812 21 2.12215 17.1202 1.18164 12ZM12.0003 17C14.7617 17 17.0003 14.7614 17.0003 12C17.0003 9.23858 14.7617 7 12.0003 7C9.23884 7 7.00026 9.23858 7.00026 12C7.00026 14.7614 9.23884 17 12.0003 17ZM12.0003 15C10.3434 15 9.00026 13.6569 9.00026 12C9.00026 10.3431 10.3434 9 12.0003 9C13.6571 9 15.0003 10.3431 15.0003 12C15.0003 13.6569 13.6571 15 12.0003 15Z"></path></svg>
                View Cart
                `;
                btn.setAttribute('onclick', "openCartModal()");
            }
            else {
                btn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                    <pathd="M9 5.5a.5.5 0 0 0-1 0V7H6.5a.5.5 0 0 0 0 1H8v1.5a.5.5 0 0 0 1 0V8h1.5a.5.5 0 0 0 0-1H9z" />
                    <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zm3.915 10L3.102 4h10.796l-1.313 7zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                </svg>
                Add to Cart
                `;
                btn.toggleAttribute('onclick');
            }
        });
    }
    updateQuantity(itemId, value) {
        this.cartItems = this.cartItems
            .map((item) => {
            if (item.id !== itemId)
                return item;
            if (value === 1) {
                return { ...item, quantity: item.quantity + 1 };
            }
            else {
                const newQty = item.quantity - 1;
                return { ...item, quantity: newQty };
            }
        })
            .filter((item) => item.quantity > 0);
        localStorage.setItem('products', JSON.stringify(this.cartItems));
        this.loadCartItems();
        this.indicateProductInCart();
    }
    displayCartSummary() {
        let subtotal = 0;
        this.cartItems?.forEach(item => {
            subtotal += item.price * item.quantity;
        });
        let totalShipping = this.cartItems.length * this.SHIPPING_FEE;
        const total = subtotal + totalShipping;
        const subtotalEl = this.element.cartSummary?.querySelector('.subtotal');
        if (subtotalEl) {
            subtotalEl.textContent = `₦ ${subtotal.toLocaleString()}`;
        }
        const shippingEl = this.element.cartSummary?.querySelector('.shipping');
        if (shippingEl) {
            shippingEl.textContent = `₦ ${totalShipping.toLocaleString()}`;
        }
        const totalEl = this.element.cartSummary?.querySelector('.totalFee');
        if (totalEl) {
            totalEl.textContent = `₦ ${total.toLocaleString()}`;
        }
    }
}
document.addEventListener('DOMContentLoaded', () => {
    new Initializer();
});
export {};
//# sourceMappingURL=main.js.map