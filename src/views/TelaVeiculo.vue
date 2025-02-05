<template>
  <div>
    <Navbar />
    <div class="container" v-if="veiculo">
      
      <!-- Carrossel de Imagens -->
      <div class="carrossel-container">
        <!-- Botão Anterior -->
        <button class="nav-button left" @click="anteriorImagem">
          <i class="bi bi-chevron-left"></i>
        </button>

        <!-- Imagem Principal -->
        <div class="imagem-principal">
          <img :src="veiculo.imagens?.[imagemSelecionada] || ''" class="main-image" 
               alt="Imagem do veículo" @click="abrirTelaCheia">
        </div>

        <!-- Botão Próximo -->
        <button class="nav-button right" @click="proximaImagem">
          <i class="bi bi-chevron-right"></i>
        </button>

        <!-- Miniaturas com rolagem dinâmica -->
        <div class="miniaturas-container">
          <div class="miniaturas">
            <img 
              v-for="(imagem, index) in miniaturasVisiveis" 
              :key="'thumb-' + (miniaturaInicio + index)"
              :src="imagem" 
              class="miniatura img-thumbnail" 
              @click="selecionarImagem(miniaturaInicio + index)" 
              :class="{ active: (miniaturaInicio + index) === imagemSelecionada }"
              alt="Miniatura do veículo">
          </div>
        </div>
      </div>

      <!-- Modal de Tela Cheia -->
      <div v-if="telaCheiaAtiva" class="modal-fullscreen" @click="fecharTelaCheia">
        <button class="close-button" @click.stop="fecharTelaCheia">X</button>
        <button class="modal-prev" @click.stop="anteriorImagem">&#10094;</button>
        <img :src="veiculo.imagens?.[imagemSelecionada] || ''" class="fullscreen-image" />
        <button class="modal-next" @click.stop="proximaImagem">&#10095;</button>
      </div>

      <!-- Informações do Veículo -->
      <div class="vehicle-info">
        <div class="price-title">
          <div>
            <h1 class="vehicle-title">{{ veiculo.marca }} {{ veiculo.modelo }}</h1>
          </div>
          <div class="price-container">
            <p class="vehicle-price">R$ {{ veiculo.valor }}</p>
            <i 
              :class="veiculo.favorito ? 'bi bi-star-fill' : 'bi bi-star'" 
              class="favorite-icon" 
              @click="toggleFavorito(veiculo)"
            ></i>
          </div>
        </div>

        <div class="info-wrapper">
          <!-- Informações do Veículo -->
          <div class="info-section">
            <h4>Informações do Veículo</h4>
            <div class="info-grid">
              <p><i class="bi bi-calendar"></i> <strong>Ano:</strong> {{ veiculo.anoModelo }}/{{ veiculo.anoFabricacao }}</p>
              <p><i class="bi bi-palette"></i> <strong>Cor:</strong> {{ veiculo.cor  || 'Não informado'}}</p>
              <p><i class="bi bi-speedometer2"></i> <strong>Km Rodado:</strong> {{ veiculo.km  || 'Não informado'}}</p>
              <p><i class="bi bi-gear"></i> <strong>Câmbio:</strong> {{ veiculo.cambio  || 'Não informado'}}</p>
              <p><i class="bi bi-fuel-pump"></i> <strong>Combustível:</strong> {{ veiculo.combustivel  || 'Não informado'}}</p>
              <p><i class="bi bi-car-front"></i><strong> Categoria:</strong> {{ veiculo.categoria || 'Não informado'}}</p>
            </div>
            <p class="options"><strong>Opcionais:</strong> {{ veiculo.opcionais?.join(', ') }}</p>
            
              <p class="descricao">
                <strong>Descrição:</strong> 
                {{ verDescricao ? (veiculo.descricao || 'Sem descrição disponível.') : (veiculo.descricao ? veiculo.descricao.slice(0, 100) + '...' : 'Sem descrição disponível.') }}
              </p>
              <button v-if="veiculo.descricao && veiculo.descricao.length > 100" @click="verDescricao = !verDescricao" class="descricao-btn">
                {{ verDescricao ? "Ocultar descrição" : "Ver descrição" }}
              </button>
            
          </div>

          <!-- Informações do Vendedor -->
          <div class="info-section " v-if="vendedor">
            <h4>Informações do Vendedor</h4> 
            <p class="seller-name"><i class="bi bi-person-circle"></i> {{ vendedor.nome }} {{ vendedor.sobrenome }}</p>
            <div class="contact-info">
              <p><i class="bi bi-envelope"></i> <strong>Email:</strong> {{ vendedor.email }}</p>
              <p><i class="bi bi-telephone"></i> <strong>Telefone:</strong> {{ vendedor.telefone }}</p>
              <p><i class="bi bi-geo-alt"></i> <strong>Localização:</strong> {{ vendedor.cidade }}, {{ vendedor.estado }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else>
      <p class="loading">Carregando veículo...</p>
    </div>
    <Footer />
  </div>
</template>


<script>
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import Navbar from '../components/NavBar.vue';
import Footer from "@/components/Footer.vue";
import DAOService from '@/Services/DAOService';
import FavoritosService from '@/Services/FavoritosService';

export default {
  name: 'TelaVeiculo',
  components: {
    Navbar,
    Footer
  },
  data() {
    return {
      veiculo: null,
      vendedor: null,
      daoService: new DAOService('anuncios'),
      imagemSelecionada: 0,
      miniaturaInicio: 0,
      telaCheiaAtiva: false,
      verDescricao: false,
    };
  },
  async created() {
    await this.carregarVeiculo();
  },
  // Adicionamos e removemos o evento global de teclado no ciclo de vida do componente
  mounted() {
    document.addEventListener("keydown", this.tecladoNavegacao);
  },

  beforeUnmount() {
    document.removeEventListener("keydown", this.tecladoNavegacao);
  },
  computed: {
    miniaturasVisiveis() {
      return this.veiculo?.imagens.slice(this.miniaturaInicio, this.miniaturaInicio + 4) || [];
    }
  },
  methods: {
    selecionarImagem(index) {
      this.imagemSelecionada = index;
      this.atualizarMiniaturas();
    },
    proximaImagem() {
      if (this.imagemSelecionada < this.veiculo.imagens.length - 1) {
        this.imagemSelecionada++;
        this.atualizarMiniaturas();
      } else {
        this.imagemSelecionada = 0; // Volta para a primeira imagem
      }
    },
    anteriorImagem() {
      if (this.imagemSelecionada > 0) {
        this.imagemSelecionada--;
        this.atualizarMiniaturas();
      } else {
        this.imagemSelecionada = this.veiculo.imagens.length - 1; // Volta para a última imagem
      }
    },
    atualizarMiniaturas() {
      if (this.imagemSelecionada < this.miniaturaInicio) {
        this.miniaturaInicio = this.imagemSelecionada;
      } else if (this.imagemSelecionada >= this.miniaturaInicio + 4) {
        this.miniaturaInicio = this.imagemSelecionada - 3;
      }
    },
    abrirTelaCheia() {
      this.telaCheiaAtiva = true;
      document.addEventListener("keydown", this.fecharComEsc);
    },
    fecharTelaCheia() {
      this.telaCheiaAtiva = false;
      document.removeEventListener("keydown", this.fecharComEsc);
    },
    fecharComEsc(event) {
      if (event.key === "Escape") {
        this.fecharTelaCheia();
      }
    },
    // Função para capturar eventos de teclado
    tecladoNavegacao(event) {
      if (event.key === "ArrowRight") {
        this.proximaImagem();
      } else if (event.key === "ArrowLeft") {
        this.anteriorImagem();
      } else if (event.key === "Escape") {
        this.fecharTelaCheia();
      }
    },
    async carregarVeiculo() {
      try {
        const id = this.$route.params.id;
        if (!id) {
          alert("ID do veículo não fornecido.");
          return;
        }
        const veiculoData = await this.daoService.get(id);

        if (veiculoData) {
          this.veiculo = veiculoData;
          // Verifica se o usuário está logado antes de buscar os favoritos
          if (FavoritosService.getUsuarioLogado()) {
            const isFavorito = await FavoritosService.isFavorito(veiculoData.id);
            this.veiculo.favorito = isFavorito;
          } else {
            this.veiculo.favorito = false; // Se não estiver logado, desativa a estrela
          }
          await this.carregarVendedor(veiculoData.userId);
        } else {
          alert("Veículo não encontrado.");
        }
      } catch (error) {
        console.error('Erro ao carregar veículo:', error);
        alert('Erro ao carregar veículo.');
      }
    },

    async carregarVendedor(userId) {
      try {
        const userRef = doc(db, 'usuarios', userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          this.vendedor = {
            nome: userData.nome || "Não informado",
            sobrenome: userData.sobrenome || "Não informado",
            email: userData.contato?.email || "Não informado",
            telefone: userData.contato?.telefone || "Não informado",
            cidade: userData.endereco?.cidade || "Não informado",
            estado: userData.endereco?.estado || "Não informado",
          };
        }
      } catch (error) {
        console.error('Erro ao buscar informações do vendedor:', error);
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

        await this.daoService.update(anuncio.id, { favorito: anuncio.favorito });

      } catch (error) {
        console.error("Erro ao atualizar favorito:", error);
        alert("Erro ao atualizar o favorito.");
      }
    }
  },
};
</script>

<style scoped>
/* ✅ Container principal */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
.modal-fullscreen {
  position: fixed;  /* Fixar na tela inteira */
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9); /* Fundo escuro */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999; /* Garantir que fique acima de tudo */
}

