/* Author: MyristicaFragrans (https://github.com/MyristicaFragrans)
 * home.tsx (c) 2023
 * Desc: description
 * Created:  2023-07-26T06:05:20.796Z
 */

import { useContext, useEffect, useState } from "preact/hooks";
import Bookshelf from "../components/Bookshelf";
import PocketContext from "../lib/PocketBaseContext";
import { ListResult, RecordModel as Record } from "pocketbase";
import { BookRecord } from "../lib/BookHandler";
import Book from "../components/Book";
import { Link } from "wouter-preact";

export default function Home() {
  const pb = useContext(PocketContext);
  let [books, setBooks] = useState<BookRecord[]>();
  useEffect(()=>{
    pb.collection('book_data').getFullList<BookRecord>({expand: 'author'}).then(list=>{
      setBooks(list)
      console.log("set")
    })
  }, [])
  return <>
    {pb.authStore.model ?
      <Bookshelf>
        {books?.map((book)=>{return <Book book={book} />})}
      </Bookshelf>
    :
      <div class="flex justify-center items-center w-full h-[80vh]">
        <div class="max-w-[350px]">
          <h1 class="text-4xl">Open Library</h1>
          <p>
            This is a privately run library for sharing digital books without
            making duplicates.
          </p>
          <Link to="/login" class="bg-slate-100 hover:bg-slate-200 py-2 px-4 inline-block rounded">Login</Link>
        </div>
      </div>
    }
  </>
}