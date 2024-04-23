import { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { IoClose } from "react-icons/io5";
import { TChatBoxDetails, WidgetProps } from "./types";
import { cn, getContrast } from "@/lib/utils";
import Widget from "./widget";
import { BASE_PATH } from "@/lib/constants";
import { useSuggestions } from "@/hooks/use-suggestion-context";
import { useThread } from "@/hooks/use-thread";
import { useMessages } from "@/hooks/use-messages";
import { SiChatbot } from "react-icons/si";
import WelcomeBox from "./welcomeBox";
const Chatbot = (props: WidgetProps) => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isWelcomeBoxOpen, setIsWelcomeBoxOpen] = useState(true);
  const [chatbotDetails, setChatbotDetails] = useState<null | TChatBoxDetails>(
    null
  );
  const { setMessages } = useMessages();
  const { resetThread } = useThread();
  const { setSuggestion } = useSuggestions();

  useEffect(() => {
    const fetchBot = async function () {
      console.log(BASE_PATH + "/chatbot");
      const response = await fetch(BASE_PATH + `/chatbot/${props.apiKey}`);
      if (!response.ok) {
        console.error(
          "[CHATBUILD_AI] There Was an Error While Loading The Chatbot"
        );
        return;
      }
      const data = await response.json();
      if (!data.data) {
        console.error(
          "[CHATBUILD_AI] There Was an Error While Loading The Chatbot"
        );
        return;
      }
      const Details = data.data;
      const textColor = getContrast(props.themeColor || Details.colorScheme);
      setChatbotDetails({ ...Details, textColor });
    };

    fetchBot();
  }, []);

  const widgetStyles = useMemo(() => {
    return {
      "--chatbot-text-color":
        props.textColor || getContrast(chatbotDetails?.colorScheme || ""),
      "--chatbot-theme-color":
        props.themeColor || chatbotDetails?.colorScheme || "orange",
    };
  }, [chatbotDetails]);

  const handleChatBoxClose = () => {
    setIsChatbotOpen(false);
  };

  if (!chatbotDetails || !chatbotDetails.chatBotName) {
    return <></>;
  }

  const resetChat = () => {
    setMessages([]);
    resetThread();
    setSuggestion([]);
    setIsChatbotOpen(false);
  };

  return (
    <div
      className="fixed bottom-5 right-5 p-3 z-[150] chatbot-widget"
      style={widgetStyles as React.CSSProperties}
    >
      {isWelcomeBoxOpen && !isChatbotOpen ? (
        <WelcomeBox
          setIsChatbotOpen={setIsChatbotOpen}
          setIsWelcomeBoxOpen={setIsWelcomeBoxOpen}
        />
      ) : null}

      <Button
        onClick={() => setIsChatbotOpen(!isChatbotOpen)}
        className={cn(
          "chatbot-widget__button group active:scale-75 transition-all duration-300 hover:scale-105 w-20 h-14 p-0 justify-center bg-chatbot_primary hover:opacity-80 text-chatbot_primary-foreground flex items-center rounded-full"
        )}
      >
        {isChatbotOpen ? (
          <IoClose className="size-[50%]  text-chatbot_primary-foreground cursor-pointer chatbot-widget__icon chatbot-widget__icon--close" />
        ) : (
          <SiChatbot className="size-[50%]  text-chatbot_primary-foreground cursor-pointer chatbot-widget__icon chatbot-widget__icon--open" />
        )}
      </Button>
      {isChatbotOpen ? (
        <Widget
          resetChat={resetChat}
          chatbotDetails={chatbotDetails}
          handleChatBoxClose={handleChatBoxClose}
        />
      ) : null}
    </div>
  );
};

export default Chatbot;
