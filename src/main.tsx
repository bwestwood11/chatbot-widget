import ReactDOM from "react-dom";
import App from "./App";
import { MessagesContextProvider } from "./context/messages-context";
import { AssistantContextProvider } from "./context/assistant-context";
import './index.css'
export interface IAppProps {
  api_key: string;
  text_color?:string;
  theme_color?:string;
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
    if (!props.api_key) {
      console.error("ERROR: apiKey is required for The Chatbot.");
      ReactDOM.render(
        <div style={{ color: "red" }}>
          Please provide a valid apiKey to use the Chatbot. For More Information
          see the <a href="#">Docs</a>
        </div>,
        el
      );
      return;
    }
    ReactDOM.render(
      <MessagesContextProvider>
        <AssistantContextProvider>
          <App {...props} />
        </AssistantContextProvider>
      </MessagesContextProvider>,
      el
    );
  },
};


window.Chatbot.mount(document.getElementById('root')!,{api_key:"abff3842-d402-4a40-8787-71079b9649ac",   });