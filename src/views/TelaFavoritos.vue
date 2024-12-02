<template>
  <div class="fundo">
    <!-- Importando a Navbar -->
    <Navbar />
  
    <!-- Conteúdo da página -->
    <div class="container py-5">
      <!-- Título -->
      <div class="header text-center mb-4">
        <h2 class="titulo-roxo font-weight-bold">Favoritos</h2>
      </div>
  
      <!-- Cartões de veículos -->
      <div class="row">
        <div class="col-md-4 mb-4" v-for="(carro, index) in carros" :key="index">
          <div class="card shadow-sm">
            <img src="/public/carro/corolla.png" alt="Teste Fiat Pulse" class="card-img-top rounded">
            <div class="card-body text-center">
              <h3 class="card-title">{{ carro.nome }}</h3>
              <p class="card-text">{{ carro.descricao }}</p>
              <p class="preco h5">{{ carro.preco }}</p>
              <button class="btn btn-primary btn-block">Ver anúncio</button>
            </div>
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
          descricao: '2.0 hybrid Automático',
          preco: 'R$ 93.990',
        },
        // Você pode adicionar mais carros aqui
      ],
    };
  },
};
</script>
  
<style scoped>
.fundo {
  background-color: #f8f9fa;
  margin: 0 auto;
  width: 100%;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  background-color: #f8f9fa;
}

.header h2 {
  font-size: 32px;
  color: #531b76;  /* Cor roxa definida */
  margin-bottom: 20px;
  font-weight: bold;
}

.card-img-top {
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

.card-body {
  padding: 1.25rem;
}

.card-title {
  font-size: 1.25rem;
  color: #333;
  font-weight: bold;
}

.card-text {
  font-size: 1rem;
  color: #666;
}

.preco {
  color: #531b76;  /* Cor roxa definida */
  font-weight: bold;
}

.btn-primary {
  background-color: #531b76;
  border-color: #531b76;
}

.btn-primary:hover {
  background-color: #4a287d;
  border-color: #4a287d;
}

@media (max-width: 767px) {
  .card-img-top {
    height: 180px;
  }
}
</style>
