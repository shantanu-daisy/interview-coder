import React from "react";

interface CheatsheetProps {
  setView: (view: "queue" | "solutions" | "debug" | "question" | "cheatsheet") => void;
}

const cheatsheetContent = `## 1. Scalability & System Architecture
- **Vertical Scaling**: Add more power (CPU, RAM) to a single machine.
- **Horizontal Scaling**: Add more machines/instances to distribute load.
- **Load Balancers**: Distribute incoming requests across multiple servers.
- **Content Delivery Networks (CDNs)**: Edge servers that cache and serve static content closer to users.
- **Caching (Redis / Memcached)**: Store frequently accessed data in memory for faster reads.
- **Microservices**: Decompose system into smaller, independently deployable services.
- **Monolithic Architecture**: All components in a single codebase, single deployment.
- **Stateless vs. Stateful**: Impact on scaling and session management.

⸻

## 2. Networking & Communication
- **IP Address & TCP/IP**: Fundamental internet addressing and transport protocol.
- **Domain Name System (DNS)**: Translates domain names to IP addresses.
- **HTTP / HTTPS**: Protocol for communication between clients and servers (with TLS for security).
- **REST / GraphQL / gRPC**: API design styles/protocols for client-server communication.
- **WebSockets**: Full-duplex, persistent communication channel (real-time apps, chat, games).
- **HTTP/2 / HTTP/3**: Protocol improvements for multiplexing, performance, security.
- **API Gateways**: Single entry point that routes requests to underlying microservices.

⸻

## 3. Data Storage & Databases
- **SQL Databases (Relational)**: MySQL, PostgreSQL; strong schema enforcement.
- **ACID Properties**: Atomicity, Consistency, Isolation, Durability for transactional integrity.
- **NoSQL Databases (Non-Relational)**: MongoDB, Cassandra, DynamoDB; flexible schema, scale-out.
- **Sharding (Partitioning)**: Splitting large datasets across multiple servers.
- **Replication**: Copying data across multiple machines for redundancy and availability.
- **Indexing**: Improving query performance with data structures (e.g., B-Tree, Hash index).
- **Hot vs. Cold Data**: Separating frequently accessed ("hot") from infrequently accessed ("cold").
- **Data Lake vs. Data Warehouse**: Unstructured vs. structured analytical storage.

### Database Scaling & Decision Factors:
- **Read/Write Patterns**: High read vs. high write loads.
- **Vertical vs. Horizontal Scaling**: Scale up (bigger machines) vs. scale out (more machines).
- **Read Replicas**: Offload reads from primary DB to replicated nodes.
- **Multi-Primary / Master-Master**: Multiple writable nodes for high availability but complexity in conflict resolution.
- **Choosing SQL vs. NoSQL**: Data relationships, transaction needs, query patterns, vertical/horizontal scale requirements.

⸻

## 4. Distributed Systems & Performance
- **CAP Theorem**: Consistency, Availability, Partition Tolerance – pick any two.
- **Eventual Consistency**: Data replicas become consistent over time (common in NoSQL).
- **Throughput vs. Latency**: Rate of data processing vs. time to respond.
- **Concurrency & Parallelism**: Handling many tasks simultaneously (threads, event-driven).
- **Message Queues (Kafka, RabbitMQ, SQS)**: Decouple services, async communication (Pub/Sub).
- **Backpressure & Rate Limiting**: Throttling requests to prevent overload.
- **Circuit Breakers**: Protect a system from cascading failures.
- **Observability**: Logs, metrics, tracing (ELK stack, Prometheus, Jaeger).
- **Bulkhead Pattern**: Isolating components to contain failures.

⸻

## 5. Caching Layers & Strategies
- **CDN Edge Caching**: Serving static content from geographically distributed caches.
- **Application Caching**: Storing frequently accessed data in memory (Redis, Memcached).
- **Cache Invalidation Policies**: LRU, LFU, TTL, "write-through," "write-behind."
- **Client-Side Caching**: Browser caching headers (ETag, Cache-Control).

⸻

## 6. Security & Authentication
- **TLS/SSL**: Encrypt data in transit (HTTPS).
- **OAuth / JWT**: Authorization frameworks and tokens for securing APIs.
- **Encryption at Rest & in Transit**: Protect data on disk and over networks.
- **Zero Trust Networks**: Strict identity verification for every person/device.
- **Session Management**: Cookies, tokens, sticky sessions, load balancer affinity.

⸻

## 7. System Design Patterns
- **Microservices**: Services that own specific domains, communicate via APIs/events.
- **Monolith**: Everything in one deployable unit, simpler but less flexible at scale.
- **Event-Driven Architecture**: Systems communicate asynchronously via events (Pub/Sub, queues).
- **Saga Pattern**: Manage distributed transactions in microservices.
- **CQRS**: Command Query Responsibility Segregation, separate read/write models.
- **Serverless**: Functions-as-a-Service (AWS Lambda, etc.) for event-driven, auto-scaled apps.

### Additional Architectural Patterns:
- **Layered Architecture (n-tier)**: Presentation, business, data layers.
- **Hexagonal (Ports & Adapters)**: Encapsulate domain logic, keep external integrations separate.
- **Onion Architecture**: Domain-centered, external layers for infrastructure.
- **Microkernel (Plugin)**: A core system with plug-in modules for extensibility.
- **Clean Architecture**: Entities, Use Cases, Adapters, Framework layers.

⸻

## 8. Real-Time & Streaming
- **WebSockets**: Persistent, full-duplex connections (chat, real-time).
- **Long Polling / Server-Sent Events**: Alternative real-time push methods.
- **Streaming Protocols**: HLS, DASH, RTMP for media streaming in small chunks.
- **Transcoding / Encoding**: Convert source video to multiple formats/resolutions.
- **Buffering & Chunking**: Handling streaming data to mitigate latency.

⸻

## 9. Specialized Topics for Specific Systems

### Notifications System
- **Push vs. Pull**: Sending notifications vs. users polling.
- **Fan-out**: Distributing messages to many recipients (e.g., user followers).
- **Retry / Dead-letter Queues**: Handling failed deliveries.

### Newsfeed / Timeline (like Twitter)
- **Feed Generation**: Pull-based (real-time queries) vs. push-based (pre-compute).
- **Write Optimization**: Inserting user posts into followers' feeds quickly.
- **Fan-out on Write vs. Fan-out on Read**: Trade-offs for distributing updates.

### Distributed Messaging Queue
- **Producers / Consumers**: Asynchronous communication via a queue or topic.
- **Ordering Guarantees**: FIFO vs. partition-based ordering.
- **Delivery Semantics**: At-least-once, at-most-once, exactly-once.

### Chat System
- **Real-time Updates**: WebSockets or persistent connections.
- **Presence & State Management**: Tracking who's online, ephemeral vs. persistent messages.
- **Push Notifications**: On new messages or mentions.

### Autocomplete Search
- **Trie / Prefix Tree**: Efficient prefix-based lookups.
- **Search Indexes**: Inverted indexes, forward indexes.
- **Ranking & Relevancy**: Sorting suggestions by popularity, context.
- **Sharding Search Data**: Handling large indexes across multiple nodes.

⸻

## 10. Infrastructure & DevOps
- **Containers (Docker)**: Packaging apps with dependencies.
- **Container Orchestration (Kubernetes)**: Automatic deployment, scaling, management of containers.
- **CI/CD Pipelines**: Continuous Integration and Deployment workflows.
- **Infrastructure as Code**: Terraform, CloudFormation for versioned infrastructure config.
- **Monitoring & Alerting**: Prometheus, Grafana, Datadog for metrics; Slack/PagerDuty for alerts.

⸻

## 11. Frontend Rendering & Performance
- **Server-Side Rendering (SSR)**: Render HTML on the server (Node.js SSR, Next.js, etc.) for SEO and faster first-load.
- **Client-Side Rendering (CSR)**: Single Page Apps (React, Angular, Vue) – JavaScript handles rendering after the initial page load.
- **Static Site Generation (SSG)**: Pre-build pages at build time for extremely fast reads (e.g., Gatsby).
- **Hydration**: Server-rendered HTML that becomes interactive on the client.
- **Micro-Frontends**: Decompose the front-end into smaller, independently deployable chunks.
- **Code Splitting / Lazy Loading**: Load only what's necessary on demand to improve performance.
- **Caching & Asset Optimization**: Browser cache headers, bundling, minification, compression (Gzip/Brotli).
- **CDN for Static Assets**: Offload delivery to geographically distributed edge servers.
- **Front-End Performance Metrics**: Time to First Byte (TTFB), Largest Contentful Paint (LCP), First Input Delay (FID).

⸻

## 12. Performance Optimization (Backend & Frontend)

### Backend
- **Efficient Data Modeling & Indexing**: Minimize costly joins, optimize queries.
- **Caching (Results & Pages)**: Avoid hitting the database for repeated queries.
- **Async Processing / Batch Jobs**: Offload heavy computations to background tasks.
- **Connection Pooling**: Reuse DB connections for throughput gains.
- **Load & Stress Testing**: Identify bottlenecks (Locust, JMeter).
- **Profiling & Monitoring**: Pinpoint slow endpoints or high CPU usage (APM tools).

### Frontend
- **Minification & Compression**: Reduce JS/CSS asset sizes.
- **Critical Rendering Path**: Optimize initial HTML, CSS, JS to minimize blocking.
- **Resource Preloading & Prefetching**: Anticipate needed assets or data.
- **Responsive & Adaptive Design**: Handle various device constraints efficiently.

⸻

## 13. High-Level Software Design Patterns
- **Creational**: Singleton, Factory, Builder, Prototype.
- **Structural**: Adapter, Facade, Proxy, Composite, Decorator.
- **Behavioral**: Observer, Strategy, Command, Chain of Responsibility.
- **Concurrency Patterns**: Producer-Consumer, Future/Promise, Actor Model.
- **Aggregation Patterns**: Aggregator, Microservices aggregator, API composition.
- **Facade / Gateway**: Simplify complex subsystems behind a single interface.

⸻

## Bonus / Extra Keywords
- **12-Factor App**: Best practices for building SaaS applications (config, logs, dev/prod parity, etc.).
- **Geo-Partitioning**: Placing data/compute near user location for low latency.
- **Failover**: Automatic switching to a redundant or standby system upon failure.
- **High Availability (HA)**: Minimizing downtime (active-active, active-passive).
- **Blue-Green Deployments**: Reduce downtime with two identical production environments.
- **Canary Releases**: Gradually roll out changes to a subset of users before full deployment.
- **Feature Flags**: Toggle features on/off without redeploying code.`;

