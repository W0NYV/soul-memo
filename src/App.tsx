import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import { open } from '@tauri-apps/api/dialog'
import "./App.css";
import { writeTextFile, BaseDirectory } from '@tauri-apps/api/fs';

interface Radio {
  label: string
  value: string
}

function App() {
  // const [greetMsg, setGreetMsg] = useState("");
  // const [name, setName] = useState("");

  const [soulPathList, setSoulPathList] = useState<Array<string>>([]);
  const [memoIndex, setMemoIndex] = useState<string>("1");

  const changeRadioValue = (event: React.ChangeEvent<HTMLInputElement>) => setMemoIndex(event.target.value);
  const radioButtons: Radio[] = [
    {label: "1", value: "1"},
    {label: "2", value: "2"},
    {label: "3", value: "3"},
    {label: "4", value: "4"}
  ]

  // async function greet() {
  //   // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
  //   setGreetMsg(await invoke("greet", { name }));
  // }

  function executeCommands() {
    invoke("simple_command");
  }

  function openDialog() {
    open().then(file => {
      console.log(file);
      setSoulPathList([...soulPathList, file as string]);
    });
  }

  function deleteFromList(_path: string) {
    setSoulPathList(soulPathList.filter((path, index) => (path !== _path)));
  }

  async function createMemo() {

    if(soulPathList.length == 16) {
      let str: string = soulPathList.toString().replace(/,/g, '\n');

      await writeTextFile('footage' + memoIndex + '.txt', str, { dir: BaseDirectory.Desktop });
      alert('Created!');
    } else {
      alert('だめよーだめだめ');
    }

  }

  function resetPathList() {
    setSoulPathList([]);
  }

  return (
    <div className="container">
      <h1>Soul Memo</h1>

      {/* <div className="row">
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank">
          <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <p>Click on the Tauri, Vite, and React logos to learn more.</p> */}

      {/* <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
      </form>

      <p>{greetMsg}</p> */}

      <div className="row">
        <button onClick={openDialog}>Open dialog</button>
        <button onClick={resetPathList}>Reset list</button>
      </div>

      <p>{"ソウルの数: " + soulPathList.length}</p>

      <ul>
        {soulPathList.map(path =>
          <div className="row-left">
            <button className="delete-button" onClick={() => deleteFromList(path)}>delete</button>
            <li>{path}</li>
          </div>
        )}
      </ul>

      <div className="row">
        {radioButtons.map(radio => {
          return (
            <div className="col-4">
              <input className="form-check-input" type="radio" name="memoIndex" value={radio.value} checked={radio.value === memoIndex} onChange={changeRadioValue} />
              <label className="form-check-label">
                <span className="fs-6">{radio.label}</span>
              </label>
            </div>
          )
        })}
      </div>

      <button onClick={createMemo}>Create memo</button>

    </div>
  );
}

export default App;
