import { LuArrowUpRight } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useThread } from "@/hooks/use-thread";
import { useMessages } from "@/hooks/use-messages";
import { BASE_PATH } from "@/lib/constants";

type MessageFormProps = {
  apiKey: string;
  scrollToBottom: () => void
};

const MessageForm = ({ apiKey,scrollToBottom }: MessageFormProps) => {
  const [userMessage, setUserMessage] = useState("");
  const { setMessages, setGenerationLoading, generationLoading } =
    useMessages();
  const { threadId,threadLoading } = useThread();
  const handleUserMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      if (!apiKey || !threadId || !userMessage.trim()) return;
      setUserMessage("");
      setGenerationLoading(true);
      setMessages((prev) => [...prev, { from: "user", message: userMessage }]);
      scrollToBottom()
      const response = await fetch(BASE_PATH + "/answer-user", {
        method: "POST",
        body: JSON.stringify({
          threadId,
          message: userMessage,
          apiKey: apiKey,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        console.log("Response not ok");
        throw new Error("Something Went Wrong");
      }
      if (typeof data !== "string") {
        console.log("Response Has Errors");
        throw new Error(data.error);
      }
      setMessages((prev) => [...prev, { from: "chatbot", message: data }]);
      scrollToBottom()
    } catch (error) {
      console.log({ error });
      setMessages((prev) => [
        ...prev,
        {
          from: "error",
          message: "There Was an Issue While Generating Message",
        },
      ]);
    } finally {
      setGenerationLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleUserMessage}
      className="flex flex-row  px-4 items-center  chatbot-widget__message-form"
    >
      <input
        type={"text"}
        placeholder="Message..."
        aria-label="Type here"
        value={userMessage}
        disabled={!threadId || generationLoading || threadLoading}
        onChange={(e) => setUserMessage(e.target.value)}
        className="chatbot-widget__message-form--input h-9 text-chatbot_foreground rounded-md border border-input bg-transparent py-1  shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1  disabled:cursor-not-allowed disabled:opacity-50 w-full flex justify-end items-end focus-visible:ring-transparent focus:ring-0 focus px-4 rounded-r-none text-sm"
      />
      <Button
        type="submit"
        className="border-s-0 chatbot-widget__message-form--submit"
        disabled={!threadId || generationLoading}
      >
        <LuArrowUpRight size={20} />
      </Button>
    </form>
  );
};

export default MessageForm;
