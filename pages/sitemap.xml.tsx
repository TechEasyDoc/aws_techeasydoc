import { GetServerSideProps } from 'next';
import { format } from 'date-fns';
import { listMdxFiles, SearchResult } from '@/utils/search';

export default function Sitemap() {
	return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
	const data = await listMdxFiles();

	if (!data) {
		res.statusCode = 404;
		res.end();
		return { props: {} };
	}

	const xml = generateSiteMap(data);

	res.setHeader('Content-Type', 'application/xml');
	res.write(xml);
	res.end();

	return { props: {} };
};

function generateSiteMap(posts: SearchResult[]): string {
	const baseUrl = 'https://aws.techeasydoc.com';

	const urls = posts
		.map((post) => {
			const lastMod = post.date
				? format(new Date(post.date), 'yyyy-MM-dd')
				: '';
			return `
    <url>
      <loc>${baseUrl}${post.slug}</loc>
      <lastmod>${lastMod}</lastmod>
    </url>`;
		})
		.join('');

	return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>${urls}
</urlset>`;
}
