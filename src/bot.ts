import "dotenv/config";
import TelegramBot, { Message } from 'node-telegram-bot-api';
import express from 'express';

const app = express();
app.use(express.json());

const token = process.env.TELEGRAM_TOKEN || "";
const adminChatId = process.env.ADMINS || "";
const url = process.env.WEBHOOK_URL || "";
const port = Number(process.env.PORT) || 3000;

// Initialize bot based on environment
const bot = process.env.NODE_ENV === "production"
    ? new TelegramBot(token, { webHook: { port } })
    : new TelegramBot(token, { polling: true });

// Set webhook for production environment
if (process.env.NODE_ENV === "production" && url) {
    bot.setWebHook(`${url}/bot${token}`);
    console.log("Bot is running in production with webhook.");
} else {
    console.log("Bot is running in development with polling.");
}

// Receive messages
bot.on('message', (msg: Message) => {
    const chatId = msg.chat.id;
    const userMessage = msg.text;

    if (userMessage) {
        bot.sendMessage(adminChatId, `Message from @${msg.from?.username || 'unknown'} (${chatId}):\n${userMessage}`)
            .then(() => bot.sendMessage(chatId, "Your message has been sent to the admin. You'll receive a reply soon."))
            .catch(error => console.log("Error sending message to admin:", error));
    }
});

// Handle replies from admin
bot.onText(/\/reply (\d+) (.+)/, (msg: Message, match: RegExpExecArray | null) => {
    if (match) {
        const userChatId = parseInt(match[1]);
        const replyMessage = match[2];

        bot.sendMessage(userChatId, replyMessage)
            .then(() => bot.sendMessage(adminChatId, "Reply sent successfully."))
            .catch(error => {
                bot.sendMessage(adminChatId, "Error sending reply.");
                console.log("Error sending reply:", error);
            });
    }
});

// Process webhook requests in production
if (process.env.NODE_ENV === "production") {
    app.post(`/bot${token}`, (req, res) => {
        bot.processUpdate(req.body);
        res.sendStatus(200);
    });

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}
