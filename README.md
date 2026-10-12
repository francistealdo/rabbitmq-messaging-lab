# RabbitMQ Messaging Lab

A hands-on repository for learning and experimenting with RabbitMQ messaging patterns using Node.js, TypeScript, Docker, and eventually .NET.

The repository is divided into two main areas:

- **Examples** — small, isolated RabbitMQ concepts.
- **Projects** — more realistic applications that combine messaging, persistence, background processing, and other backend concepts.

---

## Technologies

- RabbitMQ
- Docker / Docker Compose
- Node.js
- TypeScript
- amqplib
- Knex.js
- SQLite
- Cron jobs

---

# RabbitMQ Examples

## 01 - Basic Queue

Basic producer/consumer example demonstrating:

- Durable queues
- `publish()`
- `sendToQueue()`
- Manual acknowledgements
- Consumer prefetch

## 02 - Direct Exchange

Demonstrates routing messages using exact routing-key matches.

Two queues are bound to the same exchange:

```text
direct-exchange-queue-01
direct-exchange-queue-02
```

Both receive messages using:

```text
bind-key-for-queues
```

Only queue 01 receives messages using:

```text
bind-key-only-for-queue-01
```

## 03 - Topic Exchange

Demonstrates topic-based routing using RabbitMQ wildcards.

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

matches both bindings.

Topic wildcards:

- `*` matches exactly one word
- `#` matches zero or more words

## 04 - Fanout Exchange

Demonstrates broadcast messaging.

A single message published to the exchange is delivered to every bound queue:

```text
email-notifications
sms-notifications
push-notifications
```

Routing keys are ignored by fanout exchanges.

## 05 - Headers Exchange

Demonstrates routing messages using headers instead of routing keys.

```text
notification_type=email -> email-notifications
notification_type=sms   -> sms-notifications
notification_type=push  -> push-notifications
```

## 06 - Exchange Bindings

Demonstrates exchange-to-exchange bindings.

The example combines:

- Headers exchange
- Fanout exchange
- Multiple notification queues

A message can be routed from one exchange to another before reaching its final queues.

## 07 - Priority Queue

Demonstrates message prioritization.

The queue supports priorities up to:

```js
maxPriority: 5;
```

Messages can then be published with:

```js
{
  priority: 5;
}
```

Higher-priority messages are delivered first when multiple messages are waiting in the queue.

---

# Projects

## Document Processing

`node/projects/document-processing`

A TypeScript background-processing application that simulates document certification.

The project currently demonstrates:

- Scheduled background jobs
- Batch processing
- SQLite persistence
- Knex query builder
- Database migrations
- Database seeds
- Processing status tracking
- Simulated processing delays
- Simulated processing failures
- Protection against overlapping scheduled executions

### Current Flow

```text
SQLite
  |
  | pending documents
  v
Scheduled Job
  |
  | loads batch
  v
Document Certification
  |
  +--> success -> PROCESSED
  |
  +--> failure -> ERRORED
```

The project is intended to evolve into an event-driven workflow using RabbitMQ.

A future version may use:

```text
SQLite
   |
   v
Publisher
   |
   v
RabbitMQ
   |
   v
Certification Consumer
   |
   +--> success
   |
   +--> retry
   |
   +--> dead-letter queue
```

---

# Project Structure

```text
rabbitmq-messaging-lab/
├── .env.example
├── .gitignore
├── README.md
├── docker-compose.yml
│
└── node/
    ├── package.json
    ├── package-lock.json
    ├── tsconfig.json
    │
    ├── examples/
    │   ├── 01-basic-queue/
    │   ├── 02-direct-exchange/
    │   ├── 03-topic-exchange/
    │   ├── 04-fanout-exchange/
    │   ├── 05-headers-exchange/
    │   ├── 06-binding-exchanges/
    │   └── 07-max-priority/
    │
    └── projects/
        └── document-processing/
            ├── knexfile.ts
            ├── migrations/
            ├── seeds/
            ├── data/
            └── src/
                ├── configs/
                │   └── database/
                ├── enums/
                ├── jobs/
                ├── models/
                ├── usecases/
                └── index.ts
```

---

# Requirements

- Docker
- Node.js
- npm

---

# Environment Variables

Create a `.env` file in the repository root based on `.env.example`.

```env
RABBITMQ_DEFAULT_USER=rabbitmq
RABBITMQ_DEFAULT_PASS=your_password
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
```

The `.env` file is ignored by Git.

---

# Running RabbitMQ

From the repository root:

```bash
docker compose up -d
```

RabbitMQ will be available at:

```text
AMQP:          localhost:5672
Management UI: http://localhost:15672
```

Stop RabbitMQ:

```bash
docker compose down
```

---

# Running the Node.js Examples

Install dependencies:

```bash
cd node
npm install
```

Basic queue consumer:

```bash
npm run basic:consumer
```

Basic queue producer:

```bash
npm run basic:producer
```

Direct exchange:

```bash
npm run direct:producer
```

Topic exchange:

```bash
npm run topic:producer
```

Fanout exchange:

```bash
npm run fanout:producer
```

Headers exchange:

```bash
npm run headers:producer
```

Exchange binding:

```bash
npm run binding:producer
```

Priority queue:

```bash
npm run max-priority:producer
```

---

# Document Processing Project

From the `node` directory:

## Create the database

Run migrations:

```bash
npm run document-processing:migrate
```

The SQLite database is created locally and is not committed to Git.

## Seed sample documents

```bash
npm run document-processing:seed
```

## Run the worker

```bash
npm run document-processing:project
```

## Roll back the migration

```bash
npm run document-processing:rollback
```

---

# Planned Topics

Future RabbitMQ examples and projects may include:

- Message TTL
- Dead-letter exchanges and queues
- Retry strategies
- Publisher confirms
- Work queues
- Idempotent consumers
- Connection recovery
- Event-driven document processing
- .NET producers and consumers

---

# Purpose

This repository is a practical messaging lab focused on understanding RabbitMQ concepts through small isolated examples and then applying those concepts to more realistic backend applications.
