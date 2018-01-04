import Vue from 'vue';
import Vuex from 'vuex';
import moduleList from './modules/moduleList';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    moduleList
  }
});
