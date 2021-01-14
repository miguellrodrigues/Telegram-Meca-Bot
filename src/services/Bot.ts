import TelegramBot from "node-telegram-bot-api";
import MatterController from "../controller/MatterController";
import IMessageDTO from "../dto/IMessageDTO";
import Matter from "../model/Matter";

import { load, remainingTime } from "../util/Data";

import tokens from "../util/Secrets";
class Bot {
  private readonly bot: TelegramBot;

  private matters: Array<Matter>;
  private mattersNames: Array<string>;

  public groupChatId = "-422789094";

  constructor() {
    this.bot = new TelegramBot(tokens.TELEGRAM_TOKEN, { polling: true });

    this.matters = [];
    this.mattersNames = [];

    load(this.matters, this.mattersNames);

    this.bot.on("message", async (message) => {
      const data = message as IMessageDTO;

      if (data.from.is_bot) return;

      if (data.text.startsWith("/")) {
        this.processCommand(data.text, String(data.chat.id));
      } else {
        if (data.from.id !== 822183078) {
          if (data.chat.type !== "private") {
            this.bot.deleteMessage(data.chat.id, String(data.message_id));

            this.bot.sendMessage(data.from.id, "Por favor, utilize apenas comandos no grupo");
          }
        } else {
          if (data.text.toLowerCase() === "reload") {
            this.reload();

            this.bot.deleteMessage(data.chat.id, String(data.message_id));
          }
        }
      }
    });

    this.bot.on("polling_error", (err) => console.log(err));
  }

  async reload() {
    this.matters = [];
    this.mattersNames = [];

    await load(this.matters, this.mattersNames);
  }

  async processCommand(raw: string, chatId: string) {
    const action = raw.replace("/", "");

    if (action.includes(" ")) {
      let split = action.split(" ");

      const option = action.substring(0, action.indexOf(" "));
      const classy = action.replace(option, "").trim();

      if (option === "atividades") {
        if (this.mattersNames.includes(classy)) {
          const matter = MatterController.getMatterByName(this.matters, classy);

          if (!matter) {
            return;
          }

          if (matter.hasNotPastTasks()) {
            const tasks = matter.getNotPastTasks();
            let message = "\n";

            tasks.forEach((task) => {
              message +=
                "\n\nId: " +
                task.id +
                "\n\nDescrição: " +
                task.description +
                "\nData: " +
                MatterController.getTime(task.deliveryTime) +
                "\nTempo restante: " +
                MatterController.getRemainingTime(task) +
                "\n";
            });

            this.sendMessage(message);
          } else {
            this.sendMessage("Não foram encontradas atividades");
          }
        } else {
          this.sendMessage("Matéria não encontrada");
        }
      } else if (option === "arquivos") {
        if (this.mattersNames.includes(classy)) {
          const matter = MatterController.getMatterByName(this.matters, classy);

          if (!matter) return;

          if (matter.hasNotPastTasks()) {
            const notPastTasks = matter.getNotPastTasks();

            let message = "\n";

            notPastTasks.forEach((task) => {
              if (task.hasFiles()) {
                task.getFiles().forEach((file) => {
                  message += `\nURL: ${file.url}\n`;
                });
              }
            });

            if (message === "\n") {
              this.sendMessage("Não foram encontrados arquivos");
            } else {
              this.sendMessage(message);
            }
          } else {
            this.sendMessage("Não foram encontradas tarefas para esta matéria");
          }
        } else {
          this.sendMessage("Matéria não encontrada");
        }
      } else if (option === "tempo") {
        if (this.isNumber(split[1])) {
          const time = await remainingTime(Number(split[1]));

          if (time === "-1") {
            this.sendMessage(
              `Nenhuma tarefa encontrada com este o id ${split[1]}`
            );
          } else {
            this.sendMessage(`Tempo restante\n${time}`);
          }
        } else {
          this.sendMessage("Utilize apenas o número da tarefa, /tempo {id}");
        }
      } else if (option === "info") {
        if (this.mattersNames.includes(classy)) {
          const matter = MatterController.getMatterByName(this.matters, classy);

          let message = `Nome: ${matter?.name}
          \nProfessor: ${matter?.teacher}
          \nAtividades a entregar: ${
            matter?.getNotPastTasks().length == 0
              ? "Nenhuma"
              : matter?.getNotPastTasks().length
          }
          \nAtividades passadas: ${
            matter?.getPastTasks().length == 0
              ? "Nenhuma"
              : matter?.getPastTasks().length == 0
          }`;

          this.sendMessage(message);
        } else {
          this.sendMessage("Matéria não encontrada");
        }
      }
    } else {
      if (action === "materias") {
        let message = "\n";

        if (this.mattersNames.length > 0) {
          this.mattersNames.forEach((name) => {
            message += `${name}\n`;
          });

          this.sendMessage(message);
        } else {
          this.sendMessage("Nenhuma matéria encontrada");
        }
      } else if (action === "atividades") {
        if (this.mattersNames.length > 0) {
          this.matters.forEach(async (matter) => {
            if (matter.hasNotPastTasks()) {
              await this.sendMessageAsnyc(`\nMatéria: ${matter.name}`);

              const tasks = matter.getNotPastTasks();
              let message = "\n";

              tasks.forEach((task) => {
                message +=
                  "\nId: " +
                  task.id +
                  "\n\nDescrição: " +
                  task.description +
                  "\nData: " +
                  MatterController.getTime(task.deliveryTime) +
                  "\nTempo restante: " +
                  MatterController.getRemainingTime(task) +
                  "\nMatéria: " +
                  matter.name +
                  "\n\n";
              });

              await this.sendMessageAsnyc(message);
            }
          });
        } else {
          this.sendMessage("Nenhuma matéria encontrada");
        }
      }
    }
  }

  isNumber(value: string | number): boolean {
    return value != null && value !== "" && !isNaN(Number(value.toString()));
  }

  sendMessage(message: string) {
    this.bot.sendMessage(this.groupChatId, message, {
      disable_notification: true,
    });
  }

  async sendMessageAsnyc(message: string): Promise<TelegramBot.Message> {
    return this.bot.sendMessage(this.groupChatId, message, {
      disable_notification: false,
    });
  }

  async pinMessage(messageId: number) {
    return this.bot.pinChatMessage(this.groupChatId, `${messageId}`);
  }

  instance(): TelegramBot {
    return this.bot;
  }
}

export default Bot;
