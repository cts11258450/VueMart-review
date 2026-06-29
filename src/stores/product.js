import { ref } from "vue"
import { defineStore } from "pinia"

const useProductStore = defineStore("product", () => {
  const products = ref([
    {
      id: 1,
      name: "人體工學機械鍵盤",
      price: 3200,
      image: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80",
      category: "鍵盤",
      description: "適合長時間打字與程式開發使用，具備舒適手感與穩定回饋。",
      stock: 0,
      rating: 4.8,
    },
    {
      id: 2,
      name: "無線降噪耳機",
      price: 5400,
      image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=80",
      category: "耳機",
      description: "支援無線連線與主動降噪，適合通勤、辦公與專注學習使用。",
      stock: 8,
      rating: 4.7,
    },
    {
      id: 3,
      name: "27吋 4K 專業螢幕",
      price: 12500,
      image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
      category: "螢幕",
      description: "高解析度 4K 顯示，適合設計、剪輯與多工工作環境。",
      stock: 5,
      rating: 4.9,
    },
    {
      id: 4,
      name: "記憶棉護腕滑鼠墊",
      price: 450,
      image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80",
      category: "配件",
      description: "柔軟記憶棉材質，減少長時間使用滑鼠造成的手腕壓力。",
      stock: 24,
      rating: 4.5,
    },
  ])

  return {
    products,
  }
})

export {useProductStore}  //也可以寫具名:export {useProductStore}，或者在一開始定義useProductStore時候寫:export const useProductStore = defineStore(.....)
