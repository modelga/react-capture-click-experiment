import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef
} from "react";
import "./styles.css";

const CallbackerContext = createContext(undefined);
function CallbackerContainer({ children }) {
  const items = useRef([]);
  function add(el) {
    items.current.push(el);
  }
  function remove(id) {
    items.current = items.current.filter((p) => p.id !== id);
  }
  useEffect(() => {
    console.log("items updated ", items.current.length);
  }, [items.current]);
  return (
    <CallbackerContext.Provider
      value={{ add, remove, length: items.current.length }}
    >
      {children}
    </CallbackerContext.Provider>
  );
}
function Comp({ children, onClick, index }) {
  const ref = useRef(null);
  const { add, remove, length } = useContext(CallbackerContext);
  useEffect(() => {
    const id = ref.current;
    console.log("Creating ", index, length);
    add({ prevent: 1, stop: 2, index, id });
    return () => {
      remove(id);
      console.log("Removing ", index);
    };
  }, [ref.current]);
  return (
    <p onClick={onClick}>
      <span ref={ref}>TAG {index}</span>: {children} {length}
    </p>
  );
}

function article(name) {
  return {
    name
  };
}

export default function App() {
  const list = ["A", "B", "C", "D"].map(article);
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="App">
      <h1>Hello CodeSandbox {expanded}</h1>
      <h2 onClick={() => setExpanded(null)}>
        Start editing to see some magic happen!
      </h2>
      {list.map((value, index) => {
        return (
          <CallbackerContainer key={index}>
            <span
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                return;
              }}
              onClickCapture={(e) => {
                e.stopPropagation();
                e.preventDefault();
                return;
              }}
            >
              {" "}
              {expanded !== index && (
                <Comp onClick={() => setExpanded(index)} index={index}>
                  {value.name}
                </Comp>
              )}
            </span>
          </CallbackerContainer>
        );
      })}
    </div>
  );
}
