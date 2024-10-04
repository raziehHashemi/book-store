import { IPaymentAdapter } from "../interfaces/payment-adapter.interface";

export class PaymentAdapter implements IPaymentAdapter {
    async payment(userId: string, price: number): Promise<boolean> {
        // Payment logic
        return true;
    }
} 