(function() {
    // Áp dụng theme ngay lập tức để tránh FOUC (Flash of Unstyled Content)
    const theme = localStorage.getItem('theme');
    if (theme === 'light') {
        // Sử dụng documentElement (thẻ <html>) để áp dụng class
        // Điều này cho phép theme được áp dụng trước khi body được render
        document.documentElement.classList.add('light-mode');
    }
})();