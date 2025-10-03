document.addEventListener('DOMContentLoaded', () => {
    // Maintenance Data
    const maintenanceData = [
        { 
            id: 1, 
            status: 'healthy', 
            name: 'Cổng sạc 1',
            lastMaintenance: '15/09/2024',
            nextMaintenance: '15/12/2024',
            condition: 95,
            issues: []
        },
        { 
            id: 2, 
            status: 'healthy', 
            name: 'Cổng sạc 2',
            lastMaintenance: '20/09/2024',
            nextMaintenance: '20/12/2024',
            condition: 92,
            issues: []
        },
        { 
            id: 3, 
            status: 'warning', 
            name: 'Cổng sạc 3',
            lastMaintenance: '10/08/2024',
            nextMaintenance: '10/11/2024',
            condition: 75,
            issues: ['Cáp sạc có dấu hiệu mòn', 'Đầu cắm cần làm sạch']
        },
        { 
            id: 4, 
            status: 'broken', 
            name: 'Cổng sạc 4',
            lastMaintenance: '05/07/2024',
            nextMaintenance: 'Cần sửa chữa ngay',
            condition: 30,
            issues: ['Mạch điện bị hỏng', 'Không cấp điện được']
        },
        { 
            id: 5, 
            status: 'healthy', 
            name: 'Cổng sạc 5',
            lastMaintenance: '25/09/2024',
            nextMaintenance: '25/12/2024',
            condition: 98,
            issues: []
        },
        { 
            id: 6, 
            status: 'healthy', 
            name: 'Cổng sạc 6',
            lastMaintenance: '18/09/2024',
            nextMaintenance: '18/12/2024',
            condition: 90,
            issues: []
        }
    ];

    // DOM Elements
    const maintenanceGrid = document.getElementById('maintenanceGrid');
    const maintenanceHistory = document.getElementById('maintenanceHistory');
    const healthyPortsStat = document.getElementById('healthyPorts');
    const maintenancePortsStat = document.getElementById('maintenancePorts');
    const brokenPortsStat = document.getElementById('brokenPorts');
    const scheduledMaintenanceStat = document.getElementById('scheduledMaintenance');
    
    const actionModal = document.getElementById('actionModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    const closeModalBtn = document.getElementById('closeModal');
    const confirmActionBtn = document.getElementById('confirmAction');
    const cancelActionBtn = document.getElementById('cancelAction');

    // Sidebar & Header Elements
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const menuToggle = document.getElementById('menuToggle');
    const sidebarClose = document.getElementById('sidebarClose');
    const userAvatar = document.getElementById('userAvatar');
    const staffInfoDropdown = document.getElementById('staffInfoDropdown');
    const logoutBtn = document.getElementById('logoutBtn');

    // Action Buttons
    const scheduleMaintenanceBtn = document.getElementById('scheduleMaintenanceBtn');
    const reportIssueBtn = document.getElementById('reportIssueBtn');
    const performCheckBtn = document.getElementById('performCheckBtn');
    const viewReportsBtn = document.getElementById('viewReportsBtn');

    let activeModalInfo = { portId: null, action: null };

    // Render Functions
    const renderMaintenance = () => {
        maintenanceGrid.innerHTML = '';
        maintenanceData.forEach(port => {
            const portCard = document.createElement('div');
            portCard.className = `port-card ${port.status}`;
            portCard.dataset.portId = port.id;

            const statusInfo = getStatusInfo(port.status);
            const conditionClass = port.condition >= 80 ? 'highlight' : port.condition >= 50 ? 'warning' : 'danger';

            let portHTML = `
                <div class="port-header">
                    <h3 class="port-title">${port.name}</h3>
                    <span class="port-status-badge ${statusInfo.class}">${statusInfo.text}</span>
                </div>
                <div class="port-details">
                    <div class="detail-row">
                        <span class="detail-label"><i class="fas fa-heartbeat"></i> Tình trạng</span>
                        <span class="detail-value ${conditionClass}">${port.condition}%</span>
                    </div>
                    <div class="progress-container">
                        <div class="progress-bar">
                            <div class="progress-fill ${port.condition < 50 ? 'warning' : ''}" style="width: ${port.condition}%;"></div>
                        </div>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label"><i class="fas fa-wrench"></i> Bảo trì gần nhất</span>
                        <span class="detail-value">${port.lastMaintenance}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label"><i class="fas fa-calendar-alt"></i> Bảo trì tiếp theo</span>
                        <span class="detail-value">${port.nextMaintenance}</span>
                    </div>
            `;

            if (port.issues.length > 0) {
                portHTML += `
                    <div class="alert-box ${port.status === 'broken' ? '' : 'warning'}">
                        <i class="fas fa-exclamation-triangle"></i>
                        <div class="alert-text">
                            ${port.issues.map(issue => `<div>• ${issue}</div>`).join('')}
                        </div>
                    </div>
                `;
            }

            portHTML += '</div>';

            // Actions
            portHTML += '<div class="port-actions">';
            if (port.status === 'healthy') {
                portHTML += `<button class="port-action-btn" data-action="check" data-port-id="${port.id}"><i class="fas fa-clipboard-check"></i> Kiểm tra</button>`;
            }
            if (port.status === 'warning') {
                portHTML += `<button class="port-action-btn reset" data-action="schedule" data-port-id="${port.id}"><i class="fas fa-calendar-plus"></i> Lên lịch bảo trì</button>`;
            }
            if (port.status === 'broken') {
                portHTML += `<button class="port-action-btn stop" data-action="repair" data-port-id="${port.id}"><i class="fas fa-tools"></i> Sửa chữa ngay</button>`;
            }
            portHTML += '</div>';

            portCard.innerHTML = portHTML;
            maintenanceGrid.appendChild(portCard);
        });
        updateStats();
    };

    const updateStats = () => {
        const counts = maintenanceData.reduce((acc, port) => {
            acc[port.status] = (acc[port.status] || 0) + 1;
            return acc;
        }, {});

        healthyPortsStat.textContent = counts.healthy || 0;
        maintenancePortsStat.textContent = counts.warning || 0;
        brokenPortsStat.textContent = counts.broken || 0;
        scheduledMaintenanceStat.textContent = maintenanceData.filter(p => p.nextMaintenance !== 'Cần sửa chữa ngay').length;
    };

    const addMaintenanceLog = (type, title, message) => {
        const logItem = document.createElement('div');
        logItem.className = 'alert-item';

        const icons = {
            error: { class: 'error', i: 'fa-exclamation-circle' },
            warning: { class: 'warning', i: 'fa-exclamation-triangle' },
            info: { class: 'info', i: 'fa-info-circle' }
        };

        logItem.innerHTML = `
            <div class="alert-icon-box ${icons[type].class}">
                <i class="fas ${icons[type].i}"></i>
            </div>
            <div class="alert-content">
                <div class="alert-header">
                    <h4 class="alert-title">${title}</h4>
                    <span class="alert-time">${new Date().toLocaleTimeString('vi-VN')}</span>
                </div>
                <p class="alert-message">${message}</p>
            </div>
        `;
        maintenanceHistory.prepend(logItem);
    };

    const getStatusInfo = (status) => {
        const info = {
            healthy: { class: 'available', text: 'Hoạt động tốt' },
            warning: { class: 'idle', text: 'Cần bảo trì' },
            broken: { class: 'error', text: 'Hỏng hóc' }
        };
        return info[status] || { class: '', text: status };
    };

    // Event Handlers
    const handlePortAction = (e) => {
        const target = e.target.closest('.port-action-btn');
        if (!target) return;

        const portId = parseInt(target.dataset.portId, 10);
        const action = target.dataset.action;
        activeModalInfo = { portId, action };

        const messages = {
            check: `Bạn có muốn thực hiện kiểm tra định kỳ cho Cổng ${portId}?`,
            schedule: `Lên lịch bảo trì cho Cổng ${portId}?`,
            repair: `Xác nhận bắt đầu sửa chữa Cổng ${portId}?`
        };

        modalTitle.textContent = 'Xác nhận hành động';
        modalMessage.textContent = messages[action] || 'Bạn có chắc chắn muốn thực hiện thao tác này?';
        actionModal.classList.add('active');
    };

    const confirmAction = () => {
        const { portId, action } = activeModalInfo;
        const port = maintenanceData.find(p => p.id === portId);
        if (!port) return;

        switch (action) {
            case 'check':
                addMaintenanceLog('info', `Kiểm tra ${port.name}`, 'Đã hoàn thành kiểm tra định kỳ. Thiết bị hoạt động bình thường.');
                break;
            case 'schedule':
                addMaintenanceLog('warning', `Lên lịch bảo trì ${port.name}`, 'Đã lên lịch bảo trì dự kiến vào ngày 05/11/2024.');
                break;
            case 'repair':
                port.status = 'warning';
                port.condition = 60;
                port.issues = ['Đang trong quá trình sửa chữa'];
                addMaintenanceLog('error', `Sửa chữa ${port.name}`, 'Đã bắt đầu quy trình sửa chữa thiết bị.');
                renderMaintenance();
                break;
        }
        closeModal();
    };

    const closeModal = () => {
        actionModal.classList.remove('active');
        activeModalInfo = { portId: null, action: null };
    };

    const toggleSidebar = () => {
        sidebar.classList.toggle('active');
        sidebarOverlay.classList.toggle('active');
    };

    const toggleStaffInfo = (e) => {
        e.stopPropagation();
        staffInfoDropdown.classList.toggle('active');
    };

    const handleLogout = () => {
        if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
            window.location.href = 'loginPage.html';
        }
    };

    // Setup Event Listeners
    const setupEventListeners = () => {
        maintenanceGrid.addEventListener('click', handlePortAction);
        closeModalBtn.addEventListener('click', closeModal);
        confirmActionBtn.addEventListener('click', confirmAction);
        cancelActionBtn.addEventListener('click', closeModal);

        menuToggle.addEventListener('click', toggleSidebar);
        sidebarClose.addEventListener('click', toggleSidebar);
        sidebarOverlay.addEventListener('click', toggleSidebar);
        userAvatar.addEventListener('click', toggleStaffInfo);
        logoutBtn.addEventListener('click', handleLogout);

        document.addEventListener('click', (e) => {
            if (!userAvatar.contains(e.target) && !staffInfoDropdown.contains(e.target)) {
                staffInfoDropdown.classList.remove('active');
            }
        });

        scheduleMaintenanceBtn.addEventListener('click', () => {
            addMaintenanceLog('info', 'Lên lịch bảo trì', 'Đã thêm lịch bảo trì mới vào hệ thống.');
        });

        reportIssueBtn.addEventListener('click', () => {
            addMaintenanceLog('warning', 'Báo cáo sự cố', 'Đã ghi nhận báo cáo sự cố mới từ nhân viên.');
        });

        performCheckBtn.addEventListener('click', () => {
            addMaintenanceLog('info', 'Kiểm tra định kỳ', 'Đã hoàn thành kiểm tra định kỳ cho tất cả thiết bị.');
        });

        viewReportsBtn.addEventListener('click', () => {
            alert('Chức năng xem báo cáo chi tiết đang được phát triển.');
        });
    };

    // Initial Load
    renderMaintenance();
    setupEventListeners();
    addMaintenanceLog('info', 'Chào mừng!', 'Hệ thống quản lý bảo trì trạm sạc đã sẵn sàng.');
});
