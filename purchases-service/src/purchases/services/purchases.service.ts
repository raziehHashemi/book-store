import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Purchase } from '../schemas/purchase.schema';
import { IPurchaseRepository } from '../interfaces/purchase-repository.interface';
import { CreatePurchaseDto } from '../dtos/create-purchase.dto';
import { ClientProxy } from '@nestjs/microservices';
import { Book } from '../schemas/book.schema';
import { lastValueFrom } from 'rxjs';
import { IPaymentAdapter } from '../interfaces/payment-adapter.interface';
import { User } from '../schemas/user.schema';
import { MEMBERSHIP_TYPE } from '../enums/membership.enum';

@Injectable()
export class PurchasesService {
	constructor(
		@Inject('PurchaseRepositoryService') private readonly purchaseRepository: IPurchaseRepository,
		@Inject('BOOKS_SERVICE') private readonly booksServiceClient: ClientProxy,
		@Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
		@Inject('PaymentAdapter') private readonly paymentAdapter: IPaymentAdapter
	) { }

	async createPurchase(createPurchaseDto: CreatePurchaseDto): Promise<Purchase> {
		try {
			const { userId, bookIds } = createPurchaseDto;
			createPurchaseDto.status = 'pending';

			const books = await lastValueFrom(
				this.booksServiceClient.send<Book[]>({ cmd: 'find_books_by_ids' }, bookIds)
			);

			const user = await lastValueFrom(
				this.userServiceClient.send<User>({ cmd: 'find_user_by_id' }, userId)
			);

			if (!books || books.length !== bookIds.length) {
				throw new NotFoundException('One or more books not found');
			}

			createPurchaseDto.totalAmount = books.reduce((acc, book) => acc + book.price, 0);
			createPurchaseDto.totalAmountWithDiscount =
				user.membershipType === MEMBERSHIP_TYPE.PREMIUM ?
					createPurchaseDto.totalAmount * 0.9 : createPurchaseDto.totalAmount;

			const purchase = await this.purchaseRepository.createPurchase({
				userId,
				bookIds,
				totalAmount: createPurchaseDto.totalAmount,
				totalAmountWithDiscount: createPurchaseDto.totalAmountWithDiscount,
				status: 'pending',
			});

			return purchase;
		} catch (error) {
			throw error;
		}
	}

	async findAll(userId: string): Promise<Purchase[]> {
		try {
			const purchases = await this.purchaseRepository.findAll(userId);
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

	async addItemToCart(userId: string, bookId: string): Promise<Purchase> {
		try {
			const book = await lastValueFrom(
				this.booksServiceClient.send<Book>({ cmd: 'find_book_by_id' }, bookId)
			);
			if (!book) {
				throw new NotFoundException(`Book with id ${bookId} not found`);
			}
			let purchase = await this.purchaseRepository.findByUserId(userId);

			const user = await lastValueFrom(
				this.userServiceClient.send<User>({ cmd: 'find_user_by_id' }, userId)
			);


			if (!purchase) {
				const createPurchaseDto: CreatePurchaseDto = {
					userId,
					bookIds: [bookId],
					status: 'pending',
					totalAmount: book.price,
					totalAmountWithDiscount:
						user.membershipType === MEMBERSHIP_TYPE.PREMIUM ?
							book.price * 0.7 : book.price
				};
				purchase = await this.createPurchase(createPurchaseDto);
			}

			const updatedPurchase = await this.purchaseRepository.addItemToCart(purchase.id, bookId, book.price);
			return updatedPurchase;
		} catch (error) {
			throw error;
		}
	}

	async removeItemFromCart(userId: string, bookId: string): Promise<Purchase> {
		try {
			const purchase = await this.purchaseRepository.findByUserId(userId);

			const book = await lastValueFrom(
				this.booksServiceClient.send<Book>({ cmd: 'find_one_book' }, bookId)
			);

			if (!book) {
				throw new NotFoundException(`Book with id ${bookId} not found`);
			}

			const updatedPurchase = await this.purchaseRepository.removeItemFromCart(purchase.id, bookId, book.price);
			return updatedPurchase;
		} catch (error) {
			throw error;
		}
	}

	async completePurchase(userId: string): Promise<Purchase> {
		try {
			const purchase = await this.purchaseRepository.findByUserId(userId);

			if (purchase.status !== 'pending') {
				throw new NotFoundException('Purchase already completed or invalid');
			}

			if (await this.paymentAdapter.payment(userId, purchase.totalAmountWithDiscount || purchase.totalAmount)) {
				purchase.status = 'completed';
			} else {
				purchase.status = 'failed';
			}

			return await purchase.save();
		} catch (error) {
			throw error;
		}
	}
}
