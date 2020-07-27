import settingsComponent from './ChatbotSettings.vue'
import store from './store'
import metadata from './widget.json'
const namespace = 'chatbot'
import worker from './chatbot-worker'

export { namespace, settingsComponent, store, metadata, worker }
