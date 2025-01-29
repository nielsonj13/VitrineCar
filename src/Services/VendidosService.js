import { db } from "@/firebase"; // Substitua pelo caminho correto para o seu Firebase
import {
  collection,
  addDoc,
  deleteDoc,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";

class VendidosService {
  constructor() {
    this.collectionRef = collection(db, "veiculos_vendidos"); // Coleção de veículos vendidos
  }

  // Método para adicionar um veículo vendido
  async adicionarVeiculoVendido(veiculo) {
    try {
      const docRef = await addDoc(this.collectionRef, veiculo);
      return docRef.id;
    } catch (error) {
      console.error("Erro ao adicionar veículo vendido:", error);
      throw new Error("Erro ao adicionar veículo vendido.");
    }
  }

  // Método para remover um veículo vendido
  async removerVeiculoVendido(id) {
    try {
      const docRef = doc(db, this.collectionRef.path, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Erro ao remover veículo vendido:", error);
      throw new Error("Erro ao remover veículo vendido.");
    }
  }

  // Método para obter todos os veículos vendidos
  async obterTodosVendidos() {
    try {
      const querySnapshot = await getDocs(this.collectionRef);
      const veiculos = [];
      querySnapshot.forEach((doc) => {
        veiculos.push({ id: doc.id, ...doc.data() });
      });
      return veiculos;
    } catch (error) {
      console.error("Erro ao obter veículos vendidos:", error);
      throw new Error("Erro ao obter veículos vendidos.");
    }
  }

  // Método para obter um veículo vendido específico
  async obterVeiculoVendido(id) {
    try {
      const docRef = doc(db, this.collectionRef.path, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        throw new Error("Veículo vendido não encontrado.");
      }
    } catch (error) {
      console.error("Erro ao obter veículo vendido:", error);
      throw new Error("Erro ao obter veículo vendido.");
    }
  }
}

export default new VendidosService();