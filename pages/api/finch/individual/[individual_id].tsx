import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import redis from '../../../../util/redis'
import { finchApiUrl } from '../../../../util/constants'

type FinchIndividualRes = {
    responses: {
        individual_id: string,
        code: number
        body: FinchIndividual
    }[]
}

/****************
  NOTE: Right now, this endpoint only handles passing a single individual_id. 
  Finch has the possibility to batch multiple pay-statements together in a single request, 
  but this sample application does not implement this yet. 
*****************/
export default async function Individual(req: NextApiRequest, res: NextApiResponse) {
    const { individual_id } = req.query;
    console.log(req.method + ` /api/finch/individual/${individual_id}`);

    if (req.method == 'GET') {
        try {
            const token = await redis.get('current_connection');
            const individualRes = await axios.request<FinchIndividualRes>({
                method: 'post',
                url: `${finchApiUrl}/employer/individual`,
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Finch-API-Version': '2020-09-17'
                },
                data: {
                    requests: [
                        { individual_id: individual_id }
                    ]
                }
            });

            // Get individual info successful, return back to location
            return res.status(200).json(individualRes.data.responses[0].body);
        } catch (error) {
            //console.error(error);
            return res.status(500).json("Error retrieving individual")
        }
    }

    return res.status(405).json({ msg: "Method not implemented." })


};