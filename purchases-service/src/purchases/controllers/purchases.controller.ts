import { Controller, Post, Body, Get, Param, HttpStatus, Res, Inject, UseGuards, } from '@nestjs/common';
import { Response } from 'express';
import { PurchasesService } from '../services/purchases.service';
import { CreatePurchaseDto } from '../dtos/create-purchase.dto';
import { JwtAuthGuard } from 'src/common/gaurds/jwt-auth.guard';

@Controller('purchases')
@UseGuards(JwtAuthGuard)
export class PurchasesController {
    constructor(
        @Inject() private readonly purchasesService: PurchasesService) { }

    @Post()
    async create(
        @Body() createPurchaseDto: CreatePurchaseDto,
        @Res() res: Response,
    ) {
        try {
            const purchase = await this.purchasesService.createPurchase(createPurchaseDto);
            return res.status(HttpStatus.CREATED).json({
                statusCode: HttpStatus.CREATED,
                message: 'Purchase successfully created',
                data: purchase,
            });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'Error creating purchase',
                error: error.message,
            });
        }
    }

    @Get()
    async findAll(
        @Body() userId: string,
        @Res() res: Response) {
        try {
            const purchases = await this.purchasesService.findAll(userId);
            return res.status(HttpStatus.OK).json({
                statusCode: HttpStatus.OK,
                message: 'All purchases retrieved successfully',
                data: purchases,
            });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'Error retrieving purchases',
                error: error.message,
            });
        }
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Res() res: Response) {
        try {
            const purchase = await this.purchasesService.findById(id);
            if (!purchase) {
                return res.status(HttpStatus.NOT_FOUND).json({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Purchase not found',
                });
            }
            return res.status(HttpStatus.OK).json({
                statusCode: HttpStatus.OK,
                message: 'Purchase retrieved successfully',
                data: purchase,
            });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'Error retrieving purchase',
                error: error.message,
            });
        }
    }

    @Post('add-to-cart')
    async addItemToCart(
        @Body() { userId, bookId }: { userId: string, bookId: string },
        @Res() res: Response,
    ) {
        try {
            const purchase = await this.purchasesService.addItemToCart(userId, bookId);
            return res.status(HttpStatus.OK).json({
                statusCode: HttpStatus.OK,
                message: 'Item added to cart successfully',
                data: purchase,
            });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'Error adding item to cart',
                error: error.message,
            });
        }
    }

    @Post('remove-from-cart')
    async removeItemFromCart(
        @Body() { userId, bookId }: { userId: string, bookId: string },
        @Res() res: Response,
    ) {
        try {
            const purchase = await this.purchasesService.removeItemFromCart(userId, bookId);
            return res.status(HttpStatus.OK).json({
                statusCode: HttpStatus.OK,
                message: 'Item removed from cart successfully',
                data: purchase,
            });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'Error removing item from cart',
                error: error.message,
            });
        }
    }

    @Post('complete-purchase')
    async completePurchase(
        @Body() { userId }: { userId: string },
        @Res() res: Response,
    ) {
        try {
            const purchase = await this.purchasesService.completePurchase(userId);
            return res.status(HttpStatus.OK).json({
                statusCode: HttpStatus.OK,
                message: 'Purchase completed successfully',
                data: purchase,
            });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'Error completing purchase',
                error: error.message,
            });
        }
    }
}
