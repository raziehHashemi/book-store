import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Purchase } from '../schemas/purchase.schema';
import { IPurchaseRepository } from '../interfaces/purchase-repository.interface';
import { CreatePurchaseDto } from '../dtos/create-purchase.dto';
import { ClientProxy } from '@nestjs/microservices';
import { Book } from '../schemas/book.schema';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class PurchasesService {
	constructor(
		@Inject('PurchaseRepositoryService') private readonly purchaseRepository: IPurchaseRepository,
		@Inject('BOOKS_SERVICE') private readonly booksServiceClient: ClientProxy,
	) { }

	async createPurchase(createPurchaseDto: CreatePurchaseDto): Promise<Purchase> {
		try {
			const { userId, bookIds } = createPurchaseDto;

			const books = await lastValueFrom(
				this.booksServiceClient.send<Book[]>({ cmd: 'find_books_by_ids' }, bookIds)
			);

			if (!books || books.length !== bookIds.length) {
				throw new NotFoundException('One or more books not found');
			}

			const totalPrice = books.reduce((acc, book) => acc + book.price, 0);

			const purchase = await this.purchaseRepository.createPurchase({
				userId,
				bookIds,
				totalAmount: totalPrice,
				status: 'pending',
			});

			return purchase;
		} catch (error) {
			throw error;
		}
	}

	async findAll(): Promise<Purchase[]> {
		try {
			const purchases = await this.purchaseRepository.findAll();
			return purchases;
		} catch (error) {
			throw error;
		}
	}

	async findById(purchaseId: string): Promise<Purchase> {
		try {
			const purchase = await this.purchaseRepository.findById(purchaseId);
			if (!purchase) {
				throw new NotFoundException(`Purchase with id ${purchaseId} not found`);
			}
			return purchase;
		} catch (error) {
			throw error;
		}
	}

	async addItemToCart(purchaseId: string, bookId: string): Promise<Purchase> {
		try {
			const purchase = await this.purchaseRepository.findById(purchaseId);

			const book = await lastValueFrom(
				this.booksServiceClient.send<Book>({ cmd: 'find_book_by_id' }, bookId)
			);

			if (!book) {
				throw new NotFoundException(`Book with id ${bookId} not found`);
			}

			const updatedPurchase = await this.purchaseRepository.addItemToCart(purchaseId, bookId, book.price);
			return updatedPurchase;
		} catch (error) {
			throw error;
		}
	}

	async removeItemFromCart(purchaseId: string, bookId: string): Promise<Purchase> {
		try {
			const purchase = await this.purchaseRepository.findById(purchaseId);

			const book = await lastValueFrom(
				this.booksServiceClient.send<Book>({ cmd: 'find_one_book' }, bookId)
			);

			if (!book) {
				throw new NotFoundException(`Book with id ${bookId} not found`);
			}

			const updatedPurchase = await this.purchaseRepository.removeItemFromCart(purchaseId, bookId, book.price);
			return updatedPurchase;
		} catch (error) {
			throw error;
		}
	}

	async completePurchase(purchaseId: string): Promise<Purchase> {
		try {
			const purchase = await this.purchaseRepository.findById(purchaseId);

			if (purchase.status !== 'pending') {
				throw new NotFoundException('Purchase already completed or invalid');
			}

			purchase.status = 'completed';

			return await purchase.save();
		} catch (error) {
			throw error;
		}
	}

	async removePurchase(purchaseId: string): Promise<Purchase> {
		try {
			return await this.purchaseRepository.removePurchase(purchaseId);
		} catch (error) {
			throw error;
		}
	}
}
