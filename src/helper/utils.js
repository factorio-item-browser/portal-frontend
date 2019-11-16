/**
 * Debounces the callback for the specified delay in milliseconds.
 * @param {Function} callback
 * @param {number} delay
 * @param {*} [context]
 * @returns {Function}
 */
export function debounce(callback, delay, context) {
    let timer = null;
    context = context || this;

    return (...args) => {
        if (timer) {
            window.clearTimeout(timer);
            timer = null;
        }
        timer = window.setTimeout(() => {
            timer = null;
            callback.apply(context, args);
        }, delay);
    };
}
