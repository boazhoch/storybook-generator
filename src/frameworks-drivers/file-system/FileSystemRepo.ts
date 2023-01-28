import fs from "fs";
import { injectable } from "inversify";
import "reflect-metadata";
import { IRespositroy } from "../../usecases/types";

@injectable()
export class FileSystemRepo<
  T extends { path: string; content: string } = {
    path: string;
    content: string;
  }
> implements IRespositroy<T>
{
  create(model: T): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      fs.writeFile(model.path, model.content, (err) => {
        if (err) {
          return reject(err);
        }
        return resolve(model);
      });
    });
  }

  exist(path: string) {
    return fs.existsSync(path);
  }
}
