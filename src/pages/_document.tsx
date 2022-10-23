import { Head, Html, Main, NextScript } from 'next/document';

export default function document() {
    const isProd = process.env.NODE_ENV === 'production';
    return (
        <Html>
            <title>Time</title>
            <Head>
                {isProd && (
                    <script
                        async
                        defer
                        data-website-id="d64d0f3e-157e-4606-9dd9-2d3ffd1072da"
                        src="https://umami.finndore.dev/umami.js"
                    ></script>
                )}
                <link rel="icon" href="/favicon.ico" />
                <meta
                    property="og:image"
                    content="https://time.finndore.dev/api/og"
                />
                <meta name="twitter:card" content="summary_large_image"></meta>
            </Head>
            <body className=" bg-[#1e2022] text-white ">
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
