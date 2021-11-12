import {
  EntityTarget,
  Repository,
  getRepository,
  InsertResult,
  UpdateResult,
  DeleteResult,
  FindConditions,
} from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

class Model<T> {
  private entity: EntityTarget<T>;

  constructor(entity: EntityTarget<T>) {
    this.entity = entity;
  }

  private getRepository(): Repository<T> {
    return getRepository(this.entity);
  }

  public async create(data: T): Promise<InsertResult> {
    const repository = this.getRepository();
    return await repository.insert(data);
  }

  public async select(
    value: QueryDeepPartialEntity<T>
  ): Promise<T | undefined> {
    const repository = this.getRepository();
    return await repository.findOne(value);
  }

  public async update(
    where: FindConditions<T>,
    value: QueryDeepPartialEntity<T>
  ): Promise<UpdateResult> {
    const repository = this.getRepository();
    return await repository.update(where, value);
  }

  public async delete(id: T): Promise<DeleteResult> {
    const repository = this.getRepository();
    return await repository.delete(id);
  }
}

export default Model;
