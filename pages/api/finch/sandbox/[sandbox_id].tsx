import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import redis from '../../../../util/redis'
import { apiUrl } from '../../../../util/constants'

type SandboxRes = {
    payroll_provider_id: string,
    company_id: string,
    access_token: string
}

export default async function Sandbox(req: NextApiRequest, res: NextApiResponse) {
    const { sandbox_id } = req.query;
    console.log(req.method + ` /api/finch/sandbox/${sandbox_id}`);

    if (req.method == 'GET') {
        try {

            const body = {
                provider_id: sandbox_id,
                products: ["company", "directory", "individual", "employment", "payment", "pay_statement"],
                employee_size: Math.floor(Math.random() * 50)
            }

            const sandboxRes = await axios.request<SandboxRes>({
                method: 'post',
                url: `${apiUrl}/sandbox/create`,
                data: body
            })

            await redis.sadd('user_connections', `${sandboxRes.data.payroll_provider_id}:${sandboxRes.data.company_id}`)
            await redis.lpush(`${sandboxRes.data.payroll_provider_id}:${sandboxRes.data.company_id}`, sandboxRes.data.access_token);
            //await redis.lpush(`${session.user.org_id}:${tokenRes.data.payroll_provider_id}:${tokenRes.data.company_id}`, authRes.data.access_token);

            // Keep the newly setup connection's access_token to use for subsequent calls to Finch's APIs.
            await redis.set('current_connection', sandboxRes.data.access_token)

            // token successful, return back to location
            return res.redirect('/connections');
        } catch (error) {
            console.error(error);
            return res.status(500).json({ msg: "Error retrieving access token." })
        }
    }

    return res.status(405).json({ msg: "Method not implemented." })


};