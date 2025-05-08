
import { withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge';

// Simple middleware that requires authentication
export default withMiddlewareAuthRequired();

export const config = {
  matcher: ['/dashboard/:path*']
};
