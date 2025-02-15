/* Author: MyristicaFragrans (https://github.com/MyristicaFragrans)
 * PDF.tsx (c) 2024 Incode Laboratories=
 * Desc: description
 * Created:  2024-04-08T00:50:49.774Z
 */

import { useEffect, useId, useState } from "preact/hooks";

import * as PDF from "pdfjs-dist"
import PdfWorker from "pdfjs-dist/build/pdf.worker.mjs?worker&url";
import { ChevronLeft, ChevronRight } from "./Chevrons";

PDF.GlobalWorkerOptions.workerSrc = PdfWorker;

export default function PdfReader(props: {url: string}) {
  const id = useId();
  const [pagenum, setPagenum] = useState(1);
  const [canvas, setCanvas] = useState<HTMLCanvasElement>();
  const [doc, setDoc] = useState<PDF.PDFDocumentProxy>()
  function renderPage(newPage?:number) {
    if (canvas === undefined) return console.warn("Tried to go to page when the canvas doesn't exist");
    if (newPage) setPagenum(newPage > 0 && newPage <= (doc?.numPages || 0) ? newPage : pagenum);
    return doc?.getPage(pagenum).then((page)=>{
      const viewport = page.getViewport({scale: 1.3});
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return console.warn("Failed to get canvas context")
      const renderTask = page.render({
        canvasContext: ctx,
        viewport: viewport
      });
      return renderTask.promise
    }).then(()=>{
      console.log("done rendering page " + pagenum);
    });
  }

  useEffect(()=>{
    PDF.getDocument(props.url).promise.then((pdf)=>{
      const c = document.getElementById(id) as HTMLCanvasElement;
      if (c !== undefined) {
        setCanvas(c);
      } else console.error("Failed to initiate reader");
      setDoc(pdf);
      return renderPage(1)
    }).catch(e=>{
      console.warn(e);
      throw e;
    })
  }, []);

  return <div class="max-h-[80vh] relative">
    <canvas id={id} class="h-full"></canvas>
    <div class="h-full w-full absolute left-0 top-0 font-3xl">
      <div class="absolute left-0 top-[50%]" onClick={()=>renderPage(pagenum-1)}>
        <ChevronLeft />
      </div>
      <div class="absolute right-0 top-[50%]" onClick={()=>renderPage(pagenum+1)}>
        <ChevronRight />
      </div>
    </div>
  </div>;
}