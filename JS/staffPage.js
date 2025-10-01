// JS/staffPage.js

// Station and ports data
const stationData = {
    name: "Trạm sạc Vincom Center",
    location: "72 Lê Thánh Tôn, Q1, TP.HCM"
};

// Staff data
const staffData = {
    name: "Nguyễn Văn An",
    role: "Nhân viên vận hành",
    id: "NV001",
    email: "nguyenvanan@evchargehub.com",
    phone: "0901234567",
    shift: "Ca sáng (07:00 - 15:00)"
};

// Charging ports data with real-time monitoring
let ports = [
    {
        id: 1,
        name: "Cổng 1",
        status: "charging",
        power: 45.5,
        maxPower: 50,
        chargingTimeSeconds: 2100, // 35 minutes in seconds
        estimatedTimeSeconds: 3600, // 60 minutes in seconds
        temperature: 42,
        voltage: 380,
        current: 120,
        alerts: []
    },
    {
        id: 2,
        name: "Cổng 2",
        status: "available",
        power: 0,
        maxPower: 50,
        chargingTimeSeconds: 0,
        estimatedTimeSeconds: 0,
        temperature: 28,
        voltage: 380,
        current: 0,
        alerts: []
    },
    {
        id: 3,
        name: "Cổng 3",
        status: "charging",
        power: 48.2,
        maxPower: 50,
        chargingTimeSeconds: 2700, // 45 minutes in seconds
        estimatedTimeSeconds: 3000, // 50 minutes in seconds
        temperature: 65,
        voltage: 380,
        current: 127,
        alerts: ["Nhiệt độ cao"]
    },
    {
        id: 4,
        name: "Cổng 4",
        status: "error",
        power: 0,
        maxPower: 50,
        chargingTimeSeconds: 0,
        estimatedTimeSeconds: 0,
        temperature: 85,
        voltage: 350,
        current: 0,
        alerts: ["Lỗi kết nối", "Nhiệt độ nguy hiểm"]
    },
    {
        id: 5,
        name: "Cổng 5",
        status: "idle",
        power: 15.3,
        maxPower: 50,
        chargingTimeSeconds: 7200, // 120 minutes in seconds
        estimatedTimeSeconds: 7800, // 130 minutes in seconds
        temperature: 38,
        voltage: 380,
        current: 40,
        alerts: ["Sạc chậm"]
    }
];

// Alert history
let alertHistory = [
    {
        id: 1,
        type: "error",
        portId: 4,
        title: "Lỗi nghiêm trọng - Cổng 4",
        message: "Phát hiện nhiệt độ vượt ngưỡng an toàn (85°C). Đã tự động ngắt kết nối để bảo vệ thiết bị.",
        time: "10 phút trước"
    },
    {
        id: 2,
        type: "warning",
        portId: 3,
        title: "Cảnh báo - Cổng 3",
        message: "Nhiệt độ đang tăng cao (65°C). Khuyến nghị kiểm tra hệ thống làm mát.",
        time: "25 phút trước"
    },
    {
        id: 3,
        type: "info",
        portId: 1,
        title: "Bắt đầu sạc - Cổng 1",
        message: "Xe điện đã kết nối và bắt đầu quá trình sạc với công suất 45.5 kW.",
        time: "35 phút trước"
    },
    {
        id: 4,
        type: "warning",
        portId: 5,
        title: "Cảnh báo - Cổng 5",
        message: "Tốc độ sạc thấp hơn mức bình thường. Có thể do pin xe gần đầy hoặc có vấn đề về kết nối.",
        time: "2 giờ trước"
    }
];

let currentPortAction = null;

// Real-time simulator state
let realtimeSimulatorActive = false;
let realtimeSimulatorInterval = null;
let realtimeUpdateInterval = null;

// Status translations
const statusMap = {
    'charging': 'Đang sạc',
    'available': 'Sẵn sàng',
    'error': 'Lỗi',
    'idle': 'Chờ'
};

// Helper function to format seconds to HH:MM:SS
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Set station info
    document.getElementById('stationName').textContent = stationData.name;
    document.getElementById('stationLocation').textContent = stationData.location;
    
    updateStats();
    renderPorts();
    renderAlertHistory();
    initializeEventListeners();
    updateSimulatorUI();
});

