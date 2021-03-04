/* eslint-disable no-undef */

const isPrivilegedRequest = async (request) => {
  if (request.master) {
    return true;
  }

  if (!request.user) {
    return false;
  }

  const query = new Parse.Query(Parse.Role);
  query.equalTo('users', request.user);
  const roles = await query.find();
  const names = roles.map((role) => role.get('name'));
  return names.includes('admin');
};

// eslint-disable-next-line no-irregular-whitespace
const isValidUrl = (str) => /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.​\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[​6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1​,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00​a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u​00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i.test(str);

const sanitizeForSearch = (str) => str.toLowerCase().replace(/[^0-9a-z%]/g, '');

// PRODUCTS
Parse.Cloud.beforeSave('Products', async (request) => {
  if (!request.object.get('name') || request.object.get('name').length < 3) {
    throw new Error('Please enter a more descriptive name');
  }

  if (!request.object.get('url') || !isValidUrl(request.object.get('url'))) {
    throw new Error('Invalid URL');
  }

  if (!request.object.get('tags') || request.object.get('tags').length < 3) {
    throw new Error('Please add at least three tags');
  }

  if (!request.object.get('images') || request.object.get('images').length < 1) {
    throw new Error('There needs to be at least one image');
  }

  const isPrivileged = await isPrivilegedRequest(request);
  if (!isPrivileged) {
    request.object.set('approved', false);
  }
});
Parse.Cloud.afterSave('Products', async (request) => {
  // sort tags
  const tags = await Parse.Object.fetchAllIfNeeded(request.object.get('tags'));
  tags.sort((a, b) => {
    // first sort alphabetically by category
    if (a.get('category') < b.get('category')) {
      return -1;
    }
    if (a.get('category') > b.get('category')) {
      return 1;
    }

    // then alphabetically by label
    if (a.get('label') < b.get('label')) {
      return -1;
    }
    if (a.get('label') > b.get('label')) {
      return 1;
    }

    return 0;
  });
  request.object.set('tags', tags);

  // create and set thumbnail based on first image

  request.object.save(null, { useMasterKey: true });
});

// TAGS
Parse.Cloud.beforeSave('Tags', async (request) => {
  const isPrivileged = await isPrivilegedRequest(request);
  if (!isPrivileged) {
    request.object.set('approved', false);
  }
});
Parse.Cloud.afterSave('Tags', (request) => {
  request.object.set('searchable_label', sanitizeForSearch(request.object.get('label')));
  request.object.save(null, { useMasterKey: true });
});

Parse.Cloud.beforeSave(Parse.User, (request) => {
  const minUsernameLength = 6;
  const minPasswordLength = 8;
  if (!request.object.get('username') || request.object.get('username').length < minUsernameLength) {
    throw new Error(`Username must be more than ${minUsernameLength} characters`);
  }

  if (!request.object.get('password') || request.object.get('password').length < minPasswordLength) {
    throw new Error(`Password must be more than ${minPasswordLength} characters`);
  }
});

Parse.Cloud.define('search', async (request) => {
  // params: tags: [Tags.id], skip: number, onlyUnapproved: bool?
  // return: count: number, results: [Products]
  const { tags, skip, onlyUnapproved } = request.params;

  const query = new Parse.Query('Products');

  const isPrivileged = await isPrivilegedRequest(request);
  if (isPrivileged && onlyUnapproved) {
    query.equalTo('approved', false);
  } else if (!isPrivileged) {
    query.equalTo('approved', true);
  }

  if (tags.length > 0) {
    query.containsAll('tags.objectId', tags);
  }

  query.exists('name')
    .include('tags')
    .descending('updatedAt')
    .limit(15) // PAGE_LENGTH
    .skip(skip)
    .withCount();
  const results = await query.find();
  return results;
});

Parse.Cloud.define('tagHint', async (request) => {
  // params: fragment: string, exclude: [Tags.id]
  // return: [],
  const { fragment, exclude } = request.params;
  const sanitizedFragment = sanitizeForSearch(fragment);

  if (sanitizedFragment) {
    const tagQuery = new Parse.Query('Tags');
    tagQuery.equalTo('approved', true)
      .contains('searchable_label', sanitizedFragment)
      .notContainedIn('objectId', exclude)
      .limit(5); // MAX_HINTS
    return tagQuery.find();
  }
  return [];
});

Parse.Cloud.define('randomTagline', async (request) => {
  const taglineQuery = new Parse.Query('Tagline');
  const count = await taglineQuery.count();
  const randInt = Math.floor(Math.random() * count);
  taglineQuery.skip(randInt);
  const tagline = await taglineQuery.first();
  return tagline.get('tagline');
});
