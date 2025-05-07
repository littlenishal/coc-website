
import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';

export const GET = handleAuth({
  login: handleLogin({
    returnTo: '/dashboard',
    authorizationParams: {
      audience: 'https://api.captainsofcommerce.org',
      scope: 'openid profile email'
    }
  })
});
