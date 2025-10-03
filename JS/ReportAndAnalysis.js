// JS/ReportAndAnalysis.js

// Sidebar Toggle
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const sidebarClose = document.getElementById('sidebarClose');
const sidebarOverlay = document.getElementById('sidebarOverlay');

menuToggle.addEventListener('click', () => {
    sidebar.classList.add('active');
    sidebarOverlay.classList.add('active');
});

sidebarClose.addEventListener('click', () => {
    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
});

sidebarOverlay.addEventListener('click', () => {
    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
});

// User Avatar Dropdown
const userAvatar = document.getElementById('userAvatar');
const staffInfoDropdown = document.getElementById('staffInfoDropdown');

userAvatar.addEventListener('click', (e) => {
    e.stopPropagation();
    staffInfoDropdown.classList.toggle('active');
});

document.addEventListener('click', (e) => {
    if (!userAvatar.contains(e.target)) {
        staffInfoDropdown.classList.remove('active');
    }
});

// Logout
const logoutBtn = document.getElementById('logoutBtn');
logoutBtn.addEventListener('click', () => {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
        window.location.href = 'login.html';
    }
});

// Chart.js Configuration
const chartColors = {
    primary: '#4285f4',
    success: '#34a853',
    warning: '#fbbc04',
    danger: '#ea4335',
    purple: '#9c27b0',
    gray: '#888'
};

// Revenue Chart
const revenueCtx = document.getElementById('revenueChart');
if (revenueCtx) {
    const revenueChart = new Chart(revenueCtx, {
        type: 'line',
        data: {
            labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
            datasets: [{
                label: 'Doanh thu (VNĐ)',
                data: [5200000, 6800000, 7200000, 6500000, 7800000, 8200000, 9500000],
                borderColor: chartColors.primary,
                backgroundColor: 'rgba(66, 133, 244, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 5,
                pointHoverRadius: 7,
                pointBackgroundColor: chartColors.primary,
                pointBorderColor: '#333',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: '#333',
                    titleColor: '#d6d6d6',
                    bodyColor: '#aaa',
                    borderColor: '#444',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND'
                            }).format(context.parsed.y);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#3a3a3a',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#888',
                        callback: function(value) {
                            return (value / 1000000).toFixed(1) + 'M';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#888'
                    }
                }
            }
        }
    });
}

// Usage Chart
const usageCtx = document.getElementById('usageChart');
if (usageCtx) {
    const usageChart = new Chart(usageCtx, {
        type: 'bar',
        data: {
            labels: ['00-04', '04-08', '08-12', '12-16', '16-20', '20-24'],
            datasets: [{
                label: 'Lượt sạc',
                data: [12, 45, 156, 189, 234, 98],
                backgroundColor: [
                    'rgba(66, 133, 244, 0.8)',
                    'rgba(66, 133, 244, 0.8)',
                    'rgba(52, 168, 83, 0.8)',
                    'rgba(52, 168, 83, 0.8)',
                    'rgba(251, 188, 4, 0.8)',
                    'rgba(66, 133, 244, 0.8)'
                ],
                borderRadius: 8,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: '#333',
                    titleColor: '#d6d6d6',
                    bodyColor: '#aaa',
                    borderColor: '#444',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#3a3a3a',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#888',
                        stepSize: 50
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#888'
                    }
                }
            }
        }
    });
}

// Status Chart (Doughnut)
const statusCtx = document.getElementById('statusChart');
if (statusCtx) {
    const statusChart = new Chart(statusCtx, {
        type: 'doughnut',
        data: {
            labels: ['Đang sạc', 'Sẵn sàng', 'Lỗi', 'Chờ'],
            datasets: [{
                data: [2, 1, 1, 1],
                backgroundColor: [
                    chartColors.primary,
                    chartColors.success,
                    chartColors.danger,
                    chartColors.warning
                ],
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#888',
                        padding: 15,
                        font: {
                            size: 13
                        },
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    backgroundColor: '#333',
                    titleColor: '#d6d6d6',
                    bodyColor: '#aaa',
                    borderColor: '#444',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: true
                }
            },
            cutout: '65%'
        }
    });
}

// Time Range Filter
const timeRangeSelect = document.getElementById('timeRange');
timeRangeSelect.addEventListener('change', (e) => {
    const selectedRange = e.target.value;
    console.log('Selected time range:', selectedRange);
    // TODO: Update charts and data based on selected range
    updateDataByTimeRange(selectedRange);
});

// Report Type Filter
const reportTypeSelect = document.getElementById('reportType');
reportTypeSelect.addEventListener('change', (e) => {
    const selectedType = e.target.value;
    console.log('Selected report type:', selectedType);
    // TODO: Filter data based on report type
    filterReportByType(selectedType);
});

// Export Report
const exportBtn = document.getElementById('exportBtn');
exportBtn.addEventListener('click', () => {
    const timeRange = timeRangeSelect.value;
    const reportType = reportTypeSelect.value;
    
    // Simulate export
    const exportData = {
        timeRange: timeRange,
        reportType: reportType,
        exportDate: new Date().toISOString(),
        data: {
            revenue: '45.2M VNĐ',
            sessions: 1247,
            energy: '8,456 kWh',
            uptime: '98.5%'
        }
    };
    
    // Create a blob and download
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `report_${timeRange}_${reportType}_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    // Show success message
    showNotification('Báo cáo đã được xuất thành công!', 'success');
});

// Chart Time Range Buttons
const chartBtns = document.querySelectorAll('.chart-btn');
chartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Remove active class from all buttons
        chartBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        e.target.classList.add('active');
        
        // Update chart data based on selected range
        const range = e.target.textContent.trim();
        console.log('Chart range changed to:', range);
        // TODO: Update chart data
    });
});

// Helper Functions
function updateDataByTimeRange(range) {
    // Simulate data update
    console.log(`Updating data for range: ${range}`);
    
    // Update stat cards with animation
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        stat.style.opacity = '0.5';
        setTimeout(() => {
            stat.style.opacity = '1';
        }, 300);
    });
}

function filterReportByType(type) {
    console.log(`Filtering reports by type: ${type}`);
    
    // TODO: Show/hide relevant sections based on report type
    const sections = {
        all: ['stats', 'charts', 'metrics', 'performance'],
        revenue: ['stats', 'charts'],
        usage: ['charts', 'performance'],
        performance: ['metrics', 'performance']
    };
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        background: #333;
        color: #d6d6d6;
        padding: 15px 20px;
        border-radius: 12px;
        box-shadow: -5px -5px 15px #444, 5px 5px 15px #222;
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideIn 0.3s ease;
    `;
    
    const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
    notification.innerHTML = `
        <span style="font-size: 18px; color: ${type === 'success' ? '#34a853' : type === 'error' ? '#ea4335' : '#4285f4'};">${icon}</span>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Auto-refresh data every 30 seconds
setInterval(() => {
    console.log('Auto-refreshing report data...');
    // TODO: Fetch and update data from API
}, 30000);

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Report & Analytics page loaded');
    
    // Animate stat cards on load
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 50);
        }, index * 100);
    });
});