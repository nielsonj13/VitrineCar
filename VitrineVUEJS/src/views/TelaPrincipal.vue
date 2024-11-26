<template>
    <div>
      <!-- Navbar -->
      <Navbar />
  
      <!-- Área de Busca -->
      <div class="search-container">
        <h2>Procure seu Veículo!</h2>
        <div class="search-bar">
          <input 
            type="text" 
            v-model="busca" 
            placeholder="Digite marca ou modelo do veículo"
          />
          <button @click="buscarOfertas">Ver Ofertas</button>
        </div>
      </div>
  
      <!-- Seção de Marcas e Categorias -->
      <div class="brands-categories">
        <!-- Principais Marcas -->
        <div class="brands">
          <h3>Principais marcas</h3>
          <div class="brand-logos">
            <img 
              v-for="(marca, index) in marcas" 
              :key="index" 
              :src="marca.img" 
              :alt="marca.nome" 
            />
          </div>
        </div>
  
        <!-- Categorias -->
        <div class="categories">
          <h3>Categorias</h3>
          <div class="category-logos">
            <div v-for="(categoria, index) in categorias" :key="index">
              <img :src="categoria.img" :alt="categoria.nome" />
              <p class="category-name">{{ categoria.nome }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Navbar from '../components/NavBar.vue'; 

  
  export default {
    name: 'BuscarVeiculo',
    components: {
      Navbar, 
    },
    data() {
      return {
        busca: '',
        marcas: [
          { nome: 'Fiat', img: 'public/logos/FIAT_logo.png' },
          { nome: 'BMW', img: 'public/logos/BMW_logo.png' },
          { nome: 'Nissan', img: 'public/logos/Nissan_logo.png' },
          { nome: 'Toyota', img: 'public/logos/TOYOTA_logo.png' },
          { nome: 'Renault', img: 'public/logos/RENAULT_logo.png' },
        ],
        categorias: [
          { nome: 'SUV', img: 'public/carro/sw4.png' },
          { nome: 'Picapes', img: 'public/carro/Ram-3500 1.png' },
          { nome: 'Sedan', img: 'public/carro/corolla.png' },
          { nome: 'Hatches', img: 'public/carro/golf.png' },
        ],
      };
    },
    methods: {
      buscarOfertas() {
        alert(`Buscando por: ${this.busca}`);
        
      },
    },
  };
  </script>
  
  <style scoped>
  body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #F3F3F3;
    color: #333;
  }
  
  
  /* Área de busca */
  .search-container {
    padding: 40px;
    background-color: #FFF;
    margin: 20px auto;
    width: 80%;
    border-radius: 10px;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .search-container h2 {
    color: #531B76;
    font-size: 44px;
    margin-bottom: 20px;
    margin-left: 40px;
  }
  
  .search-bar {
    display: flex;
    align-items: center;
    margin-left: 40px;
    margin-top: 20px;
  }
  
  .search-bar input {
    background-color: #dfdfdf;
    padding: 20px;
    font-size: 20px;
    border: 1px solid #CCC;
    border-radius: 20px;
    width: 1000px;
  }
  
  .search-bar button {
    background-color: #531B76;
    color: white;
    margin-left: 20%;
    padding: 20px 50px;
    font-size: 20px;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    white-space: nowrap;
  }
  
  /* Seção de marcas e categorias */
  .brands-categories {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 0;
    width: 80%;
    margin: 0 auto;
  }
  
  .brands,
  .categories {
    width: 100%;
    margin-bottom: 20px;
  }
  
  .brands h3,
  .categories h3 {
    font-size: 40px;
    margin-bottom: 15px;
  }
  
  .brand-logos,
  .category-logos {
    display: flex;
    justify-content: space-around;
  }
  
  .brand-logos img,
  .category-logos img {
    width: 250px;
    height: 250px;
    border-radius: 50%;
    margin: 10px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .category-logos img {
    border-radius: 10px;
    width: 250px;
    height: 250px;
  }
  
  .category-name {
    font-size: 14px;
    color: #333;
    margin-top: 5px;
  }
  </style>
  