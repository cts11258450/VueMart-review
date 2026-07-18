const API_BASE_URL = "http://localhost:3000"

const delay = (ms)=>{
    return new Promise((resolve)=>{
        setTimeout(()=>{
            resolve();
        },ms)
    })
}

export const registerUserApi = async (userData) => {
    await delay(1000);

    if(import.meta.env.DEV){
        const responseMatched = await fetch(`${API_BASE_URL}/users?email=${encodeURIComponent(userData.email)}`)
        if(!responseMatched.ok){
            throw new Error("會員註冊失敗");
        }

        const matchedArray = await responseMatched.json();
        if(matchedArray.length !== 0){
            return{
                success:false,
                message:"此帳號已註冊"
            }
        }

        const response = await fetch(`${API_BASE_URL}/users`,{
            method:"POST",
            headers:{
                "Content-Type": "application/json",
            },
            body:JSON.stringify(userData)
        });

        if(!response.ok){
            throw new Error("會員註冊失敗")
        }

        const createdUser = await response.json();
        return {
            success:true,
            message:"註冊成功，請重新登入",
            user:createdUser
        };
    }

    return{
        success:true,
        message:"註冊成功，請重新登入",
        user:{
            id:Date.now(),
            ...userData
        }
    }
}

export const loginUserApi = async (loginData)=>{
    await delay(1000);

    if(import.meta.env.DEV){
        const response = await fetch(`${API_BASE_URL}/users?email=${encodeURIComponent(loginData.email)}`); //encodeURIComponent() 是把 Email 轉成安全的網址格式。

        if(!response.ok){
            throw new Error("會員登入失敗");
        }

        const userArray = await response.json();
        const matchedUser = userArray[0];

        if(!matchedUser){
            return{
                success:false,
                message:"查無此帳號，請先註冊會員"
            }
        }

        if(matchedUser.password !== loginData.password){
            return{
                success:false,
                message:"密碼錯誤，請重新輸入"
            }
        }

        return{
            success:true,
            message:"登入成功!",
            user: matchedUser,
            token: `fake-token-${matchedUser.id}`,
        }
    }

    if(loginData.password !== "123456"){
        return{
            success:false,
            message:"密碼錯誤，測試密碼請輸入 123456!"
        }
    }

    return{
        success:true,
        message:"登入成功!",
        user: {
            id: 1,
            name: "測試管理員",
            email: loginData.email,
            role: "admin",
        },
        token: "fake-token-production",
    }
}