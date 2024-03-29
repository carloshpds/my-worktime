import { createApp } from 'vue'
import PopupApp from './PopupApp.vue'
import store from '../../store'

createApp(PopupApp).use(store).mount('#mw-popup-content')
