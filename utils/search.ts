// utils/search.ts
import matter from 'gray-matter';
import removeMarkdown from 'remove-markdown';
import { promises as fs } from 'fs';
import path from 'path';

// export interface MatterData {
//     title?: string;
//     date?: string;
//     tags?: string[];
//     description?: string;
//     [key: string]: any;
// }

export interface SearchResult {
    title: string;
    slug: string;
    content: string;
    date?: string;
    tags?: string[];
    description?: string;
    category?: string;
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

export async function listMdxFiles(): Promise<SearchResult[]> {
    const pagesDir = path.join(process.cwd(), 'pages');
    const files = await getMdxFiles(pagesDir);

    const results = await Promise.all(
        files.map(async (filePath) => {
            const relativePath = path.relative(pagesDir, filePath);
            const slug = relativePath
                .replace(/\.mdx?$/, '')
                .replace(/\\/g, '/')
                .replace(/^\/?/, '/');

            const fileContent = await fs.readFile(filePath, 'utf8');
            const { data, content } = matter(fileContent);
            const plainText = removeMarkdown(content);

            return {
                title: data.title || 'Untitled',
                slug,
                content: plainText,
                date: data.date || '1970-01-01', // Fallback for missing dates
                tags: data.tags || [],
                category: data.category || '',
                description: data.description || '',
            };
        })
    );

    // Sort by date (newest first)
    return results.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
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

export interface CategoryInfo {
    name: string;
    slug: string; // First item's slug in this category
    count: number;
}

export async function getCategories(): Promise<CategoryInfo[]> {
    const posts = await listMdxFiles();

    // Group posts by category
    const categoryMap = new Map<string, { slug: string; count: number }>();

    for (const post of posts) {
        if (post.category && post.category.trim() !== '') {
            const category = post.category.trim();
            if (!categoryMap.has(category)) {
                // First post in this category - store its slug
                categoryMap.set(category, { slug: post.slug, count: 1 });
            } else {
                // Increment count for existing category
                const existing = categoryMap.get(category)!;
                existing.count++;
            }
        }
    }

    // Convert to array and sort by name
    return Array.from(categoryMap.entries())
        .map(([name, { slug, count }]) => ({ name, slug, count }))
        .sort((a, b) => a.name.localeCompare(b.name));
}