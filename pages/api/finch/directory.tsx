import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import redis from '../../../util/redis'
const finchApiUrl = process.env.FINCH_API_URL ?? 'https://api.tryfinch.com'

type FinchDirectoryRes = {
    paging: {
        count: number
        offset: number
    },
    individuals: FinchEmployee[]
}

export default async function Directory(req: NextApiRequest, res: NextApiResponse) {
    console.log(req.method + " /api/finch/directory ");

    if (req.method == 'GET') {
        try {
            const token = await redis.get('current_connection');

            const directoryRes = await axios.request<FinchDirectoryRes>({
                method: 'get',
                url: `${finchApiUrl}/employer/directory`,
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Finch-API-Version': '2020-09-17'
                },
            });

            // Get directory successful, return back to location
            console.log(directoryRes.data)
            return res.status(200).json(directoryRes.data);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ msg: "Error retrieving company directory" })
        }
    }

    return res.status(405).json({ msg: "Method not implemented." })


};