// Update statistics
function updateStats() {
    const charging = ports.filter(p => p.status === 'charging').length;
    const available = ports.filter(p => p.status === 'available').length;
    const errors = ports.filter(p => p.status === 'error').length;
    const idle = ports.filter(p => p.status === 'idle').length;
    
    document.getElementById('chargingPorts').textContent = charging;
    document.getElementById('availablePorts').textContent = available;
    document.getElementById('errorPorts').textContent = errors;
    document.getElementById('idlePorts').textContent = idle;
}

// Render ports
function renderPorts() {
    const container = document.getElementById('portsGrid');
    container.innerHTML = '';
    
    ports.forEach(port => {
        const portCard = createPortCard(port);
        container.appendChild(portCard);
    });
}

// Create port card
function createPortCard(port) {
    const card = document.createElement('div');
    card.className = `port-card ${port.alerts.length > 0 ? (port.status === 'error' ? 'error' : 'warning') : ''}`;
    
    const progress = port.estimatedTimeSeconds > 0 ? (port.chargingTimeSeconds / port.estimatedTimeSeconds * 100) : 0;
    const progressClass = progress > 80 ? 'warning' : '';
    
    card.innerHTML = `
        <div class="port-header">
            <h3 class="port-title">${port.name}</h3>
            <span class="port-status-badge ${port.status}">${statusMap[port.status]}</span>
        </div>
        
        <div class="port-details">
            <div class="detail-row">
                <span class="detail-label">
                    <i class="fas fa-bolt"></i>
                    Công suất:
                </span>
                <span class="detail-value ${port.power > port.maxPower * 0.9 ? 'warning' : 'highlight'}">
                    ${port.power.toFixed(1)} / ${port.maxPower} kW
                </span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">
                    <i class="fas fa-clock"></i>
                    Thời gian sạc:
                </span>
                <span class="detail-value">
                    ${formatTime(port.chargingTimeSeconds)} / ${port.estimatedTimeSeconds > 0 ? formatTime(port.estimatedTimeSeconds) : '--:--:--'}
                </span>
            </div>
            
            ${port.estimatedTimeSeconds > 0 ? `
            <div class="progress-container">
                <div class="progress-bar">
                    <div class="progress-fill ${progressClass}" style="width: ${Math.min(progress, 100)}%"></div>
                </div>
            </div>
            ` : ''}
            
            <div class="detail-row">
                <span class="detail-label">
                    <i class="fas fa-thermometer-half"></i>
                    Nhiệt độ:
                </span>
                <span class="detail-value ${port.temperature > 70 ? 'danger' : (port.temperature > 55 ? 'warning' : '')}">
                    ${port.temperature}°C
                </span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">
                    <i class="fas fa-plug"></i>
                    Điện áp:
                </span>
                <span class="detail-value ${port.voltage < 360 ? 'warning' : ''}">
                    ${port.voltage} V
                </span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">
                    <i class="fas fa-wave-square"></i>
                    Dòng điện:
                </span>
                <span class="detail-value">
                    ${port.current} A
                </span>
            </div>
        </div>
        
        ${port.alerts.length > 0 ? `
        <div class="alert-box ${port.status === 'error' ? 'error' : 'warning'}">
            <i class="fas fa-exclamation-triangle"></i>
            <span class="alert-text">${port.alerts.join(', ')}</span>
        </div>
        ` : ''}
        
        ${port.status === 'charging' || port.status === 'error' ? `
        <div class="port-actions">
            ${port.status === 'charging' ? `
            <button class="port-action-btn stop" onclick="stopCharging(${port.id})">
                <i class="fas fa-stop"></i> Dừng sạc
            </button>
            ` : ''}
            ${port.status === 'error' ? `
            <button class="port-action-btn reset" onclick="resetPort(${port.id})">
                <i class="fas fa-sync"></i> Khởi động lại
            </button>
            ` : ''}
        </div>
        ` : ''}
    `;
    
    return card;
}

