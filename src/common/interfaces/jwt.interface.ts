export interface JWTPayloadInterface {
    id?: string;
    email?: string;
    role?: string;
    idToken?: string;
}

export interface JWTRefreshTokenPayloadInterface {
    id?: string;
    idToken?: string;
    refresh?: boolean;
}
