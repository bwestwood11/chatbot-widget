import { useLocalStorage } from "@/hooks/use-local-storage";
import { Dispatch, SetStateAction, createContext } from "react";

type TSuggestionContext = {
  suggestion: string[];
  setSuggestion: Dispatch<SetStateAction<string[]>>;
};

export const SuggestionContext = createContext<TSuggestionContext | null>(null);
const randomQuestions = [
  "What is your Favorite color?",
  "Siblings?",
  "Last vacation?",
  "Dream job?",
  "Pet's name?",
  "Favorite sport?",
  "Favorite hobby?",
  "Favorite animal?",
];
export function SuggestionContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // const [messages, setMessages] = useState<TMessage[]>([]);
  const [suggestion, setSuggestion] = useLocalStorage<string[]>(
    "suggestion",
    randomQuestions
  );

  console.log("Messages", suggestion);
  return (
    <SuggestionContext.Provider
      value={{
        suggestion,
        setSuggestion,
      }}
    >
      {children}
    </SuggestionContext.Provider>
  );
}