// Render alert history
function renderAlertHistory() {
    const container = document.getElementById('alertsList');
    container.innerHTML = '';
    
    if (alertHistory.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #888; padding: 40px;">Chưa có cảnh báo nào</p>';
        return;
    }
    
    alertHistory.forEach(alert => {
        const alertItem = document.createElement('div');
        alertItem.className = 'alert-item';
        alertItem.innerHTML = `
            <div class="alert-icon-box ${alert.type}">
                <i class="fas fa-${alert.type === 'error' ? 'exclamation-circle' : (alert.type === 'warning' ? 'exclamation-triangle' : 'info-circle')}"></i>
            </div>
            <div class="alert-content">
                <div class="alert-header">
                    <h4 class="alert-title">${alert.title}</h4>
                    <span class="alert-time">${alert.time}</span>
                </div>
                <p class="alert-message">${alert.message}</p>
            </div>
        `;
        container.appendChild(alertItem);
    });
}

// Toggle sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

// Initialize event listeners
function initializeEventListeners() {
    // Menu toggle
    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleSidebar);
    }
    
    // Sidebar overlay
    const overlay = document.getElementById('sidebarOverlay');
    if (overlay) {
        overlay.addEventListener('click', toggleSidebar);
    }
    
    // User avatar click
    const userAvatar = document.getElementById('userAvatar');
    if (userAvatar) {
        userAvatar.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleStaffInfo();
        });
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        const dropdown = document.getElementById('staffInfoDropdown');
        const avatar = document.getElementById('userAvatar');
        
        if (dropdown && avatar && !dropdown.contains(e.target) && !avatar.contains(e.target)) {
            dropdown.classList.remove('active');
        }
    });
    
    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', function() {
        if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
            window.location.href = 'login.html';
        }
    });
    
    // Sidebar menu items
    const menuItems = document.querySelectorAll('.sidebar-menu-link');
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            // Remove active class from all items
            menuItems.forEach(i => i.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
            
            // Close sidebar on mobile
            if (window.innerWidth <= 768) {
                toggleSidebar();
            }
            
            // Handle navigation (you can add more logic here)
            const section = this.getAttribute('data-section');
            console.log('Navigating to:', section);
        });
    });
    
    // Modal close
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('cancelAction').addEventListener('click', closeModal);
    
    // Modal confirm
    document.getElementById('confirmAction').addEventListener('click', confirmAction);
    
    // Close modal when clicking outside
    document.getElementById('actionModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
    
    // ESC key to close modal and dropdown
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
            const dropdown = document.getElementById('staffInfoDropdown');
            if (dropdown) {
                dropdown.classList.remove('active');
            }
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebarOverlay');
            if (sidebar && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
            }
        }
    });

    // Test simulation buttons
    document.getElementById('testOverheat').addEventListener('click', simulateOverheat);
    document.getElementById('testComponentFailure').addEventListener('click', simulateComponentFailure);
    document.getElementById('testSlowCharge').addEventListener('click', simulateSlowCharge);
    document.getElementById('testConnectionLoss').addEventListener('click', simulateConnectionLoss);
    document.getElementById('testChargeComplete').addEventListener('click', simulateChargeComplete);
    
    // Real-time simulator toggle
    document.getElementById('simulatorToggle').addEventListener('click', toggleRealtimeSimulator);
}

// Toggle staff info dropdown
function toggleStaffInfo() {
    const dropdown = document.getElementById('staffInfoDropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
    }
}

// Stop charging
function stopCharging(portId) {
    currentPortAction = { action: 'stop', portId };
    const port = ports.find(p => p.id === portId);
    document.getElementById('modalTitle').textContent = 'Xác nhận dừng sạc';
    document.getElementById('modalMessage').textContent = `Bạn có chắc chắn muốn dừng sạc tại ${port.name}?`;
    document.getElementById('actionModal').classList.add('active');
}

// Reset port
function resetPort(portId) {
    currentPortAction = { action: 'reset', portId };
    const port = ports.find(p => p.id === portId);
    document.getElementById('modalTitle').textContent = 'Xác nhận khởi động lại';
    document.getElementById('modalMessage').textContent = `Bạn có chắc chắn muốn khởi động lại ${port.name}?`;
    document.getElementById('actionModal').classList.add('active');
}

