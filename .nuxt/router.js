import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _15efc9b0 = () => interopDefault(import('..\\pages\\create-candidate.vue' /* webpackChunkName: "pages/create-candidate" */))
const _18ea2909 = () => interopDefault(import('..\\pages\\demand.vue' /* webpackChunkName: "pages/demand" */))
const _202f642a = () => interopDefault(import('..\\pages\\deptcontrol.vue' /* webpackChunkName: "pages/deptcontrol" */))
const _723a8b60 = () => interopDefault(import('..\\pages\\intern.vue' /* webpackChunkName: "pages/intern" */))
const _5e3fb5ef = () => interopDefault(import('..\\pages\\recruiting-report.vue' /* webpackChunkName: "pages/recruiting-report" */))
const _fffb82a4 = () => interopDefault(import('..\\pages\\resign.vue' /* webpackChunkName: "pages/resign" */))
const _fa4cee3a = () => interopDefault(import('..\\pages\\resign-report.vue' /* webpackChunkName: "pages/resign-report" */))
const _e4c8ceee = () => interopDefault(import('..\\pages\\template-print\\1.vue' /* webpackChunkName: "pages/template-print/1" */))
const _1ff0b13e = () => interopDefault(import('..\\pages\\template-print\\2-cn.vue' /* webpackChunkName: "pages/template-print/2-cn" */))
const _3acd7f26 = () => interopDefault(import('..\\pages\\template-print\\2-sf.vue' /* webpackChunkName: "pages/template-print/2-sf" */))
const _e49070ea = () => interopDefault(import('..\\pages\\template-print\\3.vue' /* webpackChunkName: "pages/template-print/3" */))
const _e47441e8 = () => interopDefault(import('..\\pages\\template-print\\4.vue' /* webpackChunkName: "pages/template-print/4" */))
const _e45812e6 = () => interopDefault(import('..\\pages\\template-print\\5.vue' /* webpackChunkName: "pages/template-print/5" */))
const _27417c5d = () => interopDefault(import('..\\pages\\template-print\\bqt.vue' /* webpackChunkName: "pages/template-print/bqt" */))
const _e9ae3d52 = () => interopDefault(import('..\\pages\\template-print\\hires.vue' /* webpackChunkName: "pages/template-print/hires" */))
const _3e2516c8 = () => interopDefault(import('..\\pages\\template-print\\resign.vue' /* webpackChunkName: "pages/template-print/resign" */))
const _1be4a7f8 = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages/index" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/vg/hr/recruiting-report/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/create-candidate",
    component: _15efc9b0,
    name: "create-candidate"
  }, {
    path: "/demand",
    component: _18ea2909,
    name: "demand"
  }, {
    path: "/deptcontrol",
    component: _202f642a,
    name: "deptcontrol"
  }, {
    path: "/intern",
    component: _723a8b60,
    name: "intern"
  }, {
    path: "/recruiting-report",
    component: _5e3fb5ef,
    name: "recruiting-report"
  }, {
    path: "/resign",
    component: _fffb82a4,
    name: "resign"
  }, {
    path: "/resign-report",
    component: _fa4cee3a,
    name: "resign-report"
  }, {
    path: "/template-print/1",
    component: _e4c8ceee,
    name: "template-print-1"
  }, {
    path: "/template-print/2-cn",
    component: _1ff0b13e,
    name: "template-print-2-cn"
  }, {
    path: "/template-print/2-sf",
    component: _3acd7f26,
    name: "template-print-2-sf"
  }, {
    path: "/template-print/3",
    component: _e49070ea,
    name: "template-print-3"
  }, {
    path: "/template-print/4",
    component: _e47441e8,
    name: "template-print-4"
  }, {
    path: "/template-print/5",
    component: _e45812e6,
    name: "template-print-5"
  }, {
    path: "/template-print/bqt",
    component: _27417c5d,
    name: "template-print-bqt"
  }, {
    path: "/template-print/hires",
    component: _e9ae3d52,
    name: "template-print-hires"
  }, {
    path: "/template-print/resign",
    component: _3e2516c8,
    name: "template-print-resign"
  }, {
    path: "/",
    component: _1be4a7f8,
    name: "index"
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}
