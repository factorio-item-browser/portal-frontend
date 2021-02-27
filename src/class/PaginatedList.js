// @flow

import { action, computed, makeObservable, observable, runInAction } from "mobx";
import type { ResultsData } from "../type/transfer";
import { PortalApiError } from "./PortalApi";

type DataFetcher<T> = (number) => Promise<T>;
type ErrorHandler<T> = (PortalApiError) => T;

/**
 * The class representing a paginated list of results.
 *
 * @author BluePsyduck <bluepsyduck@gmx.com>
 * @license http://opensource.org/licenses/GPL-3.0 GPL v3
 */
class PaginatedList<TEntity, TData: { ...ResultsData<TEntity>, ... }> {
    results: TEntity[] = [];
    numberOfResults: number = 0;
    currentPage: number = 0;
    isLoading: boolean = false;

    /** @private */
    _dataFetcher: DataFetcher<TData>;
    /** @private */
    _errorHandler: ErrorHandler<TData>;

    constructor(dataFetcher: DataFetcher<TData>, errorHandler: ErrorHandler<TData>) {
        this._dataFetcher = dataFetcher;
        this._errorHandler = errorHandler;

        makeObservable(this, {
            currentPage: observable,
            hasNextPage: computed,
            isLoading: observable,
            numberOfResults: observable,
            requestNextPage: action,
            results: observable,
        });
    }

    get hasNextPage(): boolean {
        return this.results.length < this.numberOfResults;
    }

    async requestNextPage(): Promise<TData> {
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
            return this._errorHandler(e);
        }
    }
}

export default PaginatedList;
