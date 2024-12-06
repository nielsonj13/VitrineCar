<template>
  <div class="fundo">
    <Navbar />
    <div class="container">
      <div class="content">
        <h2 class="titulo-roxo text-center mb-4">Favoritos</h2>

        <div class="anuncios-container">
          <!-- Itera sobre os anúncios e exibe um cartão para cada anúncio -->
          <div v-for="carro in carros" :key="carro.id" class="card">
            <img :src="carro.imagens[0]" alt="Imagem do Carro" class="car-image" />
            <div class="car-info">
              <div class="title-container">
                <h3>{{ carro.marca }} {{ carro.modelo }}</h3>
                <i
                  :class="carro.favorito ? 'bi bi-star-fill' : 'bi bi-star'"
                  class="favorite-icon"
                ></i>
              </div>
              <p>R$ {{ carro.valor }}</p>
              <span>{{ carro.anoModelo }}/{{ carro.anoFabricacao }}</span>
            </div>
            <div class="card-actions">
              <button class="btn-ver">Ver anúncio</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "../components/NavBar.vue";
import FavoritosService from "@/Services/FavoritosService";

export default {
  name: "Favoritos",
  components: {
    Navbar,
  },
  data() {
    return {
      carros: FavoritosService.getFavoritos(),
    };
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

h2.titulo-roxo {
  color: #5b3199; /* Cor roxa padrão */
  margin-bottom: 20px;
}

.anuncios-container {
  display: flex;
  gap: 20px; /* Espaçamento horizontal e vertical entre os cards */
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

.car-info {
  text-align: left;
}

.title-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-container h3 {
  margin: 10px 0;
  color: #333;
  flex: 1;
  text-align: left;
}

.favorite-icon {
  cursor: pointer;
  font-size: 30px; /* Aumenta o tamanho da estrela */
  color: #ddd; /* Cor padrão */
  transition: transform 0.3s ease;
}

.favorite-icon.bi-star-fill {
  color: #5b3199; /* Cor roxa ao favoritar */
}

.favorite-icon:hover {
  transform: scale(1.2); /* Aumenta levemente ao passar o mouse */
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
</style>
