/**
 * Formats the specified amount to a nice human-readable string.
 * @param {number} amount
 * @returns {string}
 */
export function formatAmount(amount) {
    if (amount > 1000000) {
        return Math.round(amount / 100000) / 10 + "M";
    }
    if (amount > 1000) {
        return Math.round(amount / 100) / 10 + "k";
    }
    if (amount < 1) {
        return Math.round(amount * 1000) / 10 + "%";
    }
    return Math.round(amount * 10) / 10 + "x";
}

/**
 * Formats the crafting speed to a nice human-readable string.
 * @param {number} craftingSpeed
 * @returns {string}
 */
export function formatCraftingSpeed(craftingSpeed) {
    return Math.round(craftingSpeed * 100) / 100 + "x";
}

/**
 * Formats the crafting time to a nice human-readable string.
 * @param {number} craftingTime
 * @returns {string}
 */
export function formatCraftingTime(craftingTime) {
    return Math.round(craftingTime * 100) / 100 + "s";
}

/**
 * Formats the energy usage to a nice human-readable string.
 * @param {number} energyUsage
 * @param {string} energyUsageUnit
 * @returns {string}
 */
export function formatEnergyUsage(energyUsage, energyUsageUnit) {
    return Math.round(energyUsage * 1000) / 1000 + energyUsageUnit;
}
