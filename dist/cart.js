class CartManager {
    static instance;
    cartItems = [];
    appliedCoupon = null;
    STORAGE_KEY = 'products';
    COUPON_KEY = 'appliedCoupon';
    SHIPPING_FEE = 1500;
    coupons = {
        "COUPON1": 20,
        "COUPON2": 10,
        "COUPON3": 30,
    };
    constructor() {
        this.loadFromStorage();
        this.listenToStorageChanges();
    }
    static getInstance() {
        if (!CartManager.instance) {
            CartManager.instance = new CartManager();
        }
        return CartManager.instance;
    }
    loadFromStorage() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        this.cartItems = stored ? JSON.parse(stored) : [];
        const storedCoupon = localStorage.getItem(this.COUPON_KEY);
        this.appliedCoupon = storedCoupon ? JSON.parse(storedCoupon) : null;
    }
    saveToStorage() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.cartItems));
        if (this.appliedCoupon) {
            localStorage.setItem(this.COUPON_KEY, JSON.stringify(this.appliedCoupon));
        }
        else {
            localStorage.removeItem(this.COUPON_KEY);
        }
    }
    listenToStorageChanges() {
        window.addEventListener('storage', (e) => {
            if (e.key === this.STORAGE_KEY || e.key === this.COUPON_KEY) {
                this.loadFromStorage();
                this.dispatchCartUpdate();
            }
        });
    }
    dispatchCartUpdate() {
        window.dispatchEvent(new CustomEvent('cartUpdated', {
            detail: {
                items: this.getItems(),
                count: this.getItemCount(),
                summary: this.getCartSummary(),
                coupon: this.appliedCoupon
            }
        }));
    }
    getItems() {
        return [...this.cartItems];
    }
    getItemCount() {
        return this.cartItems.length;
    }
    addItem(item) {
        const existingItem = this.cartItems.find(i => i.id === item.id);
        if (existingItem) {
            return false;
        }
        this.cartItems.push(item);
        this.saveToStorage();
        this.dispatchCartUpdate();
        return true;
    }
    removeItem(itemId) {
        this.cartItems = this.cartItems.filter(item => item.id !== itemId);
        this.saveToStorage();
        this.dispatchCartUpdate();
    }
    updateQuantity(itemId, change) {
        this.cartItems = this.cartItems
            .map(item => {
            if (item.id !== itemId)
                return item;
            const newQuantity = item.quantity + change;
            return { ...item, quantity: newQuantity };
        })
            .filter(item => item.quantity > 0);
        this.saveToStorage();
        this.dispatchCartUpdate();
    }
    getCartSummary() {
        let subtotal = 0;
        this.cartItems.forEach(item => {
            subtotal += item.price * item.quantity;
        });
        const totalShipping = this.cartItems.length * this.SHIPPING_FEE;
        let discountAmount = 0;
        if (this.appliedCoupon) {
            discountAmount = subtotal * (this.appliedCoupon.discount / 100);
        }
        const total = subtotal + totalShipping - discountAmount;
        return {
            subtotal,
            shipping: totalShipping,
            discount: discountAmount,
            total,
            itemCount: this.cartItems.length
        };
    }
    applyCoupon(code) {
        const upperCode = code.trim().toUpperCase();
        if (this.coupons[upperCode]) {
            const discount = this.coupons[upperCode];
            this.appliedCoupon = { code: upperCode, discount };
            this.saveToStorage();
            this.dispatchCartUpdate();
            return {
                success: true,
                message: `Coupon "${upperCode}" applied! ${discount}% off`,
                discount
            };
        }
        return {
            success: false,
            message: 'Invalid coupon code'
        };
    }
    removeCoupon() {
        this.appliedCoupon = null;
        this.saveToStorage();
        this.dispatchCartUpdate();
    }
    getAppliedCoupon() {
        return this.appliedCoupon;
    }
    isInCart(itemId) {
        return this.cartItems.some(item => item.id === itemId);
    }
    getShippingFee() {
        return this.SHIPPING_FEE;
    }
    clearCart() {
        this.cartItems = [];
        this.appliedCoupon = null;
        this.saveToStorage();
        this.dispatchCartUpdate();
    }
}
export const cartManager = CartManager.getInstance();
//# sourceMappingURL=cart.js.map