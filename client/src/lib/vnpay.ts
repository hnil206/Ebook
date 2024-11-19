import { VNPay, ignoreLogger, HashAlgorithm } from 'vnpay';
import { env } from './validateEnv';


const vnpay = new VNPay({
    tmnCode: process.env.VNPAY_TMN_CODE!,
    secureSecret: process.env.VNPAY_SECURE_SECRET!,
    vnpayHost: process.env.VNPAY_HOST,
    testMode: true,
    hashAlgorithm: HashAlgorithm.SHA512,
    enableLog: true,
    loggerFn: ignoreLogger, // optional
})

export default vnpay;
