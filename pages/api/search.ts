import { NextApiRequest, NextApiResponse } from 'next';
import { searchMdxFiles } from '../../utils/search';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { q } = req.query;

    try {
        if (typeof q !== 'string') throw new Error('Invalid query');
        const results = await searchMdxFiles(q);
        res.status(200).json(results);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Failed to perform search' });
    }
}