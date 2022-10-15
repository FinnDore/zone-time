import { Head, Html, Main, NextScript } from 'next/document';

export default function document() {
    return (
        <Html>
            <title>Time</title>
            <Head>
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
