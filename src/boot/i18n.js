import { boot } from 'quasar/wrappers'
import { createI18n } from 'vue-i18n'
import messages from 'src/i18n'

export default boot(({ app }) => {
    const i18n = createI18n({
        legacy: false, // you must set `false`, to use Compostion API
        globalInjection: true, // you must set `true`, to use Compostion API
        locale: 'en-US',
        fallbackLocale: 'en-US',
        messages
    })

    // Set i18n instance on app
    app.use(i18n)
})
