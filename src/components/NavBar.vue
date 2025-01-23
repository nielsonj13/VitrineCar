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
    <router-link to="/login" class="login-button">Entrar</router-link>
  </div>
</template>

<script>
export default {
  name: "Navbar",
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

.navbar .logo {
  width: 200px;
  height: 100px;
  cursor: pointer;
}
</style>
