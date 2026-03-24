// BYD DM-i vs Fuel Car Cost Calculator
// Main JavaScript Application

// ============================================
// 1. UTILITY FUNCTIONS
// ============================================

/**
 * Format number as Indonesian Rupiah currency
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
function formatIDR(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

/**
 * Format number with thousand separators
 * @param {number} number - Number to format
 * @returns {string} Formatted number string
 */
function formatNumber(number) {
    return new Intl.NumberFormat('id-ID').format(number);
}

/**
 * Format percentage
 * @param {number} percentage - Percentage value (0-100)
 * @returns {string} Formatted percentage string
 */
function formatPercentage(percentage) {
    return percentage.toFixed(1) + '%';
}

/**
 * Show temporary notification
 * @param {string} message - Message to display
 * @param {string} type - Type of notification (success, error, info)
 */
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'assertive');

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;

    // Set background color based on type
    const colors = {
        success: '#28A745',
        error: '#DC3545',
        info: '#17A2B8'
    };
    notification.style.backgroundColor = colors[type] || colors.info;

    // Add to document
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
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
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

/**
 * Validate input value
 * @param {number} value - Value to validate
 * @param {string} fieldName - Name of the field for error message
 * @param {Object} options - Validation options
 * @returns {Object} Validation result
 */
function validateInput(value, fieldName, options = {}) {
    const { min = 0, max = Infinity, required = true } = options;

    if (required && (value === null || value === undefined || value === '')) {
        return {
            valid: false,
            message: `${fieldName} is required`
        };
    }

    const numValue = Number(value);
    if (isNaN(numValue)) {
        return {
            valid: false,
            message: `${fieldName} must be a number`
        };
    }

    if (numValue < min) {
        return {
            valid: false,
            message: `${fieldName} must be at least ${min}`
        };
    }

    if (numValue > max) {
        return {
            valid: false,
            message: `${fieldName} must be at most ${max}`
        };
    }

    return { valid: true };
}

// ============================================
// 2. COST CALCULATOR CLASS
// ============================================

class CostCalculator {
    constructor() {
        this.defaultParams = {
            fuelPrice: 15000,           // IDR per liter
            electricityPrice: 1500,     // IDR per kWh
            monthlyDistance: 1500,      // km per month
            fuelCarConsumption: 8,      // L/100km
            dmiElectricConsumption: 15, // kWh/100km
            dmiFuelConsumption: 5,      // L/100km (hybrid mode)
            hybridRatio: 30             // Percentage (0-100)
        };
    }

    /**
     * Calculate fuel car monthly cost
     * @param {Object} params - Calculation parameters
     * @returns {number} Monthly cost in IDR
     */
    calculateFuelCarCost(params) {
        const fuelNeeded = (params.monthlyDistance / 100) * params.fuelCarConsumption;
        return fuelNeeded * params.fuelPrice;
    }

    /**
     * Calculate BYD DM-i monthly cost
     * @param {Object} params - Calculation parameters
     * @returns {Object} Cost breakdown and total
     */
    calculateDMiCost(params) {
        // Electric cost (pure EV mode)
        const electricDistance = params.monthlyDistance * (1 - params.hybridRatio / 100);
        const electricNeeded = (electricDistance / 100) * params.dmiElectricConsumption;
        const electricCost = electricNeeded * params.electricityPrice;

        // Hybrid fuel cost
        const hybridDistance = params.monthlyDistance * (params.hybridRatio / 100);
        const hybridFuelNeeded = (hybridDistance / 100) * params.dmiFuelConsumption;
        const hybridCost = hybridFuelNeeded * params.fuelPrice;

        const totalCost = electricCost + hybridCost;

        return {
            total: totalCost,
            electricCost: electricCost,
            hybridCost: hybridCost,
            electricPercentage: (electricCost / totalCost) * 100,
            hybridPercentage: (hybridCost / totalCost) * 100
        };
    }

    /**
     * Calculate savings
     * @param {number} fuelCost - Fuel car cost
     * @param {number} dmiCost - DM-i cost
     * @returns {Object} Savings amount and percentage
     */
    calculateSavings(fuelCost, dmiCost) {
        const amount = fuelCost - dmiCost;
        const percentage = fuelCost > 0 ? (amount / fuelCost) * 100 : 0;

        return {
            amount: amount,
            percentage: percentage,
            annual: amount * 12
        };
    }

