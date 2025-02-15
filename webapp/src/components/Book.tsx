/* Author: MyristicaFragrans (https://github.com/MyristicaFragrans)
 * Book.tsx (c) 2023
 * Desc: description
 * Created:  2023-07-26T17:44:42.049Z
 */

import { useContext } from "preact/hooks";
import { BookRecord, BookRecordToInterface } from "../lib/BookHandler";
import PocketContext from "../lib/PocketBaseContext";
import { Link } from "wouter-preact";

export default function Book(props: {book: BookRecord}) {
  const pb = useContext(PocketContext);
  const book = BookRecordToInterface(props.book);
  return <div class="flex flex-col items-stretch w-64 p-2 m-2 border-b border-b-slate-600">
    <h2 class="text-xl text-center my-auto">{book.book_name}</h2>
    <img src={book.book_cover} />
    <div>
      <p>{book.author?.lname}, {book.author?.fname}</p>
      {book.in_use < book.copies ?
        <p>{book.in_use} / {book.copies} <Link href={`/checkout/${book.id}`} class="text-blue-600 hover:underline">Checkout</Link></p>
      :
        <p class="text-gray-400">{book.copies} / {book.copies}</p>
      }
    </div>
  </div>
}