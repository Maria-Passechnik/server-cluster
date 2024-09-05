import fs from 'fs';

export class QueueService {
  private queues: { [key: string]: any[] } = {};
  private filePath = './queues.json';

  constructor() {
    this.loadQueuesFromFile();
  }

  // Initialize or retrieve a queue
  public getQueue(queueName: string): any[] {
    if (!this.queues[queueName]) {
      this.queues[queueName] = [];
    }
    return this.queues[queueName];
  }

  // Add a message to the queue
  public async addMessage(queueName: string, message: any): Promise<void> {
    const queue = this.getQueue(queueName);
    queue.push(message);
    await this.saveQueuesToFile();
  }

  // Get the next message with a timeout
  public async getNextMessage(queueName: string, timeout: number): Promise<any | null> {
    const queue = this.getQueue(queueName);
    return new Promise((resolve) => {
      if (queue.length > 0) {
        const message = queue.shift();
        this.saveQueuesToFile();
        resolve(message);
      } else {
        setTimeout(() => resolve(null), timeout);
      }
    });
  }

  // Get all queues and the number of messages in each
  public async getAllQueues(): Promise<{ name: string; count: number }[]> {
    return Object.keys(this.queues).map(queueName => ({
      name: queueName,
      count: this.queues[queueName].length,
    }));
  }

  // Initialize default queues with default messages
  public async initializeDefaultQueues(): Promise<void> {
    const defaultMessages = [
      { message: "Default message 1" },
      { message: "Default message 2" },
      { message: "Default message 3" },
    ];

    const defaultQueueNames = ['queue1', 'queue2'];

    for (const queueName of defaultQueueNames) {
      const queue = this.getQueue(queueName);
      if (queue.length === 0) {
        defaultMessages.forEach((message) => queue.push(message));
      }
    }

    await this.saveQueuesToFile();
  }

  // Save queues to a JSON file
  private saveQueuesToFile(): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.writeFile(this.filePath, JSON.stringify(this.queues), (err) => {
        if (err) {
          console.error('Error saving queues to file:', err);
          return reject(err);
        }
        console.log('Queues saved to file');
        resolve();
      });
    });
  }

  // Load queues from a JSON file
  private loadQueuesFromFile(): void {
    if (fs.existsSync(this.filePath)) {
      const data = fs.readFileSync(this.filePath, 'utf-8');
      this.queues = JSON.parse(data);
      console.log('Queues loaded from file');
    } else {
      console.log('No existing queue data found. Starting fresh.');
    }
  }
}