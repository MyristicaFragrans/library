/* Author: MyristicaFragrans (https://github.com/MyristicaFragrans)
 * Checkout.tsx (c) 2024 Incode Laboratories=
 * Desc: description
 * Created:  2024-04-08T20:16:52.357Z
 */

import { useContext, useEffect, useState } from "preact/hooks";
import PocketContext from "../lib/PocketBaseContext";
import { BookInterface, BookRecord, BookRecordToInterface, Loan } from "../lib/BookHandler";
import { Link, Redirect } from "wouter-preact";
import Client, { ClientResponseError } from "pocketbase";

export default function CheckoutRoute(props: {params: any}) {
  const pb = useContext(PocketContext);
  const [book, setBook] = useState<BookRecord>()
  const [err, setErr] = useState<string>("");
  const [loan, setLoan] = useState<Loan>();
  if (!props.params.id) return <Redirect href="/" />

  useEffect(()=>{
    // Retrieve book information
    pb.collection("book_data").getOne(props.params.id).then((res)=>{
      
      setBook(res as BookRecord)
    }).catch((error)=>{
      console.warn(error);
      setErr(error)
    })
    // See if we have the book checked out already
    getLoan(pb, props.params.id).then(res=>{
      setLoan(res)
    }).catch((e)=>{
      if (e instanceof ClientResponseError) {
        setLoan(undefined)
      } else {
        setErr(e)
      }
    })
  }, [props.params.id]);

  function checkout(setErr: CallableFunction, setLoan: CallableFunction) {
    pb.send("/api/library/loans/checkout", {
      method: "POST",
      body: JSON.stringify({
        "id": props.params.id
      })
    }).then(res=>{
      return res.json()
    }).then(res=>{
      if (res.code == 200) {
        // Success
        getLoan(pb, props.params.id).then(res=>{
          if (book) book.in_use++;
          setLoan(res)
        }).catch((e)=>{
          if (e instanceof ClientResponseError) {
            setLoan(undefined)
          } else {
            setErr(e)
          }
        })
      }
    }).catch(error=>{
      setErr(error)
    })
  }
  function onBookReturned() {
    if (book) book.in_use--;
    setLoan(undefined);
  }

  return <div class="flex justify-center items-center h-[80vh]">
    <div class="w-[750px] h-[400px] shadow-lg p-4 grid grid-cols-2">
      {err.length ?
        <p>{err}</p>
      :
        book ? (loan ? <BookCheckedOut book={book} returnHook={onBookReturned} loan={loan} />
        : <BookDisplay book={book} checkout={checkout.bind(setErr, setLoan)} />) : null
      }
    </div>
  </div>
}

function BookCheckedOut(props: {book: any, returnHook: CallableFunction, loan: Loan}) {
  const pb = useContext(PocketContext);
  const book = props.book;
  function bookReturn() {
    props.returnHook(returnBook(pb, props.loan.id))
  }
  return <>
    <img src={pb.files.getUrl(book, book.cover)} class="h-full" />
    <div>
      <h1 class="text-2xl">All yours until {new Date(props.loan.expires).toLocaleString()}!</h1>
      <Link to={`/read/${book.id}`} class="block w-full bg-blue-500 hover:bg-blue-600 rounded p-3 m-3 text-center text-white">Open book</Link>
      <button onClick={bookReturn} class="block w-full bg-slate-100 hover:bg-slate-200 rounded p-3 m-3 text-center">Return</button>
      <Link to="/shelf" class="block w-full bg-slate-100 hover:bg-slate-200 rounded p-3 m-3 text-center">Bookshelf</Link>
      <Link to="/" class="block w-full bg-slate-100 hover:bg-slate-200 rounded p-3 m-3 text-center">Continue Browsing</Link>
    </div>
  </>
}

function BookDisplay(props: {book: any, checkout: any}) {
  const pb = useContext(PocketContext);
  const book = props.book;
  return book ?
  <>
    <img src={pb.files.getUrl(book, book.cover)} class="h-full" />
    <div>
      {book.copies > book.in_use ?
      <>
        <h1 class="text-2xl">Checking out <b>{book.book_name}</b> for 7 days</h1>
        <p>{book.in_use} / {book.copies} in use.</p>
        <button class="block w-full bg-blue-500 hover:bg-blue-600 text-white rounded p-3 m-2 text-center" onClick={props.checkout}>Check Out for 7 days</button>
      </>
      :
      <>
        <h1 class="text-2xl">No copies available for <b>{book.book_name}</b></h1>
        <p>{book.copies} / {book.copies} in use.</p>
      </>
      }
      <Link to="/" class="block w-full bg-slate-100 hover:bg-slate-200 rounded p-3 m-2 text-center">Go back</Link>
    </div>
  </>
:
  null;
}

function returnBook(pb: Client, loanid: string) {
  return pb.collection("loans").delete(loanid);
}

function getLoan(pb: Client, bookid: string) {
  return pb.collection("loans_private").getFirstListItem<Loan>(
    pb.filter("bookid = {:bookid}", {bookid: bookid})
  );
}