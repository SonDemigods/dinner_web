import Main from '@/components/main'
export default {
  path: '/system',
  name: 'system',
  meta: {
    icon: 'md-settings',
    title: '系统维护',
    access: ['isAdmin']
  },
  component: Main,
  children: [{
    path: 'person',
    name: 'person',
    meta: {
      icon: 'md-contacts',
      title: '人员维护'
    },
    component: () => import('@/view/system/person/person.vue')
  },
  {
    path: 'food',
    name: 'food',
    meta: {
      icon: 'md-beer',
      title: '菜品维护'
    },
    component: () => import('@/view/system/food/food.vue')
  }
  ]
}
