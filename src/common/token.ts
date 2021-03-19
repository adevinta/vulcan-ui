/*
Copyright 2021 Adevinta
*/

import { Config } from './config';

const cookieName = 'devcon-token';

export default function tokenProvider(config: Config): () => string {
	return () => token(config.askCredentials);
}

export function token(ask: boolean): string {
	let token = getCookie(cookieName);
	if (!token && ask) {
		token = window.prompt('enter token');
		if (token) {
			setTokenCookie(token);
		} else {
			throw new Error('Unable to get the cookie');
		}
	}
	if (!token) {
		token = '';
	}
	token = 'Bearer ' + token;
	return token.toString();
}

function getCookie(name: String): String | null {
	var cvalues = document.cookie.split(';');
	let cname = name + '=';
	var found = cvalues.filter((cookie) => {
		var trimmed = cookie.trim();
		if (trimmed.startsWith(cname)) {
			return true;
		}
		return false;
	});
	if (found.length > 0) {
		var parts = found[0].split('=');
		if (parts.length > 1) {
			return parts[1];
		}
	}
	return null;
}

function setTokenCookie(token: String) {
	let date = new Date();
	date.setFullYear(date.getFullYear() + 1);
	document.cookie = cookieName + '=' + token + '; path=/; expires=' + date.toString();
}
