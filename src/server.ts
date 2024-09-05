import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import QueueRouter from "./features/queue/queue.router";

const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.json());

app.use("/queue", QueueRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
