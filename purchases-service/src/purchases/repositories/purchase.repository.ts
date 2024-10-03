import { Injectable } from "@nestjs/common";
import { IPurchaseRepository } from "../interfaces/purchase-repository.interface";
import { InjectModel } from "@nestjs/mongoose";
import { Purchase } from "../schemas/purchase.schema";
import { Model } from "mongoose";
import { CreatePurchaseDto } from "../dtos/create-purchase.dto";

@Injectable()
export class PurchaseRepository implements IPurchaseRepository {
    constructor(
        @InjectModel(Purchase.name) private readonly purchaseModel: Model<Purchase>,
    ) { }

    async createPurchase(createPurchaseDto: CreatePurchaseDto): Promise<Purchase> {
        try {
            const newPurchase = new this.purchaseModel(createPurchaseDto);
            return await newPurchase.save();
        } catch (error) {
            throw error;
        }
    }

    async findAll(): Promise<Purchase[]> {
        try {
            return this.purchaseModel.find().exec();
        } catch (error) {
            throw error;
        }
    }

    async findById(purchaseId: string): Promise<Purchase> {
        try {
            const purchase = await this.purchaseModel.findById(purchaseId);
            return purchase;
        } catch (error) {
            throw error;
        }
    }

    async addItemToCart(purchaseId: string, bookId: string, price: number): Promise<Purchase> {
        try {
            const purchase = await this.findById(purchaseId);
            purchase.bookIds.push(bookId + '');
            purchase.totalAmount += price;
            return await purchase.save();
        } catch (error) {
            throw error;
        }
    }

    async removeItemFromCart(purchaseId: string, bookId: string, price: number): Promise<Purchase> {
        try {
            const purchase = await this.findById(purchaseId);
            const index = purchase.bookIds.indexOf(bookId + '');
            if (index > -1) {
                purchase.bookIds.splice(index, 1);
                purchase.totalAmount -= price;
            }

            return await purchase.save();
        } catch (error) {
            throw error;
        }
    }

    async removePurchase(purchaseId: string): Promise<Purchase> {
        try {
            const purchase = await this.findById(purchaseId);
            return await purchase.deleteOne();
        } catch (error) {
            throw error;
        }
    }
}