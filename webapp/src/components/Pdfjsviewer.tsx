/* Author: MyristicaFragrans (https://github.com/MyristicaFragrans)
 * Pdfjsviewer.tsx (c) 2024 Incode Laboratories=
 * Desc: description
 * Created:  2024-04-10T18:35:44.988Z
 */

import { useContext } from "preact/hooks";
import PocketContext from "../lib/PocketBaseContext";

export default function PdfjsViewer(props: {url: string}) {
  const pb = useContext(PocketContext);
  return <>
    <iframe src={`/pdfjs-legacy/build/generic-legacy/web/viewer.html?file=${props.url}`} class="w-full h-full min-h-[90vh]"></iframe>
  </>
}