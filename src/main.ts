import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import './styles.scss'
import { targetHref } from './utils'

Vue.config.productionTip = false

if (targetHref) {
    if (window.connex) {
        window.location.href = targetHref
    } else {
        new App().$mount('#app')
    }
} else {
    window.location.href = 'https://github.com/vechain/'
}