// Confirm action
function confirmAction() {
    if (!currentPortAction) return;
    
    const { action, portId } = currentPortAction;
    const port = ports.find(p => p.id === portId);
    
    if (action === 'stop') {
        port.status = 'available';
        port.power = 0;
        port.chargingTimeSeconds = 0;
        port.estimatedTimeSeconds = 0;
        port.current = 0;
        port.temperature = 28;
        port.alerts = [];
        
        addAlert({
            type: 'info',
            portId: portId,
            title: `Dừng sạc - ${port.name}`,
            message: `Quá trình sạc tại ${port.name} đã được dừng thủ công bởi nhân viên.`,
            time: 'Vừa xong'
        });
    } else if (action === 'reset') {
        port.status = 'available';
        port.power = 0;
        port.chargingTimeSeconds = 0;
        port.estimatedTimeSeconds = 0;
        port.current = 0;
        port.temperature = 28;
        port.voltage = 380;
        port.alerts = [];
        
        addAlert({
            type: 'info',
            portId: portId,
            title: `Khởi động lại - ${port.name}`,
            message: `${port.name} đã được khởi động lại thành công. Hệ thống đã trở lại trạng thái hoạt động bình thường.`,
            time: 'Vừa xong'
        });
    }
    
    updateAllUI();
    closeModal();
}

// Close modal
function closeModal() {
    document.getElementById('actionModal').classList.remove('active');
    currentPortAction = null;
}

// Add alert to history
function addAlert(alert) {
    alert.id = alertHistory.length > 0 ? Math.max(...alertHistory.map(a => a.id)) + 1 : 1;
    alertHistory.unshift(alert);
    
    if (alertHistory.length > 20) {
        alertHistory = alertHistory.slice(0, 20);
    }
}

// Sidebar close button
const sidebarClose = document.getElementById('sidebarClose');
if (sidebarClose) {
    sidebarClose.addEventListener('click', toggleSidebar);
}

// ===============================================
// === SIMULATION TEST FUNCTIONS =================
// ===============================================

// Helper to get a random port, with optional status filter
function getRandomPort(statusFilter = null) {
    let eligiblePorts = statusFilter ? ports.filter(p => p.status === statusFilter) : ports;
    
    if (eligiblePorts.length === 0) {
        // If no port matches the filter, try picking from any port that is not in an error state
        eligiblePorts = ports.filter(p => p.status !== 'error');
    }

    if (eligiblePorts.length === 0) {
        // If all are in error, just pick any port
        eligiblePorts = ports;
    }
    
    if (eligiblePorts.length > 0) {
        const randomIndex = Math.floor(Math.random() * eligiblePorts.length);
        return eligiblePorts[randomIndex];
    }
    return null; // No ports available
}

// 1. Simulate Overheat
function simulateOverheat() {
    const port = getRandomPort();
    if (!port) return;

    port.status = 'error';
    port.temperature = 85 + Math.floor(Math.random() * 10); // 85-94°C
    port.power = 0;
    port.current = 0;
    port.alerts = ['Sự cố quá nhiệt', 'Đã ngắt khẩn cấp'];

    addAlert({
        type: 'error',
        portId: port.id,
        title: `Lỗi nghiêm trọng - ${port.name}`,
        message: `Phát hiện sự cố quá nhiệt (${port.temperature}°C). Hệ thống đã tự động ngắt kết nối để đảm bảo an toàn.`,
        time: 'Vừa xong'
    });

    updateAllUI();
    console.log(`Simulated Overheat on Port ${port.id}`);
}

// 2. Simulate Component Failure
function simulateComponentFailure() {
    const port = getRandomPort();
    if (!port) return;

    port.status = 'error';
    port.power = 0;
    port.current = 0;
    port.voltage = 0;
    port.temperature = 28 + Math.floor(Math.random() * 5);
    port.alerts = ['Hỏng linh kiện', 'Yêu cầu bảo trì'];

    addAlert({
        type: 'error',
        portId: port.id,
        title: `Lỗi hệ thống - ${port.name}`,
        message: `Phát hiện lỗi phần cứng (hỏng linh kiện). Cổng sạc tạm ngừng hoạt động. Yêu cầu kỹ thuật viên kiểm tra.`,
        time: 'Vừa xong'
    });

    updateAllUI();
    console.log(`Simulated Component Failure on Port ${port.id}`);
}

