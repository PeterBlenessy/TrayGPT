import { store } from 'quasar/wrappers'
import { createPinia } from 'pinia'
import { piniaLocalForage } from 'src/stores/pinia-localforage-plugin'

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store((/* { ssrContext } */) => {
    const pinia = createPinia()

    // You can add Pinia plugins here
    // pinia.use(SomePiniaPlugin)

    // Register the Pinia LocalForage plugin
    pinia.use(piniaLocalForage)

    return pinia
})
