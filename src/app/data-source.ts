import { DataSource, CollectionViewer } from '@angular/cdk/collections';
import {
	BehaviorSubject,
	combineLatest,
	merge,
	Observable,
	of as observableOf,
	Subscription,
	Subject,
} from 'rxjs';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { map } from 'rxjs/operators';

export abstract class WrappedDataSource<T> extends DataSource<T> {
	private readonly renderData = new BehaviorSubject<T[]>([]);

	private pageOffset: number = 0;
	private pageSize: number = 0;

	private collectionViewChangeSubscription = Subscription.EMPTY;

	get paginator(): MatPaginator | null { return this._paginator; }
	set paginator(paginator: MatPaginator | null) {
		this._paginator = paginator;
		this.updatePageEventSubscription();
	}
	private _paginator: MatPaginator | null;

	private pageEventSubscription = Subscription.EMPTY;


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
	}

	setDataLength(dataLength: number) {
		if (this._paginator) {
			this._paginator.length = dataLength;
		}
	}

	abstract fetchData(pageOffset: number, pageSize: number): Observable<T[]>;

	private updateData() {
		if (this.pageSize === 0) {
			return;
		}
		this.fetchData(this.pageOffset, this.pageSize).subscribe(
			(d) => this.renderData.next(d)
		);
	}

	private updatePageEventSubscription() {
		this.pageEventSubscription.unsubscribe();
		this.pageEventSubscription = (this._paginator ?
			merge(
				this._paginator.page,
				this._paginator.initialized).subscribe((d) => {
					this.pageOffset = this._paginator.pageIndex * this._paginator.pageSize;
					this.pageSize = this._paginator.pageSize;
					this.updateData();
			}) :
			Subscription.EMPTY);
	}

	private updateComponentEventSubscription() {
		this.updatePageEventSubscription();
	}
}
