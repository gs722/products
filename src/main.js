import Vue from 'vue'
import App from './App.vue'
import VModal from 'vue-js-modal'
import VueApollo from 'vue-apollo'
import ApolloClient from 'apollo-boost'

const apolloClient = new ApolloClient({
    uri: process.env.VUE_APP_GRAPHQL_API
})

Vue.use(VueApollo)

const apolloProvider = new VueApollo({
    defaultClient: apolloClient
})

Vue.use(VModal)
Vue.config.productionTip = false

new Vue({
    apolloProvider,
    render: h => h(App),
}).$mount('#app')