.fullscreen-image {
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain; /* Para ajustar sem cortar */
}
.close-button {
  position: absolute;
  top: 10px;
  right: 30px;
  background: none;
  font-size: 30px;
  color: #5b3199;
  padding: 10px 15px;
  border: none;
  cursor: pointer;
  z-index: 10000; /* Certificar-se que está acima do modal */
}

.modal-prev, .modal-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 50px;
  padding: 10px;
  color: #5b3199;
  cursor: pointer;
  z-index: 10000;
}

.modal-prev { left: 20px; }
.modal-next { right: 20px; }


/* ✅ Carrossel de imagens */
.carrossel-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  position: relative;
}

/* ✅ Imagem principal no carrossel */
.imagem-principal img {
  width: 600px;
  height: 400px;
  border-radius: 10px;
  object-fit: cover;
  transition: transform 0.3s ease-in-out;
  cursor: pointer;
  margin-bottom: 10px;
}

/* 🖱️ Efeito ao passar o mouse na imagem principal */
.imagem-principal img:hover {
  transform: scale(1.03);
}

/* ✅ Botões de navegação no carrossel */
.nav-button {
 
  border: none;
  color: white;
  font-size: 30px;
  cursor: pointer;
  padding: 10px;
  border-radius: 50%;
  position: absolute;
  z-index: 10;
}

