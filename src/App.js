import React, { useEffect } from "react";
import useSWR from "swr";
import "./App.css";
import ShadowRealm from "shadowrealm-api";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css"; //Example style, you can use another

const ShadowRealmRunner = ({ initialCode, dataValue, dataName }) => {
  const CodeRealm = React.useRef(new ShadowRealm())
  const [code, setCode] = React.useState(initialCode);
  const [result, setResult] = React.useState("");
  const runcode = () => {
    try {
      const result = CodeRealm.current.evaluate(code);
      setResult(result);
    } catch (e) {
      setResult(e.message);
    }
  };
  // console.log(dataValue, dataName)
  useEffect(() => {
    const importData = async () => {
      await CodeRealm.current.importValue(fetch,'fetch');
    };
    importData();
  },[]);
  
  return (
    <div style={{ borderBottom: "2px sold gray", marginBottom: "2em" }}>
      <Editor
        value={code}
        onValueChange={(code) => setCode(code)}
        highlight={(code) => highlight(code, languages.js)}
        padding={10}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 12,
          border: "1px solid #ccc",
          margin: "2em 0",
          background: `white`,
        }}
      />
      <button onClick={runcode}>Run Code</button>
      {!!result?.length && (
        <>
          <h3>Result:</h3>
          <code
            style={{ marginBottom: "4em", borderBottom: "2px solid black" }}
          >
            {result}
          </code>
        </>
      )}
    </div>
  );
};

function App() {
  const {data,error} = useSWR('https://api.github.com/repos/matico-platform/matico', (url) => fetch(url).then((r) => r.json()));
  return (
    <div className="App">
      <h1>JavaScript ShadowRealms</h1>
      <h2>Better third party code evaluation, and other stuff</h2>
      <p>
        The{" "}
        <a
          href="
    https://github.com/tc39/proposal-shadowrealm/blob/main/explainer.md"
          target="_blank"
        >
          Javascript ShadowRealm API
        </a>{" "}
        offers the ability to evaluate JavaScript code in a separate
        environment, or realm. These realms are not fully isolated from the main
        thread JavaScript heap, but do have a callabale boundary only controlled
        access to web APIs like Window and Document. So, for running separate
        analytic workflows, potentially from third parties, this is a great way
        to sandbox and segment code.
      </p>
      <p>
        ShadowRealms are in a stage 3 proposal, meaning they are close to
        integration into browser engine. This example uses a polyfill. At the
        moment (Late Summer 2022), Chrome and Firefox teams are developing this
        feature, and Safari currently supports it!
      </p>
      <p>
        Unlike the Containers proposal or the{" "}
        <a href="https://github.com/endojs/endo/" target="_blank">
          Endo sandbox
        </a>
        , ShadowRealms are not fully isolated. Meaning they do have access to
        the same memory heap. However, they do lack access to APIs sometimes
        used in malicious code execution, like Window and Document. For many
        Cross-Site Scripting concerns (XSS), this gets us a step in the right
        direction for safety concerns.
      </p>
      <p>
        The last statement of each evaluated ShadowRealm gets returned as the
        value. Click "Run Code" to see the output below, and modify the code
        block as you'd like.
      </p>
      <ShadowRealmRunner initialCode={"const x = 'Hello World!' \nx;"} />
      <hr />
      <p>
        Another quick example here. In our adventures across the internet, we've all certainly come across
        annoying if not malicious use of <code>Window.alert</code>, for adware and malware. In this case by default,
        the ShadowRealm does not have access to the Window object, so we can't use <code>alert</code> in our code.
      </p>
      <ShadowRealmRunner initialCode={"window.alert('Hello World!')"} />
      <hr />
      <p>
        Another quick example here. In our adventures across the internet, we've all certainly come across
        annoying if not malicious use of <code>Window.alert</code>, for adware and malware. In this case by default,
        the ShadowRealm does not have access to the Window object, so we can't use <code>alert</code> in our code.
      </p>
      <ShadowRealmRunner initialCode={"githubData;"} dataName={"githubData"} dataValue={data}/>
    </div>
  );
}

export default App;
