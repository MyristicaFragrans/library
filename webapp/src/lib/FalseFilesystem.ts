/* Author: MyristicaFragrans (https://github.com/MyristicaFragrans)
 * FalseFilesystem.ts (c) 2024 Incode Laboratories=
 * Desc: This file provides an abstract class for a shim filesystem
 * Created:  2024-04-07T23:56:21.264Z
 */

export default abstract class FalseFilesystem {
  abstract read(path: string): Promise<string>;
}