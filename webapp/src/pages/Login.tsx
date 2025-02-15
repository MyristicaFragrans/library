/* Author: MyristicaFragrans (https://github.com/MyristicaFragrans)
 * Login.tsx (c) 2024 Incode Laboratories=
 * Desc: description
 * Created:  2024-04-08T18:30:15.449Z
 */

import { useContext, useState } from 'preact/hooks';
import PocketContext from '../lib/PocketBaseContext';
import { navigate } from 'wouter-preact/use-browser-location';

export default function LoginRoute() {
  const pb = useContext(PocketContext);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  function login(form: Event) {
    form.preventDefault()
    const target = form.target as typeof form.target & {
      email: {value: string};
      password: {value: string}
    };
    pb.collection("users").authWithPassword(
      target.email.value,
      target.password.value
    ).then(()=>{
      navigate("/", {replace: true});
    }).catch(err=>{
      console.log(err);
      setError("Invalid username or password");
    });
  }

  return <>
    <div class="border border-slate-100 p-3 m-3 rounded">
      <h1 class="text-2xl">Login</h1>
      <form onSubmit={login}>
        <div class="p-2">
          <label for="email">Email:</label>
          <input type="text" name="email" class="px-2 ml-2 border border-slate-100 rounded-full" />
        </div>
        <div class="p-2">
          <label for="password">Password:</label>
          <input type="password" name="password" class="px-2 ml-2 border border-slate-100 rounded-full" />
        </div>
        <button type="submit" class="bg-slate-100 p-2 px-4 m-2 rounded">Log in</button>
        {error.length ?
          <div class="bg-red-100 p-1">
            {error}
            <button onClick={()=>setError("")} class="border border-red-200 hover:bg-red-300 ml-2 px-4 py-2 rounded">Dismiss</button>
          </div>
        : null}
      </form>
    </div>
  </>
}