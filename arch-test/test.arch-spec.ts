import 'tsarch/dist/jest';

import { filesOfProject } from 'tsarch';

const skipTestFilesPattern = '^(?!.*\\.(spec|int-spec)\\.ts$).*$';

describe('architecture', () => {
  jest.setTimeout(60000);

  it('application should not depend on the controllers', async () => {
    const rule = filesOfProject()
      .inFolder('application')
      .matchingPattern(skipTestFilesPattern)
      .shouldNot()
      .dependOnFiles()
      .inFolder('controller');

    await expect(rule).toPassAsync();
  });

  it('application should not depend on the infrastructure', async () => {
    const rule = filesOfProject()
      .inFolder('application')
      .matchingPattern(skipTestFilesPattern)
      .shouldNot()
      .dependOnFiles()
      .inFolder('infrastructure');

    await expect(rule).toPassAsync();
  });

  it('controllers should not depend on the infrastructure', async () => {
    const rule = filesOfProject()
      .inFolder('controller')
      .matchingPattern(skipTestFilesPattern)
      .shouldNot()
      .dependOnFiles()
      .inFolder('infrastructure');

    await expect(rule).toPassAsync();
  });

  it('domain should not depend on the infrastructure', async () => {
    const rule = filesOfProject()
      .inFolder('domain')
      .matchingPattern(skipTestFilesPattern)
      .shouldNot()
      .dependOnFiles()
      .inFolder('infrastructure');

    await expect(rule).toPassAsync();
  });

  it('domain should not depend on the controller', async () => {
    const rule = filesOfProject()
      .inFolder('domain')
      .matchingPattern(skipTestFilesPattern)
      .shouldNot()
      .dependOnFiles()
      .inFolder('controller');

    await expect(rule).toPassAsync();
  });

  it('domain should not depend on the application', async () => {
    const rule = filesOfProject()
      .inFolder('domain')
      .matchingPattern(skipTestFilesPattern)
      .shouldNot()
      .dependOnFiles()
      .inFolder('application');

    await expect(rule).toPassAsync();
  });
});
