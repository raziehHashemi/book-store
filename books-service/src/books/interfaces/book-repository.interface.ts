import { CreateBookDto } from "../dtos/create-book.dto";
import { Book } from "../schemas/book.schema";

export interface IBookRepository {
    create(createBookDto: CreateBookDto): Promise<Book>;
    findAll(query: any): Promise<Book[]>;
    findById(id: string): Promise<Book>;
    findByIds(bookIds: string[]): Promise<Book[]>
}