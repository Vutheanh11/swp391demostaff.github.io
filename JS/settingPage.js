// JS/settingPage.js
document.addEventListener('DOMContentLoaded', () => {
    // --- Logic cho Sidebar & Dropdown (Giữ nguyên để đảm bảo tính nhất quán) ---
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarClose = document.getElementById('sidebarClose');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const userAvatar = document.getElementById('userAvatar');
    const staffInfoDropdown = document.getElementById('staffInfoDropdown');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.add('active');
            sidebarOverlay.classList.add('active');
        });
    }

    const closeSidebar = () => {
        if (sidebar && sidebarOverlay) {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
        }
    };

    if (sidebarClose) sidebarClose.addEventListener('click', closeSidebar);
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);

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

    // --- Logic riêng cho trang Cài đặt ---
    const themeToggle = document.getElementById('themeToggle');
    const themeLabel = document.getElementById('themeLabel');
    const languageButtons = document.querySelectorAll('.language-btn');

    // Hàm để ÁP DỤNG giao diện (theme) khi người dùng TOGGLE
    const applyTheme = (theme) => {
        if (theme === 'light') {
            document.documentElement.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
            if (themeToggle) themeToggle.classList.add('active');
            if (themeLabel) themeLabel.textContent = 'Light Mode';
        } else {
            document.documentElement.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark');
            if (themeToggle) themeToggle.classList.remove('active');
            if (themeLabel) themeLabel.textContent = 'Dark Mode';
        }
    };

    // Xử lý sự kiện khi nhấn vào nút chuyển đổi giao diện
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isLight = document.documentElement.classList.contains('light-mode');
            applyTheme(isLight ? 'dark' : 'light');
        });
    }

    // Xử lý sự kiện khi nhấn vào nút chọn ngôn ngữ
    if (languageButtons) {
        languageButtons.forEach(button => {
            button.addEventListener('click', () => {
                languageButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const selectedLang = button.getAttribute('data-lang');
                localStorage.setItem('language', selectedLang);
                console.log(`Đã đổi ngôn ngữ sang: ${selectedLang}`);
                // Thêm logic để tải lại trang hoặc thay đổi nội dung động tại đây
            });
        });
    }

    // Logic cho các Toggle Switch của thông báo
    const notificationToggles = document.querySelectorAll('.settings-card-body .toggle-switch');
    notificationToggles.forEach(toggle => {
        // Bỏ qua themeToggle vì nó không phải là nút bật/tắt thông thường
        if (toggle.id !== 'themeToggle') {
            // Tải trạng thái đã lưu
            const savedState = localStorage.getItem(toggle.id) === 'true';
            if (savedState) {
                toggle.classList.add('active');
            } else {
                toggle.classList.remove('active');
            }
            
            toggle.addEventListener('click', () => {
                toggle.classList.toggle('active');
                const settingId = toggle.id;
                const isActive = toggle.classList.contains('active');
                localStorage.setItem(settingId, isActive);
                console.log(`Cài đặt '${settingId}' đã được ${isActive ? 'bật' : 'tắt'}.`);
            });
        }
    });

    // --- Cập nhật trạng thái của các nút control khi trang được mở ---
    // Giao diện đã được áp dụng bởi theme-loader.js.
    // Phần này chỉ đảm bảo nút toggle hiển thị đúng trạng thái.
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        if (themeToggle) themeToggle.classList.add('active');
        if (themeLabel) themeLabel.textContent = 'Light Mode';
    } else {
        if (themeToggle) themeToggle.classList.remove('active');
        if (themeLabel) themeLabel.textContent = 'Dark Mode';
    }

    // Áp dụng ngôn ngữ đã lưu
    const savedLang = localStorage.getItem('language') || 'vi';
    languageButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === savedLang) {
            btn.classList.add('active');
        }
    });
});