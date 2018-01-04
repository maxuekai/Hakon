import * as types from '../mutation-types';

const state = {
  moduleList: []
};

const getters = {
  allModule: state => state.moduleList
};

const actions = {
  getModule: ({commit}, data) => commit(types.RECEIVE_MODULELIST, data)
};

const mutations = {
  [types.RECEIVE_MODULELIST]: (state, data) => {
    state.moduleList = data;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
