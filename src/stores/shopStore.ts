import { defineStore } from 'pinia';
import { alertStore } from '@/main'; // 導入實例
import {
	type SellerPageType,
	type SellerPageProductType,
	type RecommendShopType,
} from '../type/shopType';
import { getDate } from '@/setup/globalFunction';

import {
	shop, // 58	get  賣家資訊 (seller_id: string)
	shopProducts, // 59	get  賣場商品	 (seller_id: string)
	home_popularProducts, // 27 get 首頁熱銷商品
	home_recommendShops, // 28 get 首頁推薦商家
	home_newProducts, // 29 get 首頁新品推薦
	home_followShops, // 30 get 首頁關注商家
	productAll, // 54	get 商品總覽
} from './api';
import { useAuthStore } from './authStore';
import router from '@/router';

// interface ApiResponse {
// 	status: string;
// 	thisShop: Order;
// }
// https://s3-alpha-sig.figma.com/img/40ae/f695/e5547364fad7cdc20181105b21f13ca9?Expires=1717372800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=E5lf~SCzrEZPaG8NHjip5RNEiifTHGBN~JK-e6Akpy3KdYbeQdVTzPSBCZ5pgk96escSZlka2~dLIGum8ZNcupC9Pg70q2DH5V6NiLR9ZnuC5LaHt-7DmR91Xim~X2U2ujDuYX67GqihFFCUFO2rhGwwPeSWdTXoGcOy-A3RQivFQkS5G0SQIQ5yY9c3-8tSwWqcb6RGdlAnEtDnJas~r3ph-WivS53TdEFzV870EjOgEOcmLX8uz6JPr-U~vt3TAWeW26JLQexAi6v5UgXCFDHuUAch6WuTYzoicvcihnohmCALU6Xa7R4y8xD~wLSva-UAInZ8Phjf1tj1dw-dtQ__

export const useShop = defineStore({
	id: 'shop',
	state: () => ({
		allData: [
			{
				seller_id: '1',
				activies_img: [
					'YWZkZmRnZmRnYXNkaGZhO2RzamdmZGxrZ2pma2wnZ2p3ZXBvaWZ3J29la0pSRmpmJ2RzZmY=',
					'ZHNnZG5iZ2ZuZ2gsbWpoLGdobmRobmhnbg==',
				],
				seller_image:
					'YWZkZmRnZmRnYXNkaGZhO2RzamdmZGxrZ2pma2wnZ2p3ZXBvaWZ3J29la0pSRmpmJ2RzZmY=',
				seller_name: 'lex jewelry',
				seller_info:
					'大家好! 追蹤本商場就送您20%折扣的優惠劵喔! 今後也多多支持lex jewelry!',
				seller_info_date: '20230912',
				discount: 'FIRSTSALE',
				products: [
					{
						products_id: '1',
						products_name: '當日出貨鞋子防水收納袋加厚升級版',
						products_images:
							'YWZkZmRnZmRnYXNkaGZhO2RzamdmZGxrZ2pma2wnZ2p3ZXBvaWZ3J29la0pSRmpmJ2RzZmY=',
						seller_name: '慢生活品味館',
						price: 100,
						total_sales: 25,
						discount: '免運券',
						star: 4.3,
					},
				],
			},
		] as unknown as SellerPageType[],
		sellerHomeData: {} as SellerPageType,
		sellerProductsData: [] as SellerPageProductType[],
		recommendShopData: [] as RecommendShopType[],
		followShopData: [] as RecommendShopType[],
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
		// 獲取首頁推薦商家
		async getRecommendShops(): Promise<void> {
			try {
				// 固定抓6 筆
				await home_recommendShops(16)
					.then(res => {
						// return(res.data)
						this.recommendShopData = res.data;
					})
					.catch(err => {
						alertStore.error(err.response.data.message);
					});
			} catch (error) {
				alertStore.error('showError');
			}
		},
		// 獲取首頁熱銷商品
		async getPopularProducts(): Promise<void> {
			try {
				// 固定抓16 筆
				await home_popularProducts(16)
					.then(res => {
						// return(res.data)
						this.sellerProductsData = res.data;
					})
					.catch(err => {
						alertStore.error(err.response.data.message);
					});
			} catch (error) {
				alertStore.error('showError');
			}
		},
		// 獲取首頁新品推薦
		async getNewProducts(): Promise<void> {
			try {
				// 固定抓8 筆
				await home_newProducts(8)
					.then(res => {
						this.sellerProductsData = res.data;
					})
					.catch(err => {
						alertStore.error(err.response.data.message);
					});
			} catch (error) {
				alertStore.error('showError');
			}
		},
		// 獲取關注商家資訊
		async getFollowShops(): Promise<void> {
			try {
				const authStore = useAuthStore();
				if (authStore.accountType === 'user') {
					await home_followShops(authStore.token)
						.then(res => {
							this.followShopData = res.data;
						})
						.catch(err => {
							// alertStore.error(err.response.data.message);
							this.followShopData = [];
						});
					}
					else{
						console.log(authStore.accountType)
					}
			} catch (error) {
				alertStore.error('showError');
			}
		},
		// 獲取所有賣家頁面資訊
		async getShop(seller_id: string): Promise<void> {
			try {
				await shop(seller_id)
					.then(res => {
						this.sellerHomeData = res.data[0];
					})
					.catch(err => {
						alertStore.error(err.response.data.message);
					});
			} catch (error) {
				alertStore.error('showError');
			}
		},
		// 獲取所有賣家頁面資訊
		async getShopProducts(seller_id: string): Promise<void> {
			try {
				await shopProducts(seller_id)
					.then(res => {
						this.sellerProductsData = res.data;
					})
					.catch(err => {
						this.sellerProductsData = []; //避免未覆蓋掉上一筆查的商品
						alertStore.error(err.response.data.message);
					});
			} catch (error) {
				alertStore.error('showError');
			}
		},
		// 獲取商品分類的所有商品
		async getAllProductsByCategoryID(categoryID:string): Promise<void> {
			try {
				// 固定抓8 筆
				await productAll(categoryID)
					.then(res => {
						this.sellerProductsData = res.data;
					})
					.catch(err => {
						alertStore.error(err.response.data.message);
					});
			} catch (error) {
				alertStore.error('showError');
			}
		},
	},
});
