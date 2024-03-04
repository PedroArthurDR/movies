<template>
    <div class="footerCont"  :style="{ filter:$root.modoClaro ? 'none' : 'invert(100%)' }">
      2023 © Todos os direitos reservados a <b style="margin-left: 5px;">Cubos Movies</b>
    </div>
  </template>
  
  <script>
  
  export default {
    name: 'FooterGeral',
  }
  </script>
  
  <style>
  .footerCont {
   width: 100%;
   height: 40px;
    margin-top: 10px;
    border-top: #3d3a3f 1px solid;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(181, 178, 188, 1);
       background: rgb(255,255,255);
   background: linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(18,17,19,1) 20%);
  }
  </style>
  