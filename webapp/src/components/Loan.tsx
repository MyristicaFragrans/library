/* Author: MyristicaFragrans (https://github.com/MyristicaFragrans)
 * Book.tsx (c) 2023
 * Desc: description
 * Created:  2023-07-26T17:44:42.049Z
 */

import { useContext } from "preact/hooks";
import { BookRecord, BookRecordToInterface, Loan } from "../lib/BookHandler";
import PocketContext from "../lib/PocketBaseContext";
import { Link } from "wouter-preact";

export default function LoanedBook(props: {book: Loan}) {
  const pb = useContext(PocketContext);
  const book = BookRecordToInterface(props.book);
  return <div class="flex flex-col items-stretch w-64 p-2 m-2 border-b border-b-slate-600">
    <h2 class="text-xl text-center my-auto">{book.book_name}</h2>
    <img src={book.book_cover} />
    <p>{book.author?.lname}, {book.author?.fname}</p>
    {book.in_use < book.copies ?
      <p>{book.in_use} / {book.copies}</p>
    :
      <p class="text-gray-400">{book.copies} / {book.copies}</p>
    }
    <Link to={`/read/${props.book.bookid}`} class="bg-blue-500 hover:bg-blue-600 px-2 py-1 m-2 rounded inline-block text-white">Read</Link>
    <Link to={`/checkout/${props.book.bookid}`} class="text-blue-600 hover:underline">Return</Link>
  </div>
}
