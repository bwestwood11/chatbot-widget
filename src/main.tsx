import ReactDOM from "react-dom";
import App from "./App";

export interface IAppProps {
  apiKey: string;
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
    if (!props.apiKey) {
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
    ReactDOM.render(<App {...props} />, el);
  },
};





