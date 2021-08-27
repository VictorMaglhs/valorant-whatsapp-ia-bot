import { EntityTarget, Repository, getRepository } from "typeorm";

class Model<T> {
  private entity: EntityTarget<T>;

  constructor(entity: EntityTarget<T>) {
    this.entity = entity;
  }

  private getRepository(): Repository<T> {
    return getRepository(this.entity);
  }

  public async create(data: T): Promise<void> {
    const repository = this.getRepository();
    await repository.insert(data);
  }

  public async select(id: string | number): Promise<T | undefined> {
    const repository = this.getRepository();
    return await repository.findOne(id, { where: id });
  }

  public async update(data: T, where: T): Promise<void> {
    const repository = this.getRepository();
    await repository.update(where, data);
  }

  public async delete(id: T): Promise<void> {
    const repository = this.getRepository();
    await repository.delete(id);
  }
}

export default Model;
