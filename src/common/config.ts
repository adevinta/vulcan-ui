/*
Copyright 2021 Adevinta
*/

interface fileConfig {
	api_url: string;
	ask_credentials: boolean;
}

export class Config {
	cfg: fileConfig = {
		api_url: '',
		ask_credentials: false
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
}

export default async function loadConfig(): Promise<Config> {
	const url = `/config.json`;
	const resp = await fetch(url);
	if (resp.status === 200) {
		const ret = await resp.json();
		const cfg = ret as fileConfig;
		return new Config(cfg);
	}
	throw new Error(`Invalid status code getting config file: ${resp.statusText}`);
}