/* 📌 Ajuste das setas de navegação */
.left {
  left: -40px;
}

.right {
  right: -40px;
}

/* ✅ Miniaturas ao lado do carrossel */
.miniaturas {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* 📌 Estilização das miniaturas */
.miniatura {
  width: 100px;
  height: 80px;
  object-fit: cover;
  border-radius: 5px;
  cursor: pointer;
  transition: transform 0.3s, border 0.3s;
}

/* 🖱️ Efeito ao passar o mouse e destacar miniatura selecionada */
.miniatura:hover, .miniatura.active {
  transform: scale(1.1);
  border: 2px solid #531B76;
}

/* ✅ Informações do veículo */
.vehicle-info {
  display: flex;
  flex-direction: column;
  background: #fdf9f9;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  gap: 10px;
}

/* 🔷 Layout flexível para informações */
.info-wrapper {
  display: flex;
  gap: 40px;
}

/* 🔷 Caixa de informações */
.info-section {
  flex: 1;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 10px;
}

/* ✅ Título do veículo e preço */
.price-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #f3f3f3;
  padding-bottom: 15px;
  margin-bottom: 20px;
}

.vehicle-title {
  font-size: 36px;
  font-weight: bold;
  color: #5b3199;
}

.price-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* 💰 Estilo do preço */
.vehicle-price {
  font-size: 40px;
  font-weight: bold;
  color: #5b3199;
}

/* ⭐ Ícone de favorito */
.favorite-icon {
  cursor: pointer;
  font-size: 35px;
  color: #ccc;
  transition: all 0.3s ease-in-out;
  margin-left: 25px;
  vertical-align: middle;
  position: relative;
  top: -9px;
}

.favorite-icon.bi-star-fill {
  color: #5b3199;
}

.favorite-icon:hover {
  transform: scale(1.2);
  color: #7c42c2;
}

/* 🔷 Informações gerais */
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

/* 🔷 Nome do vendedor */
.seller-name {
  font-size: 45px;
  font-weight: bold;
  color: #5b3199;
}

.contact-info p {
  font-size: 21px; /* Aumenta o tamanho */
  display: block;
}

/* 🔷 Ícones */
i {
  color: #5b3199;
}

.descricao-container {
  margin-top: 15px;
  background: #f9f9f9;
  padding: 10px;
  border-radius: 10px;
  text-align: justify;
}

.descricao-btn {
  background: none;
  border: none;
  color: #5b3199;
  font-size: 14px;
  cursor: pointer;
  margin-top: 5px;
  font-weight: bold;
}

.descricao-btn:hover {
  text-decoration: underline;
}

/* ✅ RESPONSIVIDADE PARA MOBILE */
@media (max-width: 768px) {
  .container {
    padding: 10px;
  }

  .nav-button {
    display: none !important; /* Esconde as setas em telas menores */
  }
  .carrossel-container {
    flex-direction: column;
  }

  .imagem-principal img {
    width: 100%;
    height: auto;
  }

  .miniaturas {
    flex-direction: row;
    justify-content: center;
  }

  .miniatura {
    width: 80px;
    height: 60px;
  }

  .price-title {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .vehicle-title {
    font-size: 28px;
  }

  .vehicle-price {
    font-size: 30px;
  }

  .favorite-icon {
    font-size: 30px;
  }

  .info-wrapper {
    flex-direction: column;
    gap: 20px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .seller-name {
    font-size: 24px;
  }
}
</style>

