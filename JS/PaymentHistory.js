
// Mock Payment Data
const paymentData = [
    {
        id: 'PAY001',
        timestamp: '2024-01-15 14:30:25',
        port: 'Cổng 1',
        customer: 'Nguyễn Văn A',
        phone: '0901234567',
        energy: 45.5,
        duration: '2h 15m',
        amount: 227500,
        method: 'momo',
        status: 'completed'
    },
    {
        id: 'PAY002',
        timestamp: '2024-01-15 13:15:10',
        port: 'Cổng 3',
        customer: 'Trần Thị B',
        phone: '0912345678',
        energy: 32.8,
        duration: '1h 45m',
        amount: 164000,
        method: 'vnpay',
        status: 'completed'
    },
    {
        id: 'PAY003',
        timestamp: '2024-01-15 12:00:00',
        port: 'Cổng 2',
        customer: 'Lê Văn C',
        phone: '0923456789',
        energy: 28.3,
        duration: '1h 30m',
        amount: 141500,
        method: 'visa',
        status: 'pending'
    },
    {
        id: 'PAY004',
        timestamp: '2024-01-15 10:45:30',
        port: 'Cổng 4',
        customer: 'Phạm Thị D',
        phone: '0934567890',
        energy: 0,
        duration: '0m',
        amount: 0,
        method: 'momo',
        status: 'failed'
    },
    {
        id: 'PAY005',
        timestamp: '2024-01-15 09:20:15',
        port: 'Cổng 1',
        customer: 'Hoàng Văn E',
        phone: '0945678901',
        energy: 52.1,
        duration: '2h 40m',
        amount: 260500,
        method: 'zalopay',
        status: 'completed'
    }
];

// DOM Elements
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const menuToggle = document.getElementById('menuToggle');
const sidebarClose = document.getElementById('sidebarClose');
const userAvatar = document.getElementById('userAvatar');
const staffInfoDropdown = document.getElementById('staffInfoDropdown');
const logoutBtn = document.getElementById('logoutBtn');
const paymentTableBody = document.getElementById('paymentTableBody');
const detailModal = document.getElementById('detailModal');
const closeDetailModal = document.getElementById('closeDetailModal');
const applyFilter = document.getElementById('applyFilter');
const resetFilter = document.getElementById('resetFilter');
const exportBtn = document.getElementById('exportBtn');
const prevPage = document.getElementById('prevPage');
const nextPage = document.getElementById('nextPage');
const currentPageSpan = document.getElementById('currentPage');

// State
let currentPage = 1;
const itemsPerPage = 10;
let filteredData = [...paymentData];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    renderPaymentTable();
    setupEventListeners();
    setDefaultDates();
});

// Setup Event Listeners
function setupEventListeners() {
    // Sidebar toggle
    menuToggle.addEventListener('click', toggleSidebar);
    sidebarClose.addEventListener('click', toggleSidebar);
    sidebarOverlay.addEventListener('click', toggleSidebar);
    
    // User avatar dropdown
    userAvatar.addEventListener('click', toggleStaffInfo);
    
    // Logout
    logoutBtn.addEventListener('click', handleLogout);
    
    // Modal
    closeDetailModal.addEventListener('click', () => detailModal.classList.remove('active'));
    
    // Filters
    applyFilter.addEventListener('click', handleFilter);
    resetFilter.addEventListener('click', handleResetFilter);
    
    // Export
    exportBtn.addEventListener('click', handleExport);
    
    // Pagination
    prevPage.addEventListener('click', () => changePage(-1));
    nextPage.addEventListener('click', () => changePage(1));
}

// Toggle Sidebar
function toggleSidebar() {
    sidebar.classList.toggle('active');
    sidebarOverlay.classList.toggle('active');
}

// Toggle Staff Info
function toggleStaffInfo(e) {
    e.stopPropagation();
    staffInfoDropdown.classList.toggle('active');
}

// Close staff info when clicking outside
document.addEventListener('click', function(e) {
    if (!userAvatar.contains(e.target)) {
        staffInfoDropdown.classList.remove('active');
    }
});

// Handle Logout
function handleLogout() {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
        window.location.href = 'loginPage.html';
    }
}

// Set Default Dates
function setDefaultDates() {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    document.getElementById('dateTo').valueAsDate = today;
    document.getElementById('dateFrom').valueAsDate = weekAgo;
}

