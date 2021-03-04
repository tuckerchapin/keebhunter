import Parse from 'parse';

export default class Tagline extends Parse.Object {
  constructor() {
    super('Tagline');
  }

  get tagline() {
    return this.get('tagline');
  }
}
