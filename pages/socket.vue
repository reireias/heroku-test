<template>
  <v-container>
    <v-row>
      <v-col>
        <div class="display-4">socket</div>
      </v-col>
      <v-col>
        <v-btn @click="sendMessage">send</v-btn>
      </v-col>
    </v-row>
    <v-row v-for="message in messages" :key="message.id">
      <div>{{ message.text }}</div>
    </v-row>
  </v-container>
</template>

<script>
import io from 'socket.io-client'

export default {
  data() {
    return {
      messages: [],
      socket: null
    }
  },
  mounted() {
    console.log('mounted')
    this.socket = io()

    this.socket.on('new-message', (message) => {
      console.log(message)
      this.messages.push(message || {})
    })
  },
  methods: {
    sendMessage() {
      this.socket.emit('send-message', { text: 'test' })
    }
  }
}
</script>
