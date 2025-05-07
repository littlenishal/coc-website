
import { withMiddleware } from '@auth0/nextjs-auth0';

export default withMiddleware({
  async onError(error, req, res) {
    console.error(error);
    return res.redirect('/api/auth/login');
  }
});

export const config = {
  matcher: ['/dashboard/:path*']
};
