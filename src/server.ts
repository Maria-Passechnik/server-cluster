import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import QueueRouter from "./features/queue/queue.router";
import { QueueService } from './features/queue/queue.service';

const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.json());

app.use('/queue', QueueRouter);

const queueService = new QueueService();
queueService.initializeDefaultQueues().then(() => {
  console.log('Queues initialized with default messages');
}).catch(err => {
  console.error('Error initializing queues:', err);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});