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
	head: (
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
		</>
	),
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
