<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <p @click="$store.commit('add')"> commit: {{$store.state.counter}}</p> 
    <p @click="$store.dispatch('add')">dispatch: {{$store.state.counter}}</p>
    <div>getters: {{$store.getters.doubleCounter}}</div>
    <!-- 路由出口 -->
    <router-view/>
  </div>
</template>


<script>
export default {
  methods: {
    test() {
      console.log('/');
      this.$store.getters.doubleCounter = 'X'
    },   
    add() {
      this.$store.dispatch('add')
    }
  }
}
</script>


<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
