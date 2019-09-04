import {
	BehaviorSubject,
	combineLatest,
	merge,
	Observable,
	of as observableOf,
	Subscription,
	Subject,
} from 'rxjs';
import { WrappedDataSource } from './data-source';


export class ExpDataItem {
	public readonly itemName: string;
	constructor(public readonly indexValue: number) {
		const v = indexValue % 3;
		this.itemName = (v === 0) ? `Apple (${indexValue})` : (
			(v === 1) ? `Banana (${indexValue})` : `Cab (${indexValue})`
		);
	}
}

export class ExpDataSource extends WrappedDataSource<ExpDataItem> {
	constructor(private readonly maxItemCount: number) {
		super();
	}

	fetchData(pageOffset: number, pageSize: number): Observable<ExpDataItem[]> {
		const result: ExpDataItem[] = [];
		for (let i = 0; i < pageSize; i++) {
			const idxVal = i + pageOffset;
			if (idxVal >= this.maxItemCount) {
				break;
			}
			const aux = new ExpDataItem(idxVal);
			result.push(aux);
		}
		this.setDataLength(this.maxItemCount);
		return observableOf(result);
	}
}
