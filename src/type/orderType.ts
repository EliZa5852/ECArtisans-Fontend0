export interface Product {
	_id: string;
	seller_id?: string;
	sellerCategory: Array<number>; //商品主要類別
	category: any[];
	isOnshelf: boolean;

	review?: any[];
	reviews?: any[];

	sold: number;
	productName: string;
	type: number[];
	sellerType: any[];
	origin: string;
	ingredient: string;
	introduction?: string;
	format: {
		_id: string;
		title: string;
		price: number;
		cost: number;
		stock: number;
		color: string[];
	}[];
	introduce: string;
	production: string;
	state: boolean;
	evaluate: any[];
	haveStore: string;
	fare: number;
	pay: Array<number>; //1:信用卡付款 2.ATM匯款 3.店到店付費

	keyword?: any[];
	keywords?: any[];
	createAt?: string;
	updateAt?: string;
	image: string[];
}

export interface Order {
	_id: string;
	orderNumber: string;
	date: string;
	products: Product[];
	state: number;
	price: number;
	pay: number;
}

export interface ApiResponse {
	status: string;
	thisShop: Order;
}
