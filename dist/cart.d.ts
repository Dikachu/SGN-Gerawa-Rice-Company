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
declare class CartManager {
    private static instance;
    private cartItems;
    private appliedCoupon;
    private readonly STORAGE_KEY;
    private readonly COUPON_KEY;
    private readonly SHIPPING_FEE;
    private coupons;
    private constructor();
    static getInstance(): CartManager;
    private loadFromStorage;
    private saveToStorage;
    private listenToStorageChanges;
    private dispatchCartUpdate;
    getItems(): CartItem[];
    getItemCount(): number;
    addItem(item: CartItem): boolean;
    removeItem(itemId: string): void;
    updateQuantity(itemId: string, change: number): void;
    getCartSummary(): {
        subtotal: number;
        shipping: number;
        discount: number;
        total: number;
        itemCount: number;
    };
    applyCoupon(code: string): {
        success: boolean;
        message: string;
        discount?: number;
    };
    removeCoupon(): void;
    getAppliedCoupon(): Coupon | null;
    isInCart(itemId: string): boolean;
    getShippingFee(): number;
    clearCart(): void;
}
export declare const cartManager: CartManager;
export {};
//# sourceMappingURL=cart.d.ts.map