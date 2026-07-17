const API_BASE_URL = "http://localhost:3000"

const delay = (ms)=>{
    return new Promise((resolve)=>{
        setTimeout(()=>{
            resolve();
        },ms)
    })
}

export const createOrderApi = async (orderData)=>{
    await delay(1000);

    if(import.meta.env.DEV){
        const response = await fetch(`${API_BASE_URL}/orders`,{
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(orderData),
        })
        if(!response.ok){
            throw new Error("訂單建立失敗");
        }
        const order = response.json();
        return order;
    }
    return{
        ...orderData,
        id:Date.now()
    }
}