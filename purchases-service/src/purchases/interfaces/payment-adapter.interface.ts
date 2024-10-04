export interface IPaymentAdapter {
    payment(userId: string, price: number): Promise<boolean>;
}