// src/lib/i18n.ts
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { NextRequest, NextResponse } from 'next/server';

// 你的所有支持语言和默认语言，与 next.config.js 中的配置保持一致
let locales = ['zh', 'en', 'my'];
let defaultLocale = 'en';

// 获取请求中的语言偏好
function getLocaleFromHeaders(request: NextRequest) {
  const headers = { 'accept-language': request.headers.get('accept-language') || '' };
  const languages = new Negotiator({ headers }).languages();
  // 根据浏览器偏好匹配支持的语言
  return match(languages, locales, defaultLocale);
}

// 在服务器组件中获取当前语言
export function getLocale() {
  // 对于服务器组件，我们可以直接从 next/headers 获取请求头
  // 注意：在客户端组件中不能直接使用此函数
  const headers = require('next/headers');
  const headersList = headers.headers();
  const acceptLanguage = headersList.get('accept-language');

  if (acceptLanguage) {
    const negotiator = new Negotiator({ headers: { 'accept-language': acceptLanguage } });
    const languages = negotiator.languages();
    return match(languages, locales, defaultLocale);
  }
  return defaultLocale; // 默认语言
}

// 定义中间件，用于路由重定向到正确的语言路径
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 检查路径是否包含支持的语言前缀
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // 如果路径中没有语言前缀，重定向到默认语言路径
  if (pathnameIsMissingLocale) {
    const locale = getLocaleFromHeaders(request); // 从请求头中检测语言
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
  }
}
