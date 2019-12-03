const columnsList = [{
  title: '选择',
  type: 'selection',
  fixed: 'left',
  width: 50,
  align: 'center'
},
{
  title: '人员',
  key: 'personName',
  minWidth: 100,
  align: 'center'
},
{
  title: '菜品',
  key: 'foodName',
  minWidth: 100,
  align: 'center'
},
{
  title: '用餐类型',
  key: 'type',
  minWidth: 100,
  align: 'center',
  render: (h, params) => {
    let typeList = {
      0: h('div', {
        class: 'tableStatusBorder',
        style: {
          backgroundColor: '#2d8cf0',
          borderColor: '#2d8cf0',
          marginBottom: '3px'
        }
      }, '不加班'),
      1: h('div', {
        class: 'tableStatusBorder',
        style: {
          backgroundColor: '#19be6b',
          borderColor: '#19be6b',
          marginBottom: '3px'
        }
      }, '集体'),
      2: h('div', {
        class: 'tableStatusBorder',
        style: {
          backgroundColor: '#ff9900',
          borderColor: '#ff9900',
          marginBottom: '3px'
        }
      }, '个人')
    }
    let dom = typeList[params.row.type]
    return h('div', [dom])
  }
},
{
  title: '加班日期',
  key: 'date',
  minWidth: 100,
  align: 'center'
},
{
  title: '打卡时间',
  key: 'leave',
  minWidth: 100,
  align: 'center'
},
{
  title: '发票类型',
  key: 'invoiceType',
  minWidth: 100,
  align: 'center',
  render: (h, params) => {
    let typeList = {
      1: h('div', {
        class: 'tableStatusBorder',
        style: {
          backgroundColor: '#2d8cf0',
          borderColor: '#2d8cf0',
          marginBottom: '3px'
        }
      }, '定额'),
      2: h('div', {
        class: 'tableStatusBorder',
        style: {
          backgroundColor: '#19be6b',
          borderColor: '#19be6b',
          marginBottom: '3px'
        }
      }, '机打'),
      3: h('div', {
        class: 'tableStatusBorder',
        style: {
          backgroundColor: '#ff9900',
          borderColor: '#ff9900',
          marginBottom: '3px'
        }
      }, '电子')
    }
    let dom = typeList[params.row.invoiceType]
    return h('div', [dom])
  }
},
{
  title: '备注',
  key: 'remark',
  minWidth: 100,
  align: 'center'
},
{
  title: '操作',
  key: 'handle',
  align: 'center',
  minWidth: 120,
  options: ['edit', 'delete', 'leave'],
  button: []
}
]

export default columnsList
