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
    meta: {
      title: 'Keebhunter',
    },
  },
  {
    path: '/suggest-tag',
    name: 'suggest-tag',
    component: SuggestTag,
    meta: {
      title: 'Suggest a tag - Keebhunter',
      // authRequired: true,
    },
  },
  {
    path: '/submit',
    name: 'submit',
    component: ProductPage,
    meta: {
      title: 'Add a product - Keebhunter',
      // authRequired: true,
    },
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

  if (to.meta.title) {
    const metaTitle = to.meta.title; // `${to.meta.title} - Keebhunter`;
    document.title = metaTitle;
    document.head.querySelector('meta[property="og:title"]').content = metaTitle;
    document.head.querySelector('meta[property="twitter:title"]').content = metaTitle;
    document.head.querySelector('meta[property="og:image"]').content = '/apple-touch-icon.png';
    document.head.querySelector('meta[property="twitter:image"]').content = '/apple-touch-icon.png';
  }
});

export default router;
