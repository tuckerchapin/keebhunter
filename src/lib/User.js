import Parse from 'parse';

export default class User extends Parse.User {
  constructor() {
    super('User');
  }

  get email() {
    return this.get('email');
  }

  set email(str) {
    return this.set('email', str);
  }

  get username() {
    return this.get('username');
  }

  set username(str) {
    return this.set('username', str);
  }

  set password(str) {
    return this.set('password', str);
  }

  register(username, password) {
    this.username = username;
    this.password = password;
    return this.signUp();
  }
}
