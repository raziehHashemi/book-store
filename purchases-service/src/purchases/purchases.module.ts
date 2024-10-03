import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Purchase, PurchaseSchema } from 'src/purchases/schemas/purchase.schema';
import { Book, BookSchema } from 'src/purchases/schemas/book.schema';
import { PurchasesController } from './controllers/purchases.controller';
import { PurchasesService } from './services/purchases.service';
import { PurchaseRepository } from './repositories/purchase.repository';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Purchase.name, schema: PurchaseSchema },
            { name: Book.name, schema: BookSchema },
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
        }
    ],
})
export class PurchasesModule { }
