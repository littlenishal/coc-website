
import { withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge';

export default withMiddlewareAuthRequired({
  async onError(error, req) {
    console.error(error);
    return Response.redirect(new URL('/api/auth/login', req.url));
  }
});

export const config = {
  matcher: ['/dashboard/:path*']
};
