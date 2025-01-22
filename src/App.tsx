import "@picocss/pico/css/pico.min.css";
import "./App.css";
import { useDocument } from "@automerge/automerge-repo-react-hooks";
import { updateText } from "@automerge/automerge/next";
import type { AutomergeUrl } from "@automerge/automerge-repo";
import QRCode from "react-qr-code";

export interface Task {
  title: string;
  done: boolean;
}

export interface TaskList {
  tasks: Task[];
}

function App({ docUrl }: { docUrl: AutomergeUrl }) {
  const [doc, changeDoc] = useDocument<TaskList>(docUrl);
  console.log(docUrl);

  return (
    <>
      <header>
        <QRCode
          value={document.URL}
          bgColor={"#242424"}
          fgColor={"#ffffff"}
          style={{ paddingBottom: "10px" }}
        />
        <h1>Automerge Task List</h1>
      </header>

      <button
        type="button"
        onClick={() => {
          changeDoc((d) =>
            d.tasks.unshift({
              title: "",
              done: false,
            }),
          );
        }}
      >
        <b>+</b> New task
      </button>

      <div id="task-list">
        {doc &&
          doc.tasks?.map(({ title, done }, index) => (
            <div className="task" key={index}>
              <input
                type="checkbox"
                checked={done}
                onChange={() =>
                  changeDoc((d) => {
                    d.tasks[index].done = !d.tasks[index].done;
                  })
                }
              />

              <input
                type="text"
                placeholder="What needs doing?"
                value={title || ""}
                onChange={(e) =>
                  changeDoc((d) => {
                    // Use Automerge's updateText for efficient multiplayer edits
                    // (as opposed to replacing the whole title on each edit)
                    updateText(d.tasks[index], ["title"], e.target.value);
                  })
                }
                style={done ? { textDecoration: "line-through" } : {}}
              />
            </div>
          ))}
      </div>

      <footer>
        <p className="read-the-docs">
          Powered by Automerge + Vite + React + TypeScript
        </p>
      </footer>
    </>
  );
}

export default App;
