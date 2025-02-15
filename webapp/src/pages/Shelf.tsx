/* Author: MyristicaFragrans (https://github.com/MyristicaFragrans)
 * Shelf.tsx (c) 2024 Incode Laboratories=
 * Desc: description
 * Created:  2024-04-09T21:29:56.329Z
 */

import { useContext, useEffect, useState } from "preact/hooks";
import PocketContext from "../lib/PocketBaseContext";
import { ListResult } from "pocketbase";
import { BookRecord, Loan } from "../lib/BookHandler";
import Bookshelf from "../components/Bookshelf";
import LoanedBook from "../components/Loan";
import { Link } from "wouter-preact";

export default function ShelfRoute() {
  const pb = useContext(PocketContext);
  let [books, setBooks] = useState<Loan[]>();
  useEffect(()=>{
    pb.collection('loans_private').getFullList<Loan>({expand: 'author'}).then(list=>{
      setBooks(list)
      console.log("set")
    })
  }, [])
  return <>
    {books?
      (books.length ?
      <Bookshelf>
        {books?.map((book)=>{return <LoanedBook book={book} />})}
      </Bookshelf>
      :
        <div class="flex min-h-[80vh] justify-center items-center">
          <div class="w-[400px] rounded p-3 shadow-lg">
            <h1 class="text-3xl">No books checked out!</h1>
            <Link to="/" class="text-blue-500 hover:underline">Go find some</Link>
          </div>
        </div>
      )
    :
      <p>One moment...</p>
    }
  </>
}