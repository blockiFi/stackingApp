import Vue from 'vue'
import Vuex from 'vuex'

import currentUser from "./modules/currentUser"
import loading from "./modules/loading"
import constant from "./modules/constant"
import metamask from "./modules/metamask"
import vault from "./modules/vault"


Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
     currentUser,
     loading,
     constant,
     metamask,
     vault
    }
})