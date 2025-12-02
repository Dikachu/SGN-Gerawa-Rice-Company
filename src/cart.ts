type CartItem = {
    readonly id: string;
    imageSrc: string;
    name: string;
    price: number;
    quantity: number;
};

type Coupon = {
    code: string;
    discount: number;
};

class CartManager {
    private static instance: CartManager;
    private cartItems: CartItem[] = [];
    private appliedCoupon: Coupon | null = null;
    private readonly STORAGE_KEY = 'products';
    private readonly COUPON_KEY = 'appliedCoupon';
    private readonly SHIPPING_FEE = 1500;

    private coupons: { [key: string]: number } = {
        "COUPON1": 20,
        "COUPON2": 10,
        "COUPON3": 30,
    };

    private constructor() {
        this.loadFromStorage();
        this.listenToStorageChanges();
    }

    // Singleton pattern
    static getInstance(): CartManager {
        if (!CartManager.instance) {
            CartManager.instance = new CartManager();
        }
        return CartManager.instance;
    }

    // Load cart from localStorage
    private loadFromStorage(): void {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        this.cartItems = stored ? JSON.parse(stored) : [];
        
        const storedCoupon = localStorage.getItem(this.COUPON_KEY);
        this.appliedCoupon = storedCoupon ? JSON.parse(storedCoupon) : null;
    }

    // Save cart to localStorage
    private saveToStorage(): void {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.cartItems));
        if (this.appliedCoupon) {
            localStorage.setItem(this.COUPON_KEY, JSON.stringify(this.appliedCoupon));
        } else {
            localStorage.removeItem(this.COUPON_KEY);
        }
    }

    // Listen for storage changes from other tabs
    private listenToStorageChanges(): void {
        window.addEventListener('storage', (e) => {
            if (e.key === this.STORAGE_KEY || e.key === this.COUPON_KEY) {
                this.loadFromStorage();
                this.dispatchCartUpdate();
            }
        });
    }

    // Dispatch custom event for cart updates
    private dispatchCartUpdate(): void {
        window.dispatchEvent(new CustomEvent('cartUpdated', {
            detail: {
                items: this.getItems(),
                count: this.getItemCount(),
                summary: this.getCartSummary(),
                coupon: this.appliedCoupon
            }
        }));
    }

    // Get all cart items
    getItems(): CartItem[] {
        return [...this.cartItems];
    }

    // Get total number of items
    getItemCount(): number {
        return this.cartItems.length;
    }

    // Add item to cart
    addItem(item: CartItem): boolean {
        const existingItem = this.cartItems.find(i => i.id === item.id);
        
        if (existingItem) {
            return false; // Item already exists
        }
        
        this.cartItems.push(item);
        this.saveToStorage();
        this.dispatchCartUpdate();
        return true;
    }

    // Remove item from cart
    removeItem(itemId: string): void {
        this.cartItems = this.cartItems.filter(item => item.id !== itemId);
        this.saveToStorage();
        this.dispatchCartUpdate();
    }

    // Update item quantity
    updateQuantity(itemId: string, change: number): void {
        this.cartItems = this.cartItems
            .map(item => {
                if (item.id !== itemId) return item;
                const newQuantity = item.quantity + change;
                return { ...item, quantity: newQuantity };
            })
            .filter(item => item.quantity > 0);
        
        this.saveToStorage();
        this.dispatchCartUpdate();
    }

    // Get cart summary calculations
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

    // Apply coupon
    applyCoupon(code: string): { success: boolean; message: string; discount?: number } {
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

    // Remove coupon
    removeCoupon(): void {
        this.appliedCoupon = null;
        this.saveToStorage();
        this.dispatchCartUpdate();
    }

    // Get applied coupon
    getAppliedCoupon(): Coupon | null {
        return this.appliedCoupon;
    }

    // Check if item is in cart
    isInCart(itemId: string): boolean {
        return this.cartItems.some(item => item.id === itemId);
    }

    // Get shipping fee
    getShippingFee(): number {
        return this.SHIPPING_FEE;
    }

    // Clear cart
    clearCart(): void {
        this.cartItems = [];
        this.appliedCoupon = null;
        this.saveToStorage();
        this.dispatchCartUpdate();
    }
}

// Export singleton instance
export const cartManager = CartManager.getInstance();