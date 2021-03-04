import Parse from 'parse';

export default class Product extends Parse.Object {
  constructor() {
    super('Products');
    this.set('name', '');
    this.set('tags', []);
    this.set('url', '');
    this.set('images', []);
  }

  get name() {
    return this.get('name');
  }

  set name(str) {
    return this.set('name', str);
  }

  get tags() {
    return this.get('tags');
  }

  set tags(arr) {
    return this.set('tags', arr);
  }

  get url() {
    return this.get('url');
  }

  set url(str) {
    return this.set('url', str);
  }

  get thumbnail() {
    return this.get('thumbnail');
  }

  set thumbnail(pf) {
    return this.set('thumbnail', pf);
  }

  get images() {
    return this.get('images');
  }

  set images(arr) {
    return this.set('images', arr);
  }

  get approved() {
    return this.get('approved');
  }

  set approved(bool) {
    return this.set('approved', bool);
  }

  set submittedBy(user) {
    return this.set('submittedBy', user);
  }

  addTag(tagA) {
    if (this.tags.some((tagB) => tagA.id === tagB.id)) {
      throw new Error('Cannot add tag that already is added.');
    }
    return this.set('tags', [...this.tags, tagA]);
  }

  addTags(arr) {
    if (!Array.isArray(arr)) {
      throw new Error('Not an array.');
    }
    return this.set('tags', [...this.tags, ...arr.filter((tagA) => !this.tags.some((tagB) => tagA.id === tagB.id))]);
  }

  removeTag(tagA) {
    const newTags = this.tags.filter((tagB) => tagA.id !== tagB.id);
    if (this.tags.length > newTags) {
      throw new Error('Cannot remove tag not in array.');
    }
    return this.set('tags', newTags);
  }

  removeTags(arr) {
    if (!Array.isArray(arr)) {
      throw new Error('Not an array.');
    }
    return this.set('tags', this.tags.filter((tagA) => !arr.some((tagB) => tagA.id === tagB.id)));
  }
}
