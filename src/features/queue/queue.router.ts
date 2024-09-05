import { Router } from "express";
import { QueueController } from "./queue.controller";

const router = Router();
const queueController = new QueueController();

router.post("/:queue_name", queueController.addMessage);
router.get("/:queue_name", queueController.getNextMessage);
router.get("/", queueController.getQueues);

export default router;
