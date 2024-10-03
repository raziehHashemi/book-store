import { CreatePurchaseDto } from "../dtos/create-purchase.dto";
import { Purchase } from "../schemas/purchase.schema";

export interface IPurchaseRepository {
    createPurchase(createPurchaseDto: CreatePurchaseDto): Promise<Purchase>;
    findAll(): Promise<Purchase[]>;
    findById(purchaseId: string): Promise<Purchase>;
    addItemToCart(purchaseId: string, bookId: string, price: number): Promise<Purchase>;
    removeItemFromCart(purchaseId: string, bookId: string, price: number): Promise<Purchase>;
    removePurchase(purchaseId: string): Promise<Purchase>
}