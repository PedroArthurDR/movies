<template>
    <div class="MoviePageCont" v-if="movieData">
      <HeaderGeral style="position: fixed;top:0;left: 0;padding-top: 20px;"/>
      <div class="movieDetails"  :style="{ backgroundImage: `url(https://image.tmdb.org/t/p/original/${movieData.backdrop_path})`,backgroundPosition: 'center',  backgroundSize: 'cover'}" >
            <div class="leftDetails">
            <img :src="`https://image.tmdb.org/t/p/original/${movieData.poster_path}`" alt="poster" class="poster">
            <div>
                <h1 style="font-weight: 600;">{{ movieData.title }}</h1>
                <h2 style="color:#b5b2bc; font-size: 16px;font-weight: 100;font-style: italic;margin:0">Título original: {{ movieData.original_title }}</h2>
                <div class="overView"> <h2 style="color:#b5b2bc; font-size: 16px;font-weight: 100;margin:0" >SINOPSE:</h2>{{ movieData.overview }}</div>
                <div class="movieGenres">Gêneros: <div style="display: flex; justify-content:left;"><div class="genres" v-for="genres in movieData.genres" :key="genres.id"  >{{ genres.name }}</div></div></div>
                </div>
            </div>
            <div class="rightDetails">
                <div class="rightTop">
                <h2 style="color:#b5b2bc; font-size: 16px;font-weight: 100;margin:0" >Popularidade <span style="display: block;color:#FFFFFF">{{ movieData.popularity }}</span></h2>
                <h2 style="color:#b5b2bc; font-size: 16px;font-weight: 100;margin:0" >Votos <span style="display: block;color:#FFFFFF">{{ movieData.vote_count }}</span></h2>
                <n-progress type="circle" :offset-degree="180" :percentage="(movieData.vote_average*10).toFixed(0)" color="#FFE000">
                    <span style="text-align: center;font-size: 28px;color:#FFE000">{{(movieData.vote_average*10).toFixed(0)}}%</span>
                </n-progress>
                </div>
                <div class="rightMiddle">
                <h2 style="color:#b5b2bc; font-size: 16px;font-weight: 100;margin:0" >Data de lançamento <span style="display: block;color:#FFFFFF">{{ movieData.release_date.replace(/(\d{4})-(\d{2})-(\d{2})/, '$2/$3/$1') }}</span></h2>
                <h2 style="color:#b5b2bc; font-size: 16px;font-weight: 100;margin:0" >Duração <span style="display: block;color:#FFFFFF">{{ formattedDuration  }} </span></h2>
                <h2 style="color:#b5b2bc; font-size: 16px;font-weight: 100;margin:0" >Situação<span style="display: block;color:#FFFFFF"> {{ movieData.status }}</span></h2>
                <h2 style="color:#b5b2bc; font-size: 16px;font-weight: 100;margin:0" >Idioma<span style="display: block;color:#FFFFFF"> {{ movieData.original_language.toUpperCase() }}</span></h2>
                </div>
                <div class="rightBottom">
                    <h2 style="color:#b5b2bc; font-size: 16px;font-weight: 100;margin:0" >Orçamento<span style="display: block;color:#FFFFFF">{{ formattedMoney(movieData.budget) }}M</span></h2>
                    <h2 style="color:#b5b2bc; font-size: 16px;font-weight: 100;margin:0" >Receita<span style="display: block;color:#FFFFFF"> {{ formattedMoney(movieData.revenue) }}M</span></h2>
                    <h2 style="color:#b5b2bc; font-size: 16px;font-weight: 100;margin:0" >Lucro<span style="display: block;color:#FFFFFF"> {{ formattedMoney(movieData.revenue) - formattedMoney(movieData.budget) }}M</span></h2>
                </div>
            </div>
      </div>
      <div class="movieTrailer" :style="{ background: $root.modoClaro ? '#121113' : '#edeeec' ,color: $root.modoClaro ? '#edeeec' : '#121113'}">
        <h1>Trailer</h1>
        <div style="width: 100%; height: 100%;display: flex;">
            <iframe :src="`https://www.youtube.com/embed/${trailerData}`" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="width: 100%; height: 100%;"></iframe>
            <div class="companies">
                <div v-for="company in movieData.production_companies.slice(-2)" :key="company.id">
                    <img :src="`https://image.tmdb.org/t/p/original/${company.logo_path}`" :alt="company.name" style="width: 98%; max-height:300px; margin: 5px;">
                </div>
            </div>
        </div>
      </div>
      <FooterGeral style="background-color: #121113;height: 100px;margin-top: 0px;"/>
    </div>
  </template>
  
  <script>
  import HeaderGeral from '../partials/HeaderGeral.vue'
  import axios from 'axios';
  import FooterGeral from '../partials/FooterGeral.vue'
  export default {
    name: 'MoviePage',
    components: {
      HeaderGeral,
      FooterGeral,
    },
    data() {
      return {
        trailerData:null,
        movieId: null,
        movieData: null,
        percentage: 0,
      }
    },
    computed: {
    formattedDuration() {
      const minutes = this.movieData.runtime;
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;

      if (hours > 0) {
        return `${hours}h ${remainingMinutes}m`;
      } else {
        return `${remainingMinutes} minutos`;
      }
    }
  },
  methods: {
    formattedMoney(value) {
      const budget = value;
      const millionDollars = budget / 1000000;
      const roundedMillionDollars = Math.round(millionDollars);

      return roundedMillionDollars;
    }
  },
    async mounted(){
      const movieId = this.$route.params.id;
      // Construindo a URL da API com o movieId
      const url = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`;
      
      // Configurações da requisição
      const options = {
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1OTA1ZTg2Y2VhOWUxNGYzOTkwYTZiNzUxNDU4ZjdhNiIsInN1YiI6IjY1ZTNiN2JlZmUwNzdhMDE4NTBmNzExMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.vuaQoScT5hoo5tqLR1azfAHMPUFZoig-zmK_LiOsN8E'
        }
      };

      await axios.get(url, options)
        .then(response => {
          this.movieData = response.data
          console.log( 'DADOS DO FILME',this.movieData)
        })
        .catch(error => {
          console.error('Erro ao obter os detalhes do filme:', error);
        });
        console.log( this.movieData)
        const movieIdTrailer = this.movieData.id;
        const urlTrailer = `https://api.themoviedb.org/3/movie/${movieIdTrailer}/videos?language=en-US`;
        const optionsTrailer = {
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1OTA1ZTg2Y2VhOWUxNGYzOTkwYTZiNzUxNDU4ZjdhNiIsInN1YiI6IjY1ZTNiN2JlZmUwNzdhMDE4NTBmNzExMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.vuaQoScT5hoo5tqLR1azfAHMPUFZoig-zmK_LiOsN8E'
        }
        };

        await axios.get(urlTrailer, optionsTrailer)
  .then(response => {
    const trailers = response.data.results.filter(item => item.type === 'Trailer');
    if (trailers.length > 0) {
      this.trailerData = trailers[0].key;
      console.log('Trailer:', trailers[0].key);
    } else {
      console.error('Nenhum trailer encontrado.');
    }
  })
  .catch(error => console.error('error:', error));
      }
    }
  </script>
  
  <style >
   .companies{
    width: 20%; 
    max-height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: 20px;
   }
    .poster{
        width: 50%; 
        height: auto; 
        border-radius: 4px; 
        margin: 20px;
    }
    .n-progress-text{
        color: #FFFFFF  !important;
    }
    .movieGenres{
    margin-top:70px ;
    background-color:rgba(35, 34, 37, 0.6); 
    height: 11%;
    width: 70%;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    padding: 10px;
    }
    .genres{
        background-color:rgba(193, 80, 255, 0.18);
        width: auto;
        margin-right: 10px;
        border-radius:4px;
        padding: 2px;
    }
    .overView{
    background-color:rgba(35, 34, 37, 0.6); 
    font-size: 13px;
    font-weight: 100;
    width: 80%;
    height: auto;
    margin-top:30px ;
    padding: 10px;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    align-items: left;
    justify-content: center;
    line-height: 1.8
    }
    .leftDetails{
    position: absolute;
    z-index: 1;
    width:50% ;
    height: 100%;
    display: flex;
    align-items: center;
    }
    .rightDetails{
    position: absolute;
    z-index: 1;
    float: right;
    width: 50%;
    margin-left: 50%;
    height: 100%;
    padding: 40px;
    }
    .rightMiddle {
        display: grid;
        grid-template-columns: 1fr 1fr;
        width: 100%;
        padding-left:10% ;
        padding-top:2% ;
        height: 30%;
    }
    .rightMiddle >h2{
        background-color:rgba(35, 34, 37, 0.6); 
        width: 60%;
        height: 70%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        padding: 10px;
        border-radius: 4px;
    }
    .rightTop{
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        width: 100%;
    }
    .rightBottom{
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        width: 100%;
        margin-top: 20px;
    }
    .rightBottom > h2{
        background-color:rgba(35, 34, 37, 0.6); 
        height: 70%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        padding: 10px;
        width: 17%;
        border-radius: 4px;
    }
    .rightTop > h2{
        background-color:rgba(35, 34, 37, 0.6); 
        width: auto;
        height: 70%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        padding: 10px;
        border-radius: 4px;
    }
  .MoviePageCont {
    color: #FFFFFF;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 100vh;
    background: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(109,109,110,0.592874649859944) 0%, rgba(18,17,19,0.8841911764705882) 8%, rgba(18,17,19,1) 90%);
  }
  .movieDetails{
    width: 93%;
    position: relative;
    min-height: 80vh;
    margin-top: 750px;
    border-radius: 4px;
    display: flex;
    align-items: center;
  }
  .movieDetails::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgb(255,255,255);
    background: linear-gradient(273deg, rgba(255,255,255,0) 0%, rgba(64,63,65,0.1783088235294118) 0%, rgba(34,33,35,1) 48%, rgba(18,17,19,1) 90%);
    mix-blend-mode: multiply; 
}
  .movieTrailer{
    width: 100%;
    font-size: 10px;
    display: flex;
    min-height: 80vh;
    align-items: left;
    justify-content: center;
    flex-direction: column;
    text-align: left;
    background-color: #121113;
    padding: 20px;
  }
  @media (max-width: 768px) {
    body{
        background-color: rgb(18, 17, 19);
    }
        .n-progress-text {
            color: #FFFFFF !important; 
        }
        .MoviePageCont{
            background-color:rgb(18, 17, 19)
        }
        .movieGenres {
            margin-top: 30px; 
            height: auto; 
            width: 90%; 
            padding: 5px; 
        }
        .movieDetails{
            flex-direction: column;
            margin-top: 1500px;
        }
        .poster{
            min-width: 100%;
            height:100%
        }
        .leftDetails{
            width: 100%;
            height: 80vh;
            padding: 0px;
            flex-direction: column;
            justify-content: center;
            margin-top: 160px;
            background-color:rgb(18, 17, 19);
        }
        .rightDetails{
            margin-left: 0;
            padding-top: 10%;
            margin-top: 1050px;
            background-color:rgb(18, 17, 19);
            height: auto;
            width: 100vw;
            float: none;
        }
        .rightDetails > div{
            margin-top: 20px;
        }
        .movieTrailer{
            margin-top:900px ;
        }
        .companies{
            display: none;
        }
    }
  </style>
  