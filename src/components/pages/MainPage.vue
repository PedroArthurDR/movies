<template>
  <div class="MainPageCont"  :style="{ backgroundColor: $root.modoClaro ? 'none' : 'invert(100%)' }">
    <HeaderGeral/>
    <div class="searchBox"><input type="text" v-model="searchText" placeholder="Pesquisar por filmes" class="search-input"  :style="{ backdropFilter: $root.modoClaro ? 'none' : 'invert(100%)' }"/>
      <img :src="search" alt="search" class="searchImage">   
      <div style="display:flex;align-items: center;justify-content: center;background-color: #8E4EC6;width: 40px;height: 40px;margin-left: 10px;border-radius: 4px;">
        <n-popover raw  :show-arrow="false" placement="right-start" trigger="click" class="custom-popover">
        <template #trigger>
          <n-button quaternary size="small" style="grid-area: 2 / 3 / 3 / 4; width: 40px;height: 40px;border:none">
            <img :src="filter" alt="filter" class="filterImage">
          </n-button>
        </template>
        <div class="large-text">
          <n-checkbox-group raw v-model:value="checkedGenres" @change="filterMovies" style="height: 100%;display: flex;align-items: start;justify-content: space-evenly;flex-direction: column;">
            <n-checkbox raw v-for="genre in moviesGenres.slice(14)" :key="genre.id" :label="genre.name" :value="genre.id" v-model="checkedGenres" style="color:#FFFFFF" />
          </n-checkbox-group>
        </div>
        </n-popover>

      </div> 
    </div>
    <div class="movieContainer"  :style="{ backdropFilter: $root.modoClaro ? 'none' : 'invert(100%)' }">
      <div 
        v-for="(movie, index) in paginatedMovies" 
        :key="index" 
        class="movieItem"
        :style="{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.poster_path})`,position: 'relative',backgroundSize: 'cover',backgroundPosition: 'center'}"
        @mouseover="showGenres(index)"
        @mouseleave="hideGenres(index)"
        @click="redirectToMovie(movie.id)"
      >{{ console.log($root.modoClaro) }}
      <transition name="fade"  mode="out-in">
      <n-progress v-if="hoveredIndex === index" type="circle" :offset-degree="180" :percentage="(movie.vote_average*10).toFixed(0)" color="#FFE000" style="position: absolute;top:15%;left:20%;backdrop-filter: blur(5px);border-radius: 50%;">
                <span style="text-align: center;font-size: 28px;color:#FFE000;">{{(movie.vote_average*10).toFixed(0)}}%</span>
      </n-progress>
    </transition>
      <div class="movieTitle">
        {{ movie.title.toUpperCase() }}
        <transition name="fade" style="width: 100%;"  mode="out-in">
          <div   v-if="hoveredIndex === index" class="movieGenres" style="margin-top: 0px">
            <span v-for="genreId in movie.genre_ids" :key="genreId" style="color: #B4B4B4;">
              {{ getGenreName(genreId) }}{{ $last ? '' : ', ' }}
          </span>
        </div>
      </transition>
      </div>
    </div>
  </div>
  <transition name="fade" mode="out-in">
  <n-pagination
      :page-count="5" 
      :current="currentPage" 
      @change="handlePageChange" 
      class="custom-pagination"
    />
  </transition>
  <FooterGeral/>
  </div>
</template>

