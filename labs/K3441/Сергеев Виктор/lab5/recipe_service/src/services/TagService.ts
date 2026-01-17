import { Tag } from "../models/Tag";
import { BaseCRUDService } from "../common/BaseCRUDService";

export class TagService extends BaseCRUDService<Tag> {
    constructor () {
        super(Tag);
    }

    getEntityByName = async(
            name: string
    ): Promise<Tag | null> => {
        return this.repository.findOneBy({name: name});
    }
}