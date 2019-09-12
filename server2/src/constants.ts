/*
 * Group all constants used across the server
 */

export const SPOTIFY_URL = 'https://accounts.spotify.com';
export const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';
export const SPOTIFY_ACCOUNT_API_URL = 'https://accounts.spotify.com/api';
export const SPOTIFY_API_URL = 'https://api.spotify.com/v1';

export const AUTH_REDIRECT_URI = (port) => `http://localhost:${port}/connect/callback`;
export const LOGIN_REDIRECT = 'http://localhost:8080/#/login';