// Render Payment Table
function renderPaymentTable() {
    paymentTableBody.innerHTML = '';
    
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageData = filteredData.slice(start, end);
    
    pageData.forEach(payment => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${payment.id}</strong></td>
            <td>${payment.timestamp}</td>
            <td>${payment.port}</td>
            <td>${payment.customer}</td>
            <td>${payment.phone}</td>
            <td>${payment.energy} kWh</td>
            <td>${payment.duration}</td>
            <td><strong>${formatCurrency(payment.amount)}</strong></td>
            <td>
                <div class="payment-method">
                    <i class="${getPaymentIcon(payment.method)}"></i>
                    ${getPaymentMethodName(payment.method)}
                </div>
            </td>
            <td><span class="status-badge ${payment.status}">${getStatusText(payment.status)}</span></td>
            <td>
                <button class="action-btn" onclick="viewPaymentDetail('${payment.id}')">
                    <i class="fas fa-eye"></i> Xem
                </button>
            </td>
        `;
        paymentTableBody.appendChild(row);
    });
    
    updatePagination();
}

// View Payment Detail
function viewPaymentDetail(paymentId) {
    const payment = paymentData.find(p => p.id === paymentId);
    if (!payment) return;
    
    const detailContent = `
        <div class="detail-section">
            <h3>Thông tin giao dịch</h3>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-item-label">Mã giao dịch</span>
                    <span class="detail-item-value">${payment.id}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-item-label">Thời gian</span>
                    <span class="detail-item-value">${payment.timestamp}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-item-label">Cổng sạc</span>
                    <span class="detail-item-value">${payment.port}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-item-label">Trạng thái</span>
                    <span class="detail-item-value"><span class="status-badge ${payment.status}">${getStatusText(payment.status)}</span></span>
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <h3>Thông tin khách hàng</h3>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-item-label">Họ và tên</span>
                    <span class="detail-item-value">${payment.customer}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-item-label// JS/PaymentHistory.js (continued)

                    <span class="detail-item-label">Số điện thoại</span>
                    <span class="detail-item-value">${payment.phone}</span>
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <h3>Chi tiết sạc điện</h3>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-item-label">Điện năng tiêu thụ</span>
                    <span class="detail-item-value">${payment.energy} kWh</span>
                </div>
                <div class="detail-item">
                    <span class="detail-item-label">Thời lượng sạc</span>
                    <span class="detail-item-value">${payment.duration}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-item-label">Đơn giá</span>
                    <span class="detail-item-value">5,000 ₫/kWh</span>
                </div>
                <div class="detail-item">
                    <span class="detail-item-label">Phương thức thanh toán</span>
                    <span class="detail-item-value">
                        <div class="payment-method">
                            <i class="${getPaymentIcon(payment.method)}"></i>
                            ${getPaymentMethodName(payment.method)}
                        </div>
                    </span>
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <h3>Tổng thanh toán</h3>
            <div class="detail-item">
                <span class="detail-item-label">Tổng số tiền</span>
                <span class="detail-item-value highlight">${formatCurrency(payment.amount)}</span>
            </div>
        </div>
    `;
    
    document.getElementById('paymentDetail').innerHTML = detailContent;
    detailModal.classList.add('active');
}

// Filter Handler
function handleFilter() {
    const dateFrom = document.getElementById('dateFrom').value;
    const dateTo = document.getElementById('dateTo').value;
    const status = document.getElementById('statusFilter').value;
    const search = document.getElementById('searchInput').value.toLowerCase();
    
    filteredData = paymentData.filter(payment => {
        // Date filter
        if (dateFrom || dateTo) {
            const paymentDate = new Date(payment.timestamp.split(' ')[0]);
            if (dateFrom && paymentDate < new Date(dateFrom)) return false;
            if (dateTo && paymentDate > new Date(dateTo)) return false;
        }
        
        // Status filter
        if (status !== 'all' && payment.status !== status) return false;
        
        // Search filter
        if (search) {
            const searchFields = [
                payment.id,
                payment.port,
                payment.customer,
                payment.phone
            ].map(f => f.toLowerCase());
            
            if (!searchFields.some(field => field.includes(search))) return false;
        }
        
        return true;
    });
    
    currentPage = 1;
    renderPaymentTable();
    updateStats();
}

// Reset Filter
function handleResetFilter() {
    document.getElementById('statusFilter').value = 'all';
    document.getElementById('searchInput').value = '';
    setDefaultDates();
    filteredData = [...paymentData];
    currentPage = 1;
    renderPaymentTable();
    updateStats();
}

// Update Statistics
function updateStats() {
    const today = new Date().toISOString().split('T')[0];
    const todayPayments = filteredData.filter(p => p.timestamp.startsWith(today));
    
    const todayRevenue = todayPayments
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + p.amount, 0);
    
    const pendingCount = filteredData.filter(p => p.status === 'pending').length;
    const failedCount = filteredData.filter(p => p.status === 'failed').length;
    
    document.getElementById('todayRevenue').textContent = formatCurrency(todayRevenue);
    document.getElementById('todayTransactions').textContent = todayPayments.length;
    document.getElementById('pendingPayments').textContent = pendingCount;
    document.getElementById('failedPayments').textContent = failedCount;
}

// Pagination
function updatePagination() {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    currentPageSpan.textContent = currentPage;
    document.getElementById('totalPages').textContent = totalPages;
    
    prevPage.disabled = currentPage === 1;
    nextPage.disabled = currentPage === totalPages || totalPages === 0;
}

function changePage(direction) {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const newPage = currentPage + direction;
    
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        renderPaymentTable();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Export to Excel
function handleExport() {
    // Simple CSV export
    let csv = 'Mã GD,Thời gian,Cổng sạc,Khách hàng,Số điện thoại,Điện năng (kWh),Thời lượng,Số tiền (₫),Phương thức,Trạng thái\n';
    
    filteredData.forEach(payment => {
        csv += `${payment.id},${payment.timestamp},${payment.port},${payment.customer},${payment.phone},${payment.energy},${payment.duration},${payment.amount},${getPaymentMethodName(payment.method)},${getStatusText(payment.status)}\n`;
    });
    
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `payment_history_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Utility Functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

function getPaymentIcon(method) {
    const icons = {
        'momo': 'fab fa-apple-pay',
        'vnpay': 'fas fa-wallet',
        'zalopay': 'fas fa-mobile-alt',
        'visa': 'fab fa-cc-visa',
        'mastercard': 'fab fa-cc-mastercard'
    };
    return icons[method] || 'fas fa-credit-card';
}

function getPaymentMethodName(method) {
    const names = {
        'momo': 'MoMo',
        'vnpay': 'VNPay',
        'zalopay': 'ZaloPay',
        'visa': 'Visa',
        'mastercard': 'MasterCard'
    };
    return names[method] || method;
}

function getStatusText(status) {
    const texts = {
        'completed': 'Hoàn thành',
        'pending': 'Đang chờ',
        'failed': 'Thất bại'
    };
    return texts[status] || status;
}

// Initial stats update
updateStats();