import { ConfigModule as NestConfigModule } from '@nestjs/config';

import { configuration } from './configuration';

export const AppConfigModule = NestConfigModule.forRoot({
  isGlobal: true,
  load: [configuration],
});