<script>
import HeaderGeral from '../partials/HeaderGeral.vue'
import FooterGeral from '../partials/FooterGeral.vue'
import search from '@/assets/images/Search_alt_fill.svg'
import filter from '@/assets/images/filter.png'
import axios from 'axios';
export default {
  name: 'MainPage',
  components: {
    HeaderGeral,
    FooterGeral
  },
  computed: {
    paginatedMovies() {
    return this.movies.slice(this.startIndex, this.endIndex);
  },
    startIndex() {
      return (this.currentPage - 1) * this.itemsPerPage;
    },
    endIndex() {
      return Math.min(this.currentPage * this.itemsPerPage, this.movies.length);
    },
    totalPages() {
      return Math.ceil(this.movies.length / this.itemsPerPage);
    }
  },
  watch: {
    searchText(newValue) {
      this.searchMovies(newValue);
    },
  },
  methods: {
    redirectToMovie(movieId) {
      console.log(movieId)
      this.$router.push({ name: 'movie', params: { id: movieId } });
    },
    filterMovies() {
      console.log(this.checkedGenres)
      if(this.checkedGenres.length === 0){
        this.movies = this.allMovies;
        console.log(this.movies)
      }else{
        this.movies = this.allMovies.filter(movie => {
          console.log(movie.genre_ids)
          return movie.genre_ids.some(genreId => this.checkedGenres.includes(genreId));
      });
      console.log(this.movies)
      }
    },
    async searchMovies(query) {
      if(!query){
          this.movies = this.allMovies;
        }else{
            try {
          const response = await axios.get(
            'https://api.themoviedb.org/3/search/movie',
            {
              params: {
                query: query,
                include_adult: false,
                language: 'en-US',
                page: 1
              },
              headers: {
                Authorization:
                  'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1OTA1ZTg2Y2VhOWUxNGYzOTkwYTZiNzUxNDU4ZjdhNiIsInN1YiI6IjY1ZTNiN2JlZmUwNzdhMDE4NTBmNzExMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.vuaQoScT5hoo5tqLR1azfAHMPUFZoig-zmK_LiOsN8E'
              }
            }
          );
          this.movies = response.data.results;
          console.log(response.data);
        } catch (error) {
          console.error('Error:', error);
        }
      }
    },
    handlePageChange(page) {
      this.currentPage = page;
    },
    getGenreName(genreId) {
      const genre = this.moviesGenres.find(genre => genre.id === genreId);
      return genre ? genre.name : '';
    },
    showGenres(index) {
      this.hoveredIndex = index;
    },
    // Método para ocultar a div movieGenres quando o mouse sai da div movieItem
    hideGenres() {
      this.hoveredIndex = null;
    }
  },
  data() {
    return {
      checkedGenres:[],
      allMovies: [],
      movies: [],
      search: search,
      filter,
      moviesGenres: [],
      itemsPerPage: 10,
      currentPage: 1,
      hoveredIndex: null,
      searchText: '',
    }
  },
  async mounted(){
      try {
        const token = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1OTA1ZTg2Y2VhOWUxNGYzOTkwYTZiNzUxNDU4ZjdhNiIsInN1YiI6IjY1ZTNiN2JlZmUwNzdhMDE4NTBmNzExMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.vuaQoScT5hoo5tqLR1azfAHMPUFZoig-zmK_LiOsN8E';
        const config = {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        };

        this.allMovies = []; // Limpa o array de filmes

        for (let page = 1; page <= 5; page++) {
          const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc`;
          const response = await axios.get(url, config);
          this.allMovies.push(...response.data.results);
        }
        this.movies = this.allMovies;
        console.log('Movies:', this.movies);
      } catch (error) {
        console.error('Error:', error);
    }


      axios.get('https://api.themoviedb.org/3/genre/movie/list', {
      params: {
        language: 'en'
      },
      headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1OTA1ZTg2Y2VhOWUxNGYzOTkwYTZiNzUxNDU4ZjdhNiIsInN1YiI6IjY1ZTNiN2JlZmUwNzdhMDE4NTBmNzExMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.vuaQoScT5hoo5tqLR1azfAHMPUFZoig-zmK_LiOsN8E'
      }
    })
    .then(response => {
      this.moviesGenres = response.data.genres; // Armazena os gêneros de filmes na variável data
    })
    .catch(error => {
      console.error('Erro ao carregar gêneros de filmes:', error);
    });
  }
}
</script>

<style>
.n-button{
 border:none !important;
}
.n-button:hover{
 border:none !important;
}
.custom-popover{
  background-color: #D8D9D6;
  color: #FFFFFF;
  border-radius: 4px;
  padding: 10px;
  filter: invert(89%) sepia(2%) saturate(10%) hue-rotate(190deg) brightness(95%) contrast(94%);
}

.large-text{
  height: 200px;
  width: 130px;
  padding: 0;
  color:#FFFFFF;

}
.filterImage{
  width: 20px;
  height: 20px;
  filter: invert(100%);
  cursor: pointer;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.custom-pagination{
 margin-top: 20px;
}
.custom-pagination .n-pagination-item {
  background-color: #8E4EC6; 
  color:white;
  transition: 0.5s;
  width: 40px;
  height: 40px;
} 
.custom-pagination .n-pagination-item--active {
  background-color: #242326 !important; 
  color:#797782 !important; 
  border:none !important;
}
.custom-pagination .n-pagination-item:hover {
  background-color: #48295c !important; 
  color:#FFFFFF !important;
  transform: scale(1.08) !important;
}
.custom-pagination .n-pagination-item--button{
  background-color: #8E4EC6 !important; 
  color:#FFFFFF !important; 
  border:none !important;
}
.custom-pagination .n-pagination-item--button:hover{
  background-color: #8E4EC6 !important; 
  color:#FFFFFF !important; 
  transform: none !important;
}
.custom-pagination .n-pagination-item--disabled{
  background-color: #242326 !important; 
  color:#FFFFFF !important; 
  border:none !important;
}
.custom-pagination .n-pagination-item--disabled:hover{
  background-color: #242326 !important; 
  color:#FFFFFF !important; 
  border:none !important;
}
.MainPageCont {
  color: #FFFFFF;
  width: 100%;
  height: 100%;
  background: rgb(255,255,255);
  background: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(109,109,110,0.592874649859944) 0%, rgba(18,17,19,0.8841911764705882) 8%, rgba(18,17,19,1) 90%);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.searchBox{
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.searchImage {
  top: 50%;
  right: 60px;
  transform: translateY(-50%);
  width: 20px; 
  height: auto;
  position: absolute;
  filter: invert(100%);
}
.search-input{
  background-color: #1A191B;
  width: 488px;
  height: 20px;
  border-radius: 4px;
  padding: 10px;
  color: #FFFFFF;
  border: #49474E 1px solid;
}

.search-input:focus{
  outline: 2px solid #8E4EC6;
}
.movieContainer{
  width: 98%;
  height: 70%;
  background: rgb(64,63,65);
  background: linear-gradient(180deg, rgba(64,63,65,0.1783088235294118) 0%, rgba(49,48,50,0.7609418767507002) 100%, rgba(36,35,38,1) 100%);
  backdrop-filter: blur(2px);
  border-radius: 4px;
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);

}
.movieItem{
  width: 200px;
  height: 240px;
  margin-left: 15%;
  margin-top: 10px;
  border-radius: 5px;
  display: flex;
  align-items: flex-end;
  background-size: cover;
  background-position: center;
  transition: 0.5s;
  cursor: pointer;
}
.movieTitle{
  background: rgb(255,255,255);
  background: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(64,63,65,0.1783088235294118) 17%, rgba(0,0,0,0.6460959383753502) 62%, rgba(0,0,0,1) 100%);
  width: 100%;
  max-height: 40%;
  padding: 10px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  font-weight: 600;
}
.movieTitle:hover{
  transition: 1s;
  backdrop-filter: blur(4px);
}
.movieGenres{
  font-size: 12px;
  font-weight: 200;
}
.movieItem:hover{
  transform: scale(1.05);
  transition: 0.5s;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
}
@media (max-width: 768px) {
    .MainPageCont {
      padding: 10px;
    }

    .searchBox {
      height: 60px; 
    }

    .searchImage {
      right: 20px; 
      display: none;
    }

    .search-input {
      width: 70%; 
      max-width: 300px; 
    }

    .movieContainer {
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 5px; 
      overflow-y: scroll;
    }
    .headerCont{
      width:100vw;
      margin-top:-12px;
    }
    .movieItem{
      width: 130px;
    }
  }
</style>
