import Iyzipay from 'iyzipay';
import dotenv from 'dotenv';

dotenv.config();

// FIX: Sandbox fallback production'da devreye girmemesi için env kontrolü eklendi (KRİTİK 4)
if (!process.env.IYZICO_API_KEY || !process.env.IYZICO_SECRET_KEY) {
    throw new Error('IYZICO config missing: API_KEY and SECRET_KEY are required for production-ready state.');
}

const iyzipay = new Iyzipay({
    apiKey: process.env.IYZICO_API_KEY,
    secretKey: process.env.IYZICO_SECRET_KEY,
    uri: process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com'
});

export default iyzipay;
