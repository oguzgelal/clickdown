import type { AppProps } from "next/app";
import Head from "next/head";
import "../common/global.css";
// https://bootswatch.com/
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootswatch/dist/lux/bootstrap.min.css";
// import "bootswatch/dist/superhero/bootstrap.min.css";
import "bootswatch/dist/cosmo/bootstrap.min.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>ClickDown</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
