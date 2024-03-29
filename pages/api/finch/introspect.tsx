import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import redis from '../../../util/redis'
import { finchApiUrl } from '../../../util/constants';

export default async function Introspect(req: NextApiRequest, res: NextApiResponse) {
    console.log(req.method + " /api/finch/introspect ");

    if (req.method == 'GET') {
        try {
            const keys = await redis.smembers('user_connections');
            var connection_tokens = await Promise.all(keys.map(async (key) => {
                return await redis.lrange(key, 0, -1);
            }))

            const tokenData = await Promise.all(connection_tokens.flat().map(async (token: string) => {
                let data = await axios.request<FinchToken>({
                    method: 'get',
                    url: `${finchApiUrl}/introspect`,
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Finch-API-Version': '2020-09-17'
                    },
                }).then(async (res) => {
                    // TODO: Mask token so it isn't exposed on the frontend client-side.
                    return { token, data: res.data }
                }).catch(async err => {
                    // access token is already invalid (most likely because it was disconnected)                
                    console.log(`invalid token: ${token}.`)
                });

                return await data;
            }))

            // token introspect successful, return back to location
            return res.status(200).json({ data: tokenData, msg: "Success" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ msg: "Error inspecting access token" })
        }
    }

    return res.status(405).json({ msg: "Method not implemented." })
};