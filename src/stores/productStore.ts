import { defineStore } from 'pinia';
import { alertStore } from '@/main'; // 導入實例
import { type DetailedOrderProductType, type DetailedOrderType } from '../type/orderType';
import { getDate } from '@/setup/globalFunction';

import {
	sellerProductAll, // 31	get  賣家顯示所有商品管理 (token: string)
	sellerProductData, // 32	get 賣家商品管理(數量)	 (	seller_id: string, page: number, qty: number, category: string, token: string)
	sellerProduct, // 33	get  賣家單一商品管理 (product_id: string, token: string)
	sellerProductNew, // 34	post  賣家新增單一商品 (token: string)
	sellerProductEdit, // 35	put 賣家刪除單一優惠劵 (product_id: string, token: string)
	sellerProductDelete, // 36  Delete 賣家刪除單一商品(product_id: string, token: string)
} from './api';
import { useAuthStore } from './authStore';
import router from '@/router';

// interface ApiResponse {
// 	status: string;
// 	thisShop: Order;
// }
// https://s3-alpha-sig.figma.com/img/40ae/f695/e5547364fad7cdc20181105b21f13ca9?Expires=1717372800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=E5lf~SCzrEZPaG8NHjip5RNEiifTHGBN~JK-e6Akpy3KdYbeQdVTzPSBCZ5pgk96escSZlka2~dLIGum8ZNcupC9Pg70q2DH5V6NiLR9ZnuC5LaHt-7DmR91Xim~X2U2ujDuYX67GqihFFCUFO2rhGwwPeSWdTXoGcOy-A3RQivFQkS5G0SQIQ5yY9c3-8tSwWqcb6RGdlAnEtDnJas~r3ph-WivS53TdEFzV870EjOgEOcmLX8uz6JPr-U~vt3TAWeW26JLQexAi6v5UgXCFDHuUAch6WuTYzoicvcihnohmCALU6Xa7R4y8xD~wLSva-UAInZ8Phjf1tj1dw-dtQ__

// 定義類別
const categoryMapping: Record<number, string> = {
	1: '娛樂',
	2: '服飾',
	3: '3C產品',
	4: '食品',
	5: '家具',
	6: '運動用品',
	7: '寵物用品',
	8: '生活用品',
	9: '清潔用品',
	10: '其他'
};

// 從數字轉成對應類別
function convertCategoryNumbersToNames(categoryNumbers: Array<number>): string {
	const categories = categoryNumbers.map(number => categoryMapping[number]);
	return categories.length === 1 ? categories[0] : categories.join(', ');
}

