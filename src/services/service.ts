import { z } from 'zod';
import { Test } from './test';

const typeSchema = z.object({
    name: z.string(),
});

export type Type = z.infer<typeof typeSchema>;

export class Service {
    constructor(private test: Test) {}

    private mockDb: Type[] = [];

    async create(service: Type): Promise<Type> {
        this.mockDb.push(service);
        return service;
    }

    async list(): Promise<Type[]> {
        this.test.print();
        return this.mockDb;
    }
}