import { v4 } from "uuid";

interface IBaseEntity {
  id: string;
}

export class BaseEntity implements IBaseEntity {
  public id: string;
  constructor() {
    this.id = v4();
  }
}
