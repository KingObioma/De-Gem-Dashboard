// ========================================
// Navigation Hamburger Menu
// ========================================
const hamburger = document.getElementById("hamburger-js");
const closeNavBtn = document.getElementById("close-nav-btn-js");
const secondSection = document.getElementById("second-section-js");

if (hamburger && closeNavBtn && secondSection) {
    hamburger.addEventListener("click", () => {
        secondSection.classList.remove("hide");
        hamburger.classList.add("hide");
        closeNavBtn.classList.remove("hide");
    });

    closeNavBtn.addEventListener("click", () => {
        secondSection.classList.add("hide");
        closeNavBtn.classList.add("hide");
        hamburger.classList.remove("hide");
        hamburger.classList.add("show");
    });
}

// ========================================
// Authentication System
// ========================================

// Utility function to get registered users from localStorage
function getRegisteredUsers() {
    const users = localStorage.getItem('degem_users');
    return users ? JSON.parse(users) : [];
}

// Utility function to save users to localStorage
function saveUsers(users) {
    localStorage.setItem('degem_users', JSON.stringify(users));
}

// Utility function to check if email is already registered
function isEmailRegistered(email) {
    const users = getRegisteredUsers();
    return users.some(user => user.email.toLowerCase() === email.toLowerCase());
}

// Utility function to validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Utility function to show error message
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

// Utility function to hide error message
function hideError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }
}

// Utility function to show success message
function showSuccess(elementId, message) {
    const successElement = document.getElementById(elementId);
    if (successElement) {
        successElement.textContent = message;
        successElement.classList.add('show');
    }
}

// Utility function to set current user session
function setCurrentUser(user, rememberMe = false) {
    if (rememberMe) {
        localStorage.setItem('degem_current_user', JSON.stringify(user));
    } else {
        sessionStorage.setItem('degem_current_user', JSON.stringify(user));
    }
}

// Utility function to get current logged-in user
function getCurrentUser() {
    let user = sessionStorage.getItem('degem_current_user');
    if (!user) {
        user = localStorage.getItem('degem_current_user');
    }
    return user ? JSON.parse(user) : null;
}

// Utility function to logout user
function logoutUser() {
    sessionStorage.removeItem('degem_current_user');
    localStorage.removeItem('degem_current_user');
}

// ========================================
// Sign Up Form Handler
// ========================================
const signupForm = document.getElementById('signup-form');

if (signupForm) {
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const termsCheckbox = document.getElementById('terms-checkbox');

        // Hide previous messages
        hideError('signup-error');

        // Validation
        if (!name) {
            showError('signup-error', 'Please enter your name.');
            return;
        }

        if (!email) {
            showError('signup-error', 'Please enter your email address.');
            return;
        }

        if (!isValidEmail(email)) {
            showError('signup-error', 'Please enter a valid email address.');
            return;
        }

        if (!password) {
            showError('signup-error', 'Please enter a password.');
            return;
        }

        if (password.length < 6) {
            showError('signup-error', 'Password must be at least 6 characters long.');
            return;
        }

        if (termsCheckbox && !termsCheckbox.checked) {
            showError('signup-error', 'You must agree to the Terms and Conditions.');
            return;
        }

        // Check if email is already registered
        if (isEmailRegistered(email)) {
            showError('signup-error', 'This email is already registered. Please sign in instead.');
            return;
        }

        // Create new user object
        const newUser = {
            id: Date.now(),
            name: name,
            email: email,
            password: password,
            createdAt: new Date().toISOString()
        };

        // Save user
        const users = getRegisteredUsers();
        users.push(newUser);
        saveUsers(users);

        // Show success message
        showSuccess('signup-success', 'Registration successful! Redirecting to sign in...');

        // Clear form
        signupForm.reset();

        // Redirect to sign in page after 2 seconds
        setTimeout(() => {
            window.location.href = 'sign-in.html';
        }, 2000);
    });
}

// ========================================
// Sign In Form Handler
// ========================================
const signinForm = document.getElementById('signin-form');

