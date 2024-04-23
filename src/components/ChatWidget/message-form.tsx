import { useState } from "react";
import { useThread } from "@/hooks/use-thread";
import { useMessages } from "@/hooks/use-messages";
import { BASE_PATH } from "@/lib/constants";
import { useSuggestions } from "@/hooks/use-suggestion-context";
import { Icons } from "../ui/Icons";

type MessageFormProps = {
  apiKey: string;
  scrollToBottom: () => void;
};

const MessageForm = ({ apiKey, scrollToBottom }: MessageFormProps) => {
  const [userMessage, setUserMessage] = useState("");
  const { setSuggestion, suggestion } = useSuggestions();
  const { setMessages, setGenerationLoading, generationLoading } =
    useMessages();
  const { threadId, threadLoading } = useThread();

  const handleUserMessage = async (message: string) => {
    try {
      if (!apiKey || !threadId || !message.trim()) return;
      setUserMessage("");
      setGenerationLoading(true);
      setMessages((prev) => [...prev, { from: "user", message: message }]);
      scrollToBottom();
      const response = await fetch(BASE_PATH + "/answer-user", {
        method: "POST",
        body: JSON.stringify({
          threadId,
          message: message,
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
      scrollToBottom();
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
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleUserMessage(userMessage);
  };

  return (
    <div className=" px-4 space-y-3   chatbot-widget__message-form">
      <div className="chatbot_suggestion_container relative">
        <div className="py-1 flex gap-3 w-full overflow-x-auto chatbot_scrollbar  ">
          {suggestion.map((item, index) => (
            <SuggestionButton
              key={index}
              text={item}
              disabled={!threadId || generationLoading || threadLoading}
              onClick={() => {
                setSuggestion((prev) => {
                  let newQuestions = [...prev];
                  newQuestions.splice(index, 1);
                  return newQuestions;
                });

                handleUserMessage(item);
              }}
            />
          ))}
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-row items-center h-11 text-chatbot_foreground focus-within:ring-1 focus-within:ring-chatbot_primary rounded-md border border-input bg-transparent shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1  disabled:cursor-not-allowed disabled:opacity-50 w-full  justify-end focus-visible:ring-transparent focus:ring-0 focus px-4  text-sm"
      >
        <input
          type={"text"}
          placeholder="Message..."
          aria-label="Type here"
          value={userMessage}
          disabled={!threadId || generationLoading || threadLoading}
          onChange={(e) => setUserMessage(e.target.value)}
          className="chatbot-widget__message-form--input flex-1  py-2 focus:outline-none   "
        />
        <button
          type="submit"
          className="border-s-0 chatbot-widget__message-form--submit text-chatbot_primary disabled:opacity-55 "
          disabled={
            !threadId || generationLoading || userMessage.trim().length <= 0
          }
        >
          <Icons.messageIcon />
        </button>
      </form>
    </div>
  );
};

export default MessageForm;

const SuggestionButton = ({
  text,
  onClick,
  disabled,
}: {
  text: string;
  onClick: () => void;
  disabled?: boolean;
}) => {
  return (
    <button
      disabled={disabled}
      className=" text-nowrap bg-chatbot_primary disabled:opacity-65 text-chatbot_primary-foreground hover:opacity-90 px-2 py-1 rounded-md"
      onClick={onClick}
    >
      {text}
    </button>
  );
};
