<template>
  <div class="chat-settings">
    <v-card class="mb-8">
      <v-card-title class="heading">
        Chat
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" lg="6">
            <widget-url :url="widgetUrl"></widget-url>
          </v-col>
          <v-col cols="12" lg="6">
            <v-switch v-model="testMode" label="Demo mode"></v-switch>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-alert type="info" border="left" color="yellow" text>Size 500x400px</v-alert>
    <div class="demo-wrapper">
      <chat-widget
        :youtube-settings="youtube"
        :twitch-settings="twitch"
        :test-mode="testMode"
        :platform="platform"
      ></chat-widget>
    </div>
  </div>
</template>
<script lang="ts">
import Widget from '@/mixins/Widget'
import WidgetUrl from '@/components/WidgetUrl.vue'
import ChatWidget from './Chat.vue'
import './ChatSettings.scss'
import { mapState } from 'vuex'

export default Widget.extend({
  name: 'chat-settings',
  components: {
    WidgetUrl,
    ChatWidget
  },
  data () {
    return {
      testMode: true
    }
  },
  computed: {
    widgetUrl (): string {
      return `${this.$store.state.basePath}/widget/chat/`
    },
    ...mapState([
      'youtube',
      'twitch',
      'platform'
    ])
  },
  methods: {

  }
})
</script>
