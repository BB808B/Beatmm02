// src/app/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="zh">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Discover the best Vietnamese drum DJ music in Myanmar" />
        <meta name="keywords" content="Myanmar, DJ, Music, Vietnamese drum, Platform" />
        <meta name="author" content="Myanmar DJ Platform" />
        
        <link rel="icon" href="/favicon.ico" />
        
        {/* 字体链接 */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
