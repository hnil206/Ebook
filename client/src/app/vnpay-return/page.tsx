

import { Suspense} from 'react';
import { LoadingFallback, VNPayReturnContent } from './vnpay-return-content';


export default async function VNPayReturnPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <VNPayReturnContent />
        </Suspense>
    );
}



