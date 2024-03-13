import { MessagesContextProvider } from "./context/messages-context";
import { AssistantContextProvider } from "./context/assistant-context";
import App from "./App";
import { checkProps } from "./lib/utils";
import ReactDOM from "react-dom/client";

export interface IAppProps {
  api_key: string;
  text_color?: string;
  theme_color?: string;
}

declare global {
  interface Window {
    Chatbot: {
      mount: (el: Element, props: IAppProps) => void;
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
        <MessagesContextProvider>
          <AssistantContextProvider>            
            <App {...props} />
          </AssistantContextProvider>
        </MessagesContextProvider>
      );
    }
  },
};

window.Chatbot.mount(document.getElementById("root")!, {
  api_key: "6ad046f2-fce5-48a0-b570-10d0deddb747",
  text_color: "#ffffff",
  theme_color: "#FF0000",
});

function ErrorComponent({ message }: { message?: string }) {
  return (
    <div style={{ color: "red" }}>
      {message
        ? message
        : "Please provide a valid apiKey to use the Chatbot. For More Information"}
    </div>
  );
}
