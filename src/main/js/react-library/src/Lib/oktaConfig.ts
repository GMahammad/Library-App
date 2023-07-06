export const oktaConfig = {
    clientId: '0oaa6sydudoTmeLB25d7',
    issuer: 'https://dev-14420176.okta.com/oauth2/default',
    redirectUri: 'https://localhost:3000/login/callback',
    scopes: ['openid','profile','email'],
    pkce: true,
    disableHttpsCheck: true
}