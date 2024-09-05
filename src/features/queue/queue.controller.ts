import { Request, Response } from "express";
import { QueueService } from "./queue.service";

export class QueueController {
  private queueService: QueueService;

  constructor() {
    this.queueService = new QueueService();
    this.queueService.initializeDefaultQueues();
  }

  public addMessage = async (req: Request, res: Response): Promise<void> => {
    const queueName = req.params.queue_name;
    const message = req.body;
    try {
      await this.queueService.addMessage(queueName, message);
      res
        .status(200)
        .send({ success: true, message: "Message added to queue" });
    } catch (error) {
      res
        .status(500)
        .send({ success: false, error: "Failed to add message to queue" });
    }
  };

  public getNextMessage = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const queueName = req.params.queue_name;
    const timeout = parseInt(req.query.timeout as string) || 10000;
    try {
      const message = await this.queueService.getNextMessage(
        queueName,
        timeout
      );
      if (message) {
        res.status(200).send(message);
      } else {
        res.status(204).send();
      }
    } catch (error) {
      res
        .status(500)
        .send({ success: false, error: "Failed to retrieve message" });
    }
  };

  public getQueues = async (req: Request, res: Response): Promise<void> => {
    try {
      const queues = await this.queueService.getAllQueues();
      res.status(200).send(queues);
    } catch (error) {
      res
        .status(500)
        .send({ success: false, error: "Failed to retrieve queues" });
    }
  };
}
