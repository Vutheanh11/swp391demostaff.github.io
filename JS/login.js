// Demo accounts
const accounts = {
    'staff@ev.com': {
        password: 'staff123',
        role: 'staff',
        redirectUrl: 'StaffPage.html'
    },
    'admin@ev.com': {
        password: 'admin123',
        role: 'admin',
        redirectUrl: 'AdminPage.html'
    }
};

// Get form elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('errorMessage');

// Handle form submission
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    // Clear previous error message
    errorMessage.textContent = '';
    
    // Check if account exists
    if (accounts[email]) {
        // Check if password is correct
        if (accounts[email].password === password) {
            // Store user info in sessionStorage
            sessionStorage.setItem('userEmail', email);
            sessionStorage.setItem('userRole', accounts[email].role);
            
            // Success message
            errorMessage.style.color = '#4ade80';
            errorMessage.textContent = 'Login successful! Redirecting...';
            
            // Redirect after short delay
            setTimeout(() => {
                window.location.href = accounts[email].redirectUrl;
            }, 1000);
        } else {
            // Wrong password
            errorMessage.style.color = '#ff6b6b';
            errorMessage.textContent = 'Incorrect password!';
            passwordInput.value = '';
            passwordInput.focus();
        }
    } else {
        // Account not found
        errorMessage.style.color = '#ff6b6b';
        errorMessage.textContent = 'Account not found!';
        passwordInput.value = '';
    }
});

// Clear error message when user starts typing
emailInput.addEventListener('input', () => {
    errorMessage.textContent = '';
});

passwordInput.addEventListener('input', () => {
    errorMessage.textContent = '';
});