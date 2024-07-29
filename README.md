**This project use Clean architecture, node.js, nest.js, prisma, nodemailer.**

For mail template it uses handlebars templates.

How to start application?

1. You need to create .env file in each microservice (look at example .env.sample)
2. If you use .env-sample, than you need to set up SMPT env variables and API_KEY which you can take free from [openexchangerates.org](https://openexchangerates.org/)
3. Run docker compose file with commands "docker-compose up"

This application has unit tests, you can run it with command:

```bash
$ npx pnpm run test
```

## Custom Metrics Documentation

### `rate_update_cron`
- **Description**: Counter for rate update cron executions
- **Labels**: None

### `rate_update_notification`
- **Description**: Counter for rate update notifications
- **Labels**: None

### `all_rate_client_failed`
- **Description**: Counter for all failed client requests
- **Labels**: None

### `exchange_rate_fetched`
- **Description**: Counter for fetched exchange rates
- **Labels**: `source`, `status`

### `http_request`
- **Description**: Counter for HTTP requests to microservice
- **Labels**: `method`, `path`, `statusCode`

### `subscription_removal_ended_transactions`
- **Description**: Counter for ended subscription removal transactions
- **Labels**: `status`

### `kafka_event`
- **Description**: Counter for Kafka events sent to microservice
- **Labels**: `eventType`

### `subscription_created`
- **Description**: Counter for created subscriptions
- **Labels**: `status`

### `subscription_removal`
- **Description**: Counter for removed subscriptions
- **Labels**: `status`

### `customers_created`
- **Description**: Counter for created customers
- **Labels**: `status`

### `customers_removal`
- **Description**: Counter for removed customers
- **Labels**: `status`

### `rate_requests`
- **Description**: Counter for rate requests
- **Labels**: `status`

### `rate_updates`
- **Description**: Counter for rate updates
- **Labels**: `status`

### `mailer_subscription_creation`
- **Description**: Counter for created mailer subscriptions
- **Labels**: `status`

### `mailer_subscription_removal`
- **Description**: Counter for removed mailer subscriptions
- **Labels**: `status`

### `exchange_rate_mail_notification`
- **Description**: Counter for exchange rate mail notifications
- **Labels**: `status`

### `notification_mailer_cron`
- **Description**: Counter for notification mail cron jobs
- **Labels**: None
