import { IProduct, IOrder, IOrderResult } from '../types';
import { Api, ApiListResponse } from './base/api';

interface IWebLarekApi {
	getItem: (id: string) => Promise<IProduct>;
	getList: () => Promise<IProduct[]>;
	orderItems: (order: IOrder) => Promise<IOrderResult>;
}

class LarekApi extends Api implements IWebLarekApi {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string) {
		super(baseUrl);
		this.cdn = cdn;
	}

	async getList(): Promise<IProduct[]> {
		const data = (await this.get('/product')) as ApiListResponse<IProduct>;
		return data.items.map((item) => ({
			...item,
			image: this.getCdnImagePath(item.image),
		}));
	}

	async getItem(id: string): Promise<IProduct> {
		const item = (await this.get(`/product/${id}`)) as IProduct;
		return {
			...item,
			image: this.getCdnImagePath(item.image),
		};
	}

	async orderItems(order: IOrder): Promise<IOrderResult> {
		const data = (await this.post('/order', order)) as IOrderResult;
		return data;
	}

	private getCdnImagePath(imagePath: string): string {
		return this.cdn + imagePath;
	}
}

export { IWebLarekApi, LarekApi }