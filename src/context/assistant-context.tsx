import { createContext, useState } from "react";
import { BASE_PATH } from "../lib/constants";

type TAssistantContext = {
  threadId: string;
  threadError: string;
  threadLoading:boolean;
  fetchThread: (userName:string, apiKey:string) => Promise<string | undefined>
};

export const AssistantContext = createContext<TAssistantContext | null>(null);

export function AssistantContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [threadId, setThreadId] = useState("");
  const [threadError, setThreadError] = useState("");
  const [threadLoading, setThreadLoading] = useState(false);

  const fetchThread = async (userName: string, apiKey:string) => {
    if (!userName.trim()) {
      return;
    }
    try {
      setThreadError("");
      setThreadLoading(true);
      const response = await fetch(BASE_PATH + "/create-thread", {
        method: "POST",
        body: JSON.stringify({
          userName,
          apiKey,
        }),
      });
      if (!response.ok) {
        console.error(
          "[CHATBUILD_AI] There Was An issue While Fetching The Thread (Bad Response From Backend) "
        );
        setThreadError("There Was An issue While Fetching The Thread");
        return;
      }
      const data = await response.json();
      if (!("threadId" in data)) {
        console.error(
          "[CHATBUILD_AI] There Was An issue While Fetching The Thread (No Thread Id From Backend) "
        );
        setThreadError("There Was An issue While Fetching The Thread");
        return;
      }
      setThreadId(data.threadId);
      setThreadLoading(false);
      return data.threadId as string
    } catch (error) {
      console.error("[CHATBUILD_AI] ", error);
      setThreadError("[CHATBUILD_AI] Something Unexpected Happen");
      setThreadLoading(false);
      return;
    }
  };

  console.log("Thread Id", threadId);
  return (
    <AssistantContext.Provider
      value={{
        threadId,
        threadError,
        fetchThread,
        threadLoading
      }}
    >
      {children}
    </AssistantContext.Provider>
  );
}
