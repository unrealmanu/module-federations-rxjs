import React, { Suspense, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { concat, Observable, Observer, defer } from "rxjs";
import { last } from "rxjs/operators";

/*
//LOAD FROM REMOTE
const Comp = React.lazy(() => import("sharing/Block"));
*/
function loadComponent$(scope: string, module: string) {
  return defer(async () => {
    // Initializes the share scope. This fills it with known provided modules from this build and all remotes
    //@ts-ignore
    await __webpack_init_sharing__("default");
    //@ts-ignore
    const container = window[scope]; // or get the container somewhere else
    // Initialize the container, it may provide shared modules
    //@ts-ignore
    await container.init(__webpack_share_scopes__.default);
    //@ts-ignore
    const factory = await window[scope].get(module);
    const Module = factory();
    return Module;
  });
}

const loadScript$ = function (url: string): Observable<any> {
  return new Observable((observer: Observer<any>) => {
    const element: HTMLScriptElement = document.createElement("script");
    element.src = url;
    element.type = "text/javascript";
    element.async = true;

    element.onload = () => {
      observer.next(true);
      document.head.removeChild(element);
      observer.complete();
    };

    element.onerror = () => {
      observer.error(new Error(`failed to load ${url}`));
    };

    document.head.appendChild(element);
  });
};

export const App: React.FC = () => {
  const [components, setComponents] = useState<any>(undefined);

  useEffect(() => {
    concat(
      loadScript$("http://localhost:3002/Block.js"),
      loadComponent$("sharing", "./Block")
    )
      .pipe(last())
      .subscribe(
        (module: any) => {
          const customProps = { test: undefined };
          setComponents(module.default(customProps));
          /*
          // override props.children of remote components
          React.Children.map(module.default(customProps), (child, index) => {
            setComponents(
              React.cloneElement(child, { children: "override children" })
            );
          });
          */
        },
        (err: Error) => {
          console.error(err);
        },
        () => {
          console.log("complete");
        }
      );
  }, []);

  return (
    <Suspense fallback={<>Loading...</>}>
      my app
      <br />
      {/*remote <Comp />*/}
      <br />
      Modular load with observable {components}
    </Suspense>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
