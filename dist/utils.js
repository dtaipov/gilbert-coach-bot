"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIdStr = exports.isOperator = exports.OPERATOR_CHAT_IDS = void 0;
exports.OPERATOR_CHAT_IDS = [...(process.env.ADMINS || "").split(",").map(i => Number(i))];
const isOperator = (message) => {
    if (message && message.from && message.from.id) {
        return exports.OPERATOR_CHAT_IDS.includes(message === null || message === void 0 ? void 0 : message.from.id);
    }
    return false;
};
exports.isOperator = isOperator;
const getIdStr = (text, beginning) => {
    return text.substring(beginning.length, text.indexOf(":"));
};
exports.getIdStr = getIdStr;
