import { resolveProjectReferencePath } from '@ts-morph/common/lib/typescript';
import fs from 'fs';
import path from "path";

export interface Writer {
  write(path: string, content: string): Promise<boolean>;
  checkFileExists(path: string): Promise<boolean>;
}

export class FSWriter implements Writer {
  write(path: string, content: string) {
    return new Promise<boolean>((resolve, reject) => {
      fs.writeFile(path, content, err => {
        if (err) {
          return reject(err);
        }
        return resolve(true);
      });
    });
  }

  checkFileExists(filePath: string) {
    return new Promise<boolean>((resolve, reject) => {
      const value = fs.existsSync(filePath);
      return value ? resolve(value) : reject(value);
    })
  }
}
