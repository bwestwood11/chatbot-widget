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

type WidgetProps = {
  chatbotDetails: TChatBoxDetails;
  handleChatBoxClose: () => void;
};
const Widget = ({ chatbotDetails, handleChatBoxClose }: WidgetProps) => {
  const { setMessages, messages, generationLoading } = useMessages();
  const { fetchThread, threadError, threadId, threadLoading } = useThread();
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
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages, generationLoading]);

  return (
    <div className="chatbot-widget__body bg-chatbot_background absolute mb-4 break-words flex flex-col bottom-full justify-between shadow-lg right-0 rounded-2xl w-96 h-[60dvh]">
      {/* Header Of The Chatbot Widget */}
      <div className="chatbot-widget__header justify-between p-3 flex items-center bg-chatbot_primary text-chatbot_primary-foreground rounded-t-2xl rounded-b-none ">
        <div className="flex gap-3 items-center">
          <LuDot className="text-green-500" size={40} />
          <h2 className="chatbot-widget__header-heading text-lg font-bold text-center text-chatbot_primary-foreground">
            {chatbotDetails.chatBotName || "Chatty Assistant"}
          </h2>
        </div>
        <div className="flex space-x-3">
          <FaMinus
            onClick={() => handleChatBoxClose()}
            role="button"
            aria-label="Close Chatbot Widget"
            className="hover:opacity-60"
          />
          <IoClose
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
              className="flex flex-row  p-4 items-center w-full chatbot-widget__username"
            >
              <label className="sr-only">Enter Your Name</label>
              <input
                type={"text"}
                placeholder="Enter Your Name To Continue"
                aria-label="Type here"
                className="chatbot-widget__username-input h-9 rounded-md border border-input bg-transparent text-chatbot_foreground py-1  shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1  disabled:cursor-not-allowed disabled:opacity-50 w-full flex justify-end items-end focus-visible:ring-transparent focus:ring-0 focus px-4 rounded-r-none text-sm"
                onChange={(e) => setUserNameInput(e.target.value)}
                value={userNameInput}
              />
              <Button
                type="submit"
                aria-label="Enter Your Name"
                className="border-s-0 chatbot-widget__username-submit"
              >
                {threadLoading ? (
                  <LuLoader size={20} className=" animate-spin" />
                ) : (
                  <LuArrowUpRight size={20} />
                )}
              </Button>
            </form>
          )}
          {Boolean(threadId) && !threadLoading ? <Messages logoUrl={chatbotDetails.logoUrl} /> : null}
          <div ref={messagesEndRef}></div>
        </ScrollArea>
      )}
      <div>
        <MessageForm
          scrollToBottom={scrollToBottom}
          apiKey={chatbotDetails.apiKey}
        />
      </div>
    </div>
  );
};

export default Widget;
