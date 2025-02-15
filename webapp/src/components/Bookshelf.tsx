/* Author: MyristicaFragrans (https://github.com/MyristicaFragrans)
 * Bookshelf.tsx (c) 2023
 * Desc: description
 * Created:  2023-07-26T17:43:24.334Z
 */

export default function Bookshelf(props: {children: any}) {
  return <div class="flex flex-row flex-wrap">
    {props.children}
  </div>
}