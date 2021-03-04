import Parse from 'parse';

export default class Tagline extends Parse.Object {
  constructor() {
    super('KeyboardArt');
  }

  get src() {
    return this.get('src');
  }

  get name() {
    return this.get('name');
  }

  get attribution() {
    return this.get('attribution');
  }

  get url() {
    return this.get('url');
  }
}
