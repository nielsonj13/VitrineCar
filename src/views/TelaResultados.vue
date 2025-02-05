<template>
  <div>
    <Navbar />
    <div class="container">
      <div class="content">
        <h2>Resultados da sua Busca</h2>
        <p v-if="termo">Exibindo resultados para: <strong>{{ termo }}</strong></p>

         <!-- Painel de Filtros -->
        <div class="filter-container">
          <select v-model="filtros.estado" class="filtro-select">
            <option value="">Selecione o Estado</option>
            <option v-for="estado in estados" :key="estado" :value="estado">
              {{ estado }}
            </option>
          </select>

          <!-- Filtro de Cidade (Dinamicamente carregado com base no Estado selecionado) -->
          <select v-model="filtros.cidade" class="filtro-select" :disabled="!filtros.estado">
            <option value="">Selecione a Cidade</option>
            <option v-for="cidade in cidades" :key="cidade">
              {{ cidade }}
            </option>
          </select>
          
          <select v-model="filtros.km" class="filtro-select">
            <option value="">Selecione a Quilometragem</option>
            <option value="10000">Até 10.000 km</option>
            <option value="25000">Até 25.000 km</option>
            <option value="50000">Até 50.000 km</option>
            <option value="100000">Até 100.000 km</option>
            <option value="150000">Até 150.000 km</option>
            <option value="200000">Acima de 150.000 km</option>
          </select>
          <input type="text" v-model="filtros.valor" @input="formatarValor" placeholder="Valor Máximo">
          <input v-model="filtros.ano" placeholder="Ano Mínimo">
          <button class="btn-filtrar" @click="aplicarFiltros">Filtrar</button>
        </div>

        <div class="search-container">
          <input type="text"  v-model="termo"  placeholder="Buscar por marca, modelo ou categoria..."  class="search-input" @keyup.enter="pesquisarVeiculos"/>
          <button class="btn-pesquisa" @click="pesquisarVeiculos">Buscar</button>
        </div>


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
              <span>{{ anuncio.anoFabricacao }}/{{ anuncio.anoModelo }}</span>
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
import axios from "axios";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";

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
      anunciosFiltrados: [],
      filtros: {
        cidade: "",
        estado: "",
        km: "",
        valor: "",
        ano: "",
      },
      estados: [],
      cidades: [],
    };
  },
  async created() {
    this.termo = this.$route.query.termo || "";
    this.daoService = new DAOService("anuncios");
    await this.carregarResultados();
    await this.carregarEstados();
  },
  watch: {
    // Carregar cidades automaticamente quando um estado for selecionado
    "filtros.estado"(novoEstado) {
      if (novoEstado) {
        this.carregarCidades(novoEstado);
      } else {
        this.cidades = [];
      }
    }
  },
  methods: {

    async pesquisarVeiculos() {
      this.$router.push({
        name: "TelaResultados",
        query: { termo: this.termo.trim().toLowerCase() }
      }).then(() => {
        // Forçar recarregamento da rota para atualizar os resultados
        this.$router.go();
      });
    },
      
    async carregarResultados() {
  try {
    const query = this.$route.query;
    this.termo = query.termo || "";
    this.filtros = {
      cidade: query.cidade || "",
      estado: query.estado || "",
      km: query.km || "",
      valor: query.valor || "",
      ano: query.ano || "",
    };

    const termoNormalizado = this.termo.trim().toLowerCase();
    
    // Busca inicial dos anúncios
    const resultadosMarca = await this.daoService.searchByField("marca", termoNormalizado);
    const resultadosCategoria = await this.daoService.searchByField("categoria", termoNormalizado);
    const todosAnuncios = await this.daoService.getAll();

    // Filtra modelos que contenham parte do termo pesquisado
    const resultadosModelo = todosAnuncios.filter((anuncio) => {
      const palavrasModelo = anuncio.modelo.toLowerCase().split(" ");
      return palavrasModelo.some((palavra) => palavra.includes(termoNormalizado));
    });

    // Remove duplicatas dos resultados
    let todosResultados = [...resultadosMarca, ...resultadosCategoria, ...resultadosModelo];
    todosResultados = todosResultados.filter(
      (item, index, self) => self.findIndex((v) => v.id === item.id) === index
    );

    // Obter IDs únicos dos vendedores
    const userIds = [...new Set(todosResultados.map((anuncio) => anuncio.userId))];

    // Buscar informações dos vendedores em uma única chamada
    const userDocs = await Promise.all(userIds.map(async (id) => {
      const userRef = doc(db, "usuarios", id);
      const userSnap = await getDoc(userRef);
      return userSnap.exists() ? { id, ...userSnap.data() } : null;
    }));

    // Criar um mapa de usuários para acesso rápido
    const userMap = userDocs.reduce((map, user) => {
      if (user) {
        map[user.id] = user;
      }
      return map;
    }, {});

    // Adicionar cidade e estado aos anúncios
    todosResultados = todosResultados.map(anuncio => ({
      ...anuncio,
      cidade: userMap[anuncio.userId]?.endereco?.cidade || "",
      estado: userMap[anuncio.userId]?.endereco?.estado || "",
    }));

    // Aplicar filtros avançados
    this.anuncios = todosResultados.filter((anuncio) => {
      return (
        (!this.filtros.cidade || anuncio.cidade.toLowerCase().includes(this.filtros.cidade.toLowerCase())) &&
        (!this.filtros.estado || anuncio.estado.toLowerCase().includes(this.filtros.estado.toLowerCase())) &&
        (!this.filtros.km || Number(anuncio.km) <= Number(this.filtros.km)) &&
        (!this.filtros.valor || Number(anuncio.valor) <= Number(this.filtros.valor)) &&
        (!this.filtros.ano || Number(anuncio.anoModelo) >= Number(this.filtros.ano))
      );
    });

    // Buscar favoritos em uma única chamada
    const favoritos = await FavoritosService.getFavoritos();
    const favoritosMap = new Set(favoritos.map(fav => fav.id));

    this.anuncios = this.anuncios.map((anuncio) => ({
      ...anuncio,
      favorito: favoritosMap.has(anuncio.id),
    }));

    this.anunciosFiltrados = this.anuncios;
  } catch (error) {
    console.error("Erro ao buscar veículos:", error);
    alert("Erro ao buscar os veículos. Tente novamente.");
  }
},
    async carregarEstados() {
      try {
        const response = await axios.get("https://servicodados.ibge.gov.br/api/v1/localidades/estados");
        this.estados = response.data.map((estado) => estado.sigla).sort();
      } catch (error) {
        console.error("Erro ao carregar estados:", error);
      }
    },

    async carregarCidades(estadoSigla) {
      try {
        const response = await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoSigla}/municipios`);
        this.cidades = response.data.map((cidade) => cidade.nome).sort();
      } catch (error) {
        console.error("Erro ao carregar cidades:", error);
      }
    },

    async aplicarFiltros() {
      try {
        const termoNormalizado = this.termo.trim().toLowerCase();
        let anunciosFiltrados = await this.daoService.getAll();

        // Filtra por Marca, Categoria e Modelos
        const resultadosMarca = await this.daoService.searchByField("marca", termoNormalizado);
        const resultadosCategoria = await this.daoService.searchByField("categoria", termoNormalizado);
        const resultadosModelo = anunciosFiltrados.filter((anuncio) => {
          const palavrasModelo = anuncio.modelo.toLowerCase().split(" ");
          return palavrasModelo.some((palavra) => palavra.includes(termoNormalizado));
        });

        // Unir todos os resultados e remover duplicatas
        anunciosFiltrados = [...resultadosMarca, ...resultadosCategoria, ...resultadosModelo];
        anunciosFiltrados = anunciosFiltrados.filter(
          (item, index, self) => self.findIndex((v) => v.id === item.id) === index
        );

        // **Filtrar por Quilometragem**
        if (this.filtros.km) {
          if (this.filtros.km == "200000") {
            anunciosFiltrados = anunciosFiltrados.filter(anuncio => 
              this.limparNumero(anuncio.km) > 150000
            );
          } else {
            anunciosFiltrados = anunciosFiltrados.filter(anuncio => 
              this.limparNumero(anuncio.km) <= this.filtros.km
            );
          }
        }

        // **Filtrar por Valor**
        if (this.filtros.valor) {
          const valorFiltrado = this.limparNumero(this.filtros.valor);
          anunciosFiltrados = anunciosFiltrados.filter(anuncio => 
            this.limparNumero(anuncio.valor) <= valorFiltrado
          );
        }

        // Adicionar cidade e estado a cada anúncio
        for (let anuncio of anunciosFiltrados) {
          if (anuncio.userId) {
            const userRef = doc(db, "usuarios", anuncio.userId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              const userData = userSnap.data();
              anuncio.cidade = userData.endereco?.cidade || "";
              anuncio.estado = userData.endereco?.estado || "";
            }
          }
        }

         // **Aplicar filtro de ano**
        if (this.filtros.ano) {
          const anoFiltro = parseInt(this.filtros.ano, 10);
          anunciosFiltrados = anunciosFiltrados.filter(anuncio => 
            parseInt(anuncio.anoModelo, 10) >= anoFiltro
          );
        }

        // Aplicar filtro de estado
        if (this.filtros.estado) {
          anunciosFiltrados = anunciosFiltrados.filter(anuncio => anuncio.estado === this.filtros.estado);
        }

        // Aplicar filtro de cidade
        if (this.filtros.cidade) {
          anunciosFiltrados = anunciosFiltrados.filter(anuncio => anuncio.cidade === this.filtros.cidade);
        }
        
        // Atualiza os resultados da busca
        this.anuncios = anunciosFiltrados;

      } catch (error) {
        console.error("Erro ao filtrar veículos:", error);
        alert("Erro ao buscar os veículos. Tente novamente.");
      }
    },

    formatarValor() {
      if (this.filtros.valor) {
        // Remove caracteres que não sejam números
        let numeroLimpo = this.filtros.valor.replace(/\D/g, "");

        // Impede valores vazios ou apenas zeros
        if (!numeroLimpo || parseInt(numeroLimpo) === 0) {
          this.filtros.valor = "";
          return;
        }

        // Converte para número correto (dividindo por 100 para casas decimais)
        const valorFormatado = new Intl.NumberFormat("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(parseFloat(numeroLimpo) / 100);

        // Atualiza o campo com o valor formatado
        this.filtros.valor = valorFormatado;
      }
    },

    // **Função para remover pontos e vírgulas e converter para número**
    limparNumero(valor) {
      return parseInt(valor.replace(/[.,]/g, ""), 10) || 0;
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

.filter-container {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
  align-items: center;
  background: transparent; 
  padding: 10px;
  margin-bottom: 20px;
}

.filtro-select,
input {
  padding: 12px;
  font-size: 16px;
  border: 2px solid #5b3199; /* Cor da borda roxa */
  border-radius: 30px; /* Arredondamento dos botões */
  background: transparent; /* Fundo transparente */
  width: 260px;
  text-align: center; /* Centraliza o texto dentro do select */
  font-weight: bold;
  color: #5b3199; /* Cor do texto roxa */
  transition: all 0.3s ease-in-out;
  cursor: pointer;
}

/* Remove estilos padrão do select */
.filtro-select:focus,
input:focus {
  outline: none;
  border-color: #7c42c2; /* Cor mais clara ao focar */
}

/* Ajuste para a seta dos selects */
.filtro-select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'%3E%3Cpath fill='%235b3199' d='M2 0L0 2h4zM2 5l2-2H0z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 15px center;
  background-size: 10px;
}

.filtro-select::placeholder,
input::placeholder {
  color: #5b3199; /* Cor roxa */
  opacity: 1; /* Garante que a cor seja visível */
}

/* Botão Filtrar */
.btn-filtrar {
  background: #5b3199;
  color: white;
  border: none;
  padding: 15px 30px;
  font-size: 16px;
  border-radius: 30px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease-in-out;
}

.btn-filtrar:hover {
  background: #7c42c2;
}

/* Responsividade */
@media (max-width: 768px) {
  .filter-container {
    flex-direction: column;
    gap: 10px;
  }

  .filtro-select,
  input {
    width: 100%;
  }
}

.search-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  max-width: 400px;
  padding: 10px 15px;
  border: 2px solid #5b3199;
  border-radius: 30px;
  font-size: 16px;
  color: #5b3199;
}

.search-input::placeholder {
  color: #a080c3;
}

.btn-pesquisa {
  background-color: #5b3199;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 30px;
  cursor: pointer;
  font-size: 16px;
  transition: 0.3s;
}

.btn-pesquisa:hover {
  background-color: #7c42c2;
}

</style>
