import React, { Dispatch, SetStateAction } from "react";
import { IoClose } from "react-icons/io5";

const WelcomeBox = ({
  setIsWelcomeBoxOpen,
  setIsChatbotOpen,
}: {
  setIsWelcomeBoxOpen: Dispatch<SetStateAction<boolean>>;
  setIsChatbotOpen: Dispatch<SetStateAction<boolean>>;
}) => {
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
          Brett From ChatBuild
        </p>
        <p>
          Hey there! I'm Brett, your personal chatbot. I'm here to help you with
          your needs.
        </p>
      </div>
    </div>
  );
};

export default WelcomeBox;
