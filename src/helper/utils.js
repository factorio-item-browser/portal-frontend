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

/**
 * Selects all the text of the element.
 * @param {Node} element
 */
export function selectText(element) {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(element);
    selection.removeAllRanges();
    selection.addRange(range);
}
