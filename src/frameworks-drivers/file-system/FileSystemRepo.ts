import fs from 'fs';
import { IFileSystemRepo, IRespositroy } from '../../usecases/stories.usecase';
export class FileSystemRepo<T extends { path: string, content: string } = { path: string, content: string }> implements IFileSystemRepo<T> {

  create(model: T): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      fs.writeFile(model.path, model.content, err => {
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