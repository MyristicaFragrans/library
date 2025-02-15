/* Author: MyristicaFragrans (https://github.com/MyristicaFragrans)
 * FalseZip.ts (c) 2024 Incode Laboratories=
 * Desc: description
 * Created:  2024-04-07T23:58:01.873Z
 */

import FalseFilesystem from "./FalseFilesystem";
import Zip from "jszip";

export default class FalseZip extends FalseFilesystem {
  private localZip: Zip;
  constructor(zip: Zip) {
    super();
    this.localZip = zip;
  }
  read(path: string): Promise<string> {
    return new Promise((res, rej)=>{
      let file = this.localZip.file(path)
      if (file) return file.async('string')
      rej()
    });
  }
}