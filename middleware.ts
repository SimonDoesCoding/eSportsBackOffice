import { auth } from './auth';

export default auth((req) => {
  // Middleware logic runs after auth check
  // User is already authenticated if this runs
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg).*)'],
};
