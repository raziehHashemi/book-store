import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IBookRepository } from "../interfaces/book-repository.interface";
import { Book } from "../schemas/book.schema";
import { CreateBookDto } from "../dtos/create-book.dto";

@Injectable()
export class BookRepository implements IBookRepository {
    constructor(
        @InjectModel(Book.name) private readonly bookModel: Model<Book>,
    ) { }

    async create(createBookDto: CreateBookDto): Promise<Book> {
        try {
            const createdBook = new this.bookModel(createBookDto);
            return await createdBook.save();
        } catch (error) {
            throw new Error('Error creating book');
        }
    }

    async findAll(query: any): Promise<Book[]> {
        try {
            const books = await this.bookModel.find(query).exec();
            return books;
        } catch (error) {
            throw new Error('Error fetching books');
        }
    }

    async findById(id: string): Promise<Book> {
        try {
            const book = await this.bookModel.findById(id).exec();
            return book;
        } catch (error) {
            throw new Error(`Error finding book with id ${id}`);
        }
    }
}
