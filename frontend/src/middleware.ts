// src/middleware.ts
import { middleware } from './lib/i18n';

export const config = {
  // 匹配所有非文件路径和API路由
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

export default middleware;
