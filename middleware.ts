// import { authMiddleware } from "@clerk/nextjs";
 
// export default authMiddleware({
//   publicRoutes: [
//     '/',
//     '/api/webhook',
//     '/question/:id',
//     '/tags',
//     '/tags/:id',
//     '/profile/:id',
//     '/community',
//     '/jobs'
//   ],
//   ignoredRoutes: [
//     '/api/webhook', '/api/chatgpt'
//   ]
// });
 
// export const config = {
//   matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
// };
 


import { NextResponse } from 'next/server';
import { authMiddleware } from '@clerk/nextjs';

export default function middleware(req) {
  const url = req.nextUrl.clone();

  // Define the paths to bypass
  const bypassPaths = [
    '/api/webhook',
    '/api/success',
    '/question/:id',
    '/tags',
    '/tags/:id',
    '/profile/:id',
    '/community',
    '/jobs'
  ];

  // Check if the request path matches any bypass path
  if (bypassPaths.some(path => url.pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Apply Clerk Auth middleware
  return authMiddleware({
    publicRoutes: [
      '/',
      '/api/webhook',
      '/api/success',
      '/question/:id',
      '/tags',
      '/tags/:id',
      '/profile/:id',
      '/community',
      '/jobs'
    ],
    ignoredRoutes: [
      '/api/webhook',
      '/api/success',
      '/api/chatgpt'
    ]
  })(req);
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
