import { createApp } from 'vue'
import App from './App.vue'
import store, { key } from './store'
import firebase from '@/firebase'

const app = createApp(App)
app.use(store, key);


firebase.initialize()
store.dispatch('init')
.then(()=>{
    app.mount('#app')
})
