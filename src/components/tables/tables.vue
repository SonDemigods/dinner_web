<!--
 * @description 基础表格
 * @fileName tables.vue
 * @author 张航
 * @date 2019-02-01 15:40:29
 * @version V1.0.0
!-->
<template>
  <div>
    <div class="tool-box">
      <Poptip v-if="colFilter"
              placement="bottom-end"
              width="150"
              style="float:right;">
        <Button type="text"
                icon="ios-funnel"></Button>
        <div class="colList"
             slot="content">
          <Checkbox-group v-model="tableColumnsChecked"
                          @on-change="changeTableColumns">
            <Checkbox v-for="(item,index) in colList"
                      :key="index"
                      :label="item.key">{{item.title}}
            </Checkbox>
          </Checkbox-group>
        </div>
      </Poptip>
      <div :class="[ colFilter ? 'tool-slot' : 'tool-slot no']">
        <slot name="tool"></slot>
      </div>
    </div>
    <Table id="scrollView"
           ref="tablesMain"
           :data="insideTableData"
           :columns="insideColumns"
           :stripe="stripe"
           :border="border"
           :show-header="showHeader"
           :width="width"
           :height="height"
           :loading="loading"
           :disabled-hover="disabledHover"
           :highlight-row="highlightRow"
           :row-class-name="rowClassName"
           :size="size"
           :no-data-text="noDataText"
           :no-filtered-data-text="noFilteredDataText"
           @on-current-change="onCurrentChange"
           @on-select="onSelect"
           @on-select-cancel="onSelectCancel"
           @on-select-all="onSelectAll"
           @on-selection-change="onSelectionChange"
           @on-sort-change="onSortChange"
           @on-filter-change="onFilterChange"
           @on-row-click="onRowClick"
           @on-row-dblclick="onRowDblclick"
           @on-expand="onExpand">
      <slot name="header"
            slot="header"></slot>
      <slot name="footer"
            slot="footer"></slot>
      <slot name="loading"
            slot="loading"></slot>
    </Table>
    <div class="page-slot">
      <slot name="page"></slot>
    </div>
  </div>
