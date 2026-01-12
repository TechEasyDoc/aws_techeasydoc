import Logo from './components/Logo';
import Script from 'next/script';
import BuyMeCoffee from './components/BuyMeCoffee';

export default {
	logo: <Logo />,
	useNextSeoProps() {
		return {
			titleTemplate: '%s – TechEasyDoc',
		};
	},
	head: ({ title, meta }) => {
		const ogTitle = meta?.title || title || 'TechEasyDoc';
		const ogDescription =
			meta?.description ||
			'Making AWS concepts easy and enjoyable to learn';
		const ogImage = 'https://aws.techeasydoc.com/og-image.png';

		return (
			<>
				{/* Dynamic OG Tags */}
				<meta property='og:type' content='article' />
				<meta property='og:title' content={ogTitle} />
				<meta property='og:description' content={ogDescription} />
				<meta property='og:image' content={ogImage} />
				<meta property='og:site_name' content='TechEasyDoc' />

				{/* Dynamic Twitter Tags */}
				<meta name='twitter:card' content='summary_large_image' />
				<meta name='twitter:title' content={ogTitle} />
				<meta name='twitter:description' content={ogDescription} />
				<meta name='twitter:image' content={ogImage} />

				{/* Google Analytics */}
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
			</>
		);
	},
	project: {
		link: 'https://github.com/shuding/nextra',
	},
	feedback: {
		useLink: () => 'null',
		content: null,
	},
	editLink: {
		text: null,
	},
	search: {
		placeholder: 'search post',
	},
	darkMode: false,
	project: {},
	navigation: {
		prev: false,
		next: false,
	},
	footer: {
		text: (
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: '12px',
				}}
			>
				<BuyMeCoffee />
				<span>TechEasyDoc {new Date().getFullYear()} ©</span>
			</div>
		),
	},
};
