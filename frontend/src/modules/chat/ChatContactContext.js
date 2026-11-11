import { createContext } from "react";

export const ChatContactContext = createContext({
  enabled: true,
  onContact: null,
});
