import "dotenv/config";
import { Bot, webhookCallback, Context } from "grammy";
import express from "express";
import { isOperator, getIdStr, OPERATOR_CHAT_IDS } from "./utils";
import { INTRODUCTION } from "./constants/answers";
import { USER_INFO_BEGINNING, MESSAGE_FROM_BEGINNING } from "./constants/message";

export type BotContext = Context;

const bot = new Bot<BotContext>(process.env.TELEGRAM_TOKEN || "");

const reply = async (ctx: BotContext) => {
  if (!ctx.message) {
    return;
  }

  if (isOperator(ctx.message)) {
    const replyToMessage = ctx.message.reply_to_message;
    if (replyToMessage && replyToMessage.text) {
      if (replyToMessage.text.startsWith(MESSAGE_FROM_BEGINNING)) {
        const chatIdStr = getIdStr(replyToMessage.text, MESSAGE_FROM_BEGINNING);
        try {
          await bot.api.sendMessage(Number(chatIdStr), `${ctx.message.text}`);
        } catch (e) {
          console.log(e);
          await ctx.reply(`${e}`);
        }
        return;
      }
    }
  }

  for (let i = 0; i < OPERATOR_CHAT_IDS.length; i++) {
    const operatorId = OPERATOR_CHAT_IDS[i];
    await bot.api.sendMessage(
      operatorId,
      `${MESSAGE_FROM_BEGINNING}${ctx.message.from.id}: ${ctx.message.text}`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Информация о пользователе",
                callback_data: `${USER_INFO_BEGINNING}:${ctx.message.from.id}`,
              },
            ],
          ],
        },
      }
    );
  }
};

const keyboardCommon = {
    keyboard: [[{ text: "Продукты" }]],
    is_persistent: true,
    input_field_placeholder: "Напишите свой вопрос",
}

bot.on("message:file", async (ctx) => {
  if (isOperator(ctx.msg)) {
    ctx.reply(JSON.stringify(ctx.msg, null, 2));
  } else {
    ctx.reply("Отправка файлов боту не поддерживается");
  }
});
bot.command("start", (ctx) => ctx.reply(INTRODUCTION, { reply_markup: keyboardCommon }));
bot.on("message:text", reply);

if (process.env.NODE_ENV === "production") {
  const app = express();
  app.use(express.json());
  app.use(webhookCallback(bot, "express"));

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Bot listening on port ${PORT}`);
  });
} else {
  bot.start();
}
