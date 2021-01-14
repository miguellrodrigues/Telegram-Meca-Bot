import * as dotenv from 'dotenv';

dotenv.config();

export default {
  TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN ?? '',
  TaskApiUrl: process.env.TaskApiUrl ?? ''
}