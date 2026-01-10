import Logo from './components/Logo';
import Script from 'next/script';

export default {
	logo: <Logo />,
	head: (
		<>
			<Script
				src='https://www.googletagmanager.com/gtag/js?id=G-JR1BBZFR1M'
				strategy='afterInteractive'
			/>
			<Script id='google-analytics' strategy='afterInteractive'>
				{`
					window.dataLayer = window.dataLayer || [];
					function gtag(){dataLayer.push(arguments);}
					gtag('js', new Date());
					gtag('config', 'G-JR1BBZFR1M');
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
		text: <span>TechEasyDoc {new Date().getFullYear()} © </span>,
	},
};
