import { Suspense} from 'react';
import { LoadingFallback, VNPayReturnContentPremium } from './vnpay-return-content-premium';


export default async function VNPayReturnPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <VNPayReturnContentPremium />
        </Suspense>
    );
}
