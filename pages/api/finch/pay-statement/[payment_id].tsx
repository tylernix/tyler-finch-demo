import axios, { AxiosError, AxiosResponse } from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import redis from '../../../../util/redis'
const finchApiUrl = process.env.FINCH_API_URL ?? 'https://api.tryfinch.com'

/****************
  NOTE: Right now, this endpoint only handles passing a single pay-statement. 
  Finch has the possibility to batch multiple pay-statements together in a single request, 
  but this sample application does not implement this yet. 
*****************/
export default async function PayStatement(req: NextApiRequest, res: NextApiResponse) {
    const { payment_id } = req.query;
    console.log(req.method + ` /api/finch/pay-statement/${payment_id}`);

    if (req.method == 'GET') {
        const token = await redis.get('current_connection');

        const axiosRes = await axios.request({
            method: 'post',
            url: `${finchApiUrl}/employer/pay-statement`,
            headers: {
                Authorization: `Bearer ${token}`,
                'Finch-API-Version': '2020-09-17'
            },
            data: {
                requests: [
                    { payment_id: payment_id }
                ]
            }
        }).then(async (response: AxiosResponse) => {
            //console.log(response?.data)
            return res.status(200).json(response?.data);
        }).catch((err: AxiosError) => {
            //console.log(err.response?.data)
            switch (err.response?.status) {
                case 400:
                    return res.status(400).json(err.response?.data)
                case 401:
                    return res.status(401).json(err.response?.data)
                case 501:
                    return res.status(501).json(err.response?.data)
                default:
                    return res.status(500).json("Error retrieving information")
            }
        });
        return axiosRes
    }

    return res.status(405).json({ msg: "Method not implemented." })


};