import Vue from 'vue';
import Vuex from 'vuex';
import Parse from 'parse';
import router from '@/router';
import {
  User,
  Tag,
  KeyboardArt,
} from '@/lib';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    tags: [],
    keyboardArt: {},
    tagline: '',
    loggedIn: false,
    isAdmin: false,
    isMod: false,
  },

  getters: {
    allTagsByCategory: (state) => state.tags.reduce((acc, cur) => {
      if (!(cur.category in acc)) {
        acc[cur.category] = [];
      }
      acc[cur.category].push(cur);
      return acc;
    }, {}),

    isPrivileged: (state) => state.isAdmin || state.isMod,
  },

  mutations: {
    setTags(state, { tags }) {
      state.tags = tags;
    },

    setTagline(state, { tagline }) {
      state.tagline = tagline;
    },

    setKeyboardArt(state, keyboardArt) {
      state.keyboardArt = keyboardArt;
    },

    setLoggedIn(state, { loggedIn }) {
      state.loggedIn = loggedIn;
    },

    setIsAdmin(state, { isAdmin }) {
      state.isAdmin = isAdmin;
    },

    setIsMod(state, { isMod }) {
      state.isMod = isMod;
    },
  },

  actions: {
    async syncUserState({ commit }) {
      const currentUser = User.current();
      commit('setLoggedIn', { loggedIn: !!currentUser });
      const query = new Parse.Query(Parse.Role);
      query.equalTo('users', currentUser);
      const roles = await query.find();
      const names = roles.map((role) => role.get('name'));
      const isAdmin = names.includes('admin');
      if (isAdmin) {
        commit('setIsAdmin', { isAdmin: true });
        commit('setIsMod', { isMod: true });
      } else if (names.includes('mod')) {
        commit('setIsAdmin', { isAdmin: false });
        commit('setIsMod', { isMod: true });
      } else {
        commit('setIsAdmin', { isAdmin: false });
        commit('setIsMod', { isMod: false });
      }
      return 0;
    },

    async register({ dispatch }, { username, password }) {
      const user = new User();
      return user.register(username, password)
        .finally(() => dispatch('syncUserState'));
    },

    async login({ dispatch }, { username, password }) {
      return User.logIn(username, password)
        .finally(() => dispatch('syncUserState'));
    },

    async logout({ dispatch }) {
      return User.logOut()
        .finally(() => dispatch('syncUserState'))
        .finally(() => { if (router.currentRoute.name !== 'search') router.push({ name: 'search' }); });
    },

    async getAllTags({ commit }) {
      const tagQuery = new Parse.Query(Tag);
      tagQuery.equalTo('approved', true);
      tagQuery.limit(200);
      const tags = await tagQuery.find();
      commit('setTags', { tags });
      return tags;
    },

    async getTagline({ commit }) {
      const tagline = await Parse.Cloud.run('randomTagline');
      commit('setTagline', { tagline });
      return tagline;
    },

    async getKeyboardArt({ commit }) {
      const keyboardArtQuery = new Parse.Query(KeyboardArt);
      keyboardArtQuery.skip(Math.floor(Math.random() * Math.floor(await keyboardArtQuery.count())));
      const result = (await keyboardArtQuery.find())[0];
      commit('setKeyboardArt', {
        src: result.src,
        name: result.name,
        attribution: result.attribution,
        url: result.url,
      });
      return result;
    },

    async hydrate({ dispatch }) {
      dispatch('getAllTags');
      dispatch('getTagline');
      // dispatch('getKeyboardArt');
      dispatch('syncUserState');
    },
  },
});
