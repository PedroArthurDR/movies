<template>
    <div class="headerCont" :style="{ filter: $root.modoClaro ? 'none' : 'invert(100%)' }">
      <div><a href="/" ><img :src="logo" alt="logo" class="logoImage"> </a> Movies</div>
    </div>
  </template>
  
  <script>
  import logo from '@/assets/images/logo-cubos.svg'
  export default {
    name: 'HeaderGeral',
    data() {
      return {
        logo: logo,
      }
    },
  }
  </script>
  
  <style >
  .headerCont {
   width: 100%;
   height:80px;
   background: rgb(255,255,255);
   background: linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(18,17,19,1) 70%);
   display:flex;
   justify-content: space-between;
   align-items: center;
   backdrop-filter: blur(10px);
   border-bottom: rgba(241, 230, 253, 0.19) 1px solid;
   z-index: 2;
  }
  
  .headerCont > div {
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    color: white;
    font-size: 20px;
    width: 280px;
    font-weight: 700;
  }
  .headerCont img {
    width: 160px;
    height: 36px;
  }
  .logoImage {
    filter: invert(100%);
    transition: 0.2s;
  }
  .logoImage:hover {
    filter: invert(21%) sepia(93%) saturate(2491%) hue-rotate(256deg) brightness(88%) contrast(93%);
  }
  </style>
  