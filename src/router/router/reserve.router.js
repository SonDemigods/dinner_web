import Main from '@/components/main'
export default {
  path: '/dinner',
  name: 'dinner',
  meta: {
    icon: 'md-book',
    title: '订餐系统'
  },
  component: Main,
  children: [{
    path: 'list',
    name: 'list',
    meta: {
      icon: 'md-bookmarks',
      title: '订餐'
    },
    component: () => import('@/view/dinner/list/list.vue')
  }]
}
