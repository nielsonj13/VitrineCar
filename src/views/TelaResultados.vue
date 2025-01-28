<template>
  <div>
    <Navbar />
    <div class="container">
      <div class="content">
        <h2>Resultados da sua Busca</h2>
        <p v-if="termo">Exibindo resultados para: <strong>{{ termo }}</strong></p>

        <div class="anuncios-container">
          <div v-for="anuncio in anuncios" :key="anuncio.id" class="card">
            <img 
              :src="anuncio.imagens && anuncio.imagens.length > 0 ? anuncio.imagens[0] : 'https://via.placeholder.com/300?text=Sem+Imagem'"
              alt="Imagem do veículo" 
              class="img-fluid" 
            />
            <div class="car-info">
              <div class="title-container">
                <h3>{{ anuncio.marca }} {{ anuncio.modelo }}</h3>
                <i
                  :class="anuncio.favorito ? 'bi bi-star-fill' : 'bi bi-star'"
                  class="favorite-icon"
                  @click="toggleFavorito(anuncio)"
                ></i>
              </div>
              <p>R$ {{ anuncio.valor }}</p>
              <span>{{ anuncio.anoModelo }}/{{ anuncio.anoFabricacao }}</span>
            </div>
            <div class="card-actions">
              <button class="btn-ver" @click="verAnuncio(anuncio.id)">Ver anúncio</button>
            </div>
          </div>
        </div>

        <div v-if="anuncios.length === 0" class="no-results">
          <p>Nenhum veículo encontrado para "{{ termo }}".</p>
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
  name: "TelaResultados",
  components: {
    Navbar,
  },
  data() {
    return {
      anuncios: [],
      termo: "",
      daoService: null,
    };
  },
  async created() {
    this.termo = this.$route.query.termo || "";
    this.daoService = new DAOService("anuncios");
    await this.carregarResultados();
  },
  methods: {
    async carregarResultados() {
      try {
        const termoNormalizado = this.termo.trim().toLowerCase();

        // Buscar por marca, categoria e todos os modelos
        const resultadosMarca = await this.daoService.searchByField("marca", termoNormalizado);
        const resultadosCategoria = await this.daoService.searchByField("categoria", termoNormalizado);
        const todosAnuncios = await this.daoService.getAll(); // Buscar todos os anúncios

        // Filtrar modelos que contenham pelo menos uma parte do termo buscado
        const resultadosModelo = todosAnuncios.filter((anuncio) => {
          const palavrasModelo = anuncio.modelo.toLowerCase().split(" "); // Divide o modelo em palavras
          return palavrasModelo.some(palavra => palavra.includes(termoNormalizado)); // Verifica se o termo está em alguma palavra
        });

        // Unir todos os resultados e remover duplicatas
        const todosResultados = [...resultadosMarca, ...resultadosCategoria, ...resultadosModelo];
        this.anuncios = todosResultados.filter(
          (item, index, self) => self.findIndex((v) => v.id === item.id) === index
        );

        // Verificar quais anúncios são favoritos para o usuário logado
        const favoritos = await FavoritosService.getFavoritos();
        this.anuncios = this.anuncios.map((anuncio) => ({
          ...anuncio,
          favorito: favoritos.some((fav) => fav.id === anuncio.id),
        }));
      } catch (error) {
        console.error("Erro ao buscar veículos:", error);
        alert("Erro ao buscar os veículos. Tente novamente.");
      }
    },
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

.btn-ver {
  background-color: #5b3199;
  color: white;
  text-decoration: none;
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
  background-color: #5b3199;
  color: white;
}

.no-results {
  margin-top: 20px;
  padding: 20px;
  border-radius: 10px;
  background-color: #f3f3f3;
  color: #333;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
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
</style>
