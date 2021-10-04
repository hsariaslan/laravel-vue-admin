import Vue from 'vue'
import Vuex from 'vuex'
import Localbase from 'localbase'
import auth from "@/store/auth";

let db = new Localbase('db')
db.config.debug = false

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    table: null,
    id: null,
    data: {},
    datas: [],
    dataIndex: -1,
    headers: {},
    search: null,
    tableSearch: '',
    dialog: false,
    dialogDelete: false,
    errors: [],
  },

  getters: {
    table: state => {
      return state.table
    },

    id: state => {
      return state.id
    },

    data: state => {
      return state.data
    },

    datas: state => {
      return state.datas
    },

    dataIndex: state => {
      return state.dataIndex
    },

    headers: state => {
      return state.headers
    },

    search: state => {
      return state.search
    },

    tableSearch: state => {
      return state.tableSearch
    },

    errors: state => {
      return state.errors
    },

  },

  mutations: {
    table (state, table) {
      state.table = table
    },

    id (state, id) {
      state.id = id
    },

    data (state, data) {
      state.data = data
    },

    defaultData (state) {
      state.data = {}
    },

    dataPermissions (state, array) {
      state.data.permissions = array
    },

    headers (state, headers) {
      state.headers = headers
    },

    get (state, datas) {
      state.datas = datas
      // console.log(state.datas)
    },

    show (state, data) {
      state.data = data
    },

    create (state, data) {
      state.datas.push(data)
      state.dialog = false
    },
    
    edit (state, data) {
      state.dataIndex = state.datas.indexOf(data)
      state.data = Object.assign({}, data)
      state.dialog = true
    },
    
    update (state) {
      Object.assign(state.datas[state.dataIndex], state.data)
    },
    
    showUpdate (state, data) {
      state.data = data
    },

    delete (state, index) {
      // console.log(index)
      state.datas.splice(index, 1)
    },

    deleteMultiple (state, payload) {
      state.id = payload.id
      state.data = payload.data
    },

    search (state, text) {
      state.search = text
    },

    dialog (state) {
      state.dialog = !state.dialog
      state.dataIndex = -1
    },

    dialogDelete (state, data) {
      state.data = data
      state.dataIndex = state.datas.indexOf(data)
      state.dialogDelete = !state.dialogDelete
      state.dataIndex = -1
    },

    dialogClose (state) {
      state.dialogDelete = false
      state.dialog = false
      state.dataIndex = -1
    },

    errors(state, errors) {
      state.errors = errors
    },

  },

  actions: {
    table ({ commit }, table) {
      // Todo: axios api table actions
      commit('table', table)
    },
    
    id ({ commit }, id) {
      // Todo: axios api item actions
      commit('id', id)
    },
    
    data ({ commit }, data) {
      // Todo: axios api item actions
      commit('data', data)
    },
    
    defaultData ({ commit }, data) {
      // Todo: axios api item actions
      commit('defaultData', data)
    },

    dataPermissions ({ commit }, array) {
      commit('dataPermissions', array)
    },
    
    headers ({ commit }, headers) {
      // Todo: axios api item actions
      commit('headers', headers)
    },
    
    get ({ state, commit }, table) {
      // Todo: axios api get (list) actions
      if(!table) {
        table = state.table
      }
      db.collection(table).get().then(datas => {
        // console.log(datas)
        commit('get', datas)
      })
    },
    
    getWithRelations ({ state, commit }, payload) {
      // Todo: axios api get (list) actions
      if(!payload.table) {
        payload.table = state.table
      }
      db.collection(payload.table).get().then(datas => {
        // 2 rows (users)
        datas.forEach((data) => {
          // 2 times (roles, permissions)
          payload.relations.forEach((relation) => {
            // console.log(data[relation])
            relation = String(relation)
            if(data[relation].length > 0) {
              let dataArray = []
              // minimum: 1, maximum 11 times (each roles or permissions defined to the user)
              data[relation].forEach((field) => {
                db.collection(relation).doc({ id: field }).get().then(relationDatas => {
                  dataArray.push(relationDatas)
                  // console.log(relationDatas.name)
                })
              })
              data[relation] = dataArray
              // console.log(data[relation])
              // console.log(dataArray)
              // dataArray = []
            } else {
              let dataArray = []
              // console.log(relation)
              db.collection(relation).doc({ id: data[relation] }).get().then(relationDatas => {
                // console.log(Vue.helpers.isNull(relationDatas))
                if(Vue.helpers.isNull(relationDatas)) {
                  data[relation] = relationDatas
                } else {
                  // console.log(relationDatas)
                  dataArray.push(relationDatas)
                  data[relation] = dataArray
                }
              })
            }
          })
        })
        commit('get', datas)
        console.log(datas)
      })
    },
    
    show ({ state, commit, dispatch }, payload) {
      // Todo: axios api show actions
      let table = payload.table
      let id = payload.id
      if(!table) {
        table = state.table
      }
      if(!id) {
        id = state.id
      }
      db.collection(table).doc({ id: id }).get().then(data => {
        commit('show', data)
      })
    },

    create ({ state, commit }, data) {
      // Todo: axios api create actions
      // console.log(data)
      db.collection(state.table).add(data)
      Vue.nextTick(() => {
        commit('create', data)
        commit('defaultData')
      })
    },
    
    edit ({ commit }, data) {
      // console.log(data)
      commit('edit', data)
    },
    
    update ({ state, commit }, data) {
      // Todo: axios api update actions
      db.collection(state.table).doc({ id: data.id }).update(data)
      Vue.nextTick(() => {
        commit('update')
        commit('defaultData')
        commit('dialogClose')
      })
    },
    
    showUpdate ({ state, commit }, data) {
      // Todo: axios api update actions
      db.collection(state.table).doc({ id: data.id }).update(data)
      commit('showUpdate', data)
    },
    
    delete ({ state, commit, dispatch }, data) {
      // Todo: axios api delete actions
      // console.log(data)
      db.collection(state.table).doc({ id: data.id }).delete()
      Vue.nextTick(() => {
        state.dataIndex = state.datas.indexOf(data)
        commit('delete', state.dataIndex)
        dispatch('dialogDelete', data)
        commit('defaultData')
        // console.log(state.datas)
      })
    },
    
    deleteMultiple ({ state, commit }, payload) {
      // Todo: axios api deleteMultiple actions
      commit('delete', payload)
    },
    
    search ({ state, commit }, text) {
      // Todo: axios api search actions
      commit('search', text)
    },
    
    dialog ({ commit }) {
      commit('dialog')
    },
    
    dialogDelete ({ commit }, data) {
      // console.log(data)
      commit('dialogDelete', data)
    },
    
    dialogClose ({ commit }) {
      commit('dialogClose')
      commit('defaultData')
    },
    
    pushError({ commit }, errors) {
      commit('errors', errors)
    },
    
    getLastId({}, table) {
      return new Promise((resolve, reject) => {
        db.collection(table).orderBy('id', 'desc').limit(1).get()
        .then(data => {
          resolve(data[0].id).then((value) => {
            return value
          })
        })
        .catch(error => {
          reject(error)
        })
      })
    },

  },

  modules: {
    auth,
  }
})
