import {
  Dispatch,
  SetStateAction,
  createContext,
  useState,
} from "react";

export type TMessage = {
  message: string;
  from: "chatbot" | "user" | "error";
}

type TMessagesContext = {
  messages: TMessage[];
  setMessages: Dispatch<SetStateAction<TMessage[]>>;
  generationLoading:boolean
  setGenerationLoading: Dispatch<SetStateAction<boolean>>;

};

export const MessagesContext = createContext<TMessagesContext | null>(null);

export function MessagesContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [messages, setMessages] = useState<TMessage[]>([]);
  const [generationLoading,setGenerationLoading] = useState(false)
  console.log("Messages", messages);
  return (
    <MessagesContext.Provider value={{messages,setMessages,generationLoading,setGenerationLoading}}>{children}</MessagesContext.Provider>
  );
}