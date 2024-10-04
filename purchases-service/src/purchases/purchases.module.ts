import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Purchase, PurchaseSchema } from 'src/purchases/schemas/purchase.schema';
import { Book, BookSchema } from 'src/purchases/schemas/book.schema';
import { PurchasesController } from './controllers/purchases.controller';
import { PurchasesService } from './services/purchases.service';
import { PurchaseRepository } from './repositories/purchase.repository';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PaymentAdapter } from './adapter/payment.adapter';
import { User, UserSchema } from './schemas/user.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Purchase.name, schema: PurchaseSchema },
            { name: Book.name, schema: BookSchema },
            { name: User.name, schema: UserSchema }
        ]),
        ClientsModule.registerAsync([
            {
                name: 'BOOKS_SERVICE',
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: async (configService: ConfigService) => ({
                    transport: Transport.TCP,
                    options: {
                        host: configService.get<string>('BOOKS_SERVICE_HOST', 'localhost'),
                        port: configService.get<number>('BOOKS_SERVICE_PORT', 3001),
                    },
                }),
            },
            {
                name: 'USER_SERVICE',
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: async (configService: ConfigService) => ({
                    transport: Transport.TCP,
                    options: {
                        host: configService.get<string>('USER_SERVICE_HOST', 'localhost'),
                        port: configService.get<number>('USER_SERVICE_PORT', 3002),
                    },
                }),
            },
        ]),
    ],
    controllers: [PurchasesController],
    providers: [
        {
            provide: 'PurchaseRepositoryService',
            useClass: PurchaseRepository
        },
        {
            provide: 'PurchasesService',
            useClass: PurchasesService,
        },
        {
            provide: 'PaymentAdapter',
            useClass: PaymentAdapter
        }
    ],
})
export class PurchasesModule { }
