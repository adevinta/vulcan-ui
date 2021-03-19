/*
Copyright 2021 Adevinta
*/

export default function teamID(): string {
	var qparams = new URL(document.location.toString()).searchParams;
	let team = qparams.get('team_id');
	team = team || '';
	return team;
}
