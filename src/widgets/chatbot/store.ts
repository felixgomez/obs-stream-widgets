import { MutationTree, ActionTree, GetterTree } from 'vuex'
import { Map } from '@/types'

const state: Map<any> = {}

const mutations: MutationTree<Map<any>> = {}

const actions: ActionTree<Map<any>, any> = {}

const getters: GetterTree<Map<any>, any> = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
