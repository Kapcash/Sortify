export default {
  client_id: process.env.client_id,
  client_secret:  process.env.client_secret,
  jwt_key:  process.env.jwt_key,
  scopes:  process.env.scopes,
  SERVER_PORT: process.env.SERVER_PORT || '3000',
  environnement: 'default',
};