// @flow

/**
 * The class helping with formatting several values to nice and human-readable strings.
 *
 * @author BluePsyduck <bluepsyduck@gmx.com>
 * @license http://opensource.org/licenses/GPL-3.0 GPL v3
 */
export class Formatter {
    /**
     * Formats the specified amount to a nice human-readable string.
     */
    static formatAmount(amount: number): string {
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
    static formatCraftingSpeed(craftingSpeed: number): string {
        return Math.round(craftingSpeed * 100) / 100 + "x";
    }

    /**
     * Formats the crafting time to a nice human-readable string.
     */
    static formatCraftingTime(craftingTime: number): string {
        return Math.round(craftingTime * 100) / 100 + "s";
    }

    /**
     * Formats the energy usage to a nice human-readable string.
     * @param {number} energyUsage
     * @param {string} energyUsageUnit
     * @returns {string}
     */
    static formatEnergyUsage(energyUsage: number, energyUsageUnit: string): string {
        return Math.round(energyUsage * 1000) / 1000 + energyUsageUnit;
    }
}
