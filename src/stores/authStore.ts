import { defineStore } from 'pinia';
import router from '@/router/index';
import { sellerLogin, userLogin } from './api';
import { alertStore } from '@/main'; // 導入實例

interface UserDataType {
	mail: string;
	password: string;
}

function initialState() {
	return {
			token: '',
			id: '',
			isLoggedIn: false,
			isLoading: false,
			accountType: '',
	};
}

export const useAuthStore = defineStore({
	id: 'auth',
	state: () => initialState(),
	actions: {
		async login(data: UserDataType): Promise<void> {
			this.reset();
			await this.setAccountType();
			if (data.mail !== '' && data.password !== '') {
				if (this.accountType !== '') {
					this.isLoading = true;
					try {
						await this.setAccountType();
						// const { user } = await sellerLogin(data);
						let res;
						if (this.accountType === 'seller') {
							res = await sellerLogin(data);
						} else if (this.accountType === 'user') {
							res = await userLogin(data);
						}
						const { user } = res;
						await this.handleLoginSuccess(user);
					} catch (error) {
						await this.handleLoginError(error);
					} finally {
						this.isLoading = false;
					}
				} else {
					alertStore.error('找不到路徑');
				}
			} else {
				alertStore.error('帳號密碼不可為空');
			}
		},
		async setAccountType(): Promise<void> {
			const currentPagePath = window.location.href;
			if (currentPagePath.includes('/seller')) {
				this.accountType = 'seller';
			} else if (currentPagePath.includes('/user')) {
				this.accountType = 'user';
			}
		},
		async handleLoginSuccess(user: any): Promise<void> {
			// 如果已經有登入狀態代表可能是買家或商家身份進入沒有權限的頁面被router返回重新登入
			if (this.isLoggedIn && this.accountType !== '') {
				this.reset();
			} else {
				this.isLoggedIn = true;
				alertStore.success('logIn');
			}
			this.token = user.token;
			this.id = JSON.parse(atob(user.token.split('.')[1])).id;
			// 判斷account身份為商家還是買家，進入主頁
			const nextPage =
				this.accountType === 'seller' ? 'SellerOverview' : 'UserProfile';
			router.push({ name: nextPage });
		},
		async handleLoginError(error: any): Promise<void> {
			console.error('Login error:', error);
			let errorMessage = '登入失敗';
			if (error.response && error.response.status === 500) {
				errorMessage = '伺服器錯誤，請稍後再試;信箱不正確';
			} else if (
				error.response &&
				error.response.data &&
				error.response.data.message
			) {
				errorMessage = error.response.data.message;
			}
			alertStore.error(errorMessage);
		},
		logout(): void {
			this.isLoggedIn = false;
			this.reset();
			localStorage.removeItem('auth');
			
			// 返回登入畫面，判斷account身份為商家還是買家
			const nextPage = this.accountType === 'seller' ? 'SellerHome' : 'Index';
			router.push({ name: nextPage });
		},
		reset(): void {
			Object.assign(this, initialState());
		},
		cancel(): void {
			this.reset();
			alertStore.success('取消動作');
		},
	},
	persist: true,
});
