import { BaseController } from "./BaseController";
import { BaseCRUDService } from "./BaseCRUDService";
import { DeepPartial } from "typeorm";

export abstract class BaseCRUDController<T> extends BaseController<T> {
    protected service: BaseCRUDService<T>

    constructor(model: new() => T) {
        super(model);
        this.service = new BaseCRUDService<T>(model);
        this.getAllEntities = this.getAllEntities.bind(this);
        this.getEntityById = this.getEntityById.bind(this);
        this.createEntity = this.createEntity.bind(this);
        this.updateEntity = this.updateEntity.bind(this);
        this.deleteEntity = this.deleteEntity.bind(this);
    }

    public getAllEntities(): Promise<T[]> {
        return this.service.getAllEntities();
    }

    public getEntityById(id: number): Promise<T | null> {
        return this.service.getEntityById(id);
    }

    public async createEntity(data: DeepPartial<T>): Promise<T> {
        return this.service.createEntity(data as DeepPartial<T>);
    }

    public async updateEntity(id: number, data: DeepPartial<T>): Promise<T> {
        return this.service.updateEntity(id, data as DeepPartial<T>);
    }

    public deleteEntity(id: number): Promise<boolean> {
        return this.service.deleteEntity(id);
    }
}