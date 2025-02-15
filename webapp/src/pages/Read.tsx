/* Author: MyristicaFragrans (https://github.com/MyristicaFragrans)
 * Read.tsx (c) 2023
 * Desc: description
 * Created:  2023-07-26T20:37:18.989Z
 */

import Epub, { Rendition } from 'epubjs';
import { useContext, useEffect, useId, useState } from 'preact/hooks'
import PocketContext from '../lib/PocketBaseContext';
import { BookRecord, Loan } from '../lib/BookHandler';
import Section from 'epubjs/types/section';
import View from 'epubjs/types/managers/view';
import { ChevronLeft, ChevronRight } from '../components/Chevrons';
import PdfReader from '../components/PdfReader';
import EpubReader from '../components/EpubReader';
import { ClientResponseError } from 'pocketbase';
import { navigate } from 'wouter-preact/use-browser-location';
import PdfjsViewer from '../components/Pdfjsviewer';

export default function Read(props: {params: any}) {
  const readID = useId();
  const pb = useContext(PocketContext);
  const [render, setRendition] = useState<Rendition>()
  const [url, setUrl] = useState<string>("");
  const [type, setType] = useState<string>("");
  useEffect(()=>{
    pb.collection('loans_private').getFirstListItem<Loan>(
      pb.filter("bookid = {:bookid}", {bookid: props.params.id})
    ).then(async record => {
      // Get the URL to the book
      console.log(JSON.stringify(record,undefined,2))
      const url = await pb.files.getToken().then(token=>{
        return pb.files.getUrl(record, record.book, {token: token});
      })
      console.log(url)
      setUrl(url);
      if (record.type) {
        setType(record.type)
      } else {
        setType(record.book.split(".").pop() || "");
      }
    }).catch(e=>{
      if (e instanceof ClientResponseError) {
        // Probably not checked out
        navigate(`/checkout/${props.params.id}`, {replace: true});
      }
    });
  }, [props.params.id]);

  if (url.length == 0) {
    return <div>Loading...</div>
  }
  switch (type) {
    case "pdf":
      return <PdfjsViewer url={url} />
    case "epub":
      return <EpubReader url={url} />
    default:
      return <div>Unrecognized book format "{type}"</div>
  }
}