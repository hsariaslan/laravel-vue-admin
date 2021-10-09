import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes';
import middleware from '@/middleware/middleware';
import permission from '@/middleware/permission';

Vue.use(VueRouter);

const router = new VueRouter({
  routes
});

middleware(router);
permission(router);

export default router;