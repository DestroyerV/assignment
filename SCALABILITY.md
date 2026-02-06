# Scalability & Architecture Notes

## Architecture Overview
The current application uses a **Modular Monolith** architecture. Code is organized by domain (auth, task) within the same deployable unit. This is suitable for the current scope but designed to be split easily.

## Scalability Strategies

### 1. Database Scaling
- **Indexing**: MongoDB indexes on frequent query fields (e.g., `user` in Tasks, `email` in Users) ensure $O(log n)$ lookup performance.
- **Sharding**: As data grows (TB+), we can shard the User collection by `country` or `region` and Task collection by `userId`.
- **Replication**: Use MongoDB Replica Sets for high availability and read scaling (secondary reads).

### 2. Application Scaling
- **Horizontal Scaling**: The API is stateless (JWT based). We can deploy `N` instances of the backend behind a load balancer (Nginx / AWS ALB).
- **Containerization**: Dockerize the application to ensure consistent environments and easy orchestration with Kubernetes (K8s) or ECS.

### 3. Caching (Redis)
- **Session/Token Blacklist**: Use Redis to store invalid tokens for instant revocation (if moving away from stateless JWTs or implementing logout).
- **Query Caching**: Cache result of `GET /tasks` for short duration (e.g., 30s) updates. Invalidate cache on Task Create/Update.

### 4. Microservices Migration
If the application grows significantly:
- **Auth Service**: Extract User/Auth logic. Other services verify tokens via public key or internal API.
- **Task Service**: Dedicated service for task management.
- **Notification Service**: (Future) For sending email/push notifications on task updates.
- **Communication**: Use Message Queues (RabbitMQ / Kafka) for async communication between services (e.g., TaskCreated event -> EmailService).

## Security Best Practices
- **JWT**: Access tokens with short expiration.
- **Hashing**: Bcrypt for passwords.
- **Validation**: Zod for strict input validation.
- **Helmet**: Secures HTTP headers.
- **Rate Limiting**: (To be added) Limit requests per IP 100/15min using `express-rate-limit`.

## Deployment Pipeline (CI/CD)
1. **Lint & Test**: Run ESLint and Unit Tests.
2. **Build**: Compile TypeScript.
3. **Docker Build**: Create image.
4. **Deploy**: Push to registry and update ECS/K8s cluster.
