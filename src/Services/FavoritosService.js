import { getAuth } from "firebase/auth";

class FavoritosService {
  constructor() {
    this.favoritosKey = "favoritos";
  }

  // Verifica se há um usuário logado
  verificarUsuarioLogado() {
    const auth = getAuth();
    const user = auth.currentUser;
    return !!user; // Retorna verdadeiro se há usuário logado, falso caso contrário
  }
  // Recupera a lista de favoritos do localStorage para o usuário logado
  getFavoritos() {
    const user = this.getUsuarioLogado();
    if (!user) return [];

    const favoritos = JSON.parse(localStorage.getItem(this.favoritosKey)) || [];
    return favoritos.filter((item) => item.userId === user.uid);
  }

  // Adiciona um anúncio aos favoritos do usuário logado
  adicionarFavorito(anuncio) {
    const user = this.getUsuarioLogado();
    if (!user) {
      alert("Você precisa estar logado para favoritar um anúncio.");
      return;
    }

    const favoritos = this.getFavoritos();
    if (!favoritos.find((item) => item.id === anuncio.id)) {
      favoritos.push({ ...anuncio, userId: user.uid });
      this.salvarFavoritos(favoritos);
      
    }
  }

  // Remove um anúncio dos favoritos do usuário logado
  removerFavorito(id) {
    const user = this.getUsuarioLogado();
    if (!user) {
      alert("Você precisa estar logado para remover um favorito.");
      return;
    }

    let favoritos = JSON.parse(localStorage.getItem(this.favoritosKey)) || [];
    favoritos = favoritos.filter((item) => !(item.id === id && item.userId === user.uid));
    this.salvarFavoritos(favoritos);
    
  }

  // Verifica se um anúncio está nos favoritos do usuário logado
  isFavorito(id) {
    const user = this.getUsuarioLogado();
    if (!user) return false;

    const favoritos = this.getFavoritos();
    return favoritos.some((item) => item.id === id && item.userId === user.uid);
  }

  // Salva os favoritos no localStorage
  salvarFavoritos(favoritos) {
    localStorage.setItem(this.favoritosKey, JSON.stringify(favoritos));
  }

  // Obtém o usuário logado
  getUsuarioLogado() {
    const auth = getAuth();
    return auth.currentUser;
  }
}

export default new FavoritosService();
