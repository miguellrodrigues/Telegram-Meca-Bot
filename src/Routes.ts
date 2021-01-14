import { Router } from 'express';
import BotController from './controller/BotController';
import Bot from './services/Bot';

const routes = Router();

const telegramBot = new Bot();

BotController.insert(telegramBot);

routes.post('/publish', BotController.publish);

export default routes;