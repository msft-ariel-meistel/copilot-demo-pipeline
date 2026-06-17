/**
 * Format a currency amount for display
 * @param {number} amount - The amount to format
 * @param {string} currency - ISO 4217 currency code (e.g. 'USD', 'EUR')
 * @param {string} [locale='en-US'] - BCP 47 locale string
 * @returns {string} Formatted currency string
 */
function formatCurrency(amount, currency, locale = 'en-US') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(amount);
}

/**
 * Sleep for a given number of milliseconds
 * @param {number} ms
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = { formatCurrency, sleep };
