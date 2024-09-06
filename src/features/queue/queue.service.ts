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
}
