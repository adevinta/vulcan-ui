/*
Copyright 2021 Adevinta
*/

interface fileConfig {
	api_url: string;
	ask_credentials: boolean;
	static_labels: string[];
	teams_crud: boolean;
}

export class Config {
	cfg: fileConfig = {
		api_url: '',
		ask_credentials: false,
		static_labels: [],
		teams_crud: false,
	};
	constructor(cfg: fileConfig) {
		this.cfg = cfg;
	}

	get apiUrl(): string {
		const url = this.cfg.api_url;
		if (url.endsWith('/')) {
			return url.substr(0, url.length - 1);
		}
		return url;
	}

	get askCredentials(): boolean {
		return this.cfg.ask_credentials;
	}

	get staticLabels(): string[] {
		return this.cfg.static_labels;
	}

	get teamsCrud(): boolean {
		return this.cfg.teams_crud;
	}
}

export default async function loadConfig(): Promise<Config> {
	const url = `/config.json?q=` + new Date().getTime(); // Avoid caching conflict
	const resp = await fetch(url);
	if (resp.status === 200) {
		const ret = await resp.json();
		const cfg = ret as fileConfig;
		return new Config(cfg);
	}
	throw new Error(`Invalid status code getting config file: ${resp.statusText}`);
}
