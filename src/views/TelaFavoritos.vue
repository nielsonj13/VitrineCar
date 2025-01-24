<template>
  <div class="fundo">
    <Navbar />
    <div class="container">
      <div class="content">
        <h2 class="titulo-roxo text-center mb-4">Favoritos</h2>

        <div class="anuncios-container">
          <div v-for="carro in carros" :key="carro.id" class="card">
            <img 
            :src="carro.imagens && carro.imagens.length > 0 ? carro.imagens[0] : 'https://via.placeholder.com/300?text=Sem+Imagem'" 
            alt="Imagem do veículo" 
            class="img-fluid"
          />
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
              <button class="btn-ver"><router-link :to="`/veiculo/${carro.id}`" class="btn-ver">Ver anúncio</router-link></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "../components/NavBar.vue";
import DAOService from "@/Services/DAOService";
import FavoritosService from "@/Services/FavoritosService";

export default {
  name: "Favoritos",
  components: {
    Navbar,
  },
  data() {
    return {
      carros: [],  // Inicializado vazio para carregar dinamicamente
      daoService: new DAOService("anuncios"),  // Inicializa corretamente o serviço DAOService
    };
  },
  created() {
    this.carregarFavoritos();  // Chamar a função ao carregar a página
  },
  methods: {
    async carregarFavoritos() {
      try {
        this.carros = FavoritosService.getFavoritos();
      } catch (error) {
        console.error("Erro ao carregar favoritos:", error);
      }
    },

    async toggleFavorito(carro) {
      carro.favorito = !carro.favorito;
      if (carro.favorito) {
        FavoritosService.adicionarFavorito(carro);
      } else {
        FavoritosService.removerFavorito(carro.id);
      }

      // Atualiza no banco de dados (Firebase)
      try {
        await this.daoService.update(carro.id, { favorito: carro.favorito });
        console.log(`Favorito atualizado com sucesso para ID: ${carro.id}`);
      } catch (error) {
        console.error("Erro ao atualizar favorito:", error);
        alert("Erro ao atualizar o favorito.");
        carro.favorito = !carro.favorito;  // Reverte a alteração no frontend
      }

      // Recarregar lista após remoção para refletir mudanças na interface
      this.carregarFavoritos();
    },
    verAnuncio(id) {
      this.$router.push(`/veiculo/${id}`);
    }
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
  text-decoration: none;
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
