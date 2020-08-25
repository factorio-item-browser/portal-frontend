// @flow

/**
 * Formats the specified amount to a nice human-readable string.
 */
export function formatAmount(amount: number): string {
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
 */
export function formatCraftingSpeed(craftingSpeed: number): string {
    return Math.round(craftingSpeed * 100) / 100 + "x";
}

/**
 * Formats the crafting time to a nice human-readable string.
 */
export function formatCraftingTime(craftingTime: number): string {
    if (craftingTime <= 600) {
        return Math.round(craftingTime * 100) / 100 + "s";
    }
    if (craftingTime <= 36000) {
        return Math.round((craftingTime * 100) / 60) / 100 + "min";
    }
    if (craftingTime <= 86400) {
        return Math.round((craftingTime * 100) / 3600) / 100 + "h";
    }

    return "∞";
}

/**
 * Formats the energy usage to a nice human-readable string.
 */
export function formatEnergyUsage(energyUsage: number, energyUsageUnit: string): string {
    return Math.round(energyUsage * 1000) / 1000 + energyUsageUnit;
}
