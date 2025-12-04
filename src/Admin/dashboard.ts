// Dashboard functionality
interface DashboardStats {
    totalOrders: number;
    pendingOrders: number;
    totalProducts: number;
    totalUsers: number;
}

interface Order {
    id: string;
    customer: string;
    amount: number;
    status: 'pending' | 'delivered' | 'received';
    date: string;
}

interface Review {
    id: string;
    user: string;
    product: string;
    rating: number;
    text: string;
    date: string;
}

// Sample data (In production, fetch from API)
const sampleOrders: Order[] = [
    {
        id: 'ORD-001',
        customer: 'John Doe',
        amount: 299.99,
        status: 'pending',
        date: '2024-01-15'
    },
    {
        id: 'ORD-002',
        customer: 'Jane Smith',
        amount: 149.99,
        status: 'delivered',
        date: '2024-01-14'
    },
    {
        id: 'ORD-003',
        customer: 'Mike Johnson',
        amount: 399.99,
        status: 'received',
        date: '2024-01-13'
    }
];

const sampleReviews: Review[] = [
    {
        id: 'REV-001',
        user: 'Alice Brown',
        product: 'Product A',
        rating: 5,
        text: 'Excellent product! Highly recommended.',
        date: '2024-01-15'
    },
    {
        id: 'REV-002',
        user: 'Bob Wilson',
        product: 'Product B',
        rating: 4,
        text: 'Good quality, fast delivery.',
        date: '2024-01-14'
    }
];

// Load dashboard data
function loadDashboardData(): void {
    // Update stats
    const stats: DashboardStats = {
        totalOrders: 156,
        pendingOrders: 12,
        totalProducts: 45,
        totalUsers: 234
    };

    updateStats(stats);
    loadRecentOrders();
    loadRecentReviews();
}

// Update stats cards
function updateStats(stats: DashboardStats): void {
    const totalOrdersEl = document.getElementById('totalOrders');
    const pendingOrdersEl = document.getElementById('pendingOrders');
    const totalProductsEl = document.getElementById('totalProducts');
    const totalUsersEl = document.getElementById('totalUsers');

    if (totalOrdersEl) totalOrdersEl.textContent = stats.totalOrders.toString();
    if (pendingOrdersEl) pendingOrdersEl.textContent = stats.pendingOrders.toString();
    if (totalProductsEl) totalProductsEl.textContent = stats.totalProducts.toString();
    if (totalUsersEl) totalUsersEl.textContent = stats.totalUsers.toString();
}

// Load recent orders
function loadRecentOrders(): void {
    const tableBody = document.getElementById('recentOrdersTable');
    if (!tableBody) return;

    if (sampleOrders.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" class="no-data">No recent orders</td></tr>';
        return;
    }

    tableBody.innerHTML = sampleOrders.map(order => `
        <tr>
            <td>${order.id}</td>
            <td>${order.customer}</td>
            <td>$${order.amount.toFixed(2)}</td>
            <td><span class="status-badge status-${order.status}">${order.status}</span></td>
            <td>${formatDate(order.date)}</td>
        </tr>
    `).join('');
}

// Load recent reviews
function loadRecentReviews(): void {
    const reviewsContainer = document.getElementById('recentReviews');
    if (!reviewsContainer) return;

    if (sampleReviews.length === 0) {
        reviewsContainer.innerHTML = '<div class="no-data">No recent reviews</div>';
        return;
    }

    reviewsContainer.innerHTML = sampleReviews.map(review => `
        <div class="review-card">
            <div class="review-header">
                <div>
                    <div class="review-user">${review.user}</div>
                    <small>${review.product}</small>
                </div>
                <div class="review-rating">
                    ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                </div>
            </div>
            <div class="review-text">${review.text}</div>
        </div>
    `).join('');
}

// Format date
function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    loadDashboardData();
});