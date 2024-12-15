<template>
  <div class="fundo">
    <Navbar />
    <div class="container">
      <div class="content">
        <h2 class="titulo-roxo text-center mb-4">Favoritos</h2>

        <div class="anuncios-container">
          <div v-for="carro in carros" :key="carro.id" class="card">
            <img v-if="carro.modelo === 'Pulse'" src="https://img.olx.com.br/images/57/577487211134112.jpg" alt="Fiat Pulse" class="img-fluid" />
            <img v-else-if="carro.modelo === 'Macan'" src="https://bocamafrapremium.com.br/wp-content/uploads/2024/08/fdccff4b83304f8ba26aed5dc8af3951_1709324197638.jpg" alt="Ford Fiesta" class="img-fluid" />
            <img v-else-if="carro.modelo === 'Compass'" src="https://carroesporteclube.com.br/wp-content/uploads/2021/05/Jeep-Compass-Longitude-2022-foto-Thiago-Ventura-Carro-Esporte-Clube7.jpg" alt="Chevrolet Onix" class="img-fluid" />
            <img v-else-if="carro.modelo === 'Celta'" src="https://media-repository-mobiauto.storage.googleapis.com/production/images/editorial/magazine/1686762966718.autowp.ru_chevrolet_celta_super_3-door_5.jpg" alt="Chevrolet Celta" class="img-fluid" />
            <img v-else-if="carro.modelo === 'Gol'" src="https://s2-autoesporte.glbimg.com/3EgKP_GD7pf7-BmNtHVJT6qg1HU=/0x0:1400x912/888x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_cf9d035bf26b4646b105bd958f32089d/internal_photos/bs/2022/R/M/K7kos5QGafxzSGEkFP7Q/dsc06181.jpg" alt="Volkswagen Gol" class="img-fluid" />
            <img v-else-if="carro.modelo === 'Uno'" src="https://img1.icarros.com/dbimg/imgmodelo/4/269_4.jpg" alt="Fiat Uno" class="img-fluid" />
          

            <div class="car-info">
              <div class="title-container">
                <h3>{{ carro.marca }} {{ carro.modelo }}</h3>
                <i
                  :class="carro.favorito ? 'bi bi-star-fill' : 'bi bi-star'"
                  class="favorite-icon"
                  @click="toggleFavorito(carro)"
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
  methods: {
    toggleFavorito(carro) {
      carro.favorito = !carro.favorito;
      if (carro.favorito) {
        FavoritosService.adicionarFavorito(carro);
      } else {
        FavoritosService.removerFavorito(carro.id);
      }
    },
  },
};
</script>

<style scoped>

.container {
  max-width: 80%;
  margin: 0 auto;
  padding: 20px 0;
}

.content {
  text-align: center;
}

h2.titulo-roxo {
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
  font-size: 30px; 
  color: #ddd; 
  transition: transform 0.3s ease;
}

.favorite-icon.bi-star-fill {
  color: #5b3199; 
}

.favorite-icon:hover {
  transform: scale(1.2); 
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


/* Estilo existente + estilos de favorite-icon */
.favorite-icon {
  cursor: pointer;
  font-size: 30px;
  color: #ddd;
  transition: transform 0.3s ease;
}
.favorite-icon.bi-star-fill {
  color: #5b3199;
}
.favorite-icon:hover {
  transform: scale(1.2);
}
</style>
