import { GoDotFill } from "react-icons/go";
import { useMessages } from "@/hooks/use-messages";
import { cn } from "@/lib/utils";
import Markdown from "react-markdown";
import { TMessage } from "@/context/messages-context";
import { Button } from "../ui/button";
import { LuArrowUpRight } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import { useState } from "react";

const Messages = ({ logoUrl }: { logoUrl: string }) => {
  const { messages, generationLoading } = useMessages();
  const [showEmailCapture, setShowEmailCapture] = useState(true);
  return (
    <div className="pb-5">
      {messages.map((message, index) => (
        <Message logoUrl={logoUrl} message={message} key={`Message-${index}`} />
      ))}

      {showEmailCapture && messages.length === 3 && (
        <div className="px-4 mt-4 ">
          <form className=" chatbot-widget__username p-4 relative rounded-lg space-y-2 bg-chatbot_secondary ">
            <button
              type="button"
              className="text-chatbot_secondary-foreground absolute right-2 top-2"
              onClick={() => setShowEmailCapture(false)}
            >
              {" "}
              <IoClose size={15} />
            </button>{" "}
            <label className="text-chatbot_foreground font-semibold px-1">
              Enter Your Email
            </label>
            <div className="flex flex-row   items-center w-full gap-3">
              <input
                type={"text"}
                placeholder="your@email.com"
                aria-label="Type here"
                className="chatbot-widget__username-input  h-9 rounded-md border border-input bg-chatbot_background text-chatbot_foreground  shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-chatbot_foreground/60 focus-visible:outline-none focus-visible:ring-1  disabled:cursor-not-allowed disabled:opacity-50 w-full flex justify-end items-end focus-visible:ring-transparent focus:ring-0 focus px-4 rounded-r-none text-sm"
                // onChange={(e) => setUserNameInput(e.target.value)}
                // value={userNameInput}
              />
              <Button
                type="submit"
                aria-label="Enter Your Name"
                className="border-s-0 h-9 chatbot-widget__username-submit"
              >
                <LuArrowUpRight size={20} />
              </Button>
            </div>
            <p className="text-chatbot_secondary-foreground/70 font-semibold px-2">
              If you would like us to contact you
            </p>
          </form>
        </div>
      )}

      {generationLoading && (
        <div className="px-4">
          <p className="flex break-words py-1 text-start  rounded-lg mb-2 w-1/3 text-chatbot_message-foreground text-sm">
            {Array.from({ length: 3 }).map((_, index) => (
              <GoDotFill
                key={`LoadingPointsWidget-${index}`}
                style={{
                  animationDelay: `${index * 300}ms`,
                  animationDuration: "900ms",
                }}
                className={` text-chatbot_foreground animate-pulse `}
                size={18}
              />
            ))}
          </p>
        </div>
      )}
    </div>
  );
};

export default Messages;

const Message = ({
  message,
  logoUrl,
}: {
  message: TMessage;
  logoUrl: string;
}) => {
  return (
    <div
      className={cn(
        "flex flex-1 px-4 gap-2",
        message.from === "user"
          ? "justify-end w-full chatbot-widget__user-message"
          : "justify-start w-full chatbot-widget__chatbot-message"
      )}
    >
      {message?.from === "chatbot" ? (
        <img
          src={logoUrl || "https://via.placeholder.com/50"}
          alt="logo"
          width={12}
          height={12}
          loading="lazy"
          className="size-4 rounded-full object-contain mt-3"
        />
      ) : null}
      <div
        className={cn(
          "flex gap-y-1",
          message.from === "user"
            ? "justify-end p-1.5 rounded-3xl w-3/4"
            : "justify-start w-3/4"
        )}
      >
        <div
          className={cn(
            message.from === "user"
              ? "w-fit px-3 py-2 rounded-lg bg-chatbot_primary text-chatbot_primary-foreground shadow-md text-end mb-2"
              : message.from === "chatbot"
              ? "w-fit px-3 bg-chatbot_message shadow-md py-2 text-start text-chatbot_message-foreground rounded-lg mb-2"
              : "w-fit px-3 bg-slate-50 shadow-md py-2 text-start text-red-600 rounded-lg mb-2"
          )}
        >
          <Markdown>{message.message}</Markdown>
        </div>
      </div>
    </div>
  );
};
