import Vue from 'vue';
import Vuex from 'vuex';
import Parse from 'parse';
import router from '@/router';
import {
  User,
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
    isPrivileged: (state) => state.isAdmin || state.isMod,
  },

  mutations: {
    setTags(state, { category, tags }) {
      if (category) {
        const index = state.tags.findIndex((tagCategory) => tagCategory.category === category);
        Vue.set(state.tags[index], 'tags', tags);
      } else {
        state.tags = tags;
      }
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

    async getInitialTags({ commit }) {
      const tags = await Parse.Cloud.run('popularTagsByCategory');
      commit('setTags', { tags });
      return tags;
    },

    async getMoreTags({ commit }, { category }) {
      const tags = await Parse.Cloud.run('popularTagsByCategory', { category });
      commit('setTags', { category, tags });
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
      dispatch('getInitialTags');
      dispatch('getTagline');
      // dispatch('getKeyboardArt');
      dispatch('syncUserState');
    },
  },
});
