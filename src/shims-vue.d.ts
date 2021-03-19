/*
Copyright 2021 Adevinta
*/

declare module '*.vue' {
	import Vue from 'vue';
	export default Vue;
}

declare type GlobalFetch = {
	fetch(input: RequestInfo, init?: RequestInit): Promise<Response>;
};
