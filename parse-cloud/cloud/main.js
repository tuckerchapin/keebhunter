/* eslint-disable no-undef */

const isPrivilegedRequest = (request) => {
  if (request.master) {
    return true;
  }

  if (!request.user) {
    return false;
  }

  return request.user.get('isAdmin');
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

  if (request.object.get('approved')) {
    if (!isPrivilegedRequest(request)) {
      request.object.set('approved', false);
    }
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
  if (request.object.dirty()) {
    request.object.save(null, { useMasterKey: true });
  }

  // create and set thumbnail based on first image
});

// TAGS
Parse.Cloud.beforeSave('Tags', async (request) => {
  if (request.object.get('approved')) {
    if (!isPrivilegedRequest(request)) {
      request.object.set('approved', false);
    }
  }
});
Parse.Cloud.afterSave('Tags', (request) => {
  const searchableLabel = sanitizeForSearch(request.object.get('label'));
  if (searchableLabel !== request.object.get('searchable_label')) {
    request.object.set('searchable_label', searchableLabel);
    request.object.save(null, { useMasterKey: true });
  }
});

Parse.Cloud.beforeSave(Parse.User, (request) => {
  if (request.object.isNew()) {
    const minUsernameLength = 6;
    const minPasswordLength = 8;
    if (!request.object.get('username') || request.object.get('username').length < minUsernameLength) {
      throw new Error(`Username must be more than ${minUsernameLength} characters`);
    }

    if (!request.object.get('password') || request.object.get('password').length < minPasswordLength) {
      throw new Error(`Password must be more than ${minPasswordLength} characters`);
    }
  }
});

// FUNCTIONS
Parse.Cloud.define('search', async (request) => {
  // params: tags: [Tags.id], skip: number, onlyUnapproved: bool?
  // return: count: number, results: [Products]
  const { tags, skip, onlyUnapproved } = request.params;

  const query = new Parse.Query('Products');

  if (onlyUnapproved && isPrivilegedRequest(request)) {
    query.equalTo('approved', false);
  } else {
    query.equalTo('approved', true);
  }

  if (tags.length > 0) {
    query.containsAll('tags.objectId', tags);
  }

  query.exists('name')
    .include('tags')
    .descending('updatedAt')
    .limit(12) // PAGE_LENGTH
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

Parse.Cloud.define('popularTagsByCategory', async (request) => {
  if (request.params.category) {
    const query = new Parse.Query('Tags');
    query.equalTo('category', request.params.category)
      .descending('popularity');
    return query.find();
  }

  const query = new Parse.Query('Tags');
  const categories = await query.distinct('category');
  return Promise.all(categories.map(async (category) => {
    const tagQuery = new Parse.Query('Tags');
    tagQuery.equalTo('category', category)
      .descending('popularity')
      .withCount()
      .limit(5);
    const { count, results } = await tagQuery.find();
    return { category, total: count, tags: results };
  }));
});

Parse.Cloud.define('randomTagline', async () => {
  const taglineQuery = new Parse.Query('Tagline');
  const count = await taglineQuery.count();
  const randInt = Math.floor(Math.random() * count);
  taglineQuery.skip(randInt);
  const tagline = await taglineQuery.first();
  return tagline.get('tagline');
});

// JOBS
Parse.Cloud.job('tagPopularity', async () => {
  const tagQuery = new Parse.Query('Tags');
  tagQuery.limit(200);
  const tags = await tagQuery.find();
  return tags.map(async (tag) => {
    const query = new Parse.Query('Products');
    query.containsAll('tags', [tag]);
    const count = await query.count();
    tag.set('popularity', count);
    return tag.save(null, { useMasterKey: true });
  });
});
