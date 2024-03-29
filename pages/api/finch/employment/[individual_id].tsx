import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import redis from '../../../../util/redis'
import { finchApiUrl } from '../../../../util/constants'

type FinchEmploymentRes = {
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
export default async function Employment(req: NextApiRequest, res: NextApiResponse) {
    const { individual_id } = req.query;
    console.log(req.method + ` /api/finch/employment/${individual_id}`);

    if (req.method == 'GET') {
        try {

            const token = await redis.get('current_connection');
            const employmentRes = await axios.request<FinchEmploymentRes>({
                method: 'post',
                url: `${finchApiUrl}/employer/employment`,
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

            // Get individual employment info successful, return back to location
            return res.status(200).json(employmentRes.data.responses[0].body);
        } catch (error) {
            //console.error(error);
            return res.status(500).json("Error retrieving individual")
        }
    }

    return res.status(405).json({ msg: "Method not implemented." })


};