import { DeepPartial } from "typeorm";
import { BaseService } from "./BaseService";

export class BaseCRUDService<T> extends BaseService<T> {
    constructor (model: new() => T) {
        super(model);
    }

    async getAllEntities(): Promise<Array<T>> {
        return this.repository.find();
    }
    
    async getEntityById (id: number): Promise<T | null> {
        return this.repository.findOneBy({id: id} as any);
    }

    async createEntity (data: DeepPartial<T>): Promise<T> {
        const entity = this.repository.create(data);
        return this.repository.save(entity);
    }

    async updateEntity (id: number, data: DeepPartial<T>): Promise<T> {
        const entity = await this.getEntityById(id);
        if (!entity) {
            return null;
        }
        this.repository.merge(entity, data);
        return this.repository.save(entity);
    }

    async deleteEntity (id: number): Promise<boolean> {
        const result = await this.repository.delete(id);
        return result.affected > 0;
    }
}