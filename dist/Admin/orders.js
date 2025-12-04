let orders = [
    {
        id: 'ORD-001',
        customer: 'John Doe',
        customerEmail: 'john@example.com',
        products: ['Product A', 'Product B'],
        amount: 299.99,
        status: 'pending',
        date: '2024-01-15',
        address: '123 Main St, City, State'
    },
    {
        id: 'ORD-002',
        customer: 'Jane Smith',
        customerEmail: 'jane@example.com',
        products: ['Product C'],
        amount: 149.99,
        status: 'delivered',
        date: '2024-01-14',
        address: '456 Oak Ave, City, State'
    },
    {
        id: 'ORD-003',
        customer: 'Mike Johnson',
        customerEmail: 'mike@example.com',
        products: ['Product D', 'Product E', 'Product F'],
        amount: 399.99,
        status: 'received',
        date: '2024-01-13',
        address: '789 Pine Rd, City, State'
    }
];
let currentFilter = 'all';
let selectedOrder = null;
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadOrders(currentFilter);
});
function setupEventListeners() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.target;
            const status = target.getAttribute('data-status') || 'all';
            tabBtns.forEach(b => b.classList.remove('active'));
            target.classList.add('active');
            currentFilter = status;
            loadOrders(status);
        });
    });
    const closeModal = document.getElementById('closeModal');
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            const modal = document.getElementById('orderModal');
            if (modal)
                modal.classList.remove('active');
        });
    }
    const modal = document.getElementById('orderModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }
}
function loadOrders(filter) {
    const tableBody = document.getElementById('ordersTable');
    if (!tableBody)
        return;
    let filteredOrders = orders;
    if (filter !== 'all') {
        filteredOrders = orders.filter(order => order.status === filter);
    }
    if (filteredOrders.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" class="no-data">No orders found</td></tr>';
        return;
    }
    tableBody.innerHTML = filteredOrders.map(order => `
        <tr>
            <td>${order.id}</td>
            <td>${order.customer}</td>
            <td>${order.products.join(', ')}</td>
            <td>$${order.amount.toFixed(2)}</td>
            <td><span class="status-badge status-${order.status}">${capitalizeFirst(order.status)}</span></td>
            <td>${formatDate(order.date)}</td>
            <td>
                <div class="action-btns">
                    ${getOrderActionButtons(order)}
                </div>
            </td>
        </tr>
    `).join('');
    attachActionListeners();
}
function getOrderActionButtons(order) {
    if (order.status === 'pending') {
        return `
            <button class="btn btn-success btn-sm" onclick="updateOrderStatus('${order.id}', 'delivered')">
                <i class="fas fa-truck"></i> Mark Delivered
            </button>
            <button class="btn btn-primary btn-sm" onclick="viewOrderDetails('${order.id}')">
                <i class="fas fa-eye"></i> View
            </button>
        `;
    }
    else if (order.status === 'delivered') {
        return `
            <button class="btn btn-success btn-sm" onclick="updateOrderStatus('${order.id}', 'received')">
                <i class="fas fa-check"></i> Mark Received
            </button>
            <button class="btn btn-primary btn-sm" onclick="viewOrderDetails('${order.id}')">
                <i class="fas fa-eye"></i> View
            </button>
        `;
    }
    else {
        return `
            <button class="btn btn-primary btn-sm" onclick="viewOrderDetails('${order.id}')">
                <i class="fas fa-eye"></i> View
            </button>
            <button class="btn btn-secondary btn-sm" onclick="updateOrderStatus('${order.id}', 'pending')">
                <i class="fas fa-redo"></i> Reset
            </button>
        `;
    }
}
function updateOrderStatus(orderId, newStatus) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = newStatus;
        loadOrders(currentFilter);
        alert(`Order ${orderId} status updated to ${newStatus}`);
    }
}
function viewOrderDetails(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order)
        return;
    selectedOrder = order;
    const modal = document.getElementById('orderModal');
    const detailsBody = document.getElementById('orderDetailsBody');
    if (!modal || !detailsBody)
        return;
    detailsBody.innerHTML = `
        <div class="order-detail-section">
            <div class="order-detail-label">Order ID:</div>
            <div class="order-detail-value">${order.id}</div>
            
            <div class="order-detail-label">Customer Name:</div>
            <div class="order-detail-value">${order.customer}</div>
            
            <div class="order-detail-label">Email:</div>
            <div class="order-detail-value">${order.customerEmail}</div>
            
            <div class="order-detail-label">Delivery Address:</div>
            <div class="order-detail-value">${order.address}</div>
            
            <div class="order-detail-label">Order Date:</div>
            <div class="order-detail-value">${formatDate(order.date)}</div>
            
            <div class="order-detail-label">Status:</div>
            <div class="order-detail-value">
                <span class="status-badge status-${order.status}">${capitalizeFirst(order.status)}</span>
            </div>
            
            <div class="order-detail-label">Total Amount:</div>
            <div class="order-detail-value"><strong>$${order.amount.toFixed(2)}</strong></div>
            
            <div class="order-detail-label">Products:</div>
            <ul class="order-products-list">
                ${order.products.map(product => `<li>${product}</li>`).join('')}
            </ul>
        </div>
    `;
    modal.classList.add('active');
}
function attachActionListeners() {
    window.updateOrderStatus = updateOrderStatus;
    window.viewOrderDetails = viewOrderDetails;
}
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}
// export {};
//# sourceMappingURL=orders.js.map