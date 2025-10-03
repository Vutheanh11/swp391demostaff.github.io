document.addEventListener('DOMContentLoaded', () => {

    // --- Shared Logic from staffPage.js ---
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarClose = document.getElementById('sidebarClose');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const userAvatar = document.getElementById('userAvatar');
    const staffInfoDropdown = document.getElementById('staffInfoDropdown');

    // Toggle Sidebar
    const toggleSidebar = () => {
        sidebar.classList.toggle('active');
        sidebarOverlay.classList.toggle('active');
    };

    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', toggleSidebar);
    }
    if (sidebarClose && sidebarOverlay) {
        sidebarClose.addEventListener('click', toggleSidebar);
        sidebarOverlay.addEventListener('click', toggleSidebar);
    }
    
    // Toggle User Info Dropdown
    if (userAvatar) {
        userAvatar.addEventListener('click', (event) => {
            event.stopPropagation();
            staffInfoDropdown.classList.toggle('active');
        });
    }

    document.addEventListener('click', (event) => {
        if (staffInfoDropdown && !staffInfoDropdown.contains(event.target) && !userAvatar.contains(event.target)) {
            staffInfoDropdown.classList.remove('active');
        }
    });

    // --- Charge History Page Specific Logic ---
    const historyTableBody = document.getElementById('historyTableBody');

    // Sample data
    const chargeHistoryData = [
        { id: 'TXN-00123', port: 'A-01', user: 'Lê Minh Anh', start: '2025-09-30 08:15', end: '2025-09-30 09:45', energy: 22.5, cost: 78750, status: 'completed' },
        { id: 'TXN-00124', port: 'B-03', user: 'Trần Hùng', start: '2025-09-30 08:30', end: '2025-09-30 08:45', energy: 5.1, cost: 17850, status: 'cancelled' },
        { id: 'TXN-00125', port: 'C-02', user: 'Phạm Thị Bích', start: '2025-09-30 09:02', end: '2025-09-30 11:32', energy: 35.0, cost: 122500, status: 'completed' },
        { id: 'TXN-00126', port: 'A-04', user: 'Nguyễn Văn Nam', start: '2025-09-30 10:10', end: '2025-09-30 10:55', energy: 0.0, cost: 0, status: 'error' },
        { id: 'TXN-00127', port: 'B-01', user: 'Võ Anh Quân', start: '2025-09-30 11:20', end: '2025-09-30 12:05', energy: 18.2, cost: 63700, status: 'completed' },
        { id: 'TXN-00128', port: 'C-03', user: 'Đặng Mai Linh', start: '2025-09-30 13:00', end: '2025-09-30 15:00', energy: 28.9, cost: 101150, status: 'completed' },
        { id: 'TXN-00129', port: 'A-02', user: 'Hoàng Văn Dũng', start: '2025-09-30 14:00', end: '2025-09-30 14:15', energy: 4.3, cost: 15050, status: 'completed' }
    ];

    const renderTable = (data) => {
        if (!historyTableBody) return;
        historyTableBody.innerHTML = ''; // Clear existing data

        data.forEach(item => {
            const statusClass = `status-${item.status}`;
            const statusText = item.status.charAt(0).toUpperCase() + item.status.slice(1);
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.port}</td>
                <td>${item.user}</td>
                <td>${item.start}</td>
                <td>${item.end}</td>
                <td>${item.energy.toFixed(2)}</td>
                <td>${item.cost.toLocaleString('vi-VN')}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            `;
            historyTableBody.appendChild(row);
        });
    };

    // Initial render of the table
    renderTable(chargeHistoryData);
});