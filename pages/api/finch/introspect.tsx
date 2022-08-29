import axios from 'axios'
import Redis from 'ioredis'
import type { NextApiRequest, NextApiResponse } from 'next'

// TODO: make this into a react hook
let redis = new Redis(process.env.REDIS_URL ?? '');

// TODO: put this into a @types file
type FinchToken = {
    client_id: string,
    company_id: string,
    products: string[],
    username: string,
    payroll_provider_id: string,
    manual: boolean
}

export default async function Introspect(req: NextApiRequest, res: NextApiResponse) {
    console.log(req.method + " /api/finch/introspect ");

    if (req.method == 'GET') {
        try {
            //const code = req.body;
            const keys = await redis.smembers('user_connections');
            var connection_tokens = await Promise.all(keys.map(async (key) => {
                return await redis.lrange(key, 0, -1);
            }))
            //const tokens = await redis.lrange('user_tokens', 0, -1);

            const tokenData = await Promise.all(connection_tokens.flat().map(async (token: string) => {
                let data = await axios.request<FinchToken>({
                    method: 'get',
                    url: 'https://api.tryfinch.com/introspect',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Finch-API-Version': '2020-09-17'
                    },
                }).then(async (res) => {
                    return { token, data: res.data }
                }).catch(async err => {
                    // access token is already invalid (most likely because it was disconnected)                
                    console.log(`invalid token: ${token}.`)
                });

                //const mask = "XXXXXXXX-XXXX-XXXX-XXXX-" + token.slice(token.length - 12);
                //console.log(mask);
                //console.log(introspectRes);
                return await data;
            }))

            //console.log('TOKEN DATA')
            //console.log(tokenData);

            // token successful, return back to location
            return res.status(200).json({ data: tokenData, msg: "Success" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ msg: "Error inspecting access token" })
        }
    }

    return res.status(405).json({ msg: "Method not implemented." })


};