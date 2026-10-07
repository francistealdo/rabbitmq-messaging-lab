# RabbitMQ Messaging Lab

A hands-on repository for exploring RabbitMQ messaging concepts using Node.js, Docker, and eventually .NET.

## Current Examples

### 01 - Basic Queue

Basic producer/consumer example demonstrating:

- Durable queues
- `publish()`
- `sendToQueue()`
- Manual acknowledgements
- Consumer prefetch
- RabbitMQ running with Docker Compose

## Project Structure

```text
rabbitmq-messaging-lab/
├── .env
├── .env.example
├── .gitignore
├── README.md
├── docker-compose.yml
└── node/
    ├── package.json
    ├── package-lock.json
    └── examples/
        └── 01-basic-queue/
            ├── producer.mjs
            └── consumer.mjs
```

## Requirements

- Docker
- Node.js
- npm

## Environment Variables

Create a `.env` file in the repository root based on `.env.example`.

Example:

```env
RABBITMQ_DEFAULT_USER=rabbitmq
RABBITMQ_DEFAULT_PASS=your_password
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
```

The `.env` file should not be committed to source control.

## Running RabbitMQ

From the repository root:

```bash
docker compose up -d
```

RabbitMQ will be available on:

- AMQP: `localhost:5672`
- Management UI: `http://localhost:15672`

To stop the container:

```bash
docker compose down
```

## Running the Node.js Examples

Install dependencies:

```bash
cd node
npm install
```

Run the consumer:

```bash
npm run basic:consumer
```

Run the producer in another terminal:

```bash
npm run basic:producer
```

The producer sends messages to the `01-basic-queue` queue.

The consumer reads messages from the queue, waits a few seconds to simulate processing, and then manually acknowledges them.

## Concepts Demonstrated

### Durable Queue

The queue is declared with:

```js
await channel.assertQueue("01-basic-queue", {
  durable: true,
});
```

This allows the queue definition to survive a RabbitMQ restart.

### Manual Acknowledgements

The consumer uses:

```js
{
  noAck: false;
}
```

and acknowledges processed messages with:

```js
channel.ack(data);
```

This prevents RabbitMQ from considering the message successfully processed before the consumer explicitly confirms it.

### Prefetch

The consumer uses:

```js
await channel.prefetch(5);
```

This limits the number of unacknowledged messages delivered to the consumer at the same time.

## Planned Examples

Future examples may include:

- Work queues
- Direct exchanges
- Fanout exchanges
- Topic exchanges
- Message TTL
- Priority queues
- Dead-letter queues
- Retry strategies
- Publisher confirms
- .NET producers and consumers
- Event-driven sample applications

## Purpose

This repository is intended as a practical RabbitMQ learning lab, with small isolated examples that can later evolve into more realistic event-driven applications.