</template>
<script>
import './tables.less'
import handleBtns from './btns'
import { debounce, getToken } from '@/libs/util'
export default {
  name: 'base_table',
  props: {
    value: {
      type: Array,
      default () {
        return []
      }
    },
    columns: {
      type: Array,
      default () {
        return []
      }
    },
    colFilter: {
      type: Boolean,
      default: false
    },
    colList: {
      type: Array,
      default () {
        return []
      }
    },
    nameKey: {
      type: String,
      default: ''
    },
    size: String,
    width: {
      type: [Number, String]
    },
    height: {
      type: [Number, String]
    },
    page: {
      type: [Number, String]
    },
    pageSize: {
      type: [Number, String]
    },
    stripe: {
      type: Boolean,
      default: true
    },
    border: {
      type: Boolean,
      default: true
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    highlightRow: {
      type: Boolean,
      default: false
    },
    rowClassName: {
      type: Function,
      default () {
        return ''
      }
    },
    context: {
      type: Object
    },
    noDataText: {
      type: String
    },
    noFilteredDataText: {
      type: String
    },
    disabledHover: {
      type: Boolean
    },
    loading: {
      type: Boolean,
      default: false
    },
    /**
     * @description 全局设置是否可编辑
     */
    editable: {
      type: Boolean,
      default: false
    },
    access_view: {
      type: Boolean,
      default: true
    },
    access_edit: {
      type: Boolean,
      default: true
    },
    access_delete: {
      type: Boolean,
      default: true
    },
    access_up: {
      type: Boolean,
      default: true
    },
    access_down: {
      type: Boolean,
      default: true
    },
    scrollToBottom: {
      type: Function,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      selsectColumns: [],
      insideColumns: [],
      insideTableData: [],
      edittingCellId: '',
      edittingText: '',
      tableData2: this.mockTableData2(),
      tableColumns2: [],
      tableColumnsChecked: []
    }
  },
  methods: {
    suportEdit (item, index) {
      item.render = (h, params) => {
        return h(TablesEdit, {
          props: {
            params: params,
            value: this.insideTableData[params.index][params.column.key],
            edittingCellId: this.edittingCellId,
            editable: this.editable
          },
          on: {
            'input': val => {
              this.edittingText = val
            },
            'on-start-edit': (params) => {
              this.edittingCellId = `editting-${params.index}-${params.column.key}`
              this.$emit('on-start-edit', params)
            },
            'on-cancel-edit': (params) => {
              this.edittingCellId = ''
              this.$emit('on-cancel-edit', params)
            },
            'on-save-edit': (params) => {
              this.value[params.row.initRowIndex][params.column.key] = this.edittingText
              this.$emit('input', this.value)
              this.$emit('on-save-edit', Object.assign(params, { value: this.edittingText }))
              this.edittingCellId = ''
            }
          }
        })
      }
      return item
    },
    surportHandle (item) {
      let options = item.options || []
      let insideBtns = []
      options.forEach(item => {
        if (item === 'show' && !this.access_view) return false
        if (item === 'edit' && !this.access_edit) return false
        if (item === 'delete' && !this.access_delete) return false
        if (item === 'up' && !this.access_up) return false
        if (item === 'down' && !this.access_down) return false
        if (item === 'pass' && !this.access_adop) return false
        if (item === 'finish' && !this.access_adop) return false
        if (handleBtns[item]) insideBtns.push(handleBtns[item])
      })
      let btns = item.button ? [].concat(insideBtns, item.button) : insideBtns
      item.render = (h, params) => {
        let userId = localStorage.getItem('userid')
        params.tableData = this.value
        let rule
        if (params.row.pid) {
          rule = userId === params.row.pid.toString() || getToken() === '1'
        } else {
          rule = getToken() === '1'
        }
        let dom = rule ? h('div', btns.map(item => item(h, params, this))) : h('div', '')
        return dom
      }
      return item
    },
    surportName (item) {
      item.render = (h, params) => {
        params.tableData = this.value
        let dom
        dom = [
          // h('Icon', {
          //   props: {
          //     type: 'md-flag',
          //     size: 18,
          //     color: '#19be6b'
          //   }
          // }),
          h('Button', {
            props: {
              type: 'text',
              size: 'small'
            },
            style: {},
            on: {
              click: () => {
                // if (this.access_edit) {
                this.$emit('on-name', params.index)
                // } else {
                //   this.$emit('on-view-only', params.index)
                // }
              }
            }
          }, params.row[this.nameKey])
        ]
        return h('div', dom)
      }
      return item
    },
    surportIndex (item) {
      item.render = (h, params) => {
        return h('div', params.index + (this.page - 1) * this.pageSize + 1)
      }
      return item
    },
    handleColumns (columns) {
      this.insideColumns = columns.map((item, index) => {
        let res = item
        if (res.key === 'handle') res = this.surportHandle(res)
        if (res.key === this.nameKey) res = this.surportName(res)
        if (res.key === 'index') res = this.surportIndex(res)
        return res
      })
    },
    setDefaultSearchKey () {
      this.searchKey = this.columns[0].key !== 'handle' ? this.columns[0].key : (this.columns.length > 1 ? this.columns[1].key : '')
    },
    handleClear (e) {
      if (e.target.value === '') this.insideTableData = this.value
    },
    // handleSearch () {
    //   this.insideTableData = this.value.filter(item => item[this.searchKey].indexOf(this.searchValue) > -1)
    // },
    handleTableData () {
      this.insideTableData = this.value.map((item, index) => {
        let res = item
        res.initRowIndex = index
        return res
      })
    },
    exportCsv (params) {
      this.$refs.tablesMain.exportCsv(params)
    },
    clearCurrentRow () {
      this.$refs.talbesMain.clearCurrentRow()
    },
    onCurrentChange (currentRow, oldCurrentRow) {
      this.$emit('on-current-change', currentRow, oldCurrentRow)
    },
    onSelect (selection, row) {
      this.$emit('on-select', selection, row)
    },
    onSelectCancel (selection, row) {
      this.$emit('on-select-cancel', selection, row)
    },
    onSelectAll (selection) {
      this.$emit('on-select-all', selection)
    },
    onSelectionChange (selection) {
      this.$emit('on-selection-change', selection)
    },
    onSortChange (column, key, order) {
      this.$emit('on-sort-change', column, key, order)
    },
    onFilterChange (row) {
      this.$emit('on-filter-change', row)
    },
    onRowClick (row, index) {
      this.$emit('on-row-click', row, index)
    },
    onRowDblclick (row, index) {
      this.$emit('on-row-dblclick', row, index)
    },
    onExpand (row, status) {
      this.$emit('on-expand', row, status)
    },

    mockTableData2 () {
      let data = []

      function getNum () {
        return Math.floor(Math.random() * 10000 + 1)
      }

      for (let i = 0; i < 20; i++) {
        data.push({
          name: 'Name ' + (i + 1),
          fav: 0,
          show: getNum(),
          weak: getNum(),
          signin: getNum()
        })
      }
      return data
    },
    getTable2Columns () {
      let data = []
      this.columns.map((item, index) => {
        let res = item
        if (res.type === 'selection') res = data.push(res)
        if (res.type === 'index') res = data.push(res)
        this.tableColumnsChecked.forEach(col => {
          if (res.key === col) {
            data.push(res)
          }
        })
        if (res.key === 'handle') res = data.push(res)
      })
      return data
    },
    changeTableColumns () {
      this.selsectColumns = this.colFilter ? this.getTable2Columns() : this.columns
      this.handleColumns(this.selsectColumns)
    },
    changeColumns (columns) {
      this.selsectColumns = JSON.parse(JSON.stringify(columns))
      this.changeTableColumns()
    },
    initChange () {
      if (this.colFilter) {
        this.colList.forEach(item => this.tableColumnsChecked.push(item.key))
      }
    },
    handleScroll: debounce(function (e) {
      if (e.target.scrollHeight - 100 < e.target.clientHeight + e.target.scrollTop) {
        this.scrollToBottom()
      }
    }, 100)
  },
  watch: {
    columns (columns) {
      this.changeColumns(columns)
      this.setDefaultSearchKey()
    },
    value (val) {
      this.handleTableData()
    }
  },
  mounted () {
    this.initChange()
    this.changeColumns(this.columns)
    this.setDefaultSearchKey()
    this.handleTableData()
    document.getElementById('scrollView').addEventListener('scroll', this.handleScroll, true)
  }
}
</script>
