
import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';

const handler = handleAuth({
  login: handleLogin({
    returnTo: '/dashboard',
    authorizationParams: {
      audience: 'https://api.captainsofcommerce.org',
      scope: 'openid profile email'
    }
  })
});

export { handler as GET, handler as POST };
