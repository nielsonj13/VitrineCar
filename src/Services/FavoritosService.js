class FavoritosService {
  constructor() {
    this.favoritosKey = "favoritos";
  }

  // Recupera a lista de favoritos do localStorage
  getFavoritos() {
    const favoritos = localStorage.getItem(this.favoritosKey);
    return favoritos ? JSON.parse(favoritos) : [];
  }

  // Adiciona um anúncio aos favoritos
  adicionarFavorito(anuncio) {
    const favoritos = this.getFavoritos();
    if (!favoritos.find((item) => item.id === anuncio.id)) {
      favoritos.push(anuncio);
      localStorage.setItem(this.favoritosKey, JSON.stringify(favoritos));
    }
  }

  // Remove um anúncio dos favoritos
  removerFavorito(id) {
    const favoritos = this.getFavoritos();
    const atualizados = favoritos.filter((item) => item.id !== id);
    localStorage.setItem(this.favoritosKey, JSON.stringify(atualizados));
  }

  // Verifica se um anúncio está nos favoritos
  isFavorito(id) {
    const favoritos = this.getFavoritos();
    return favoritos.some((item) => item.id === id);
  }
}

export default new FavoritosService();
