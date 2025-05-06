import mongoose from 'mongoose';
import app from './app';
import env from './config/env';

const DB = env.DATABASE_URL.replace('<PASSWORD>', env.DATABASE_PASSWORD);
const PORT = env.PORT || 3000;

mongoose.connect(DB).then(() => {
 console.log('Database connected successfully');
});

app.listen(PORT, () => {
 console.log(`Server running on port: ${PORT}`);
});
