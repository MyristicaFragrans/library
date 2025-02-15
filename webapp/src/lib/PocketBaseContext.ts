/* Author: MyristicaFragrans (https://github.com/MyristicaFragrans)
 * PocketBaseContext.ts (c) 2023
 * Desc: description
 * Created:  2023-07-26T05:30:55.820Z
 */

import PocketBase from 'pocketbase';
import { Context, createContext } from "preact";

const PocketContext : Context<PocketBase> = createContext(null as any)

export default PocketContext;