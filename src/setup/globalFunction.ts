import { type App } from 'vue';
import router from '@/router';

// 前往??
export function go(path: string | Record<string, any>): void {
	router.push(path);
}

// 改變網站 title 的名稱
export function title(text: string): string {
	document.title = text;
	return text;
}

// 2024-12-10T04:45:14.835Z 轉成 2024-12-10
export function getDate(isoDate: string | null) {
	if (isoDate) {
		const date = new Date(isoDate);
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份是從0開始的，所以要加1
		const day = String(date.getDate()).padStart(2, '0');

		return `${year}-${month}-${day}`;
	}
	return;
}
// 將 Date 對象轉換為 ISO 字符串
export function getISO(
	isoDate: string | Date | null,
	typeDate: 'start' | 'end'
): string | Date {
	if (isoDate && typeof isoDate === 'string') {
		let date;
		if (typeDate === 'start') {
			date = new Date(isoDate);
			date.setUTCHours(0, 0, 0, 0);
		}
		if (typeDate === 'end') {
			date = new Date(isoDate);
			date.setUTCHours(23, 59, 59, 999);
		}
		if (date) return date;
	}
	return isoDate as string;
}

// 全預註冊
const global = {
	install(app: App) {
		app.config.globalProperties.$go = go;
		app.provide('go', go);

		app.config.globalProperties.$title = title;
		app.provide('title', title);

		app.config.globalProperties.$getDate = getDate;
		app.provide('getDate', getDate);
	},
};

export default global;
