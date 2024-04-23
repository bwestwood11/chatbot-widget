import { SuggestionContext } from "@/context/suggestion-context";
import { useContext } from "react";

export const useSuggestions = () => {
  const context = useContext(SuggestionContext);

  if (context === null) {
    throw new Error(
      "useSuggestion must be used within a SuggestionContextProvider"
    );
  }

  return context;
};
