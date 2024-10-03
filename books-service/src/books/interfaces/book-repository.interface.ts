import { CreateBookDto } from "../dtos/create-book.dto";

export interface IBookRepository {
    create(createBookDto: CreateBookDto);
    findAll(query: any);
    findById(id: string);
}