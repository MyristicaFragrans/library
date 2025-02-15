import PocketBase from 'pocketbase';
import PocketContext from '../lib/PocketBaseContext';
import '../styles/app.less'

import { Link, Route } from "wouter-preact";
import { Suspense, lazy, useEffect, useState } from "preact/compat";
import LoginRoute from '../pages/Login';
import { navigate } from 'wouter-preact/use-browser-location';
import CheckoutRoute from '../pages/Checkout';
import ShelfRoute from '../pages/Shelf';

const HomeRoute = lazy(() => import('../pages/Home'))
const ReadRoute = lazy(() => import('../pages/Read'))

export function App() {
  const pb = new PocketBase();

  const [loggedIn, setLoggedIn] = useState(pb.authStore.model !== null);
  pb.authStore.onChange((_, model)=>{
    setLoggedIn(model !== null);
  });
  
  function logout() {
    pb.authStore.clear();
    navigate("/", {replace: true});
  }

  return (
    <>
      <PocketContext.Provider value={pb}>
        <div class="flex flex-row items-center">
          <h1 class="text-3xl">Library</h1>
          <Link to="/" class="inline-block bg-slate-100 hover:bg-slate-200 px-4 py-2 mx-4">Home</Link>
          <Link to="/shelf" class="inline-block bg-slate-100 hover:bg-slate-200 px-4 py-2 mx-4">My Shelf</Link>
          <span class="flex-grow"></span>
          {loggedIn ?
          <>
            <p class="mx-2">Hello, {pb.authStore.model?.name}</p>
            <a href="javascript:void" onClick={logout} class="inline-block text-blue-500 hover:underline">Logout</a>
          </>
          :
          <Link to="/login" class="inline-block bg-slate-100 hover:bg-slate-200 m-2 py-2 px-4 rounded">Login</Link>
          }
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <Route path='/' component={HomeRoute} />
          <Route path='/login' component={LoginRoute} />
          <Route path='/shelf' component={ShelfRoute} />
          <Route path='/read/:id' component={ReadRoute} />
          <Route path='/checkout/:id' component={CheckoutRoute} />
        </Suspense>
      </PocketContext.Provider>
    </>
  )
}
