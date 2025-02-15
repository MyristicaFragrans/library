/* Author: MyristicaFragrans (https://github.com/MyristicaFragrans)
 * EpubReader.tsx (c) 2024 Incode Laboratories=
 * Desc: description
 * Created:  2024-04-09T20:59:31.335Z
 */

import Epub, { Rendition } from 'epubjs';
import { useEffect, useId, useState } from 'preact/hooks'
import { ChevronLeft, ChevronRight } from '../components/Chevrons';

export default function EpubReader(props: {url: any}) {
  const readID = useId();
  const [render, setRender] = useState<Rendition>()
  useEffect(()=>{
    const book = Epub(props.url, {openAs: 'epub'});
    const rendition = book.renderTo(readID, {
      width: '100%',
      height: '600px',
      spread: 'always'
    });
    rendition.display();
    book.ready.then(()=>{
      setRender(rendition)
      console.log("Ready")
    });
  }, []);
  return <div class="relative">
    <div class="flex justify-center items-center min-h-[90vh]">
      <div id={readID} class="h-[800px] w-[1000px] shadow-lg rounded-lg overflow-hidden relative"></div>
    </div>
    {render ?
    <div class="h-full w-full absolute left-0 top-0 font-3xl">
      <div class="absolute left-0 top-[50%] cursor-pointer" onClick={()=>render?.prev()}>
        <ChevronLeft />
      </div>
      <div class="absolute right-0 top-[50%] cursor-pointer" onClick={()=>render?.next()}>
        <ChevronRight />
      </div>
    </div>
    :
      <h2>Loading...</h2>
    }
  </div>;
}
