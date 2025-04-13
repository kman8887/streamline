import { PeoplePipe } from './people.pipe';

describe('PeoplePipe', () => {
  it('create an instance', () => {
    const pipe = new PeoplePipe();
    expect(pipe).toBeTruthy();
  });
});
