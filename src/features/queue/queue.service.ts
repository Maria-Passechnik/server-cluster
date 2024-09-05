export class QueueService {
  private queues: { [key: string]: any[] } = {};

  constructor() {}

  public getQueue(queueName: string): any[] {
    if (!this.queues[queueName]) {
      this.queues[queueName] = [];
    }
    return this.queues[queueName];
  }

  public async addMessage(queueName: string, message: any): Promise<void> {
    const queue = this.getQueue(queueName);
    queue.push(message);
  }

  public async getNextMessage(
    queueName: string,
    timeout: number
  ): Promise<any | null> {
    const queue = this.getQueue(queueName);
    return new Promise((resolve) => {
      if (queue.length > 0) {
        const message = queue.shift();
        resolve(message);
      } else {
        setTimeout(() => resolve(null), timeout);
      }
    });
  }

  public async getAllQueues(): Promise<{ name: string; count: number }[]> {
    return Object.keys(this.queues).map((queueName) => ({
      name: queueName,
      count: this.queues[queueName].length,
    }));
  }

  public initializeDefaultQueues(): void {
    const defaultMessages = [
      { message: "Default message 1" },
      { message: "Default message 2" },
      { message: "Default message 3" },
    ];

    const defaultQueueNames = ["queue1", "queue2"];

    for (const queueName of defaultQueueNames) {
      const queue = this.getQueue(queueName);
      if (queue.length === 0) {
        defaultMessages.forEach((message) => queue.push(message));
      }
    }

    console.log("Default queues initialized");
  }
}
