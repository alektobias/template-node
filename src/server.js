import 'dotenv/config';
import app from './app';

const { PORT, HOST } = process.env;

app.listen(PORT || 3333, HOST);
