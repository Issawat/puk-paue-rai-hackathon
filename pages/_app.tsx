import { AppProps } from "next/app";
import Head from "next/head";
import { MantineProvider, useMantineTheme } from "@mantine/core";

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <>
      <Head>
        <title>พรรค... เพื่อไร?</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: "light",
          defaultGradient: {
            from: "red",
            to: "blue",
            deg: 90,
          },
        }}
      >
        <Component {...pageProps} />
      </MantineProvider>
    </>
  );
}
