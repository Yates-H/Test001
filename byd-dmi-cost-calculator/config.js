// BYD DM-i Cost Calculator Configuration
// This file contains deployment and environment settings

const CONFIG = {
    // ============================================
    // DEPLOYMENT SETTINGS
    // ============================================

    // Production URL (GitHub Pages or other hosting)
    // Replace with your actual deployment URL
    PRODUCTION_URL: 'https://Yates-H.github.io/Test001/',

    // Local development URL
    LOCAL_URL: 'http://localhost:8080/',

    // ============================================
    // ENVIRONMENT DETECTION
    // ============================================

    /**
     * Detect if we're in production environment
     * @returns {boolean} True if in production
     */
    isProduction() {
        // Check if current hostname is not localhost
        return window.location.hostname !== 'localhost' &&
               window.location.hostname !== '127.0.0.1';
    },

    /**
     * Get the appropriate base URL for current environment
     * @returns {string} Base URL
     */
    getBaseUrl() {
        if (this.isProduction()) {
            // In production, use current URL
            const currentUrl = window.location.origin + window.location.pathname;
            // Remove trailing filename if present
            return currentUrl.replace(/[^/]*\.html$/, '');
        } else {
            // In development, use configured local URL
            return this.LOCAL_URL;
        }
    },

    /**
     * Get QR code URL (can be overridden for sharing)
     * @param {string} customUrl - Optional custom URL
     * @returns {string} URL for QR code
     */
    getQrUrl(customUrl = null) {
        if (customUrl) {
            return customUrl;
        }

        // For production, always use the full current URL
        // For development, use local URL
        return this.getBaseUrl();
    },

    // ============================================
    // FEATURE FLAGS
    // ============================================

    // Enable debug logging
    DEBUG: false,

    // Enable QR code debugging
    QR_DEBUG: true,

    // ============================================
    // DISPLAY SETTINGS
    // ============================================

    // QR code size
    QR_CODE_SIZE: 200,

    // QR code colors
    QR_CODE_DARK_COLOR: '#1E5128',
    QR_CODE_LIGHT_COLOR: '#ffffff',

    // ============================================
    // DEPLOYMENT INSTRUCTIONS
    // ============================================

    /**
     * Get deployment instructions
     * @returns {string} Deployment instructions
     */
    getDeploymentInstructions() {
        return `
        ============================================
        DEPLOYMENT INSTRUCTIONS
        ============================================

        1. UPDATE PRODUCTION_URL:
           - Change PRODUCTION_URL above to your actual deployment URL
           - Example: https://your-username.github.io/byd-dmi-calculator/

        2. DEPLOY TO GITHUB PAGES:
           a. Create GitHub repository: byd-dmi-calculator
           b. Push code: git push origin main
           c. Enable GitHub Pages in repository Settings
           d. Select branch: main, folder: / (root)

        3. TEST DEPLOYMENT:
           a. Visit your GitHub Pages URL
           b. Scan QR code with mobile device
           c. Verify mobile access works

        4. SHARE WITH OTHERS:
           - Share the GitHub Pages URL
           - Or let them scan the QR code
        `;
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}