import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html lang='en'>
			<Head>
				<title>AWS TechEasyDoc</title>
				<meta
					name='description'
					content='Learn AWS Stuffs easily and enjoyably with TechEasyDoc. Explore our comprehensive guides, tutorials, and resources to master AWS services and best practices.'
				/>
				<meta
					name='keywords'
					content='AWS, AWS Stuffs, AWS tutorial, AWS guide, AWS resources, AWS documentation, AWS services, AWS best practices, AWS tips and tricks, AWS for beginners, AWS for developers, AWS for architects, AWS for DevOps, AWS for data scientists, AWS for machine learning'
				/>

				{/* Open Graph / Facebook */}
				<meta property='og:type' content='website' />
				<meta property='og:url' content='https://techeasydoc.com/' />
				<meta
					property='og:title'
					content='AWS TechEasyDoc - AWS Made Easy'
				/>
				<meta
					property='og:description'
					content='Learn AWS Stuffs easily and enjoyably with TechEasyDoc. Explore our comprehensive guides, tutorials, and resources to master AWS services and best practices.'
				/>
				<meta
					property='og:image'
					content='https://techeasydoc.com/og-image.png'
				/>
				<meta property='og:site_name' content='TechEasyDoc' />

				{/* Twitter Card */}
				<meta name='twitter:card' content='summary_large_image' />
				<meta name='twitter:url' content='https://techeasydoc.com/' />
				<meta
					name='twitter:title'
					content='AWS TechEasyDoc - AWS Made Easy'
				/>
				<meta
					name='twitter:description'
					content='Learn AWS Stuffs easily and enjoyably with TechEasyDoc. Explore our comprehensive guides, tutorials, and resources to master AWS services and best practices.'
				/>
				<meta
					name='twitter:image'
					content='https://techeasydoc.com/og-image.png'
				/>

				<link rel='icon' href='/logoSM.png' type='image/png' />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
