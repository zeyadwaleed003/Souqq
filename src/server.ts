import mongoose from 'mongoose';
import app from './app';
import env from './config/env';
import logger from './config/logger';

const DB = env.DATABASE_URL.replace('<PASSWORD>', env.DATABASE_PASSWORD);
const PORT = env.PORT || 3000;

mongoose.connect(DB).then(() => {
 logger.info('Database connected successfully');
});

app.listen(PORT, () => {
 logger.info(`Server running on port: ${PORT}`);
});
