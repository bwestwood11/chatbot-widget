import { Dispatch, SetStateAction } from "react";
import { IoClose } from "react-icons/io5";

const WelcomeBox = ({
  setIsWelcomeBoxOpen,
  setIsChatbotOpen,
  alertMessage,
  chatbotName
}: {
  setIsWelcomeBoxOpen: Dispatch<SetStateAction<boolean>>;
  setIsChatbotOpen: Dispatch<SetStateAction<boolean>>;
  alertMessage?: string;
  chatbotName: string;
}) => {
  if (!alertMessage?.trim()) {
    return null
  }
  return (
    <div
      role="button"
      className=" w-[60svw]  sm:w-[340px]  rounded-xl bg-chatbot_background shadow-lg absolute right-[40%]  bottom-full py-3 px-4  "
    >
      <div className=" right-2 top-3 absolute ">
        <button
          className="hover:text-chatbot_foreground/40  "
          onClick={() => setIsWelcomeBoxOpen(false)}
        >
          <IoClose />
        </button>
      </div>
      <div
        onClick={() => {
          setIsChatbotOpen(true);
        }}
        className="space-y-1"
      >
        <p className="text-chatbot_foreground/40 font-semibold flex-1">
          Hello from {chatbotName}!
        </p>
        <p>
          {alertMessage}
        </p>
      </div>
    </div>
  );
};

export default WelcomeBox;
