import Parse from 'parse';

export default class Tag extends Parse.Object {
  constructor() {
    super('Tags');
  }

  get label() {
    return this.get('label');
  }

  set label(str) {
    return this.set('label', str);
  }

  get category() {
    return this.get('category');
  }

  set category(str) {
    return this.set('category', str);
  }

  get color() {
    return this.get('color');
  }

  set submittedBy(user) {
    return this.set('submittedBy', user);
  }
}
