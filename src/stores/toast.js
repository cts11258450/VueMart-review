import {ref} from "vue"
import {defineStore} from "pinia"

export const useToastStore = defineStore("toast",()=>{
    const toasts = ref([]);
    let toastId = 0;

    const removeToast=(id)=>{
        toasts.value = toasts.value.filter((toast) => {
            return toast.id !== id
        })
    }

    const showToast = (text, type = "success") => {
        const id = toastId++;

        toasts.value.push({
            id,
            text,
            type,
        })

        setTimeout(() => {
           removeToast(id);
        }, 3000)
    }
    return{
        toasts,
        showToast,
        removeToast,
    }
})