// 3. Simulate Slow Charging
function simulateSlowCharge() {
    let port = getRandomPort('charging');
    // If no port is charging, find an available one and start charging it slowly
    if (!port) {
        port = getRandomPort('available');
        if (port) {
            port.status = 'charging';
            port.estimatedTimeSeconds = 7200; // 2 hours
        }
    }
    
    if (!port) return;

    port.power = parseFloat((5 + Math.random() * 5).toFixed(1)); // 5-10 kW
    port.current = Math.round((port.power / port.voltage) * 1000);
    port.alerts = ['Sạc chậm', 'Kiểm tra kết nối'];

    addAlert({
        type: 'warning',
        portId: port.id,
        title: `Cảnh báo - ${port.name}`,
        message: `Tốc độ sạc tại ${port.name} thấp bất thường (${port.power} kW). Có thể do kết nối hoặc pin xe sắp đầy.`,
        time: 'Vừa xong'
    });
    
    updateAllUI();
    console.log(`Simulated Slow Charge on Port ${port.id}`);
}

// 4. Simulate Connection Loss
function simulateConnectionLoss() {
    const port = getRandomPort('charging');
    if (!port) return;

    port.status = 'error';
    port.power = 0;
    port.current = 0;
    port.alerts = ['Mất kết nối', 'Kiểm tra lại phích cắm'];
    
    addAlert({
        type: 'error',
        portId: port.id,
        title: `Lỗi kết nối - ${port.name}`,
        message: `Mất kết nối với xe điện tại ${port.name}. Vui lòng kiểm tra lại phích cắm và kết nối vật lý.`,
        time: 'Vừa xong'
    });
    
    updateAllUI();
    console.log(`Simulated Connection Loss on Port ${port.id}`);
}

// 5. Simulate Charging Complete
function simulateChargeComplete() {
    const port = getRandomPort('charging');
    if (!port) return;

    port.status = 'available';
    port.power = 0;
    port.chargingTimeSeconds = 0;
    port.estimatedTimeSeconds = 0;
    port.current = 0;
    port.temperature = 30; // Cool down
    port.alerts = [];

    addAlert({
        type: 'info',
        portId: port.id,
        title: `Hoàn thành sạc - ${port.name}`,
        message: `Quá trình sạc tại ${port.name} đã hoàn tất. Cổng sạc hiện đang sẵn sàng cho lượt tiếp theo.`,
        time: 'Vừa xong'
    });
    
    updateAllUI();
    console.log(`Simulated Charging Complete on Port ${port.id}`);
}

// ===============================================
// === REAL-TIME SIMULATOR FUNCTIONS =============
// ===============================================

// Toggle real-time simulator
function toggleRealtimeSimulator() {
    realtimeSimulatorActive = !realtimeSimulatorActive;
    
    if (realtimeSimulatorActive) {
        startRealtimeSimulator();
    } else {
        stopRealtimeSimulator();
    }
    
    updateSimulatorUI();
}

// Start real-time simulator
function startRealtimeSimulator() {
    console.log('Starting Real-time Simulator...');
    
    // Update charging ports every 2 seconds
    realtimeUpdateInterval = setInterval(() => {
        updateChargingPorts();
    }, 2000);
    
    // Run random simulation every 5-10 seconds
    const runSimulation = () => {
        const simulationTypes = [
            simulateOverheat,
            simulateComponentFailure,
            simulateSlowCharge,
            simulateConnectionLoss,
            simulateChargeComplete,
            simulateNormalChargingProgress
        ];
        
        // Randomly pick a simulation type
        const randomSim = simulationTypes[Math.floor(Math.random() * simulationTypes.length)];
        randomSim();
        
        // Schedule next simulation
        if (realtimeSimulatorActive) {
            const nextDelay = 5000 + Math.random() * 5000; // 5-10 seconds
            realtimeSimulatorInterval = setTimeout(runSimulation, nextDelay);
        }
    };
    
    // Start first simulation after 2 seconds
    realtimeSimulatorInterval = setTimeout(runSimulation, 2000);
}

// Stop real-time simulator
function stopRealtimeSimulator() {
    console.log('Stopping Real-time Simulator...');
    
    if (realtimeSimulatorInterval) {
        clearTimeout(realtimeSimulatorInterval);
        realtimeSimulatorInterval = null;
    }
    
    if (realtimeUpdateInterval) {
        clearInterval(realtimeUpdateInterval);
        realtimeUpdateInterval = null;
    }
}

