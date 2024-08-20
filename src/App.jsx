import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.scss";
import {RouterProvider} from "react-router-dom";
import router from "./router/Router.jsx";

function App() {
  // const [greetMsg, setGreetMsg] = useState("");
  // const [name, setName] = useState("");
  //
  // async function greet() {
  //   // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
  //   setGreetMsg(await invoke("greet", { name }));
  // }

  return (
      <RouterProvider router={router}/>
    // <div className="container">
    //   <form
    //     className="row"
    //     onSubmit={(e) => {
    //       e.preventDefault();
    //       greet();
    //     }}
    //   >
    //     <input
    //       id="greet-input"
    //       onChange={(e) => setName(e.currentTarget.value)}
    //       placeholder="Enter a name..."
    //     />
    //     <button type="submit">Greet</button>
    //   </form>
    //
    //   <p>{greetMsg}</p>
    //  </div>
  );
}

export default App;
