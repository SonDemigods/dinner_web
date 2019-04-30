const columnsList = [{
  title: '选择',
  type: 'selection',
  fixed: 'left',
  width: 50,
  align: 'center'
},
{
  title: '姓名',
  key: 'name',
  minWidth: 100,
  align: 'center'
},
{
  title: '岗位',
  key: 'work',
  minWidth: 100,
  align: 'center'
},
{
  title: '操作',
  key: 'handle',
  align: 'center',
  minWidth: 120,
  options: ['edit', 'delete'],
  button: [

  ]
}
]

export default columnsList