if (signinForm) {
    signinForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form values
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('remember-me');

        // Hide previous error messages
        hideError('signin-error');

        // Validation
        if (!email) {
            showError('signin-error', 'Please enter your email address.');
            return;
        }

        if (!isValidEmail(email)) {
            showError('signin-error', 'Please enter a valid email address.');
            return;
        }

        if (!password) {
            showError('signin-error', 'Please enter your password.');
            return;
        }

        // Check credentials
        const users = getRegisteredUsers();
        const user = users.find(u =>
            u.email.toLowerCase() === email.toLowerCase() &&
            u.password === password
        );

        if (!user) {
            showError('signin-error', 'Invalid email or password. Please try again.');
            return;
        }

        // Set user session
        setCurrentUser(user, rememberMe ? rememberMe.checked : false);

        // Redirect to home page
        window.location.href = 'index.html';
    });
}

// ========================================
// Dark Mode Persistence
// ========================================

// Check and apply dark mode preference on page load
function applyDarkModePreference() {
    const darkModeEnabled = localStorage.getItem('degem_darkMode') === 'true';

    if (darkModeEnabled) {
        document.body.classList.add('darkMode');
        document.documentElement.style.setProperty("--light-gray", "#eae6e6bb");
    } else {
        document.body.classList.remove('darkMode');
        document.documentElement.style.setProperty("--light-gray", "#737373");
    }
}

// Apply dark mode preference immediately when script loads
applyDarkModePreference();

// Also apply on DOMContentLoaded for safety
document.addEventListener('DOMContentLoaded', function() {
    applyDarkModePreference();
});

// ========================================
// Authentication State Management
// ========================================

// Protected pages that require authentication
const protectedPages = ['index.html', 'orders.html', 'clients.html', 'tailors.html', 'collections.html', 'notifications.html', 'profile.html', 'degem.html'];

// Auth pages that logged-in users should not access
const authPages = ['sign-in.html', 'sign-up.html'];

// Get current page name
function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
    return page;
}

// Check if user is on a protected page
function isProtectedPage() {
    const currentPage = getCurrentPage();
    return protectedPages.some(page => currentPage === page || currentPage === '' && page === 'index.html');
}

// Check if user is on an auth page
function isAuthPage() {
    const currentPage = getCurrentPage();
    return authPages.includes(currentPage);
}

// Update sidebar navigation based on auth state
function updateSidebarAuth() {
    const user = getCurrentUser();
    const signInLinks = document.querySelectorAll('.signin-link');
    const signUpLinks = document.querySelectorAll('.signup-link');
    const profileLinks = document.querySelectorAll('.profile-link');
    const logoutBtns = document.querySelectorAll('.logout-container');

    if (user) {
        // User is logged in
        signInLinks.forEach(el => el.classList.add('auth-hidden'));
        signUpLinks.forEach(el => el.classList.add('auth-hidden'));
        profileLinks.forEach(el => el.classList.remove('auth-hidden'));
        logoutBtns.forEach(el => el.classList.remove('auth-hidden'));
    } else {
        // User is logged out
        signInLinks.forEach(el => el.classList.remove('auth-hidden'));
        signUpLinks.forEach(el => el.classList.remove('auth-hidden'));
        profileLinks.forEach(el => el.classList.add('auth-hidden'));
        logoutBtns.forEach(el => el.classList.add('auth-hidden'));
    }
}

// Handle logout
function handleLogout() {
    logoutUser();
    window.location.href = 'sign-in.html';
}

// Protect routes - redirect unauthenticated users
function protectRoutes() {
    const user = getCurrentUser();
    const currentPage = getCurrentPage();

    // If on protected page without auth, redirect to sign in
    if (isProtectedPage() && !user) {
        window.location.href = 'sign-in.html';
        return;
    }

    // If on auth page while logged in, redirect to dashboard
    if (isAuthPage() && user) {
        window.location.href = 'index.html';
        return;
    }
}

// Initialize auth state on page load
function initAuthState() {
    // Protect routes first
    protectRoutes();

    // Update sidebar navigation
    updateSidebarAuth();

    // Add logout event listeners
    document.querySelectorAll('.logout-btn').forEach(btn => {
        btn.addEventListener('click', handleLogout);
    });
}

// Run auth initialization when DOM is ready
document.addEventListener('DOMContentLoaded', initAuthState);
