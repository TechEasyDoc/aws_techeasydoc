import { NextApiRequest, NextApiResponse } from 'next';
import { listMdxFiles } from '../../utils/search';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    try {
        const results = await listMdxFiles();
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get the list of files' });
    }
}