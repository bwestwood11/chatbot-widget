import { IAppProps } from "@/main";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getContrast(hexColor:string) {
  // Convert hex color to RGB
  let r = parseInt(hexColor.substring(1, 3), 16);
  let g = parseInt(hexColor.substring(3, 5), 16);
  let b = parseInt(hexColor.substring(5, 7), 16);

  // Calculate relative luminance
  let luminance = 0.2126 * (r / 255) + 0.7152 * (g / 255) + 0.0722 * (b / 255);

  // Check if white or black text would have better contrast
  let textColor = luminance > 0.6 ? "#000000" : "#ffffff";

  return textColor;
}


export const checkProps = (props: IAppProps) => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

  if (!props.api_key || !uuidRegex.test(props.api_key)) {
    console.error(
      "CHATBOT ERROR: Invalid Api key. \nPlease Add The Provided Api Key to the Script as api_key="
    );
    return false;
  }

  if (
    (!!props.text_color && !props.text_color.includes("#")) ||
    (!!props.theme_color && !props.theme_color.includes("#"))
  ) {
    console.error(
      "CHATBOT ERROR: Only Hex Values Are Allowed in the theme_color or text_color."
    );
    return false;
  }

  return true;
};