import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Script from 'next/script';

export default function App({ Component, pageProps }: AppProps) {
	return (
		<>
			<Script
				src='https://www.googletagmanager.com/gtag/js?id=G-EDY2ZLQN2J'
				strategy='afterInteractive'
			/>
			<Script id='google-analytics' strategy='afterInteractive'>
				{`
					window.dataLayer = window.dataLayer || [];
					function gtag(){dataLayer.push(arguments);}
					gtag('js', new Date());
					gtag('config', 'G-EDY2ZLQN2J');
				`}
			</Script>
			<Component {...pageProps} />
		</>
	);
}
