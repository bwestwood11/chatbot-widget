import { MessagesContextProvider } from "./context/messages-context";
import { AssistantContextProvider } from "./context/assistant-context";
import App from "./App";
import { checkProps } from "./lib/utils";
import ReactDOM from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";


export interface IAppProps {
  api_key: string;
  text_color?: string;
  theme_color?: string;
}

declare global {
  interface Window {
    Chatbot: {
      mount: (el: Element, props: IAppProps) => void;
      loadCss:(cssUrl:string) => void
    };
  }
}

window.Chatbot = {
  mount: function (el: Element, props: IAppProps) {
    let root: ReactDOM.Root | null = null;

    root = ReactDOM.createRoot(el);

    if (!checkProps(props)) {
      root.render(
        <ErrorComponent message="Invalid props. Please check the console for details." />
      );
      return;
    } else {
      root.render(
        <ErrorBoundary onError={(error)=>console.error("CHATBOT_WIDGET: " + error)} fallback={<div></div>}>
        <MessagesContextProvider>
          <AssistantContextProvider>  
                  
            <App {...props} />
          </AssistantContextProvider>
        </MessagesContextProvider>
        </ErrorBoundary>
      );
    }
  },
  loadCss:function (cssUrl:string) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = cssUrl; 
    document.head.appendChild(link);
  }
};

// window.Chatbot.mount(document.getElementById("root")!, {
//   api_key: "84e23d5b-1257-40d4-a811-22f12bf26f7d",
//   text_color: "#ffffff",
//   theme_color: "#FF0000",
// });

function ErrorComponent({ message }: { message?: string }) {
  return (
    <div style={{ color: "red" }}>
      {message
        ? message
        : "Please provide a valid apiKey to use the Chatbot. For More Information"}
    </div>
  );
}