const Cheatsheet: React.FC<CheatsheetProps> = ({ setView }) => {
  // Split content by ⸻ delimiter to create sections
  const sections = cheatsheetContent.split('⸻').map(section => section.trim());

  return (
    <div className="flex flex-col h-full p-4 bg-zinc-900 text-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">System Design Cheatsheet</h1>
        <button
          onClick={() => setView("queue")}
          className="px-3 py-1 bg-zinc-800 rounded hover:bg-zinc-700"
        >
          Back to Queue
        </button>
      </div>

      <div className="flex-grow overflow-y-auto pr-2 space-y-6">
        {sections.map((section, index) => (
          <div key={index} className="border-b border-zinc-800 pb-4 last:border-b-0">
            <div className="font-sans whitespace-pre-wrap markdown-content">
              {section.split('\n').map((line, lineIndex) => {
                // Apply styling to markdown headings (## and ###)
                if (line.startsWith('## ')) {
                  return (
                    <h2 key={lineIndex} className="text-xl font-bold text-blue-400 mb-3 mt-2">
                      {line.substring(3)}
                    </h2>
                  );
                } else if (line.startsWith('### ')) {
                  return (
                    <h3 key={lineIndex} className="text-lg font-semibold text-blue-300 mb-2 mt-4">
                      {line.substring(4)}
                    </h3>
                  );
                } else if (line.startsWith('- **')) {
                  // Style bullet points with bold terms
                  const boldEndIndex = line.indexOf('**:', 3);
                  if (boldEndIndex > 0) {
                    // Case: - **Term**: Description
                    const term = line.substring(3, boldEndIndex);
                    const description = line.substring(boldEndIndex + 3);
                    return (
                      <div key={lineIndex} className="flex mb-1.5">
                        <span className="text-gray-400 mr-2">•</span>
                        <span className="font-bold text-blue-200">{term}:</span>
                        <span className="ml-1">{description}</span>
                      </div>
                    );
                  } else {
                    // Case: - **Bold Item**
                    const boldEnd = line.lastIndexOf('**');
                    const boldText = line.substring(3, boldEnd);
                    const restOfLine = line.substring(boldEnd + 2);
                    return (
                      <div key={lineIndex} className="flex mb-1.5">
                        <span className="text-gray-400 mr-2">•</span>
                        <span className="font-bold text-blue-200">{boldText}</span>
                        <span>{restOfLine}</span>
                      </div>
                    );
                  }
                } else if (line.trim().length === 0) {
                  return <div key={lineIndex} className="h-2"></div>;
                } else {
                  return <div key={lineIndex} className="mb-1">{line}</div>;
                }
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cheatsheet; 