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
- **Description**: Update rate cron counter
- **Labels**: None

### `rate_update_notification`
- **Description**: Rate update notification counter
- **Labels**: None

### `all_rate_client_failed`
- **Description**: Counter of all failed clients
- **Labels**: None

### `exchange_rate_fetched`
- **Description**: Fetch rate counter
- **Labels**: `source`, `status`

### `http_request`
- **Description**: HTTP request to microservice
- **Labels**: `method`, `path`, `statusCode`

### `subscription_removal_ended_transactions`
- **Description**: Counter of ended subscription removal transactions
- **Labels**: `status`

### `kafka_event`
- **Description**: Kafka events to microservice
- **Labels**: `eventType`

### `subscription_created`
- **Description**: Count of subscriptions creation
- **Labels**: `status`

### `subscription_removal`
- **Description**: Count of subscriptions removal
- **Labels**: `status`

### `customers_created`
- **Description**: Count of customers creation
- **Labels**: `status`

### `customers_removal`
- **Description**: Count of customers removal
- **Labels**: `status`

### `rate_requests`
- **Description**: Count of rate requests
- **Labels**: `status`

### `rate_updates`
- **Description**: Count of rate updates
- **Labels**: `status`

### `mailer_subscription_creation`
- **Description**: Count of mailer subscription creation
- **Labels**: `status`

### `mailer_subscription_removal`
- **Description**: Count of mailer subscription removal
- **Labels**: `status`

### `exchange_rate_mail_notification`
- **Description**: Count of exchange rate mail notification
- **Labels**: `status`

### `notification_mailer_cron`
- **Description**: Count of notification mail cron
- **Labels**: None
