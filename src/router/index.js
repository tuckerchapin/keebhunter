import Vue from 'vue';
import VueRouter from 'vue-router';
import { User } from '@/lib';
import Search from '@/views/Search.vue';
import ProductPage from '@/views/ProductPage.vue';
import SuggestTag from '@/views/SuggestTag.vue';

Vue.use(VueRouter);

const DEFAULT_TITLE = 'Keebhunter';

const routes = [
  {
    path: '/',
    name: 'search',
    component: Search,
  },
  {
    path: '/suggest-tag',
    name: 'suggest-tag',
    component: SuggestTag,
    // meta: { authRequired: true },
  },
  {
    path: '/submit',
    name: 'submit',
    component: ProductPage,
    // meta: { authRequired: true },
  },
  {
    path: '/:id',
    name: 'product',
    component: ProductPage,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.authRequired) && !User.current()) {
    // needs auth & not logged in, redirect
    next({ name: 'search' });
  } else {
    next();
  }
});

router.afterEach((to) => {
  window.scrollTo(0, 0);
  Vue.nextTick(() => {
    document.title = to.meta.title || DEFAULT_TITLE;
  });
});

export default router;
