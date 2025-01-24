<template>
  <div class="navbar">
    <router-link to="/">
      <img src="/public/logos/logo_vitrinecar.png" alt="VitrineCar" class="logo" />
    </router-link>
    <nav>
      <router-link to="/TelaAnuncios">Comprar</router-link>
      <router-link to="/TelaMeusAnuncios">Vender</router-link>
      <router-link to="/TelaFavoritos">Favoritos</router-link>
    </nav>

    <div v-if="usuario">
      <router-link to="/TelaMinhaConta" class="user-name">{{ usuario.displayName || usuario.email }}</router-link>
      <button @click="logout" class="login-button logout-button">Sair</button>
    </div>
    <router-link v-else to="/login" class="login-button">Entrar</router-link>
  </div>
</template>

<script>
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

export default {
  name: "Navbar",
  data() {
    return {
      usuario: null,
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
  },
  methods: {
    async logout() {
      try {
        const auth = getAuth();
        await signOut(auth);
        this.$router.push("/");
      } catch (error) {
        alert("Erro ao sair: " + error.message);
      }
    },
  },
};
</script>

<style scoped>
/* Estilos da Navbar */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 50px;
  background-color: #F3F3F3;
  margin: 3px;
}

.navbar nav a {
  margin: 0 15px;
  color: #531B76;
  text-decoration: none;
  font-size: 23px;
}

.navbar .login-button {
  background-color: #531B76;
  color: white;
  padding: 20px 35px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 20px;
  text-decoration: none;
}

.navbar .logout-button {
  background-color: #ff0000;
  margin-left: 15px;
  font-size: 18px;
}

.navbar .logo {
  width: 200px;
  height: 100px;
  cursor: pointer;
}

.user-name {
  font-size: 20px;
  color: #531B76;
  margin-right: 10px;
  font-weight: bold;
  cursor: pointer;
  text-decoration: none;
}

.user-name:hover {
  text-decoration: underline;
}
</style>
