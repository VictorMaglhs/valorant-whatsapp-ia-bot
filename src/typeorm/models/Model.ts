import { EntityTarget, Repository, getRepository } from "typeorm";

class Model<T> {
  private repository: Repository<T>;

  constructor(entity: EntityTarget<T>) {
    this.repository = getRepository(entity);
  }

  public async create(data: T): Promise<void> {
    await this.repository.insert(data);
  }
}

export default Model;
