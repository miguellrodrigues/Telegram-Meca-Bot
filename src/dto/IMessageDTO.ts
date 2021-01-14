interface Chat {
  id: number;
  first_name: string;
  type: string;
}

interface From {
  id: number;
  is_bot: boolean;
  first_name: string;
  language_code: string;
}

interface IMessageDTO {
  message_id: number;
  from: From;
  chat: Chat;
  date: number;
  text: string;
}

export default IMessageDTO