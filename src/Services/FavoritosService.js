class FavoritosService {
    constructor() {
      this.favoritos = []; // Lista de anúncios favoritos
    }
  
    adicionarFavorito(anuncio) {
      if (!this.favoritos.find((fav) => fav.id === anuncio.id)) {
        this.favoritos.push(anuncio);
      }
    }
  
    removerFavorito(anuncioId) {
      this.favoritos = this.favoritos.filter((fav) => fav.id !== anuncioId);
    }
  
    getFavoritos() {
      return this.favoritos;
    }
  }
  
  export default new FavoritosService();
  