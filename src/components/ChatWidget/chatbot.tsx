import { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { IoClose } from "react-icons/io5";
import { FaRocketchat } from "react-icons/fa";
import { TChatBoxDetails, WidgetProps } from "./types";
import { cn, getContrast } from "@/lib/utils";
import Widget from "./widget";
import { BASE_PATH } from "@/lib/constants";

const Chatbot = (props: WidgetProps) => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [chatbotDetails, setChatbotDetails] = useState<null | TChatBoxDetails>(
    null
  );

  useEffect(() => {
    const fetchBot = async function () {
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

  return (
    <div
      className="fixed bottom-5 right-5 p-3 z-[150] chatbot-widget"
      style={widgetStyles as React.CSSProperties}
    >
      <Button
        onClick={() => setIsChatbotOpen(!isChatbotOpen)}
        className={cn(
          "chatbot-widget__button w-20 h-14 p-0 justify-center bg-chatbot_primary hover:opacity-80 text-chatbot_primary-foreground flex items-center rounded-full",
        )}
      >
        {isChatbotOpen ? (
          <IoClose className="size-[40%] text-chatbot_primary-foreground cursor-pointer chatbot-widget__icon chatbot-widget__icon--close" />
        ) : (
          <FaRocketchat className="size-[40%] text-chatbot_primary-foreground cursor-pointer chatbot-widget__icon chatbot-widget__icon--open" />
        )}
      </Button>

      {isChatbotOpen ? (
        <Widget
          chatbotDetails={chatbotDetails}
          handleChatBoxClose={handleChatBoxClose}
        />
      ) : null}
    </div>
  );
};

export default Chatbot;
