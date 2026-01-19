export declare function connectRabbitMQ(): Promise<void>;
export declare function sendMessage(message: any): Promise<void>;
export declare function consumeMessages(callback: (message: any) => void): Promise<void>;