    /**
     * Calculate cost per kilometer
     * @param {number} totalCost - Total monthly cost
     * @param {number} distance - Monthly distance
     * @returns {number} Cost per km
     */
    calculateCostPerKm(totalCost, distance) {
        return distance > 0 ? totalCost / distance : 0;
    }

    /**
     * Validate all parameters
     * @param {Object} params - Parameters to validate
     * @returns {Array} Array of validation errors
     */
    validateParameters(params) {
        const errors = [];

        // Validate each parameter
        const validations = [
            { field: 'fuelPrice', value: params.fuelPrice, min: 0, max: 100000 },
            { field: 'electricityPrice', value: params.electricityPrice, min: 0, max: 10000 },
            { field: 'monthlyDistance', value: params.monthlyDistance, min: 0, max: 10000 },
            { field: 'fuelCarConsumption', value: params.fuelCarConsumption, min: 0, max: 50 },
            { field: 'dmiElectricConsumption', value: params.dmiElectricConsumption, min: 0, max: 50 },
            { field: 'dmiFuelConsumption', value: params.dmiFuelConsumption, min: 0, max: 50 },
            { field: 'hybridRatio', value: params.hybridRatio, min: 0, max: 100 }
        ];

        validations.forEach(({ field, value, min, max }) => {
            const validation = validateInput(value, field, { min, max });
            if (!validation.valid) {
                errors.push(validation.message);
            }
        });

        return errors;
    }
}

// ============================================
// 3. CHART MANAGER CLASS
// ============================================

class ChartManager {
    constructor() {
        this.chart = null;
        this.colors = {
            fuelCar: 'rgba(220, 53, 69, 0.7)',
            dmiCar: 'rgba(30, 81, 40, 0.7)',
            borderFuelCar: 'rgb(220, 53, 69)',
            borderDmiCar: 'rgb(30, 81, 40)'
        };
    }

    /**
     * Initialize or update the cost comparison chart
     * @param {number} fuelCost - Fuel car cost
     * @param {number} dmiCost - DM-i cost
     * @param {string} language - Current language
     */
    renderCostChart(fuelCost, dmiCost, language = 'id') {
        const ctx = document.getElementById('cost-chart');
        if (!ctx) return;

        const labels = language === 'id'
            ? ['Mobil Bensin', 'BYD DM-i']
            : ['Fuel Car', 'BYD DM-i'];

        const dataLabel = language === 'id'
            ? 'Biaya Bulanan (IDR)'
            : 'Monthly Cost (IDR)';

        const chartTitle = language === 'id'
            ? 'Perbandingan Biaya Bulanan'
            : 'Monthly Cost Comparison';

        const data = {
            labels: labels,
            datasets: [{
                label: dataLabel,
                data: [fuelCost, dmiCost],
                backgroundColor: [
                    this.colors.fuelCar,
                    this.colors.dmiCar
                ],
                borderColor: [
                    this.colors.borderFuelCar,
                    this.colors.borderDmiCar
                ],
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false
            }]
        };

        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: chartTitle,
                    font: {
                        size: 16,
                        weight: '600'
                    },
                    padding: {
                        top: 10,
                        bottom: 30
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${formatIDR(context.raw)}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatIDR(value);
                        },
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 14,
                            weight: '500'
                        }
                    }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeOutQuart'
            }
        };

        // Destroy existing chart if it exists
        if (this.chart) {
            this.chart.destroy();
        }

        // Create new chart
        this.chart = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: options
        });
    }

    /**
     * Destroy the chart
     */
    destroy() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    }
}

// ============================================
// 4. LANGUAGE MANAGER CLASS
// ============================================

class LanguageManager {
    constructor() {
        this.currentLang = 'id';
        this.translations = {};
        this.initialized = false;
    }

    /**
     * Initialize language manager
     */
    async init() {
        try {
            // Load both language files
            const [idResponse, enResponse] = await Promise.all([
                fetch('locales/id.json'),
                fetch('locales/en.json')
            ]);

            if (!idResponse.ok || !enResponse.ok) {
                throw new Error('Failed to load language files');
            }

            this.translations.id = await idResponse.json();
            this.translations.en = await enResponse.json();
            this.initialized = true;

            // Set initial language
            await this.setLanguage(this.currentLang);
        } catch (error) {
            console.error('Language initialization failed:', error);
            // Fallback to hardcoded translations
            this.loadFallbackTranslations();
            this.initialized = true;
        }
    }

