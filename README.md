# RabbitMQ Messaging Lab

A hands-on repository for exploring RabbitMQ messaging concepts using Node.js, Docker, and eventually .NET.

## Current Examples

### 01 - Basic Queue

Basic producer/consumer example demonstrating:

- Durable queue
- `publish()`
- `sendToQueue()`
- Manual acknowledgements
- Consumer prefetch
- RabbitMQ running with Docker Compose

### 02 - Direct Exchange

Demonstrates message routing with a direct exchange using exact routing keys.

The example creates two queues:

- `direct-exchange-queue-01`
- `direct-exchange-queue-02`

Both queues are bound to:

```text
bind-key-for-queues
```

Only the first queue is also bound to:

```text
bind-key-only-for-queue-01
```

This demonstrates how a direct exchange routes messages only to queues whose binding key exactly matches the message routing key.

### 03 - Topic Exchange

Demonstrates routing messages using topic patterns and wildcards.

The example creates two queues:

- `system-logs`
- `system-errors`

Bindings:

```text
system-logs   -> logs.#
system-errors -> #.error
```

Examples:

```text
logs.system.info
```

is routed to `system-logs`.

```text
logs.system.error
```

matches both patterns and is routed to both queues.

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
        ├── 01-basic-queue/
        │   ├── producer.mjs
        │   └── consumer.mjs
        ├── 02-direct-exchange/
        │   └── producer.mjs
        └── 03-topic-exchange/
            └── producer.mjs
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

### Basic Queue

Run the consumer:

```bash
npm run basic:consumer
```

Run the producer in another terminal:

```bash
npm run basic:producer
```

### Direct Exchange

Run:

```bash
npm run direct:producer
```

### Topic Exchange

Run:

```bash
npm run topic:producer
```

## Purpose

This repository is intended as a practical RabbitMQ learning lab, with small isolated examples that can later evolve into more realistic event-driven applications.
