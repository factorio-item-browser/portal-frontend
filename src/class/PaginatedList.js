import { action, computed, observable, runInAction } from "mobx";

/**
 * The class representing a paginated list of results.
 *
 * @author BluePsyduck <bluepsyduck@gmx.com>
 * @license http://opensource.org/licenses/GPL-3.0 GPL v3
 *
 * @template TData
 * @template TEntity
 */
class PaginatedList {
    /**
     * The results of the list.
     * @type {TEntity[]}
     */
    @observable
    results = [];

    /**
     * The total number of results in the list.
     * @type {number}
     */
    @observable
    numberOfResults = 0;

    /**
     * The currently loaded page.
     * @type {number}
     */
    @observable
    currentPage = 0;

    /**
     * Whether we are currently loading new results.
     * @type {boolean}
     */
    @observable
    isLoading = false;

    /**
     * The callback to request the data of a page.
     * @type {function (number): *}
     * @private
     */
    _dataFetcher;

    /**
     * The callback for handling an error.
     * @type {function (PortalApiError): void}
     * @private
     */
    _errorHandler;

    /**
     * Initializes the paginated list.
     * @param {function (number): *} dataFetcher
     * @param {function (PortalApiError): void} errorHandler
     */
    constructor(dataFetcher, errorHandler) {
        this._dataFetcher = dataFetcher;
        this._errorHandler = errorHandler;
    }

    /**
     * Returns whether another page is available to be requested.
     * @returns {boolean}
     */
    @computed
    get hasNextPage() {
        return this.results.length < this.numberOfResults;
    }

    /**
     * Requests the next page of data.
     * @returns {Promise<TData>}
     */
    @action
    async requestNextPage() {
        this.isLoading = true;

        try {
            const newPage = this.currentPage + 1;
            const data = await this._dataFetcher(newPage);
            return runInAction(() => {
                this.isLoading = false;
                this.currentPage = newPage;
                this.results.push(...data.results);
                this.numberOfResults = data.numberOfResults;

                return data;
            });
        } catch (e) {
            this._errorHandler(e);
        }
    }
}

export default PaginatedList;
