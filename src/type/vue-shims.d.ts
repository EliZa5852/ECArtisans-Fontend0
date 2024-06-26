// vue-shims.d.ts
import { ComponentCustomProperties } from 'vue';

declare module 'vue' {
	interface ComponentCustomProperties {
		$go: (path: string | Object) => any;
		$title: (text: string) => any;
		$getDate: (date: string | null) => string | void;
		$dayAndToDay: (
			text: string | null | Date,
			isType: '>' | '<' | '<=' | '>=' | '='
		) => boolean;
	}
}
