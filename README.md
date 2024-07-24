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
