import { Controller, Post, Body, Get, Param, HttpStatus, Res, Inject, } from '@nestjs/common';
import { Response } from 'express';
import { PurchasesService } from '../services/purchases.service';
import { CreatePurchaseDto } from '../dtos/create-purchase.dto';

@Controller('purchases')
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
    async findAll(@Res() res: Response) {
        try {
            const purchases = await this.purchasesService.findAll();
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
}
