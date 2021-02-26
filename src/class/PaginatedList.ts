import { ResultsData } from "../type/transfer";
import { action, computed, makeObservable, observable, runInAction } from "mobx";
import { PortalApiError } from "./PortalApi";

type DataFetcher<T> = (page: number) => Promise<T>;
type ErrorHandler<T> = (error: PortalApiError) => T;

export class PaginatedList<TEntity, TData extends ResultsData<TEntity>> {
    private readonly dataFetcher: DataFetcher<TData>;
    private readonly errorHandler: ErrorHandler<TData>;

    public results: TEntity[] = [];
    public numberOfResults = 0;
    public currentPage = 0;
    public isLoading = false;

    public constructor(
        dataFetcher: DataFetcher<TData>,
        errorHandler: ErrorHandler<TData>,
    ) {
        this.dataFetcher = dataFetcher;
        this.errorHandler = errorHandler;

        makeObservable(this, {
            results: observable,
            numberOfResults: observable,
            currentPage: observable,
            isLoading: observable,
            hasNextPage: computed,
            requestNextPage: action,
        });
    }

    public get hasNextPage(): boolean {
        return this.results.length < this.numberOfResults;
    }

    public async requestNextPage(): Promise<TData> {
        this.isLoading = true;
        try {
            const newPage = this.currentPage + 1;
            const data = await this.dataFetcher(newPage);
            return runInAction((): TData => {
                this.isLoading = false;
                this.currentPage = newPage;
                this.results.push(...data.results);
                this.numberOfResults = data.numberOfResults;
                return data;
            });
        } catch (e) {
            return this.errorHandler(e);
        }
    }
}