// Update charging ports (called every 2 seconds when simulator is active)
function updateChargingPorts() {
    let updated = false;
    
    ports.forEach(port => {
        if (port.status === 'charging') {
            // Increase charging time by 2 seconds
            port.chargingTimeSeconds += 2;
            
            // Update temperature (slight fluctuation or gradual increase)
            const tempChange = (Math.random() - 0.3) * 1.5; // Slightly biased toward increase
            port.temperature += tempChange;
            port.temperature = Math.max(25, Math.min(75, Math.round(port.temperature)));
            
            // Check for temperature warnings
            if (port.temperature > 70 && !port.alerts.includes('Nhiệt độ cao')) {
                port.alerts.push('Nhiệt độ cao');
                addAlert({
                    type: 'warning',
                    portId: port.id,
                    title: `Cảnh báo nhiệt độ - ${port.name}`,
                    message: `Nhiệt độ tại ${port.name} đang tăng cao (${port.temperature}°C).`,
                    time: 'Vừa xong'
                });
            }
            
            // Check if charging complete
            if (port.chargingTimeSeconds >= port.estimatedTimeSeconds) {
                port.status = 'available';
                port.power = 0;
                port.chargingTimeSeconds = 0;
                port.estimatedTimeSeconds = 0;
                port.current = 0;
                port.temperature = 30;
                port.alerts = [];
                
                addAlert({
                    type: 'info',
                    portId: port.id,
                    title: `Hoàn thành sạc - ${port.name}`,
                    message: `Quá trình sạc tại ${port.name} đã hoàn tất tự động.`,
                    time: 'Vừa xong'
                });
            }
            
            updated = true;
        }
    });
    
    if (updated) {
        updateAllUI();
    }
}

// Simulate normal charging progress (for real-time mode)
function simulateNormalChargingProgress() {
    const chargingPorts = ports.filter(p => p.status === 'charging');
    
    if (chargingPorts.length > 0) {
        // Pick random charging port and update its progress
        const port = chargingPorts[Math.floor(Math.random() * chargingPorts.length)];
        
        // Update power slightly
        port.power = parseFloat((port.power + (Math.random() - 0.5) * 2).toFixed(1));
        port.power = Math.max(0, Math.min(port.maxPower, port.power));
        
        // Update current based on power
        port.current = Math.round((port.power / port.voltage) * 1000);
        
        updateAllUI();
        console.log(`Real-time: Updated charging progress on Port ${port.id}`);
    } else {
        // No ports charging, maybe start charging on an available port
        const availablePorts = ports.filter(p => p.status === 'available');
        if (availablePorts.length > 0 && Math.random() > 0.7) {
            const port = availablePorts[Math.floor(Math.random() * availablePorts.length)];
            port.status = 'charging';
            port.power = parseFloat((30 + Math.random() * 20).toFixed(1));
            port.chargingTimeSeconds = 0;
            port.estimatedTimeSeconds = 3600 + Math.floor(Math.random() * 3600); // 1-2 hours
            port.current = Math.round((port.power / port.voltage) * 1000);
            port.temperature = 35 + Math.floor(Math.random() * 10);
            
            addAlert({
                type: 'info',
                portId: port.id,
                title: `Bắt đầu sạc - ${port.name}`,
                message: `Xe điện mới kết nối vào ${port.name} và bắt đầu sạc.`,
                time: 'Vừa xong'
            });
            
            updateAllUI();
            console.log(`Real-time: Started charging on Port ${port.id}`);
        }
    }
}

// Update simulator UI
function updateSimulatorUI() {
    const toggle = document.getElementById('simulatorToggle');
    const status = document.getElementById('simulatorStatus');
    const testButtons = document.querySelectorAll('.test-btn');
    
    if (realtimeSimulatorActive) {
        toggle.classList.add('active');
        status.textContent = 'Đang chạy';
        status.classList.remove('inactive');
        status.classList.add('active');
        
        // Disable manual test buttons when real-time is active
        testButtons.forEach(btn => {
            btn.disabled = true;
        });
    } else {
        toggle.classList.remove('active');
        status.textContent = 'Đã tắt';
        status.classList.remove('active');
        status.classList.add('inactive');
        
        // Enable manual test buttons when real-time is inactive
        testButtons.forEach(btn => {
            btn.disabled = false;
        });
    }
}

// Helper to update all UI elements
function updateAllUI() {
    updateStats();
    renderPorts();
    renderAlertHistory();
}