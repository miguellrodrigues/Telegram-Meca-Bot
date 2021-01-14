import { Request, Response } from "express";
import ITaskDTO from "../dto/ITaskDTO";
import Bot from "../services/Bot";

let telegramBot: Bot;

export default {
  async publish(req: Request, res: Response) {
    const data = req.body as ITaskDTO;

    const message = await telegramBot.sendMessageAsnyc(
      `Nova tarefa cadastrada (${data.matterName}): ${data.name}`
    );

    let info = `\nMatéria ${data.matterName}
    \nNome: ${data.name}
    \nDescrição: ${data.description}
    \nData de entrega: ${data.deliveryDate}
    \nNúmero de arquivos: ${data.files.length}`;

    telegramBot.sendMessage(info);

    telegramBot.pinMessage(message.message_id);

    await telegramBot.reload();

    return res.status(200).json({ message: "success" });
  },

  insert(bot: Bot) {
    telegramBot = bot;
  },
};
