<template>
  <!-- Navbar -->
  <Navbar />
  <div class="container">
    <!-- Conteúdo Principal -->
    <div class="content">
      <h2>Meus Anúncios</h2>

      <div class="anuncios-container">
       
        <div v-for="anuncio in anuncios" :key="anuncio.id" class="card">
          <img 
              :src="getImagem(anuncio)" 
              alt="Imagem do veículo" 
              @error="imagemErro($event)"
              class="img-fluid"
            />

          <div class="car-info">
            <div class="title-container">
              <h3>{{ anuncio.marca }} {{ anuncio.modelo }}</h3>
              <template v-if="!anuncio.vendido">
              <i 
                :class="anuncio.favorito ? 'bi bi-star-fill' : 'bi bi-star'"
                class="favorite-icon"
                @click="toggleFavorito(anuncio)"
              ></i>
            </template>
            </div>
            <p v-if="anuncio.vendido" class="vendido-label">Vendido</p>
            <p>R$ {{ anuncio.valor }}</p>
            <span>{{ anuncio.anoFabricacao }}/{{ anuncio.anoModelo }}</span>
          </div>
          <div class="card-actions">
          <!-- Veículos Ativos -->
          <template v-if="!anuncio.vendido">
            <button class="btn-ver" @click="verAnuncio(anuncio.id)">Ver anúncio</button>
            <button class="btn-vendido" @click="marcarComoVendido(anuncio.id)">
              <i class="bi bi-check-circle"></i> Marcar como Vendido
            </button>
            <button class="btn-editar" @click="editarAnuncio(anuncio.id)">
              <i class="bi bi-pencil-fill"></i> Editar anúncio
            </button>
            <button class="btn-excluir" @click="excluirAnuncio(anuncio.id)">
              <i class="bi bi-trash-fill"></i> Excluir anúncio
            </button>
          </template>

          <!-- Veículos Vendidos -->
          <template v-else>
            <div class="vendido-banner">
              <i class="bi bi-check-circle-fill"></i>
              <p>Este Veículo já foi Vendido</p>
            </div>
          </template>
        </div>
        </div>
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
import { getAuth, onAuthStateChanged } from "firebase/auth";
import DAOService from "@/Services/DAOService";
import FavoritosService from "@/Services/FavoritosService"; 
import VendidosService from "@/Services/VendidosService";

export default {
  name: "MeusAnuncios",
  components: {
    Navbar,
  },
  data() {
    return {
      anuncios: [],
      daoService: new DAOService("anuncios"),
      vendidosService: new DAOService("veiculos_vendidos"),
      userId: null,
    };
  },
  created() {
    this.verificarUsuario();
  },
  methods: {
    getImagem(anuncio) {
      if (anuncio.imagens && Array.isArray(anuncio.imagens) && anuncio.imagens.length > 0) {
        return anuncio.imagens[0]; // Retorna a primeira imagem se existir
      } 
    },
    imagemErro(event) {
      event.target.src = '/logos/logo_vitrinecar.png'; // Força a logo caso a imagem falhe
    },

    verificarUsuario() {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.userId = user.uid;
          this.carregarAnuncios();
        } else {
          this.$router.push("/login");
        }
      });
    },
    
    async carregarAnuncios() {
      try {
        const anunciosAtivos = await this.daoService.getAll();
        const anunciosVendidos = await VendidosService.obterTodosVendidos(); 

        this.anuncios = [...anunciosAtivos, ...anunciosVendidos]
          .filter((anuncio) => anuncio.userId === this.userId)
          .map(async (anuncio) => {
            const isFavorito = await FavoritosService.isFavorito(anuncio.id);
            return { ...anuncio, favorito: isFavorito };
          });

        this.anuncios = await Promise.all(this.anuncios);
      } catch (error) {
        console.error("Erro ao carregar anúncios:", error);
        alert("Erro ao carregar os anúncios.");
      }
    },

    async marcarComoVendido(id) {
      try {
        const anuncio = await this.daoService.get(id);

        if (!anuncio) {
          alert("Anúncio não encontrado!");
          return;
        }

        // Atualizar status do veículo na coleção de ativos
        await this.daoService.update(id, { vendido: true });

        // Adicionar à coleção de veículos vendidos
        await VendidosService.adicionarVeiculoVendido({ ...anuncio, vendido: true });

        // Remover da coleção de anúncios ativos
        await this.daoService.delete(id);

        alert("Veículo marcado como vendido!");
        this.carregarAnuncios();
      } catch (error) {
        console.error("Erro ao marcar como vendido:", error);
        alert("Erro ao marcar o veículo como vendido.");
      }
    },

    async toggleFavorito(anuncio) {
      if (!FavoritosService.getUsuarioLogado()) {
        alert('Você precisa estar logado para favoritar um anúncio');
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

        await this.daoService.update(anuncio.id, { favorito: anuncio.favorito });

      } catch (error) {
        console.error("Erro ao atualizar favorito:", error);
        alert("Erro ao atualizar o favorito.");
      }
    },

    criarAnuncio() {
      this.$router.push("/criar-anuncio");
    },

    editarAnuncio(id) {
      this.$router.push(`/editar-anuncio/${id}`);
    },

    async excluirAnuncio(id) {
      try {
        await this.daoService.delete(id);
        this.carregarAnuncios();
        alert("Anúncio excluído com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir anúncio:", error);
        alert("Erro ao excluir o anúncio.");
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

.btn-editar {
  background-color: #ffc107;
  color: white;
}

.btn-excluir {
  background-color: #dc3545;
  color: white;
}

.vendido-label {
  display: inline-block;
  background-color: #28a745;
  color: white;
  font-weight: bold;
  font-size: 14px;
  padding: 5px 10px;
  border-radius: 5px;
  margin-top: 10px;
}

.vendido-banner {
  background-color: #e4ffdd; /* Fundo vermelho claro */
  color: #28a745; /* Vermelho escuro */
  font-weight: bold;
  text-align: center;
  padding: 12px; /* Aumenta o padding para centralizar melhor */
  border-radius: 8px;
  border: 1px solid #28a745;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px; /* Espaçamento entre ícone e texto */
  height: 80px; /* Define uma altura fixa */
}

.vendido-banner i {
  font-size: 20px;
  color: #28a745;
}

.vendido-banner p {
  margin: 0; /* Remove margens extras que estavam desalinhando o texto */
  line-height: 1.2; /* Ajusta a altura da linha para melhor alinhamento */
}

.btn-vendido {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
}

.btn-vendido:hover {
  background-color: #218838;
}


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