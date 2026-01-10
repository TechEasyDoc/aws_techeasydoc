import { NextApiRequest, NextApiResponse } from 'next';
import { getCategories } from '../../utils/search';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const categories = await getCategories();
        res.status(200).json(categories);
    } catch (error) {
        console.error('Categories error:', error);
        res.status(500).json({ error: 'Failed to get categories' });
    }
}