    /**
     * Load fallback translations if files fail to load
     */
    loadFallbackTranslations() {
        this.translations = {
            id: {
                appTitle: "BYD DM-i vs Mobil Bensin - Kalkulator Biaya",
                calculate: "Hitung Biaya",
                fuelCar: "Mobil Bensin",
                dmiCar: "BYD DM-i",
                savings: "Penghematan"
            },
            en: {
                appTitle: "BYD DM-i vs Fuel Car - Cost Calculator",
                calculate: "Calculate Cost",
                fuelCar: "Fuel Car",
                dmiCar: "BYD DM-i",
                savings: "Savings"
            }
        };
    }

    /**
     * Set current language
     * @param {string} lang - Language code (id/en)
     */
    async setLanguage(lang) {
        if (!['id', 'en'].includes(lang)) {
            console.warn(`Unsupported language: ${lang}`);
            return;
        }

        this.currentLang = lang;
        this.updatePageText();
        this.updateLanguageButtons();

        // Save preference to localStorage
        try {
            localStorage.setItem('byd-calculator-language', lang);
        } catch (error) {
            console.warn('Failed to save language preference:', error);
        }
    }

    /**
     * Update all text elements on the page
     */
    updatePageText() {
        if (!this.initialized || !this.translations[this.currentLang]) {
            return;
        }

        const translations = this.translations[this.currentLang];
        const elements = document.querySelectorAll('[data-i18n]');

        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[key]) {
                // Handle different element types
                if (element.tagName === 'INPUT' && element.type !== 'submit' && element.type !== 'button') {
                    element.placeholder = translations[key];
                } else if (element.tagName === 'TEXTAREA') {
                    element.placeholder = translations[key];
                } else {
                    element.textContent = translations[key];
                }
            }
        });

        // Update page title
        document.title = translations.appTitle || document.title;
    }

    /**
     * Update language button states
     */
    updateLanguageButtons() {
        const buttons = document.querySelectorAll('.lang-btn');
        buttons.forEach(button => {
            const lang = button.getAttribute('data-lang');
            if (lang === this.currentLang) {
                button.classList.add('active');
                button.setAttribute('aria-pressed', 'true');
            } else {
                button.classList.remove('active');
                button.setAttribute('aria-pressed', 'false');
            }
        });
    }

    /**
     * Get translation for a specific key
     * @param {string} key - Translation key
     * @returns {string} Translated text
     */
    t(key) {
        if (!this.initialized || !this.translations[this.currentLang]) {
            return key;
        }
        return this.translations[this.currentLang][key] || key;
    }

    /**
     * Get translation with parameters
     * @param {string} key - Translation key
     * @param {Object} params - Parameters to replace
     * @returns {string} Translated text with parameters
     */
    tWithParams(key, params) {
        let text = this.t(key);
        Object.keys(params).forEach(param => {
            text = text.replace(`{${param}}`, params[param]);
        });
        return text;
    }
}

// ============================================
// 5. QR CODE GENERATOR CLASS
// ============================================

class QRCodeGenerator {
    constructor() {
        this.qrCode = null;
        this.defaultSize = 200;
    }

