<template>
    <div class="container">
      <!-- Navbar -->
      <Navbar />
  
      <!-- Conteúdo Principal -->
      <div class="content">
        <h2>Meus Anúncios</h2>
  
        <div class="anuncios-container">
          <!-- Cartão do Anúncio -->
          <div class="card">
            <img src="/public/carro/sw4.png" alt="Toyota SW4" class="car-image" />
            <div class="car-info">
              <h3>Toyota SW4</h3>
              <p>R$ 400.000</p>
              <span>2024/2025</span>
            </div>
            <div class="card-actions">
              <button class="btn-ver">Ver anúncio</button>
              <button class="btn-editar">Editar anúncio</button>
              <button class="btn-excluir">Excluir anúncio</button>
            </div>
          </div>
  
          <!-- Botão de Criar Novo Anúncio -->
          <div class="new-card" @click="criarAnuncio">
            <div class="new-icon">+</div>
            <p>Criar Novo Anúncio</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Navbar from "../components/NavBar.vue";
  
  export default {
    name: "MeusAnuncios",
    components: {
      Navbar,
    },
    methods: {
      criarAnuncio() {
        this.$router.push("/criar-anuncio");
      },
    },
  };
  </script>
  
  <style scoped>
  /* Estilo Base */
  .container {
    max-width: 80%;
    margin: 0 auto;
    padding: 20px 0;
  }
  
  .content {
    text-align: center;
  }
  
  h2 {
    color: #5b3199;
    margin-bottom: 20px;
  }
  
  .anuncios-container {
    display: flex;
    gap: 20px;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .card {
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    width: 250px;
    text-align: center;
    padding: 15px;
  }
  
  .card img {
    width: 100%;
    height: 150px;
    object-fit: cover;
    border-radius: 8px;
  }
  
  .car-info h3 {
    margin: 10px 0;
    color: #333;
  }
  
  .car-info p {
    margin: 0;
    color: #5b3199;
    font-weight: bold;
  }
  
  .car-info span {
    font-size: 14px;
    color: #666;
  }
  
  .card-actions {
    margin-top: 10px;
  }
  
  .card-actions button {
    display: block;
    width: 100%;
    margin: 5px 0;
    padding: 10px;
    border-radius: 5px;
    font-size: 14px;
    cursor: pointer;
    border: none;
  }
  
  .btn-ver {
    background-color: #5b3199;
    color: white;
  }
  
  .btn-editar {
    background-color: #ffc107;
    color: white;
  }
  
  .btn-excluir {
    background-color: #dc3545;
    color: white;
  }
  
  /* Estilo do Card Novo Anúncio */
  .new-card {
    background-color: #f3f3f3;
    border-radius: 10px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    width: 250px;
    height: 240px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    text-align: center;
  }
  
  .new-icon {
    font-size: 50px;
    color: #5b3199;
    font-weight: bold;
  }
  
  .new-card p {
    margin-top: 10px;
    color: #333;
    font-weight: bold;
  }
  </style>