"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const grammy_1 = require("grammy");
const express_1 = __importDefault(require("express"));
const utils_1 = require("./utils");
const answers_1 = require("./constants/answers");
const message_1 = require("./constants/message");
const bot = new grammy_1.Bot(process.env.TELEGRAM_TOKEN || "");
const reply = async (ctx) => {
    if (!ctx.message) {
        return;
    }
    if ((0, utils_1.isOperator)(ctx.message)) {
        const replyToMessage = ctx.message.reply_to_message;
        if (replyToMessage && replyToMessage.text) {
            if (replyToMessage.text.startsWith(message_1.MESSAGE_FROM_BEGINNING)) {
                const chatIdStr = (0, utils_1.getIdStr)(replyToMessage.text, message_1.MESSAGE_FROM_BEGINNING);
                try {
                    await bot.api.sendMessage(Number(chatIdStr), `${ctx.message.text}`);
                }
                catch (e) {
                    console.log(e);
                    await ctx.reply(`${e}`);
                }
                return;
            }
        }
    }
    for (let i = 0; i < utils_1.OPERATOR_CHAT_IDS.length; i++) {
        const operatorId = utils_1.OPERATOR_CHAT_IDS[i];
        await bot.api.sendMessage(operatorId, `${message_1.MESSAGE_FROM_BEGINNING}${ctx.message.from.id}: ${ctx.message.text}`, {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "Информация о пользователе",
                            callback_data: `${message_1.USER_INFO_BEGINNING}:${ctx.message.from.id}`,
                        },
                    ],
                ],
            },
        });
    }
};
const keyboardCommon = {
    keyboard: [[{ text: "Продукты" }]],
    is_persistent: true,
    input_field_placeholder: "Напишите свой вопрос",
};
bot.on("message:file", async (ctx) => {
    if ((0, utils_1.isOperator)(ctx.msg)) {
        ctx.reply(JSON.stringify(ctx.msg, null, 2));
    }
    else {
        ctx.reply("Отправка файлов боту не поддерживается");
    }
});
bot.command("start", (ctx) => ctx.reply(answers_1.INTRODUCTION, { reply_markup: keyboardCommon }));
bot.on("message:text", reply);
if (process.env.NODE_ENV === "production") {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use((0, grammy_1.webhookCallback)(bot, "express"));
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Bot listening on port ${PORT}`);
    });
}
else {
    bot.start();
}