    /**
     * Generate QR code for current URL
     */
    generateQRCode() {
        const container = document.getElementById('qrcode');
        if (!container) return;

        // Clear existing QR code
        container.innerHTML = '';

        // Get current URL
        const url = window.location.href;

        // Update URL display
        const urlDisplay = document.getElementById('qr-url-display');
        if (urlDisplay) {
            urlDisplay.textContent = url;
        }

        try {
            // Generate QR code
            this.qrCode = new QRCode(container, {
                text: url,
                width: this.defaultSize,
                height: this.defaultSize,
                colorDark: "#1E5128",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
        } catch (error) {
            console.error('QR code generation failed:', error);
            container.innerHTML = '<p>QR code generation failed</p>';
        }
    }

    /**
     * Copy current URL to clipboard
     */
    async copyUrlToClipboard() {
        const url = window.location.href;

        try {
            await navigator.clipboard.writeText(url);
            showNotification(this.languageManager?.t('copySuccess') || 'URL copied successfully!', 'success');
        } catch (error) {
            console.error('Failed to copy URL:', error);
            showNotification(this.languageManager?.t('copyError') || 'Failed to copy URL', 'error');

            // Fallback method
            const textArea = document.createElement('textarea');
            textArea.value = url;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                showNotification(this.languageManager?.t('copySuccess') || 'URL copied successfully!', 'success');
            } catch (err) {
                console.error('Fallback copy failed:', err);
            }
            document.body.removeChild(textArea);
        }
    }
}

// ============================================
// 6. MAIN APPLICATION CLASS
// ============================================

class CostComparisonApp {
    constructor() {
        this.calculator = new CostCalculator();
        this.chartManager = new ChartManager();
        this.languageManager = new LanguageManager();
        this.qrGenerator = new QRCodeGenerator();

        // Bind methods
        this.handleCalculate = this.handleCalculate.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.handleLanguageChange = this.handleLanguageChange.bind(this);
        this.handleCopyUrl = this.handleCopyUrl.bind(this);
        this.handleRangeChange = this.handleRangeChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);

        this.initialized = false;
    }

    /**
     * Initialize the application
     */
    async init() {
        if (this.initialized) return;

        try {
            // Initialize language manager
            await this.languageManager.init();

            // Set up event listeners
            this.setupEventListeners();

            // Generate initial QR code
            this.qrGenerator.generateQRCode();

            // Set initial language from localStorage or browser
            await this.loadLanguagePreference();

            // Perform initial calculation
            await this.handleCalculate();

            this.initialized = true;
            console.log('Application initialized successfully');
        } catch (error) {
            console.error('Application initialization failed:', error);
            showNotification('Failed to initialize application', 'error');
        }
    }

    /**
     * Load language preference from localStorage or browser
     */
    async loadLanguagePreference() {
        try {
            // Try to get from localStorage
            const savedLang = localStorage.getItem('byd-calculator-language');
            if (savedLang && ['id', 'en'].includes(savedLang)) {
                await this.languageManager.setLanguage(savedLang);
                return;
            }

            // Fallback to browser language
            const browserLang = navigator.language.toLowerCase();
            if (browserLang.startsWith('id')) {
                await this.languageManager.setLanguage('id');
            } else {
                await this.languageManager.setLanguage('en');
            }
        } catch (error) {
            console.warn('Failed to load language preference:', error);
            // Default to Indonesian
            await this.languageManager.setLanguage('id');
        }
    }

    /**
     * Set up all event listeners
     */
    setupEventListeners() {
        // Calculate button
        const calculateBtn = document.getElementById('calculate-btn');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', this.handleCalculate);
        }

