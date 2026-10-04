import { create } from 'zustand';
import {type Product,type Category} from '../types/types'

type ProductState = {
  products: Product[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
};

const API_URL = import.meta.env.VITE_API_URL ?? ""

export const  useProductStore = create<ProductState>()(
  (set) => ({
    products:[],
    categories:[],
    loading:false,
    error:null,
    fetchProducts: async() => {
      set({loading:true ,error:null })
      try {
        const res = await fetch(`${API_URL}/products/`)
        const data = await res.json()
        set({products:data.items,loading:false})
      } catch{
        set({error:"No se pudieron cargar los productos",loading:false})
      }
    },
    fetchCategories: async() => {
      set({loading:true,error:null})
      try {
        const res = await fetch(`${API_URL}/categories/`)
        const data = await res.json()
        set({categories:data.items,loading:false})
      } catch {
        set({error:"No se pudieron cargar las categorias",loading:false})
      }
    }

  })
)