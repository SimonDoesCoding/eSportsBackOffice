import { auth } from './auth';

export default auth(() => {
  // Middleware logic runs after auth check
  // User is already authenticated if this runs
  return undefined;
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg).*)'],
};
