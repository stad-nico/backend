export interface JwtPayload {
	readonly user: {
		id: string;
		username: string;
	};
}
