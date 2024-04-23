import { LuArrowUpRight, LuDot, LuLoader } from "react-icons/lu";
import { TChatBoxDetails } from "./types";
import { FaMinus } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useMessages } from "@/hooks/use-messages";
import { useThread } from "@/hooks/use-thread";
import { FormEvent, useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Messages from "./messages";
import { Button } from "@/components/ui/button";
import MessageForm from "./message-form";
import { useSuggestions } from "@/hooks/use-suggestion-context";

type WidgetProps = {
  chatbotDetails: TChatBoxDetails;
  handleChatBoxClose: () => void;
  resetChat: () => void;
};
const Widget = ({
  chatbotDetails,
  handleChatBoxClose,
  resetChat,
}: WidgetProps) => {
  const { setMessages, messages, generationLoading } = useMessages();
  const { fetchThread, threadError, threadId, threadLoading } = useThread();
  const { setSuggestion } = useSuggestions();
  const [userNameInput, setUserNameInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null); // Ref for the element to scroll to

  const handleUserNameFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userNameInput) {
      setMessages((prev) => [
        ...prev,
        {
          from: "chatbot",
          message:
            chatbotDetails?.welcomeMessage || "Hello! How can I help you?",
        },
      ]);

      fetchThread(userNameInput, chatbotDetails.apiKey);
      setSuggestion(chatbotDetails.suggestionQuestions);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, generationLoading]);

  return (
    <div className="chatbot-widget__body bg-chatbot_background    sm:mb-4 break-words flex flex-col  justify-between shadow-lg right-0 rounded-2xl fixed  sm:absolute sm:bottom-full bottom-0    w-screen h-screen sm:w-96 sm:h-[min(80dvh,550px)] pb-2">
      {/* Header Of The Chatbot Widget */}
      <div className="chatbot-widget__header justify-between p-3 flex items-center bg-chatbot_primary text-chatbot_primary-foreground sm:rounded-t-2xl rounded-b-none ">
        <div className="flex gap-3 items-center">
          <LuDot className="text-green-500" size={40} />
          <h2 className="chatbot-widget__header-heading text-lg font-bold text-center text-chatbot_primary-foreground">
            {chatbotDetails.chatBotName || "Chatty Assistant"}
          </h2>
        </div>
        <div className="flex space-x-3">
          <IoClose
            onClick={() => resetChat()}
            role="button"
            aria-label="Close Chatbot Widget"
            className="hover:opacity-60"
          />
          <FaMinus
            onClick={() => handleChatBoxClose()}
            role="button"
            aria-label="Close Chatbot Widget"
            className="hover:opacity-60"
          />
        </div>
      </div>

      {Boolean(threadError) && (
        <div className=" px-4 py-2">
          <p>{threadError}</p>
        </div>
      )}
      {!Boolean(threadError) && (
        <ScrollArea className="h-full w-full space-y-2 text-sm text-chatbot_primary-foreground">
          {/* Logo and The Name of the business */}
          <div className="flex flex-col w-full items-center mb-6 chatbot-widget__details-wrapper">
            <img
              src={chatbotDetails?.logoUrl || "https://via.placeholder.com/50"}
              alt="logo"
              width={80}
              height={80}
              className="w-20 h-20 rounded-full object-contain mt-3 chatbot-widget__details-logo"
            />
            <h2 className="text-lg font-bold text-center text-chatbot_foreground chatbot-widget__details-heading">
              {chatbotDetails?.chatBotName}
            </h2>
            <p className="text-chatbot_muted-foreground px-10 text-center chatbot-widget__header-description">
              {chatbotDetails.chatBotDescription ||
                "We are here to help you with any questions in regards to our company and our services"}
            </p>
          </div>

          {!threadId && (
            <form
              onSubmit={handleUserNameFormSubmit}
              className=" chatbot-widget__username p-4 space-y-2 "
            >
              <label className="text-chatbot_foreground font-semibold px-1">
                Enter Your Name
              </label>
              <div className="flex flex-row   items-center w-full gap-3">
                <input
                  type={"text"}
                  placeholder="👋 Let's be friends, okay?"
                  aria-label="Type here"
                  className="chatbot-widget__username-input  h-9 rounded-md border border-input bg-transparent text-chatbot_foreground  shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1  disabled:cursor-not-allowed disabled:opacity-50 w-full flex justify-end items-end focus-visible:ring-transparent focus:ring-0 focus px-4 rounded-r-none text-sm"
                  onChange={(e) => setUserNameInput(e.target.value)}
                  value={userNameInput}
                />
                <Button
                  type="submit"
                  aria-label="Enter Your Name"
                  className="border-s-0 h-9 chatbot-widget__username-submit"
                >
                  {threadLoading ? (
                    <LuLoader size={20} className=" animate-spin" />
                  ) : (
                    <LuArrowUpRight size={20} />
                  )}
                </Button>
              </div>
            </form>
          )}

          {Boolean(threadId) && !threadLoading ? (
            <Messages logoUrl={chatbotDetails.logoUrl} />
          ) : null}
          <div ref={messagesEndRef}></div>
        </ScrollArea>
      )}

      <MessageForm
        scrollToBottom={scrollToBottom}
        apiKey={chatbotDetails.apiKey}
      />
    </div>
  );
};

export default Widget;
