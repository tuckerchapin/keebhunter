import Parse from 'parse';

export default class Flag extends Parse.Object {
  constructor(product, user) {
    super('Flag');
    this.set('flaggedProduct', product);
    this.set('creator', user);
  }

  set category(str) {
    this.set('category', str);
  }

  set reason(str) {
    this.set('reason', str);
  }

  set tags(arr) {
    this.set('tags', arr);
  }
}
