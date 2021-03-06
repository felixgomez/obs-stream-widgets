<template>
  <div class="chat">
    <ul>
      <transition-group name="fadeRight">
        <li v-for="message in messages" :key="message.id" class="primary-bg">
          <div class="profile-image primary-light-bg">
            <img :src="message.author.profileImageUrl" />
          </div>
          <span class="author">
            {{ message.author.name }}
          </span>
          <span class="message">
            {{ message.content }}
          </span>
        </li>
      </transition-group>
    </ul>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import './Chat.scss'
import { Youtube, Map, Twitch } from '@/types'
import YouTubeChat from 'youtube-live-chat'
import takeRight from 'lodash/takeRight'
import { ChatMessage, ChartAuthor } from './types'
import tmi from 'tmi.js'
import { Platform } from '@/enums'

const testMessages = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Morbi ac leo quis diam posuere sollicitudin non a dui.',
  'Vestibulum malesuada elit imperdiet ante tempor, ut posuere tellus bibendum.',
  'Maecenas accumsan sapien non lacus faucibus, at feugiat nulla aliquam.',
  'Proin condimentum tellus at justo efficitur, nec posuere sapien fringilla.',
  'Morbi quis orci consequat, rutrum urna at, scelerisque lectus.',
  'Etiam euismod velit at nunc scelerisque facilisis.',
  'Nulla venenatis eros pharetra elit efficitur placerat.',
  'Curabitur vitae lorem ullamcorper, pellentesque enim vitae, consequat metus.',
  'Proin consectetur dui in neque viverra dapibus.',
  'Mauris luctus mi id fermentum venenatis.',
  'Suspendisse pretium nisi a ante volutpat, in egestas nisl lobortis.',
  'In laoreet urna ac dui convallis congue.',
  'Vestibulum id turpis interdum, consectetur enim ut, consequat ante.',
  'Aliquam sit amet libero laoreet, commodo nisi eget, imperdiet enim.',
  'Nunc pulvinar leo eu purus vestibulum, nec interdum lorem egestas.',
  'Vestibulum sit amet risus nec nisi placerat sodales.',
  'Proin ultrices ipsum id dictum luctus.',
  'Curabitur iaculis erat ut semper pulvinar.',
  'Vestibulum vitae diam eu tortor mollis vestibulum ac eget felis.',
  'Pellentesque at tortor ac odio euismod tincidunt.',
  'Maecenas nec nisi nec sem interdum convallis nec et nibh.',
  'Nulla semper tortor ut mauris pretium, ut gravida eros convallis.',
  'Maecenas consequat dui at ante molestie ultrices.',
  'Aenean euismod sapien at libero malesuada sodales.',
  'Fusce tempus risus tempus mollis ultricies.',
  'Aenean consequat ante commodo lectus faucibus, eget tincidunt purus varius.',
  'Fusce dapibus dui ut enim dignissim pretium.',
  'Sed malesuada neque sed arcu pellentesque commodo.',
  'Phasellus laoreet eros eu scelerisque luctus.',
  'Praesent tincidunt nunc vel ultrices rhoncus.',
  'In ut arcu eget ex condimentum blandit.'
]

const testAuthors = [
  'Silvia Alonso', 'Catalina Rey', 'Cristina', 'H4ckerM4n0', 'Juan Antonio', 'Michael', 'Alfredo Landa', 'Mario Montera', ''
]

export default Vue.extend({
  name: 'chat',
  props: {
    youtubeSettings: Object as () => Youtube,
    twitchSettings: Object as () => Twitch,
    testMode: Boolean,
    platform: String as () => Platform
  },
  data () {
    return {
      youtubeChatClient: null as any,
      twitchClient: null as any,
      twitchChatClient: null as any,
      messages: [] as ChatMessage[],
      testInterval: null as number | null
    }
  },
  methods: {
    insertMessage (id:string, author: ChartAuthor, message: string) {
      if (this.messages.findIndex((item: ChatMessage) => item.id === id) === -1) {
        this.messages.push({
          content: message,
          author: author,
          id
        })
      }
      this.messages = takeRight(this.messages, 40)
    },
    getChatMessages () {
      if (this.testMode) {
        this.testInterval = +setInterval(() => {
          const author = {
            name: testAuthors[Math.floor(Math.random() * testAuthors.length)],
            profileImageUrl: 'https://i.pravatar.cc/30'
          }
          this.insertMessage(
            (Math.random() * 100000).toFixed(0),
            author,
            testMessages[Math.floor(Math.random() * testMessages.length)]
          )
        }, 2300)
      } else {
        switch (this.platform) {
          case Platform.YouTube:
            this.getYouTubeChatMessages()
            break
          case Platform.Twitch:
            this.getTwitchChatMessages()
            break
        }
      }
    },
    getYouTubeChatMessages () {
      this.youtubeChatClient = new YouTubeChat(this.youtubeSettings.channelId, this.youtubeSettings.apiKey)
      this.youtubeChatClient.on('ready', () => {
        this.youtubeChatClient.listen(5000)
      })

      this.youtubeChatClient.on('message', (data: any) => {
        const author = {
          name: data.authorDetails.displayName,
          profileImageUrl: data.authorDetails.profileImageUrl
        }
        this.insertMessage(data.id, author, data.snippet.displayMessage)
      })

      this.youtubeChatClient.on('error', (error: any) => {
        if (error.error.code === 403) {
          this.youtubeChatClient.stop()
          console.error('API LIMIT EXCEEDED')
        } else {
          console.error(error)
        }
      })
    },
    getTwitchChatMessages () {
      const client = new (tmi as any).Client({
        options: {
          debug: false
        },
        connection: {
          reconnect: true,
          secure: true
        },
        channels: [
          this.twitchSettings.channel
        ]
      }) as any
      client.connect()
      client.on('message', (channel: string, tags: Map<any>, message: any, self: any) => {
        if (self) {
          return
        }

        this.insertMessage(
          tags.id,
          {
            name: tags.displayName || tags.username,
            profileImageUrl: ''
          },
          message
        )
      })
    },
    exitChat (value: boolean) {
      if (value) {
        clearInterval(this.testInterval!)
      } else {
        if (this.platform === Platform.YouTube) {
          this.youtubeChatClient.stop()
        }
      }
    }
  },
  beforeMount () {
    this.getChatMessages()
  },
  beforeDestroy () {
    this.exitChat(this.testMode)
  },
  watch: {
    testMode (newValue) {
      this.exitChat(!this.testMode)
      this.getChatMessages()
    }
  }
})
</script>
