<template>
  <div class="navbar">
    <!-- Logo -->
    <router-link to="/">
      <img src="/public/logos/logo_vitrinecar.png" alt="VitrineCar" class="logo" />
    </router-link>

    <!-- Menu Hamburguer (Visível apenas no Mobile) -->
    <button class="menu-toggle" @click="menuAberto = !menuAberto">
      <i :class="menuAberto ? 'bi bi-x-lg' : 'bi bi-list'"></i>
    </button>

    <!-- Menu principal -->
    <nav :class="{ 'menu-mobile': menuAberto }">
      <router-link to="/TelaAnuncios">Comprar</router-link>
      <router-link to="/TelaMeusAnuncios">Vender</router-link>
      <router-link to="/TelaFavoritos">Favoritos</router-link>

      <!-- Ícone do usuário dentro do menu hamburguer (Apenas no Mobile) -->
      <div v-if="mobileView && usuario" class="user-menu">
        <div class="user-info mobile-user" @click="toggleDropdown">
          <i class="bi bi-person-circle"></i>
        <span class="user-name">{{ usuario.displayName || usuario.email }}</span>
        <i :class="dropdownAberto ? 'bi bi-chevron-up' : 'bi bi-chevron-down'"></i>
        </div>


        <div v-if="dropdownAberto" class="dropdown-menu">
          <router-link to="/TelaMeusAnuncios" class="dropdown-item">
            <i class="bi bi-house-door"></i> Meus Anúncios
          </router-link>
          <router-link to="/TelaMinhaConta" class="dropdown-item">
            <i class="bi bi-person"></i> Minha Conta
          </router-link>
          <button @click="logout" class="dropdown-item logout">
            <i class="bi bi-box-arrow-right"></i> Sair
          </button>
        </div>
      </div>
    </nav>

    <!-- Ícone do usuário separado (Apenas no Desktop) -->
    <div v-if="!mobileView && usuario" class="user-menu">
      <div class="user-info desktop-user" @click="toggleDropdown">
        <i class="bi bi-person-circle"></i>
        <span class="user-name">{{ usuario.displayName || usuario.email }}</span>
        <i :class="dropdownAberto ? 'bi bi-chevron-up' : 'bi bi-chevron-down'"></i>
      </div>

      <div v-if="dropdownAberto" class="dropdown-menu">
        <router-link to="/TelaMeusAnuncios" class="dropdown-item">
          <i class="bi bi-house-door"></i> Meus Anúncios
        </router-link>
        <router-link to="/TelaMinhaConta" class="dropdown-item">
          <i class="bi bi-person"></i> Minha Conta
        </router-link>
        <button @click="logout" class="dropdown-item logout">
          <i class="bi bi-box-arrow-right"></i> Sair
        </button>
      </div>
    </div>

    <!-- Botão de Login (Caso não esteja logado) -->
    <router-link v-if="!usuario" to="/login" class="login-button">Entrar</router-link>
  </div>
</template>

<script>
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

export default {
  name: "Navbar",
  data() {
    return {
      usuario: null,
      dropdownAberto: false,
      menuAberto: false,
      mobileView: window.innerWidth <= 768,
    };
  },
  created() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.usuario = user;
      } else {
        this.usuario = null;
      }
    });

    window.addEventListener("resize", this.checkMobileView);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.checkMobileView);
  },
  methods: {
    checkMobileView() {
      this.mobileView = window.innerWidth <= 768;
    },
    toggleDropdown() {
      this.dropdownAberto = !this.dropdownAberto;
    },
    async logout() {
      try {
        const auth = getAuth();
        await signOut(auth);
        this.dropdownAberto = false;
        this.$router.push("/");
      } catch (error) {
        alert("Erro ao sair: " + error.message);
      }
    },
  },
};
</script>

<style scoped>
/* ======================= */
/* NAVBAR GERAL */
/* ======================= */

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background-color: #F3F3F3;
  position: relative;
  z-index: 100;
}

.navbar nav {
  display: flex;
  gap: 40px;
}

.navbar .logo {
    width: 190px;
    height: 120px;
  }

.navbar nav a {
  color: #531B76;
  text-decoration: none;
  font-size: 28px;
}

/* ======================= */
/* BOTÃO DE ENTRAR */
/* ======================= */

.login-button {
  background-color: #531B76;
  color: white;
  padding: 15px 30px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 18px;
  text-decoration: none;
  transition: 0.3s;
}

.login-button:hover {
  background-color: #410f5f;
}

/* ======================= */
/* MENU HAMBURGUER */
/* ======================= */

.menu-toggle {
  display: none;
  background: none;
  border: none;
  font-size: 30px;
  cursor: pointer;
  color: #531B76;
}

/* ======================= */
/* MENU MOBILE */
/* ======================= */

@media (max-width: 768px) {
  .navbar .logo {
    width: 160px;
    height: 90px;
  }

  .menu-toggle {
    display: block;
  }

  .navbar nav {
    display: none;
    flex-direction: column;
    position: absolute;
    top: 80px;
    left: 0;
    right: 0;
    background: #F3F3F3;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
    z-index: 200;
  }

  .navbar nav.menu-mobile {
    display: flex;
  }

  .navbar nav a {
    padding: 10px 0;
    text-align: center;
  }

  /* Ajuste do botão "Entrar" no mobile */
  .login-button {
    width: 100%;
    text-align: center;
    padding: 15px 0;
    border-radius: 0;
    background-color: #531B76;
    color: white;
    font-size: 18px;
  }

  /* Ícone de usuário dentro do menu no mobile */
  .mobile-user {
    display: flex;
    justify-content: center;
    font-size: 28px;
    margin-top: 10px;
  }

  .desktop-user {
    display: none;
  }

  .navbar nav a {
    font-size: 20px; /* Diminui o tamanho da fonte no mobile */
  }
}

/* ======================= */
/* MENU DO USUÁRIO (DESKTOP) */
/* ======================= */

.user-menu {
  position: relative;
  cursor: pointer;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 28px;
  font-weight: bold;
  color: #531B76;
  cursor: pointer;
}

.user-name {
  display: block; /* Nome visível apenas no Desktop */
}

@media (max-width: 768px) {
  .user-name {
    display: none; /* Esconde o nome no Mobile */
  }
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: 100%;
  background: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  width: 220px;
  display: flex;
  flex-direction: column;
  z-index: 999;
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-item {
  padding: 12px 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  color: #531B76;
  text-decoration: none;
  transition: background 0.3s;
}

.dropdown-item:hover {
  background: #f3f3f3;
}

.logout {
  color: red;
}

.bi {
  font-size: 30px;
}
</style>
