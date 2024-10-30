import { MessageEntity, Message } from "@grammyjs/types";
export const OPERATOR_CHAT_IDS = [...(process.env.ADMINS || "").split(",").map(i => Number(i))];

export const isOperator = (message?: Message) => {
  if (message && message.from && message.from.id) {
    return OPERATOR_CHAT_IDS.includes(message?.from.id);
  }
  return false;
};

export const getIdStr = (text: string, beginning: string) => {
  return text.substring(beginning.length, text.indexOf(":"));
};