export const useProduct = defineStore({
	id: 'product',
	state: () => ({
		allData: [] as Array<DetailedOrderProductType>, // 賣家所有商品
		data: {
			_id: '',
			seller_id: '',
			sellerCategory: [], //商品主要類別
			category: [],
			isOnshelf: null,

			review: [],
			reviews: [],

			sold: null,
			productName: '',
			type: [],
			sellerType: [],
			origin: '',
			ingredient: '',
			introduction: '',
			format: {
				_id: '',
				title: '',
				price: null,
				cost: null,
				stock: null,
				color: [],
			},
			introduce: '',
			production: '',
			state: null,
			evaluate: [],
			haveStore: '',
			fare: null,
			pay: [], //1:信用卡付款 2.ATM匯款 3.店到店付費

			keyword: [],
			keywords: [],
			createAt: '',
			updateAt: '',
			image: [],
		} as unknown as DetailedOrderProductType, // 賣家所有訂單
		isLoading: false, // 請求狀態
		accountType: '',
	}),
	getters: {
		// // 獲取所有訂單
		// gettingAllOrders(state) {
		// 	return state.allOrders;
		// },
		// // 獲取單筆訂單
		// gettingSingleOrder(state) {
		// 	return state.oneOrder;
		// },
	},
	actions: {
		async setAccountType(): Promise<void> {
			const currentPagePath = window.location.hash;
			if (currentPagePath.includes('/seller')) {
				this.accountType = 'seller';
			} else if (currentPagePath.includes('/user')) {
				this.accountType = 'user';
			}
		},
		// 獲取所有商品
		async getProductsAll(token: string): Promise<void> {
			try {
				await this.setAccountType();
				let res;
				if (this.accountType === 'seller') {
					const authStore = useAuthStore();
					await sellerProductAll(authStore.token)
						.then(res => {
							// 轉換 sellerCategory 
							const processedProducts = res.products.map((product: { sellerCategory: number[]; }) => ({
								...product,
								sellerCategory: convertCategoryNumbersToNames(product.sellerCategory)
							}));
						// 更新狀態
						this.allData = processedProducts;
						console.log(processedProducts)

						})
						.catch(err => {
							alertStore.error(err.response.data.message);
						});
				}
			} catch (error) {
				alertStore.error('showError');
			}
		},
		
		// 獲取單一商品
		async getProduct(product_id: string, token: string): Promise<void> {
			try {
				await this.setAccountType();
				let res;
				if (this.accountType === 'seller') {
					const authStore = useAuthStore();
					await sellerProduct(product_id, authStore.token)
						.then(res => {
							const isData = res.products[0];
							// isData.startDate = getDate(isData.startDate);
							// isData.endDate = getDate(isData.endDate);
							// isData.type = parseInt(isData.type);
							// isData.discountConditions = parseInt(isData.discountConditions);
							this.data = isData;
						})
						.catch(err => {
							alertStore.error(err.response.data.message);
						});
				}
			} catch (error) {
				alertStore.error('showError');
			}
		},
		// 新增 單筆 商品
		async newProduct(data: any): Promise<void> {
			try {
				await this.setAccountType();
				const authStore = useAuthStore();
				let res;
				// data.startDate = getISO(data.startDate, 'start');
				// data.endDate = getISO(data.endDate, 'end');
				data.isEnabled = true;
				if (data.productType === 0) delete data.productChoose;
				if (data.type === 0) delete data.percentage;
				alertStore.success('productDelete');
				console.log('新增', data);
				console.log(this.accountType);
				if (this.accountType === 'seller') {
					await sellerProductNew(data, authStore.token)
						.then(res => {
							console.log(res);
						})
						.catch(err => {
							console.log(err);
							// alertStore.error(err.response.data.message);
						});
				}
			} catch (error) {
				alertStore.error('showError');
			}
		},
		// 更新 單筆 商品
		async getProductEdit(data: any): Promise<void> {
			try {
				await this.setAccountType();
				const authStore = useAuthStore();
				console.log('更新前發送的authStore.token', authStore.token); //可以使用
				console.log('更新前發送的data._id', this.data._id); //可以使用
				let res;
				// data.startDate = getISO(data.startDate, 'start');
				// data.endDate = getISO(data.endDate, 'end');

				// if (data.productType === 0) delete data.productChoose;
				// if (data.type === 0) delete data.percentage;
				console.log('更新前發送的', data);
				if (this.accountType === 'seller' && this.data._id) {
					await sellerProductEdit(
						this.data._id,
						JSON.stringify(data),
						authStore.token
					)
						.then(res => {
							console.log(res);
							alertStore.success('renewOK');
						})
						.catch(err => {
							alertStore.error(err.response.data.message);
						});
				}
			} catch (error) {
				alertStore.error('showError');
			}
		},
		// 刪除 單筆 商品
		async deleteProduct(): Promise<void> {
			try {
				await this.setAccountType();
				const authStore = useAuthStore();
				if (this.accountType === 'seller' && this.data._id) {
					await sellerProductDelete(this.data._id, authStore.token)
						.then(res => {
							alertStore.success('productDelete');
							router.go(-1);
						})
						.catch(err => {
							alertStore.error(err.response.data.message);
						});
				}
			} catch (error) {
				alertStore.error('showError');
			}
		},
	},
});
