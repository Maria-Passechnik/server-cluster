export class QueueService {
  private queues: { [key: string]: any[] } = {};

  public getQueue(queueName: string): any[] {
    if (!this.queues[queueName]) {
      console.log(`Creating new queue: ${queueName}`);
      this.queues[queueName] = [];
    }
    return this.queues[queueName];
  }

  // Add a message to the queue
  public async addMessage(queueName: string, message: any): Promise<void> {
    const queue = this.getQueue(queueName);
    queue.push(message);
    console.log(`Added message to ${queueName}:`, message);
  }

  // Get the next message with a timeout
  public async getNextMessage(queueName: string, timeout: number): Promise<any | null> {
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

  // Get all queues and the number of messages in each
  public async getAllQueues(): Promise<{ name: string; count: number }[]> {
    const queueNames = Object.keys(this.queues);
    console.log('Fetching all queues:', queueNames);
    return queueNames.map((queueName) => ({
      name: queueName,
      count: this.queues[queueName].length,
    }));
  }

  // Initialize default queues with default messages
  public async initializeDefaultQueues(): Promise<void> {
    console.log('Initializing default queues...');
    const defaultMessages = [
      { message: "Default message 1" },
      { message: "Default message 2" },
      { message: "Default message 3" },
    ];

    const defaultQueueNames = ['queue1', 'queue2'];

    for (const queueName of defaultQueueNames) {
      const queue = this.getQueue(queueName);
      console.log(`Checking queue ${queueName}`);
      if (queue.length === 0) {
        console.log(`Adding default messages to ${queueName}`);
        defaultMessages.forEach((message) => queue.push(message));
      } else {
        console.log(`${queueName} already has messages`);
      }
    }
  }
}