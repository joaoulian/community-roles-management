import { UniqueEntityID } from './UniqueEntityID';

const isEntity = (entity: any): entity is Entity<any, any> => {
  return entity instanceof Entity;
};

export abstract class Entity<Props, ID extends UniqueEntityID> {
  public readonly props: Props;
  protected readonly _id: ID;

  constructor(props: Props, id: ID) {
    this._id = id;
    this.props = props;
  }

  public get id(): ID {
    return this._id;
  }

  public equals(object?: Entity<Props, ID>): boolean {
    if (object === null || object === undefined) {
      return false;
    }

    if (this === object) {
      return true;
    }

    if (!isEntity(object)) {
      return false;
    }

    return this._id.equals(object._id);
  }
}
