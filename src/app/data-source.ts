import {
	BehaviorSubject,
	merge,
	Observable,
	Subscription
} from 'rxjs';

import { DataSource, CollectionViewer } from '@angular/cdk/collections';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';

export abstract class WrappedDataSource<T> extends DataSource<T> {
	private readonly renderData = new BehaviorSubject<T[]>([]);
	private readonly loadingIndication = new BehaviorSubject<boolean>(false);
	public readonly loadingIndicator = this.loadingIndication.asObservable();

	private pageOffset: number = 0;
	private pageSize: number = 0;
	private sortColumnIdentifier: string = '';
	private sortAscend: boolean = true;

	private collectionViewChangeSubscription = Subscription.EMPTY;

	get paginator(): MatPaginator | null { return this._paginator; }
	set paginator(paginator: MatPaginator | null) {
		this._paginator = paginator;
		this.updatePageEventSubscription();
	}
	private _paginator: MatPaginator | null;

	private pageEventSubscription = Subscription.EMPTY;

	get sort(): MatSort | null { return this._sort; }
	set sort(sort: MatSort | null) {
		this._sort = sort;
		this.updateSortChangeSubscription();
	}
	private _sort: MatSort | null;

	private sortChangeSubscription = Subscription.EMPTY;

	connect(collectionViewer: CollectionViewer): Observable<T[]> {
		this.collectionViewChangeSubscription.unsubscribe();
		this.collectionViewChangeSubscription = collectionViewer.viewChange.subscribe((rng) => {
			console.log(`view-change: ${rng.start} - ${rng.end}`);
		});
		this.updateComponentEventSubscription();
		this.updateData();
		return this.renderData.asObservable();
	}

	disconnect(collectionViewer: CollectionViewer): void {
		this.collectionViewChangeSubscription.unsubscribe();
		this.collectionViewChangeSubscription = Subscription.EMPTY;
		this.pageEventSubscription.unsubscribe();
		this.pageEventSubscription = Subscription.EMPTY;
		this.sortChangeSubscription.unsubscribe();
		this.sortChangeSubscription = Subscription.EMPTY;
	}

	setDataLength(dataLength: number) {
		if (this._paginator) {
			this._paginator.length = dataLength;
		}
	}

	abstract fetchData(pageOffset: number, pageSize: number, sortColumnIdentifier: string, sortAscend: boolean): Observable<T[]>;

	private updateData() {
		if (this.pageSize === 0) {
			return;
		}
		this.loadingIndication.next(true);
		this.fetchData(this.pageOffset, this.pageSize, this.sortColumnIdentifier, this.sortAscend).subscribe(
			(d) => {
				this.renderData.next(d);
				this.loadingIndication.next(false);
			});
	}

	private updatePageEventSubscription() {
		this.pageEventSubscription.unsubscribe();
		this.pageEventSubscription = (this._paginator ?
			merge(
				this._paginator.page,
				this._paginator.initialized).subscribe((d: PageEvent | void) => {
					this.pageOffset = this._paginator.pageIndex * this._paginator.pageSize;
					this.pageSize = this._paginator.pageSize;
					this.updateData();
				}) :
			Subscription.EMPTY);
	}

	private updateSortChangeSubscription() {
		this.sortChangeSubscription.unsubscribe();
		this.sortChangeSubscription = (this._sort ?
			this._sort.sortChange.subscribe(
				(sortOpt: Sort) => {
					if (!sortOpt) {
						return;
					}
					if (sortOpt.direction === '') {
						this.sortColumnIdentifier = '';
						this.sortAscend = true;
					} else {
						this.sortColumnIdentifier = sortOpt.active || '';
						this.sortAscend = (sortOpt.direction === 'desc') ? false : true;
					}
					this.updateData();
				}) :
			Subscription.EMPTY);
	}

	private updateComponentEventSubscription() {
		this.updatePageEventSubscription();
		this.updateSortChangeSubscription();
	}
}
