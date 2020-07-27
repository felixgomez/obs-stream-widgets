<template>
  <div class="chat-settings">
    <v-card class="mb-8">
      <v-card-title class="heading">
        Chatbot
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
  </div>
</template>
<script lang="ts">
import Widget from '@/mixins/Widget'
import './ChatbotSettings.scss'
import { mapState } from 'vuex'

export default Widget.extend({
  name: 'chatbot-settings',
  data () {
    return {
      testMode: true
    }
  },
  computed: {
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
