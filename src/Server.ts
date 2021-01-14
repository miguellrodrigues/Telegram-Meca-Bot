import express from 'express';
import routes from './Routes';
import cors from 'cors';
import api from './services/Api';

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(process.env.PORT || 3000, () => {
  setInterval(
    () =>
      api.get("/matters").then((_response) => console.log('log on')),
    30000 * 10,
  );
});