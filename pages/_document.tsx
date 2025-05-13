import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
				<title>AWS TechEasyDoc</title>
				<meta name='TechEasyDoc' content='TechEasyDoc blog' />
				{/* <meta
					name='google-site-verification'
					content='dlXvES6EDO1kpDBHpHZb8oCPpCforLp12BIFTolE6nU'
				/> */}
				<meta
					name='keywords'
					content='AWS, AWS Stuffs, AWS tutorial, AWS guide, AWS resources, AWS documentation, AWS services, AWS best practices, AWS tips and tricks, AWS for beginners, AWS for developers, AWS for architects, AWS for DevOps, AWS for data scientists, AWS for machine learning'
				></meta>
				<meta
					name='description'
					content='Learn AWS Stuffs easily and enjoyably with TechEasyDoc. Explore our comprehensive guides, tutorials, and resources to master AWS services and best practices.'
				></meta>

				{/* <OpenGraph
					currentURL='https://fullstackwriter.dev'
					description='FullstackWriter'
					pageTitle='FullstackWriter blog'
					previewImage='https://res.cloudinary.com/dtgbzmpca/image/upload/v1676986003/fullstack_logo1.png'
					siteName='@fullstackwriter'
				/> */}
				<link rel='icon' href='/logoSM.png' type="image/png"/>
			</Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
