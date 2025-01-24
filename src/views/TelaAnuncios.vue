<template>
    <!-- Navbar -->
    <Navbar />
    <div class="container">
      <!-- Conteúdo Principal -->
      <div class="content">
        <h2>Todos Veiculos Anunciados</h2>
  
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
              <button class="btn-ver"><router-link :to="`/veiculo/${anuncio.id}`" class="btn-ver">Ver anúncio</router-link></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Navbar from "../components/NavBar.vue";
  import DAOService from "@/Services/DAOService";
  import FavoritosService from "@/Services/FavoritosService"; // Importando o serviço de favoritos
  
  export default {
    name: "MeusAnuncios",
    components: {
      Navbar,
    },
    data() {
      return {
        anuncios: [],
        daoService: null,
      };
    },
    created() {
      this.daoService = new DAOService("anuncios");
      this.carregarAnuncios();
    },
    methods: {
      async carregarAnuncios() {
        try {
          this.anuncios = await this.daoService.getAll();
        } catch (error) {
          console.error("Erro ao carregar anúncios:", error);
          alert("Erro ao carregar os anúncios.");
        }
      },      
      toggleFavorito(anuncio) {
        if (!FavoritosService.verificarUsuarioLogado()) {
        return;
      }
        anuncio.favorito = !anuncio.favorito;
        if (anuncio.favorito) {
          FavoritosService.adicionarFavorito(anuncio); // Adiciona aos favoritos
        } else {
          FavoritosService.removerFavorito(anuncio.id); // Remove dos favoritos
        }

      // Atualiza no banco de dados (opcional)
      try {
        this.daoService.update(anuncio.id, { favorito: anuncio.favorito });
      } catch (error) {
        console.error("Erro ao atualizar favorito:", error);
        alert("Erro ao atualizar o favorito.");
      }
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
    text-decoration: none;
  }
  
  </style>
  