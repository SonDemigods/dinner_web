import Main from '@/components/main'
export default {
  path: '/reserve',
  name: 'reserve',
  meta: {
    icon: 'md-book',
    title: '预定管理'
  },
  component: Main,
  children: [{
    path: 'list',
    name: 'list',
    meta: {
      icon: 'md-bookmarks',
      title: '订餐'
    },
    component: () => import('@/view/reserve/list')
  }]
}
