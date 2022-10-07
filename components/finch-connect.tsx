import { useFinchConnect, ErrorEvent, SuccessEvent, } from 'react-finch-connect';
import { baseUrl } from '../util/constants'

type FinchConnectOptions = {
    products: string[],
    embedded?: boolean,
    sandbox?: boolean,
    payroll_provider?: string
}
export function FinchConnect(options: FinchConnectOptions) {
    const onSuccess = async (e: SuccessEvent) => {
        return await fetch(baseUrl + "/api/finch/sandbox/gusto")

        // if (options.embedded)
        //     return fetch(`/api/finch/callback?code=${e.code}&embedded=${options.embedded}`)
    }
    const onError = (e: ErrorEvent) => console.error(e.errorMessage);
    const onClose = () => console.log("User exited Finch Connect");

    const { open: openFinchConnect } = useFinchConnect({
        clientId: process.env.NEXT_PUBLIC_FINCH_CLIENT_ID ?? '',
        payrollProvider: options.payroll_provider,
        products: options.products,
        sandbox: options.sandbox,
        onSuccess,
        onError,
        onClose
    });
    return { openFinchConnect }
}