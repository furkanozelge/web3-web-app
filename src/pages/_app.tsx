import type { AppProps } from "next/app";
// import "../../.semantic/dist/semantic.min.css";
import "../styles/main.scss";

import CeramicProvider from "components/site/context/CeramicProvider";
import { appWithTranslation } from "next-i18next";
import Head from "next/head";
import { NextPageWithLayout } from "types";

import { Web3Provider } from "@ethersproject/providers";
import { Web3ReactProvider } from "@web3-react/core";
import AuthGuard from "components/site/guard/AuthGuard";
import { Provider } from "react-redux";
import { store } from "store";
import { AuthHandlerProvider } from "components/site/context/AuthHandlerProvider";

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
	const getLayout = Component.getLayout ?? ((page: any) => page);

	function getLibrary(provider: any) {
		return new Web3Provider(provider);
	}

	return (
		<Web3ReactProvider getLibrary={getLibrary}>
			<Provider store={store}>
				<AuthHandlerProvider>
					<CeramicProvider>
						<Head>
							<title>Index.as</title>
							{/* <link
								rel="preload"
								href="/fonts/Freizeit-Bold.woff"
								as="font"
								type="font/woff"
								crossOrigin="anonymous"
							/>
							<link
								rel="preload"
								href="/fonts/Freizeit-Regular.woff"
								as="font"
								type="font/woff"
								crossOrigin="anonymous"
							/>
							<link
								rel="preload"
								href="/fonts/Roquefort-Standard.woff"
								as="font"
								type="font/woff"
								crossOrigin="anonymous"
							/>
							<link
								rel="preload"
								href="/fonts/Inter-Bold.otf"
								as="font"
								type="font/otf"
								crossOrigin="anonymous"
							/>
							<link
								rel="preload"
								href="/fonts/Inter-ExtraBold.otf"
								as="font"
								type="font/otf"
								crossOrigin="anonymous"
							/>
							<link
								rel="preload"
								href="/fonts/Inter-Light.otf"
								as="font"
								type="font/otf"
								crossOrigin="anonymous"
							/>
							<link
								rel="preload"
								href="/fonts/Inter-Medium.otf"
								as="font"
								type="font/otf"
								crossOrigin="anonymous"
							/>
							<link
								rel="preload"
								href="/fonts/Inter-Regular.otf"
								as="font"
								type="font/otf"
								crossOrigin="anonymous"
							/>
							<link
								rel="preload"
								href="/fonts/Inter-SemiBold.otf"
								as="font"
								type="font/otf"
								crossOrigin="anonymous"
							/> */}
							<link rel="stylesheet preload prefetch" as="style" href="/fonts/fonts.css" type="text/css" />
							<meta name="title" content="Index.as" />
							<link rel="shortcut icon" href="/favicon-white.png" />
							<meta
								name="description"
								content="Share curated links about any topic as a searchable index."
							></meta>
						</Head>
						{Component.requireAuth ? (
							<AuthGuard>
								{getLayout(<Component {...pageProps} />)}
							</AuthGuard>
						) : (
							getLayout(<Component {...pageProps} />)
						)}
					</CeramicProvider>
				</AuthHandlerProvider>
			</Provider>
		</Web3ReactProvider>
	);
}

export default appWithTranslation(MyApp as any);
