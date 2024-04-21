import { GoDotFill } from "react-icons/go";
import { useMessages } from "@/hooks/use-messages";
import { cn } from "@/lib/utils";
import Markdown from "react-markdown";
import { TMessage } from "@/context/messages-context";

const Messages = ({ logoUrl }: { logoUrl: string }) => {
  const { messages, generationLoading } = useMessages();
  return (
    <div>
      {messages.map((message, index) => (
        <Message logoUrl={logoUrl} message={message} key={`Message-${index}`} />
      ))}

      {generationLoading && (
        <div className="px-4">
          <p className="flex break-words py-1 text-start  rounded-lg mb-2 w-1/3 text-chatbot_message-foreground text-sm">
            {Array.from({ length: 3 }).map((_, index) => (
              <GoDotFill
                key={`LoadingPointsWidget-${index}`}
                className={`animate-bounce delay-${index * 100} `}
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
                        src={
                          logoUrl ||
                          "https://via.placeholder.com/50"
                        }
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
