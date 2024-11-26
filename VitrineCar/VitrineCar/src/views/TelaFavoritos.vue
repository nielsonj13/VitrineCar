<template>
    <div class="fundo">
      <!-- Importando a Navbar -->
      <Navbar />
  
      <!-- Conteúdo da página -->
      <div class="container">
        <!-- Título -->
        <div class="header">
          <h2>Favoritos</h2>
        </div>
  
        <!-- Cartões de veículos -->
        <div class="cards">
          <div class="card" v-for="(carro, index) in carros" :key="index">
            <img src="/public/carro/corolla.png" alt="Teste Fiat Pulse" />
            <div class="card-content">
              <h3>{{ carro.nome }}</h3>
              <p>{{ carro.descricao }}</p>
              <p class="preco">{{ carro.preco }}</p>
              <button class="button">Ver anúncio</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Navbar from '../components/NavBar.vue';
  
  export default {
    name: 'Favoritos',
    components: {
      Navbar,
    },
    data() {
      return {
        carros: [
          {
            nome: 'Corolla',
            descricao: '2.0 hybrid Automatico',
            preco: 'R$ 93.990',
            
          },
        ],
      };
    },
  };
  </script>
  
  <style scoped>

  .fundo{
    background-color: #f3f3f3;
    margin: 0 auto;
    width: 100%;
  }
  
  /* Estilo Geral */
  .container {
    width: 100%;
    margin: 0 auto;
    padding: 20px 0;
    background-color: #f3f3f3;
  }
  
  /* Título */
  .header h2 {
    font-size: 32px;
    color: #531b76;
    margin-bottom: 20px;
    font-weight: bold;
  }
  
  /* Estilo dos Cards */
  .cards {
    display: flex;
    gap: 20px;
    justify-content: space-around;
    flex-wrap: wrap;
  }
  
  .card {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    width: 300px;
    padding: 15px;
    text-align: center;
  }
  
  .car-image {
    width: 100%;
    height: 200px;
    border-radius: 8px;
    object-fit: cover;
  }
  
  .card-content {
    margin-top: 15px;
  }
  
  .card-content h3 {
    font-size: 20px;
    color: #333;
  }
  
  .card-content p {
    font-size: 16px;
    color: #666;
    margin: 5px 0;
  }
  
  .card-content .preco {
    font-size: 18px;
    font-weight: bold;
    color: #531b76;
  }
  
  .button {
    background-color: #531b76;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    margin-top: 10px;
  }
  
  .button:hover {
    background-color: #4a287d;
  }
  </style>