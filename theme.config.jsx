import Logo from './components/Logo';

export default {
	logo: <Logo />,
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
