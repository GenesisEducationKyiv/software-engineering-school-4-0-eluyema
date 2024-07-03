import 'tsarch/dist/jest';

// imports the files entrypoint
import { filesOfProject } from 'tsarch';

const SECOND = 1000;

describe('architecture', () => {
  // architecture tests can take a while to finish
  jest.setTimeout(60 * SECOND);

  // we use async await in combination with jest since this project uses asynchronous calls
  it('business logic should not depend on the ui', async () => {
    const rule = filesOfProject()
      .inFolder('business')
      .shouldNot()
      .dependOnFiles()
      .inFolder('ui');

    await expect(rule).toPassAsync();
  });

  it('business logic should be cycle free', async () => {
    const rule = filesOfProject()
      .inFolder('business')
      .should()
      .beFreeOfCycles();

    await expect(rule).toPassAsync();
  });
});
