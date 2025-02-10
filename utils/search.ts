// utils/search.ts
import matter from 'gray-matter';
import removeMarkdown from 'remove-markdown';
import { promises as fs } from 'fs';
import path from 'path';

export interface MatterData {
    title?: string;
    date?: string;
    [key: string]: any;
}

export interface SearchResult {
    title: string;
    slug: string;
    content: string;
    date?: string;
}

export async function searchMdxFiles(query: string): Promise<SearchResult[]> {
    const pagesDir = path.join(process.cwd(), 'pages');
    const files = await getMdxFiles(pagesDir);

    const results = await Promise.all(
        files.map(async (filePath) => {
            const relativePath = path.relative(pagesDir, filePath);
            const slug = relativePath
                .replace(/\.mdx?$/, '')
                .replace(/\\/g, '/') // Convert Windows paths to URL format
                .replace(/^\/?/, '/');

            const fileContent = await fs.readFile(filePath, 'utf8');
            const { data, content } = matter(fileContent);
            const plainText = removeMarkdown(content);

            return {
                title: data.title || 'Untitled',
                slug,
                content: plainText,
                date: data.date,
            };
        })
    );

    const normalizedQuery = query.toLowerCase();
    return results.filter(post => {
        const searchContent = `${post.title} ${post.content}`.toLowerCase();
        return searchContent.includes(normalizedQuery);
    });
}

async function getMdxFiles(dir: string): Promise<string[]> {
    const dirents = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
        dirents.map(dirent => {
            const res = path.resolve(dir, dirent.name);
            return dirent.isDirectory() ? getMdxFiles(res) : res;
        })
    );
    return Array.prototype.concat(...files)
        .filter(file => /\.mdx?$/.test(file));
}