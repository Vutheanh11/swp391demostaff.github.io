
document.addEventListener('DOMContentLoaded', () => {
    // State
    const portsData = [
        { id: 1, status: 'charging', customer: 'Nguyễn Văn A', soc: 75, power: 10.5, duration: '01:30:15', errorCode: null, startTime: new Date(Date.now() - 5415000) },
        { id: 2, status: 'available', customer: null, soc: 0, power: 0, duration: '00:00:00', errorCode: null },
        { id: 3, status: 'error', customer: null, soc: 0, power: 0, duration: '00:00:00', errorCode: 'OVERHEAT' },
        { id: 4, status: 'idle', customer: 'Trần Thị B', soc: 100, power: 0, duration: '02:15:40', errorCode: null },
        { id: 5, status: 'available', customer: null, soc: 0, power: 0, duration: '00:00:00', errorCode: null },
        { id: 6, status: 'charging', customer: 'Lê Văn C', soc: 40, power: 11.2, duration: '00:55:20', errorCode: null, startTime: new Date(Date.now() - 3320000) },
    ];

    const mockCustomers = [
        'Phạm Minh Tuấn', 'Hoàng Thị Kim Liên', 'Vũ Đức Thắng', 'Đặng Mỹ Linh', 
        'Bùi Anh Khoa', 'Đỗ Gia Hân', 'Hồ Thanh Tùng', 'Dương Thùy Chi', 'Lý Hải Nam',
        'Mai Phương Thảo', 'Trịnh Quốc Bảo', 'Ngô Lan Hương'
    ];

    const errorTypes = {
        'OVERHEAT': { message: 'Cổng sạc quá nhiệt. Tạm dừng để làm mát.', icon: 'fa-fire-alt' },
        'COMPONENT_FAILURE': { message: 'Lỗi linh kiện bên trong. Cần kiểm tra kỹ thuật.', icon: 'fa-microchip' },
        'CONNECTION_LOSS': { message: 'Mất kết nối với máy chủ. Đang thử kết nối lại.', icon: 'fa-unlink' },
        'POWER_FAULT': { message: 'Lỗi nguồn điện đầu vào. Vui lòng kiểm tra nguồn.', icon: 'fa-bolt' }
    };
    
    let isSimulatorActive = false;
    let simulatorIntervalId = null;
    let activeModalInfo = { portId: null, action: null };

    // DOM Elements
    const portsGrid = document.getElementById('portsGrid');
    const alertsList = document.getElementById('alertsList');
    const chargingPortsStat = document.getElementById('chargingPorts');
    const availablePortsStat = document.getElementById('availablePorts');
    const errorPortsStat = document.getElementById('errorPorts');
    const idlePortsStat = document.getElementById('idlePorts');
    const actionModal = document.getElementById('actionModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    const closeModalBtn = document.getElementById('closeModal');
    const confirmActionBtn = document.getElementById('confirmAction');
    const cancelActionBtn = document.getElementById('cancelAction');
    const simulatorToggle = document.getElementById('simulatorToggle');
    const simulatorStatus = document.getElementById('simulatorStatus');
    
    // Sidebar & Header Elements
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const menuToggle = document.getElementById('menuToggle');
    const sidebarClose = document.getElementById('sidebarClose');
    const userAvatar = document.getElementById('userAvatar');
    const staffInfoDropdown = document.getElementById('staffInfoDropdown');
    const logoutBtn = document.getElementById('logoutBtn');

    // Test buttons
    const testOverheatBtn = document.getElementById('testOverheat');
    const testComponentFailureBtn = document.getElementById('testComponentFailure');
    const testSlowChargeBtn = document.getElementById('testSlowCharge');
    const testConnectionLossBtn = document.getElementById('testConnectionLoss');
    const testChargeCompleteBtn = document.getElementById('testChargeComplete');
    

    // Main Functions
    const renderPorts = () => {
        portsGrid.innerHTML = '';
        portsData.forEach(port => {
            const portCard = document.createElement('div');
            portCard.className = `port-card ${port.status === 'error' ? 'error' : ''}`;
            portCard.dataset.portId = port.id;

            const statusInfo = getStatusInfo(port.status);
            
            let portHTML = `
                <div class="port-header">
                    <h3 class="port-title">Cổng ${port.id}</h3>
                    <span class="port-status-badge ${statusInfo.class}">${statusInfo.text}</span>
                </div>
                <div class="port-details">
            `;

            if (port.status === 'charging' || port.status === 'idle') {
                portHTML += `
                    <div class="detail-row">
                        <span class="detail-label"><i class="fas fa-user"></i> Khách hàng</span>
                        <span class="detail-value">${port.customer || 'N/A'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label"><i class="fas fa-battery-full"></i> Mức pin (SOC)</span>
                        <span class="detail-value highlight">${port.soc}%</span>
                    </div>
                    <div class="progress-container">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${port.soc}%;"></div>
                        </div>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label"><i class="fas fa-bolt"></i> Công suất</span>
                        <span class="detail-value">${port.power} kW</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label"><i class="fas fa-clock"></i> Thời gian sạc</span>
                        <span class="detail-value">${port.duration}</span>
                    </div>
                `;
            }

            if (port.status === 'error' && port.errorCode) {
                portHTML += `
                    <div class="alert-box">
                        <i class="fas ${errorTypes[port.errorCode]?.icon || 'fa-exclamation-triangle'}"></i>
                        <span class="alert-text">${errorTypes[port.errorCode]?.message || 'Lỗi không xác định.'}</span>
                    </div>
                `;
            }
            
            if (port.status === 'available') {
                 portHTML += `
                    <div class="detail-row" style="justify-content: center; flex-direction: column; gap: 10px; min-height: 150px; color: #555;">
                         <i class="fas fa-plug fa-3x"></i>
                         <span style="font-size: 16px; font-weight: 500;">Sẵn sàng kết nối</span>
                    </div>
                `;
            }

            portHTML += '</div>';

            // Actions
            portHTML += '<div class="port-actions">';
            if (port.status === 'charging') {
                portHTML += `<button class="port-action-btn stop" data-action="stop" data-port-id="${port.id}"><i class="fas fa-stop-circle"></i> Dừng sạc</button>`;
            }
            if (port.status === 'error') {
                portHTML += `<button class="port-action-btn reset" data-action="reset" data-port-id="${port.id}"><i class="fas fa-sync-alt"></i> Khởi động lại</button>`;
            }
            if (port.status === 'idle') {
                portHTML += `<button class="port-action-btn" data-action="complete" data-port-id="${port.id}"><i class="fas fa-check-circle"></i> Hoàn tất</button>`;
            }
            portHTML += '</div>';
            
            portCard.innerHTML = portHTML;
            portsGrid.appendChild(portCard);
        });
        updateStats();
    };

    const updateStats = () => {
        const counts = portsData.reduce((acc, port) => {
            acc[port.status] = (acc[port.status] || 0) + 1;
            return acc;
        }, {});

        chargingPortsStat.textContent = counts.charging || 0;
        availablePortsStat.textContent = counts.available || 0;
        errorPortsStat.textContent = counts.error || 0;
        idlePortsStat.textContent = counts.idle || 0;
    };
    
    const addAlert = (type, title, message) => {
        const alertItem = document.createElement('div');
        alertItem.className = 'alert-item';
        
        const icons = {
            error: { class: 'error', i: 'fa-exclamation-circle' },
            warning: { class: 'warning', i: 'fa-exclamation-triangle' },
            info: { class: 'info', i: 'fa-info-circle' },
            success: { class: 'success', i: 'fa-check-circle' } // Assuming success style exists or can be added
        };

        alertItem.innerHTML = `
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
        alertsList.prepend(alertItem);
    };

    // Event Handlers
    const handlePortAction = (e) => {
        const target = e.target.closest('.port-action-btn');
        if (!target) return;

        const portId = parseInt(target.dataset.portId, 10);
        const action = target.dataset.action;
        activeModalInfo = { portId, action };

        const messages = {
            stop: `Bạn có chắc muốn dừng phiên sạc tại Cổng ${portId}?`,
            reset: `Bạn có muốn khởi động lại Cổng ${portId} để khắc phục sự cố không?`,
            complete: `Xác nhận xe tại Cổng ${portId} đã rút phích cắm và hoàn tất giao dịch?`
        };
        
        modalTitle.textContent = 'Xác nhận hành động';
        modalMessage.textContent = messages[action] || 'Bạn có chắc chắn muốn thực hiện thao tác này?';
        actionModal.classList.add('active');
    };

    const confirmAction = () => {
        const { portId, action } = activeModalInfo;
        const port = portsData.find(p => p.id === portId);
        if (!port) return;

        switch (action) {
            case 'stop':
                port.status = 'idle';
                port.power = 0;
                addAlert('warning', `Dừng sạc Cổng ${port.id}`, `Phiên sạc cho ${port.customer} đã bị dừng thủ công.`);
                break;
            case 'reset':
                port.status = 'available';
                port.errorCode = null;
                port.customer = null;
                port.soc = 0;
                addAlert('info', `Khởi động lại Cổng ${port.id}`, 'Cổng sạc đã được khởi động lại và sẵn sàng hoạt động.');
                break;
            case 'complete':
                port.status = 'available';
                port.customer = null;
                port.soc = 0;
                port.duration = '00:00:00';
                addAlert('info', `Hoàn tất tại Cổng ${port.id}`, 'Cổng sạc đã sẵn sàng cho khách hàng tiếp theo.');
                break;
        }
        renderPorts();
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
            window.location.href = 'loginPage.html'; // Assuming this is the login page
        }
    };
    
    // Simulator Logic
    const toggleSimulator = () => {
        isSimulatorActive = !isSimulatorActive;
        if (isSimulatorActive) {
            simulatorToggle.classList.add('active');
            simulatorStatus.textContent = 'Đang chạy';
            simulatorStatus.classList.remove('inactive');
            simulatorStatus.classList.add('active');
            // Random interval between 3 to 6 seconds
            const randomInterval = Math.random() * (6000 - 3000) + 3000;
            simulatorIntervalId = setInterval(runRealtimeSimulation, randomInterval);
            addAlert('info', 'Simulator Bật', 'Chế độ giả lập tự động đã được kích hoạt.');
        } else {
            simulatorToggle.classList.remove('active');
            simulatorStatus.textContent = 'Đã tắt';
            simulatorStatus.classList.remove('active');
            simulatorStatus.classList.add('inactive');
            clearInterval(simulatorIntervalId);
            addAlert('info', 'Simulator Tắt', 'Chế độ giả lập tự động đã được tắt.');
        }
    };

    const runRealtimeSimulation = () => {
        if (!isSimulatorActive) return;

        // 1. Simulate new customer arriving (35% chance)
        if (Math.random() < 0.35) {
            const availablePorts = portsData.filter(p => p.status === 'available');
            if (availablePorts.length > 0) {
                const portToUse = availablePorts[Math.floor(Math.random() * availablePorts.length)];
                const newCustomer = mockCustomers[Math.floor(Math.random() * mockCustomers.length)];
                
                portToUse.status = 'charging';
                portToUse.customer = newCustomer;
                portToUse.soc = Math.floor(Math.random() * 20) + 5; // Start SOC: 5-24%
                portToUse.power = parseFloat((Math.random() * (11.5 - 9.5) + 9.5).toFixed(1));
                portToUse.duration = '00:00:00';
                portToUse.startTime = new Date();
                
                addAlert('info', `Khách hàng mới: ${newCustomer}`, `Bắt đầu sạc tại Cổng ${portToUse.id}.`);
            }
        }

        // 2. Update existing charging sessions
        portsData.forEach(port => {
            if (port.status === 'charging' && port.soc < 100) {
                port.soc += Math.floor(Math.random() * 3) + 1; // Increase SOC by 1-3%
                if (port.soc > 100) port.soc = 100;
                
                if (port.startTime) {
                    const diff = Math.floor((new Date() - port.startTime) / 1000);
                    port.duration = new Date(diff * 1000).toISOString().substr(11, 8);
                }
                
                if (port.soc === 100) {
                    port.status = 'idle';
                    port.power = 0;
                    addAlert('success', `Sạc hoàn tất`, `Xe của ${port.customer} tại Cổng ${port.id} đã được sạc đầy.`);
                }
            }
        });

        // 3. Simulate random error (10% chance)
        if (Math.random() < 0.10) {
            const operationalPorts = portsData.filter(p => p.status !== 'error');
            if (operationalPorts.length > 0) {
                const portToFail = operationalPorts[Math.floor(Math.random() * operationalPorts.length)];
                const errorKeys = Object.keys(errorTypes);
                const randomError = errorKeys[Math.floor(Math.random() * errorKeys.length)];
                
                portToFail.status = 'error';
                portToFail.errorCode = randomError;
                portToFail.power = 0;
                
                addAlert('error', `Lỗi tại Cổng ${portToFail.id}`, errorTypes[randomError].message);
            }
        }
        
        // 4. Simulate a fix for an error (15% chance if there are errors)
        const errorPorts = portsData.filter(p => p.status === 'error');
        if (errorPorts.length > 0 && Math.random() < 0.15) {
            const portToFix = errorPorts[0]; // Fix the oldest error
            portToFix.status = 'available';
            portToFix.errorCode = null;
            portToFix.customer = null;
            portToFix.soc = 0;
            addAlert('warning', `Hệ thống phục hồi`, `Sự cố tại Cổng ${portToFix.id} đã được tự động khắc phục.`);
        }
        
        renderPorts();
    };
    
    // Manual Test Functions
    const runTest = (type) => {
        let targetPort;
        switch(type) {
            case 'error':
                const operationalPorts = portsData.filter(p => p.status !== 'error');
                if(operationalPorts.length === 0) {
                    addAlert('warning', 'Không thể test', 'Tất cả các cổng đang bị lỗi.');
                    return;
                }
                targetPort = operationalPorts[Math.floor(Math.random() * operationalPorts.length)];
                
                const errorKeys = Object.keys(errorTypes);
                const randomError = errorKeys[Math.floor(Math.random() * errorKeys.length)];
                targetPort.status = 'error';
                targetPort.errorCode = randomError;
                targetPort.power = 0;
                addAlert('error', `[TEST] Lỗi tại Cổng ${targetPort.id}`, errorTypes[randomError].message);
                break;
            case 'complete':
                const chargingPorts = portsData.filter(p => p.status === 'charging');
                 if(chargingPorts.length === 0) {
                    addAlert('warning', 'Không thể test', 'Không có cổng nào đang sạc.');
                    return;
                }
                targetPort = chargingPorts[Math.floor(Math.random() * chargingPorts.length)];
                targetPort.soc = 100;
                targetPort.status = 'idle';
                targetPort.power = 0;
                addAlert('success', `[TEST] Sạc hoàn tất`, `Xe của ${targetPort.customer} tại Cổng ${targetPort.id} đã sạc đầy.`);
                break;
            // Add other test cases if needed
        }
        renderPorts();
    };

    // Setup Event Listeners
    const setupEventListeners = () => {
        portsGrid.addEventListener('click', handlePortAction);
        closeModalBtn.addEventListener('click', closeModal);
        confirmActionBtn.addEventListener('click', confirmAction);
        cancelActionBtn.addEventListener('click', closeModal);

        simulatorToggle.addEventListener('click', toggleSimulator);

        // Sidebar & Header
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
        
        // Test buttons wiring
        testOverheatBtn.addEventListener('click', () => runTest('error')); // Simplified: just trigger a random error
        testComponentFailureBtn.addEventListener('click', () => runTest('error'));
        testConnectionLossBtn.addEventListener('click', () => runTest('error'));
        testChargeCompleteBtn.addEventListener('click', () => runTest('complete'));
        
        // Disable testSlowCharge for now as it's more complex
        testSlowChargeBtn.disabled = true; 
    };
    
    const getStatusInfo = (status) => {
        const info = {
            charging: { class: 'charging', text: 'Đang sạc' },
            available: { class: 'available', text: 'Sẵn sàng' },
            error: { class: 'error', text: 'Lỗi' },
            idle: { class: 'idle', text: 'Chờ rút phích' },
            pending: { class: 'pending', text: 'Đang chờ' }
        };
        return info[status] || { class: '', text: status };
    };

    // Initial Load
    renderPorts();
    setupEventListeners();
    addAlert('info', 'Chào mừng!', 'Bảng điều khiển giám sát trạm sạc đã sẵn sàng.');
});
