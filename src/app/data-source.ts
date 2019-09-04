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

	private collectionViewChangeSubscription: Subscription|null = null;

	private pageOffset: number = 0;
	private pageSize: number = 10;

	connect(collectionViewer: CollectionViewer): Observable<T[]> {
		if (this.collectionViewChangeSubscription) {
			this.collectionViewChangeSubscription.unsubscribe();
		}
		this.collectionViewChangeSubscription = collectionViewer.viewChange.subscribe((rng) => {
			console.log(`view-change: ${rng.start} - ${rng.end}`);
		});
		this.updateData();
		return this.renderData.asObservable();
	}

	disconnect(collectionViewer: CollectionViewer): void {
		if (this.collectionViewChangeSubscription) {
			this.collectionViewChangeSubscription.unsubscribe();
		}
		this.collectionViewChangeSubscription = null;
	}

	abstract fetchData(pageOffset: number, pageSize: number): Observable<T[]>;

	private updateData() {
		this.fetchData(this.pageOffset, this.pageSize).subscribe(
			(d) => this.renderData.next(d)
		);
	}
}
