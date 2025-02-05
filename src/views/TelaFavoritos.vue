<template>
  <div class="fundo">
    <Navbar />
    <div class="container">
      <div class="content">
        <h2 class="titulo-roxo text-center mb-4">Favoritos</h2>

        <div v-if="carros.length > 0" class="anuncios-container">
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
              <span>{{ carro.anoFabricacao }}/{{ carro.anoModelo }}</span>
            </div>
            <div class="card-actions">
              <button class="btn-ver" @click="verAnuncio(carro.id)">Ver anúncio</button>
            </div>
          </div>
        </div>

        <div v-else class="no-favorites">
          <p>Você não tem veículos favoritados.</p>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "../components/NavBar.vue";
import FavoritosService from "@/Services/FavoritosService";
import DAOService from "@/Services/DAOService";

export default {
  name: "Favoritos",
  components: {
    Navbar,
  },
  data() {
    return {
      carros: [],  
      daoService: new DAOService("anuncios"),
    };
  },
  async created() {
    await this.carregarFavoritos();
  },
  methods: {
    async carregarFavoritos() {
  try {
    // Obtém a lista de favoritos salvos no banco de dados
    let favoritos = await FavoritosService.getFavoritos();

    // Obtém todos os anúncios ativos
    const anunciosAtivos = await this.daoService.getAll();

    // Filtra os favoritos, removendo aqueles que foram excluídos ou vendidos
    this.carros = favoritos.filter((favorito) =>
      anunciosAtivos.some((anuncio) => anuncio.id === favorito.id && !anuncio.vendido)
    ).map(carro => ({
      ...carro,
      favorito: true, // Mantém a estrela acesa para veículos válidos
    }));

    // Atualiza o FavoritosService para manter apenas os válidos
    FavoritosService.atualizarFavoritos(this.carros);

  } catch (error) {
    console.error("Erro ao carregar favoritos:", error);
  }
}
,

    async toggleFavorito(anuncio) {
      if (!FavoritosService.getUsuarioLogado()) {
        alert("Você precisa estar logado para favoritar um anúncio.");
        return;
      }

      try {
        const isFavorito = await FavoritosService.isFavorito(anuncio.id);
        
        if (isFavorito) {
          await FavoritosService.removerFavorito(anuncio.id);
          anuncio.favorito = false;
        } else {
          await FavoritosService.adicionarFavorito(anuncio);
          anuncio.favorito = true;
        }

        // Atualiza a propriedade de favorito no Firestore
        await this.daoService.update(anuncio.id, { favorito: anuncio.favorito });

        // Recarrega os favoritos após atualização
        // await this.carregarFavoritos();

      } catch (error) {
        console.error("Erro ao atualizar favorito:", error);
        alert("Erro ao atualizar o favorito.");
      }
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
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Garante que os elementos dentro do card sejam espaçados */
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

/* Estilização caso não tenha favoritos */
.no-favorites {
  margin-top: 20px;
  padding: 20px;
  border-radius: 10px;
  background-color: #f3f3f3;
  color: #333;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}
</style>
