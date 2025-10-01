
document.addEventListener('DOMContentLoaded', () => {

    // Lấy các element cần thiết cho sidebar và header
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarClose = document.getElementById('sidebarClose');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const userAvatar = document.getElementById('userAvatar');
    const staffInfoDropdown = document.getElementById('staffInfoDropdown');

    // --- Logic cho Sidebar ---

    // Mở sidebar khi nhấn nút menu
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.add('active');
            sidebarOverlay.classList.add('active');
        });
    }

    // Đóng sidebar khi nhấn nút close
    if (sidebarClose) {
        sidebarClose.addEventListener('click', () => {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
        });
    }

    // Đóng sidebar khi nhấn vào overlay
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
        });
    }

    // --- Logic cho Dropdown thông tin nhân viên ---

    // Hiển thị/ẩn dropdown khi nhấn vào avatar
    if (userAvatar) {
        userAvatar.addEventListener('click', (event) => {
            // Ngăn sự kiện click lan ra ngoài (document)
            event.stopPropagation(); 
            staffInfoDropdown.classList.toggle('active');
        });
    }
    
    // Đóng dropdown khi nhấn ra ngoài
    document.addEventListener('click', (event) => {
        if (staffInfoDropdown && staffInfoDropdown.classList.contains('active')) {
            // Kiểm tra xem click có nằm ngoài dropdown và avatar không
            if (!staffInfoDropdown.contains(event.target) && !userAvatar.contains(event.target)) {
                staffInfoDropdown.classList.remove('active');
            }
        }
    });

    // Thêm logic riêng cho trang Payment History tại đây (nếu cần)
    // Ví dụ: xử lý sự kiện cho các nút lọc, phân trang, v.v.
});