        // Reset button
        const resetBtn = document.getElementById('reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', this.handleReset);
        }

        // Language buttons
        const langButtons = document.querySelectorAll('.lang-btn');
        langButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const lang = e.currentTarget.getAttribute('data-lang');
                this.handleLanguageChange(lang);
            });
        });

        // Copy URL button
        const copyUrlBtn = document.getElementById('copy-url-btn');
        if (copyUrlBtn) {
            copyUrlBtn.addEventListener('click', this.handleCopyUrl);
        }

        // Range input (hybrid ratio)
        const rangeInput = document.getElementById('hybrid-ratio');
        if (rangeInput) {
            rangeInput.addEventListener('input', this.handleRangeChange);
        }

        // Number inputs (debounced to avoid too many calculations)
        const numberInputs = document.querySelectorAll('input[type="number"]');
        numberInputs.forEach(input => {
            input.addEventListener('change', this.handleInputChange);
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Enter to calculate
            if (e.key === 'Enter' && !e.ctrlKey && !e.altKey && !e.metaKey) {
                e.preventDefault();
                this.handleCalculate();
            }

            // Escape to reset
            if (e.key === 'Escape') {
                e.preventDefault();
                this.handleReset();
            }
        });

        // Handle window resize for chart responsiveness
        window.addEventListener('resize', () => {
            if (this.chartManager.chart) {
                this.chartManager.chart.resize();
            }
        });
    }

    /**
     * Get current input parameters
     * @returns {Object} Current parameters
     */
    getInputParams() {
        return {
            fuelPrice: parseFloat(document.getElementById('fuel-price').value) || this.calculator.defaultParams.fuelPrice,
            electricityPrice: parseFloat(document.getElementById('electricity-price').value) || this.calculator.defaultParams.electricityPrice,
            monthlyDistance: parseFloat(document.getElementById('monthly-distance').value) || this.calculator.defaultParams.monthlyDistance,
            fuelCarConsumption: parseFloat(document.getElementById('fuel-consumption').value) || this.calculator.defaultParams.fuelCarConsumption,
            dmiElectricConsumption: parseFloat(document.getElementById('dmi-electric-consumption').value) || this.calculator.defaultParams.dmiElectricConsumption,
            dmiFuelConsumption: parseFloat(document.getElementById('dmi-fuel-consumption').value) || this.calculator.defaultParams.dmiFuelConsumption,
            hybridRatio: parseFloat(document.getElementById('hybrid-ratio').value) || this.calculator.defaultParams.hybridRatio
        };
    }

    /**
     * Update range input display value
     * @param {Event} e - Range input event
     */
    handleRangeChange(e) {
        const value = e.target.value;
        const display = document.getElementById('hybrid-ratio-value');
        if (display) {
            display.textContent = `${value}%`;
        }
    }

    /**
     * Handle input change with debounce
     */
    handleInputChange() {
        // Clear any existing timeout
        if (this.inputTimeout) {
            clearTimeout(this.inputTimeout);
        }

        // Set new timeout for calculation
        this.inputTimeout = setTimeout(() => {
            this.handleCalculate();
        }, 500); // 500ms debounce
    }

    /**
     * Handle calculate button click
     */
    async handleCalculate() {
        try {
            // Show calculating state
            const calculateBtn = document.getElementById('calculate-btn');
            if (calculateBtn) {
                const originalText = calculateBtn.innerHTML;
                calculateBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${this.languageManager.t('calculating')}`;
                calculateBtn.disabled = true;

                // Perform calculation
                await this.performCalculation();

                // Restore button state
                setTimeout(() => {
                    calculateBtn.innerHTML = originalText;
                    calculateBtn.disabled = false;
                }, 300);
            } else {
                await this.performCalculation();
            }
        } catch (error) {
            console.error('Calculation failed:', error);
            showNotification(this.languageManager.t('invalidInput') || 'Invalid input', 'error');
        }
    }

    /**
     * Perform the actual calculation
     */
    async performCalculation() {
        // Get current parameters
        const params = this.getInputParams();

        // Validate parameters
        const errors = this.calculator.validateParameters(params);
        if (errors.length > 0) {
            showNotification(errors[0], 'error');
            return;
        }

        // Calculate costs
        const fuelCost = this.calculator.calculateFuelCarCost(params);
        const dmiCostResult = this.calculator.calculateDMiCost(params);
        const savings = this.calculator.calculateSavings(fuelCost, dmiCostResult.total);

        // Calculate cost per km
        const fuelCostPerKm = this.calculator.calculateCostPerKm(fuelCost, params.monthlyDistance);
        const dmiCostPerKm = this.calculator.calculateCostPerKm(dmiCostResult.total, params.monthlyDistance);

        // Update UI
        this.updateResults(fuelCost, dmiCostResult, savings, fuelCostPerKm, dmiCostPerKm);

        // Update chart
        this.chartManager.renderCostChart(fuelCost, dmiCostResult.total, this.languageManager.currentLang);
    }

    /**
     * Update all result displays
     */
    updateResults(fuelCost, dmiCostResult, savings, fuelCostPerKm, dmiCostPerKm) {
        // Update fuel car cost
        const fuelCostElement = document.getElementById('fuel-cost');
        if (fuelCostElement) {
            fuelCostElement.textContent = formatIDR(fuelCost);
            fuelCostElement.classList.add('highlight');
            setTimeout(() => fuelCostElement.classList.remove('highlight'), 1000);
        }

        // Update fuel car cost per km
        const fuelCostPerKmElement = document.getElementById('fuel-cost-per-km');
        if (fuelCostPerKmElement) {
            fuelCostPerKmElement.textContent = formatIDR(fuelCostPerKm);
        }

        // Update DM-i cost
        const dmiCostElement = document.getElementById('dmi-cost');
        if (dmiCostElement) {
            dmiCostElement.textContent = formatIDR(dmiCostResult.total);
            dmiCostElement.classList.add('highlight');
            setTimeout(() => dmiCostElement.classList.remove('highlight'), 1000);
        }

        // Update DM-i cost per km
        const dmiCostPerKmElement = document.getElementById('dmi-cost-per-km');
        if (dmiCostPerKmElement) {
            dmiCostPerKmElement.textContent = formatIDR(dmiCostPerKm);
        }

        // Update savings
        const savingsAmountElement = document.getElementById('savings-amount');
        if (savingsAmountElement) {
            savingsAmountElement.textContent = formatIDR(savings.amount);
            savingsAmountElement.classList.add('highlight');
            setTimeout(() => savingsAmountElement.classList.remove('highlight'), 1000);
        }

        const savingsPercentageElement = document.getElementById('savings-percentage');
        if (savingsPercentageElement) {
            savingsPercentageElement.textContent = formatPercentage(savings.percentage);
        }

        const annualSavingsElement = document.getElementById('annual-savings');
        if (annualSavingsElement) {
            annualSavingsElement.textContent = formatIDR(savings.annual);
        }

        // Update cost breakdown
        const fuelCostBreakdown = document.getElementById('fuel-cost-breakdown');
        if (fuelCostBreakdown) {
            fuelCostBreakdown.textContent = formatIDR(dmiCostResult.hybridCost);
        }

        const fuelCostPercentage = document.getElementById('fuel-cost-percentage');
        if (fuelCostPercentage) {
            fuelCostPercentage.textContent = formatPercentage(dmiCostResult.hybridPercentage);
        }

        const electricityCostBreakdown = document.getElementById('electricity-cost-breakdown');
        if (electricityCostBreakdown) {
            electricityCostBreakdown.textContent = formatIDR(dmiCostResult.electricCost);
        }

        const electricityCostPercentage = document.getElementById('electricity-cost-percentage');
        if (electricityCostPercentage) {
            electricityCostPercentage.textContent = formatPercentage(dmiCostResult.electricPercentage);
        }

        const totalCostBreakdown = document.getElementById('total-cost-breakdown');
        if (totalCostBreakdown) {
            totalCostBreakdown.textContent = formatIDR(dmiCostResult.total);
        }
    }

    /**
     * Handle reset button click
     */
    handleReset() {
        // Reset all inputs to default values
        Object.keys(this.calculator.defaultParams).forEach(key => {
            const element = document.getElementById(key.replace(/([A-Z])/g, '-$1').toLowerCase());
            if (element) {
                element.value = this.calculator.defaultParams[key];

                // Update range display if it's the hybrid ratio
                if (key === 'hybridRatio') {
                    const display = document.getElementById('hybrid-ratio-value');
                    if (display) {
                        display.textContent = `${this.calculator.defaultParams[key]}%`;
                    }
                }
            }
        });

        // Show success message
        showNotification(this.languageManager.t('resetSuccess') || 'Parameters reset to defaults', 'success');

        // Recalculate with default values
        this.handleCalculate();
    }

    /**
     * Handle language change
     * @param {string} lang - New language code
     */
    async handleLanguageChange(lang) {
        try {
            await this.languageManager.setLanguage(lang);

            // Update chart with new language
            const params = this.getInputParams();
            const fuelCost = this.calculator.calculateFuelCarCost(params);
            const dmiCostResult = this.calculator.calculateDMiCost(params);
            this.chartManager.renderCostChart(fuelCost, dmiCostResult.total, lang);

            // Show success message
            const langName = lang === 'id' ? 'Indonesian' : 'English';
            showNotification(`Language changed to ${langName}`, 'success');
        } catch (error) {
            console.error('Language change failed:', error);
            showNotification('Failed to change language', 'error');
        }
    }

    /**
     * Handle copy URL button click
     */
    handleCopyUrl() {
        this.qrGenerator.copyUrlToClipboard();
    }
}

// ============================================
// 7. APPLICATION INITIALIZATION
// ============================================

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new CostComparisonApp();
    app.init().catch(error => {
        console.error('Failed to initialize application:', error);
        showNotification('Failed to load calculator. Please refresh the page.', 'error');
    });
});

// Export for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CostCalculator,
        ChartManager,
        LanguageManager,
        QRCodeGenerator,
        CostComparisonApp,
        formatIDR,
        formatNumber,
        formatPercentage
    };
}