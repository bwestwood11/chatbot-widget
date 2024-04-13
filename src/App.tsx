import { FaRocketchat } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { FaMinus } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import { LuArrowUpRight, LuDot } from "react-icons/lu";
import { useThread } from "@/hooks/use-thread";
import { useMessages } from "@/hooks/use-messages";
import { cn, getContrast } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GoDotFill } from "react-icons/go";
import "./index.css";
import { IAppProps } from "./main";

// const BASEPATH = "http://localhost:3000/api";
const BASEPATH = "https://www.chatbuild.io/api";

type TCHATBOXDETAILS = {
  chatBotName: string;
  colorScheme: string;
  welcomeMessage: string;
  apiKey: string;
  logoUrl: string;
  textColor: string;
};

const Widget = (props: IAppProps) => {
  const [chatBox, setChatBox] = useState(false);
  const { messages, setMessages } = useMessages();
  const [userMessage, setUserMessage] = useState("");
  const { threadId, setThreadId } = useThread();
  const [threadLoading, setThreadLoading] = useState(false);
  const [generationLoading, setGenerationLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [chatbotDetails, setChatbotDetails] = useState<null | TCHATBOXDETAILS>(
    null
  );
  const [isUserNameExist, setIsUserNameExist] = useState<string>("");
  const [userNameInput, setNameInput] = useState("");

  const BackgroundStyles = {
    backgroundColor: props.theme_color || chatbotDetails?.colorScheme,
  };

  const widgetStyles = {
    "--chatbot-text-color":
      props.text_color || getContrast(chatbotDetails?.colorScheme || ""),
    "--chatbot-theme-color":
      props.theme_color || chatbotDetails?.colorScheme || "orange",
  };

  // const scrollTriggerRef = useRef<>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null); // Ref for the element to scroll to
  const widgetContainerRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleUserName = async (e: any) => {
    e.preventDefault();
    try {
      setError("");
      setIsUserNameExist(userNameInput);
      setThreadLoading(true);
      if (!userNameInput || !props.api_key) return;
      setMessages((prev) => [
        ...prev,
        {
          from: "chatbot",
          message:
            chatbotDetails?.welcomeMessage || "Hello! How can I help you?",
        },
      ]);
      const response = await fetch(BASEPATH + "/create-thread", {
        method: "POST",
        body: JSON.stringify({
          userName: userNameInput,
          apiKey: props.api_key,
        }),
      });
      if(!response.ok){
        throw Error("Bad Response From Backend")
      }

      const data = await response.json()
      if ((!("threadId" in data))) {
        throw Error("No Thread Id From Backend")
      }
      setThreadId(data.threadId);
      setThreadLoading(false);

    } catch (error) {
      console.error(error)
      setError("Something Went Wrong");

    }
  };

  useEffect(() => {
    const fetchBot = async function () {
      const response = await fetch(BASEPATH + `/chatbot/${props.api_key}`);
      if (!response.ok) {
        return;
      }
      const data = await response.json();
      if (!data.data) {
        return;
      }

      if (!data.data) {
        return;
      }
      const Details = data.data;

      const textColor = getContrast(props.theme_color || Details.colorScheme);

      setChatbotDetails({ ...Details, textColor });
    };

    fetchBot();
  }, []);

  const handleUserMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setUserMessage("");

      setGenerationLoading(true);

      setMessages((prev) => [...prev, { from: "user", message: userMessage }]);

      const response = await fetch(BASEPATH + "/answer-user", {
        method: "POST",
        body: JSON.stringify({
          threadId,
          message: userMessage,
          apiKey: props.api_key,
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
    } catch (error) {
      console.log({ error });
      setMessages((prev) => [
        ...prev,
        {
          from: "chatbot",
          message: "There Was an Issue While Generating Message",
        },
      ]);
    } finally {
      setGenerationLoading(false);
    }
  };

  const handleChatBox = () => {
    setChatBox(!chatBox);
  };

  // calls the scrollToBottom function when the messages array changes to scroll to the bottom of the chat area
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div

      style={widgetStyles as React.CSSProperties} // By default variables are not a valid typescript type for css properties
      className="fixed bottom-5 right-5 p-3 z-[150] chatbot-widget"
    >
      {/* The widget at the bottom right which starts a new thread onClick */}
      <Button
       onClick={()=> setChatBox(!chatBox)}
        className="p-7 justify-center bg-bg hover:bg-bg hover:opacity-70 text-text flex items-center rounded-full "
      >
        {chatBox ? (
          <IoClose className="w-8 h-8 text-white cursor-pointer" />
        ) : (
          <FaRocketchat className="w-8 h-8 text-white cursor-pointer" />
        )}
      </Button>

      {/* Parent div of the chat box */}
      {chatBox && (
        <div
          ref={widgetContainerRef}
          className="bg-white absolute mb-4 break-words flex flex-col bottom-full justify-between shadow-lg right-0 rounded-2xl w-96 h-[60dvh]"
        >
          {/* Start of orange header for chatbox */}
          <div className="justify-between p-3 flex items-center bg-bg text-text rounded-t-2xl rounded-b-none ">
            <div className="flex gap-3 items-center">
              <LuDot className="text-green-500" size={40} />
              <h2 className="text-lg font-bold text-center text-text">
                {chatbotDetails?.chatBotName || "Chatty Assistant"}
              </h2>
            </div>
            <div className="flex space-x-3">
              <FaMinus
                onClick={() => handleChatBox()}
                className="cursor-pointer hover:text-black/60"
              />
              <IoClose
                onClick={() => handleChatBox()}
                className="cursor-pointer hover:text-black/60"
              />
            </div>
          </div>

          {/* Parent element for the chat area below orange header */}

          {!Boolean(error) && (
            <ScrollArea
              className="h-full w-full space-y-2 text-sm text-text"
              // style={{ color: chatbotDetails?.textColor }}
            >
              {/* Logo and Name of Business */}
              <div className="flex flex-col w-full items-center mb-6">
                <img
                  src={
                    chatbotDetails?.logoUrl || "https://via.placeholder.com/50"
                  }
                  alt="logo"
                  width={80}
                  height={80}
                  loading="lazy"
                  className="w-20 h-20 rounded-full object-contain mt-3"
                />
                <h2 className="text-lg font-bold text-center text-black">
                  {chatbotDetails?.chatBotName}
                </h2>
                <p className="text-muted-foreground px-10 text-center">
                  We are here to help you with any questions in regards to our
                  company and our services.
                </p>
              </div>

              {isUserNameExist &&
                messages.map((message, index) => (
                  <div
                    key={`LoadingPointsWidget-${index}`}
                    className={cn(
                      "flex flex-1 px-4",
                      message?.from === "user"
                        ? "justify-end w-full"
                        : "justify-start w-full"
                    )}
                  >
                    <div
                      className={cn(
                        "flex gap-y-1",
                        message?.from === "user"
                          ? "justify-end p-1.5 rounded-3xl w-3/4"
                          : "justify-start w-3/4"
                      )}
                    >
                      <span
                        style={message?.from === "user" ? BackgroundStyles : {}}
                        className={cn(
                          message?.from === "user"
                            ? "w-fit px-3 py-2 rounded-lg shadow-md text-end mb-2"
                            : "w-fit px-3 bg-slate-50 shadow-md py-2 text-start text-black rounded-lg mb-2"
                        )}
                      >
                        {message?.message}
                      </span>
                    </div>
                  </div>
                ))}

              {/* The loader for when the Assistant API is thinking of an answer */}
              {generationLoading && (
                <div className="px-4">
                  <p className="flex break-words py-1 text-start rounded-lg mb-2 w-1/3 text-slate-500 text-sm">
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
              {/* This div is for scrolling to the bottom of the chat box when new messages appear */}
              {!isUserNameExist && (
                <form
                  onSubmit={(e) => handleUserName(e)}
                  className="flex flex-row bg-white p-4 items-center w-full"
                >
                  <label className="sr-only">Enter Your Name</label>
                  <input
                    type={"text"}
                    placeholder="Enter Your Name To Continue"
                    aria-label="Type here"
                    className=" h-9 rounded-md border border-input bg-transparent text-black py-1  shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1  disabled:cursor-not-allowed disabled:opacity-50 w-full flex justify-end items-end focus-visible:ring-transparent focus:ring-0 focus px-4 rounded-r-none text-sm"
                    onChange={(e) => setNameInput(e.target.value)}
                    value={userNameInput}
                    {...props}
                  />
                  <Button
                    type="submit"
                    className="border-s-0"
                  >
                    <LuArrowUpRight size={20} />
                  </Button>
                </form>
              )}
              {threadLoading && messages.length <= 0 ? <WidgetLoader /> : null}
              {error ? (
                <div className=" px-4 py-2">
                  <p>{error}</p>
                </div>
              ) : null}
              <div ref={messagesEndRef} />
            </ScrollArea>
          )}

          {/* The input that allows the user to chat to the assistant's API */}
          {!threadLoading && Boolean(isUserNameExist) && (
            <form
              onSubmit={(e) => handleUserMessage(e)}
              className="flex flex-row bg-white p-4 items-center"
            >
              <input
                type={"text"}
                placeholder="Message..."
                aria-label="Type here"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                className=" h-9 rounded-md border border-input bg-transparent py-1  shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1  disabled:cursor-not-allowed disabled:opacity-50 w-full flex justify-end items-end focus-visible:ring-transparent focus:ring-0 focus px-4 rounded-r-none text-sm"
                {...props}
              />
              <Button type="submit" className="border-s-0" disabled={!threadId}>
                <LuArrowUpRight size={20} />
              </Button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default Widget;

const WidgetLoader = () => {
  return (
    <div className=" w-full flex flex-col gap-2 mt-6 px-4 py-2">
      <div
        className={
          "animate-pulse rounded-md bg-primary/10 w-3/4 h-[24px] self-start"
        }
      />
    </div>
  );
};
