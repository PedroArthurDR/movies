<template>
    <n-config-provider :theme-overrides="DarkthemeOverrides">
      {{console.log(darkTheme)}}
        <div id="app" :style="{ backgroundImage: `url(${background})` }">
          <button @click="alternarModo" class="lightModeButton" size="small" >
            <img :src="sun" alt="sun" class="sunImage" style="width: 30px;height: 30px;">
          </button>
        <router-link to="/"></router-link>
        <router-link to="/movie"></router-link>
        <router-view></router-view>
      </div>
    </n-config-provider>
</template>

<script>

import background from '@/assets/images/background.png'
import { darkTheme } from 'naive-ui'
import sun from '@/assets/images/sun.png'
export default {
  name: 'App',
  components: {

  },
  data() {
    const DarkthemeOverrides = {
    common: {
      primaryColor: '#8E4EC6',
      secondaryColor: '#201526',
    },
    Button: {
      textColor: '#201526',
      common: {
        primaryColorHover: '#8E4EC6',
        textColor1: '#201526',
    },
    },
    Pagination: {
      common: {
        primaryColorHover: '#8E4EC6',
        textColor1: '#201526',
    },
    },
    Select: {
      peers: {
        InternalSelection: {
          textColor: '#8E4EC6'
        }
      }
    }
    // ...
  }
    return {
      background: background,
      DarkthemeOverrides,
      darkTheme,
      sun,
      modoClaro: true
    }
  },
  methods: {
    alternarModo() {
      this.modoClaro = !this.modoClaro;
    }
  }
}
</script>

<style>
  .lightModeButton{
    cursor: pointer;
    width: 60px;
    height: 40px;
    border:none;
    background-color: rgba(183, 68, 247, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
    border-radius: 4px;
    padding: 5px;
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 3;
  }
  .sunImage {
    filter: invert(100%);
    width: 10px;
    height: 10px;
  }
::-webkit-scrollbar {
  width: 8px; /* Largura da barra de rolagem */
}

/* Estilo do botão da barra de rolagem */
::-webkit-scrollbar-thumb {
  background-color: #ccc; /* Cor do botão */
  border-radius: 4px; /* Borda arredondada */
}
#app {
  width: 100%;
  height:100vh;
  background-size: cover; 
  background-position: center; 
  background-repeat: no-repeat;
}
body {
  margin:0;
  font-family:sans-serif;
}
body div{
  box-sizing: border-box;
}

</style>
