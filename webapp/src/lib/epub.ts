/* Author: MyristicaFragrans (https://github.com/MyristicaFragrans)
 * epub.ts (c) 2024 Incode Laboratories=
 * Desc: This file parses EPUB books
 * Created:  2024-04-07T23:55:19.408Z
 */

import FalseFilesystem from "./FalseFilesystem";

export default class EpubHandler {
  private epubInterface: FalseFilesystem;
  constructor(epub: FalseFilesystem) {
    this.epubInterface = epub;
  }
  
}