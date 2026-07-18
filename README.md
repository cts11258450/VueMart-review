# VueMart Review

## 線上 Demo

[點此查看線上作品](https://cts11258450.github.io/VueMart-review/)

VueMart Review 是一個使用 Vue 3、Vue Router 與 Pinia 製作的前端電商作品。

專案包含商品列表、商品詳情、購物車、會員註冊、會員登入、結帳流程、訂單建立、會員訂單紀錄、訂單詳情，以及後台商品管理 CRUD 等功能。

這個專案主要用來練習 Vue 3 Composition API、元件拆分、Pinia 狀態管理、Vue Router 路由管理、表單驗證、localStorage 資料保存、RESTful API 串接、會員註冊與登入流程，以及完整的前端購物與後台管理流程。

商品資料已由原本寫死在 store 中的靜態資料，重構為透過 API 流程非同步載入。開發環境使用 JSON Server 模擬後端 REST API，前端透過 `fetch()` 取得商品資料；正式部署環境則使用 `mockProducts` 作為 fallback，確保 GitHub Pages 線上 Demo 也能正常顯示商品資料。

訂單建立流程也已改為 API 架構。開發環境中，結帳頁會透過 `POST http://localhost:3000/orders` 將訂單送到 JSON Server；正式部署環境則使用訂單 fallback 模擬建立訂單，並搭配 localStorage 保存訂單資料，確保線上 Demo 仍能完成完整結帳流程。

後台商品管理功能已加入完整 CRUD 流程。開發環境中，後台可透過 JSON Server API 新增、編輯與刪除商品，對應 `POST /products`、`PATCH /products/:id` 與 `DELETE /products/:id`。正式部署環境則透過 fallback 模擬操作成功，讓 GitHub Pages 線上 Demo 仍可體驗後台商品管理流程。

會員註冊與登入流程已改為 API 架構。開發環境中，註冊會先透過 `GET /users?email=xxx` 檢查帳號是否重複，再透過 `POST /users` 新增會員；登入則透過 `GET /users?email=xxx` 查詢使用者並比對密碼。登入成功後會將 token 與 user 保存至 Pinia 狀態，並透過 localStorage 保留登入狀態。正式部署環境則使用登入與註冊 fallback，讓 GitHub Pages 線上 Demo 仍可展示會員與後台操作流程。

專案使用 Pinia action 搭配 async / await 管理資料取得、會員註冊、會員登入、訂單建立與後台商品 CRUD 流程，同時處理 loading、error、empty state、not found、submitting、creating、updating、deleting 與避免重複請求等情境，讓專案架構更接近真實前端開發流程。

---

## 專案畫面截圖

### 首頁

![首頁](./screenshots/home.png)

### 商品列表

![商品列表](./screenshots/product.png)

### 商品詳情

![商品詳情](./screenshots/product-detail.png)

### 購物車

![購物車](./screenshots/cart.png)

### 結帳頁

![結帳頁](./screenshots/checkout.png)

### 登入頁

![登入頁](./screenshots/login.png)

### 註冊頁

![註冊頁](./screenshots/register.png)

### 訂單成立

![訂單成立](./screenshots/order-success.png)

### 訂單成立畫面 2

![訂單成立畫面 2](./screenshots/order-success-1.png)

### 訂單紀錄

![訂單紀錄](./screenshots/orderHistory.png)

### 訂單詳情

![訂單詳情](./screenshots/orderDetail.png)

### 後台商品管理

![後台商品管理](./screenshots/admin-products.png)

---

## 專案特色

* 使用 Vue 3 Composition API 開發
* 使用 Vue Router 建立多頁式前端路由
* 使用 Pinia 管理商品、購物車、會員、訂單與 Toast 狀態
* 使用 JSON Server 模擬後端 REST API
* 支援會員註冊流程與帳號重複檢查
* 註冊流程支援 `GET /users?email=xxx` 查詢重複帳號與 `POST /users` 新增會員
* 登入流程支援 `GET /users?email=xxx` 查詢使用者並比對密碼
* 支援 admin / user 角色權限測試
* 商品資料透過 `fetch()` 非同步載入
* 訂單建立透過 `POST /orders` API 送出
* 支援後台商品管理 CRUD
* 後台商品管理支援新增商品、編輯商品與刪除商品
* 商品新增透過 `POST /products` API 串接
* 商品編輯透過 `PATCH /products/:id` API 串接
* 商品刪除透過 `DELETE /products/:id` API 串接
* 使用 `productApi.js`、`orderApi.js` 與 `authApi.js` 封裝 API 請求
* 使用 `response.ok` 與 `response.json()` 處理 API 回應
* 使用 async / await 與 try / catch / finally 處理資料載入、會員註冊、會員登入、訂單建立與商品 CRUD 流程
* 使用 Pinia action 管理商品 API 載入、loading 與 error 狀態
* 商品列表與商品詳情頁支援 loading、error、empty、not found 與成功狀態
* 結帳頁支援 submitting 狀態，避免訂單重複送出
* 後台商品管理支援新增中、儲存中、刪除中與錯誤提示狀態
* 訂單建立失敗時使用 Toast 顯示錯誤提示
* 商品新增、編輯、刪除失敗時使用 Toast 顯示錯誤提示
* 抽出 LoadingState 與 ErrorState 共用元件，減少重複 UI 程式碼
* 避免商品資料重複 fetch，減少不必要的資料請求
* 處理非同步商品資料載入後的分類 query 驗證與同步問題
* 使用 `import.meta.env.DEV` 判斷開發環境與正式部署環境
* 開發環境使用 JSON Server，正式部署環境使用商品、訂單與後台 CRUD fallback
* 使用 localStorage 保存購物車、登入狀態與訂單資料
* 支援商品搜尋、分類篩選與價格排序
* 支援商品詳情頁與動態路由
* 支援購物車加入、移除、數量調整與庫存上限判斷
* 支援會員註冊、登入、登出與 Route Guard 權限保護
* 支援後台頁面 `requiresAuth` 與 `requiresAdmin` 權限保護
* 支援結帳表單驗證與送出 loading 狀態
* 支援後台商品新增與編輯表單驗證
* 支援訂單建立、訂單成功頁、我的訂單與訂單詳情
* 支援非本人訂單權限判斷
* 完整處理空狀態與錯誤狀態
* 具備 RWD 響應式版面

---

## 作品亮點

### 1. 完整的前端電商流程

本專案完成從商品瀏覽到訂單建立的完整流程：

```txt
商品列表
→ 商品詳情
→ 加入購物車
→ 購物車管理
→ 登入會員
→ 結帳表單驗證
→ 建立訂單
→ 訂單成功頁
→ 我的訂單
→ 訂單詳情
```

### 2. 使用 Pinia 管理多種狀態

專案將不同資料拆分成多個 store：

```txt
productStore：商品資料、loading、error、商品 CRUD
cartStore：購物車資料
authStore：會員登入狀態與管理員權限
orderStore：訂單資料
toastStore：提示訊息
```

這讓資料責任更清楚，也方便不同頁面共用狀態。

### 3. 會員註冊與登入 API 流程

本專案加入完整會員註冊與登入流程，模擬常見的前端會員功能。

註冊流程包含：

```txt
RegisterView
→ 表單驗證
→ authStore.register()
→ registerUserApi()
→ GET /users?email=xxx 檢查帳號是否重複
→ 無重複才 POST /users
→ 註冊成功
→ 導向 /login?email=xxx
```

登入流程包含：

```txt
LoginView
→ 表單驗證
→ authStore.login()
→ loginUserApi()
→ GET /users?email=xxx
→ 查詢使用者
→ 比對密碼
→ 保存 token / user
→ localStorage 同步登入狀態
→ 依照 redirect 導回原本頁面
```

會員系統支援以下情境：

```txt
註冊表單驗證
帳號重複檢查
查無帳號
密碼錯誤
登入成功
登入中 input / button disabled
註冊成功後自動帶入 Email 至登入頁
admin / user 角色權限判斷
```

開發環境中，會員資料透過 JSON Server 的 `users` 資源模擬：

```txt
GET  /users?email=xxx
POST /users
```

正式部署環境因 GitHub Pages 無法執行 JSON Server，會使用 production fallback 模擬註冊與登入成功，方便展示會員與後台流程。

### 4. 商品資料改為 API 載入流程

本專案將商品資料由原本寫死在 Pinia store 中，重構為獨立的 API 請求流程。

商品資料請求集中在 `src/api/productApi.js` 管理，並由 `productStore.fetchProducts()` 非同步 action 載入商品資料。

開發環境中，前端會透過 JSON Server 取得商品資料：

```txt
GET http://localhost:3000/products
GET http://localhost:3000/products/:id
```

資料載入流程包含：

```txt
頁面載入
→ 呼叫 productStore.fetchProducts()
→ 進入 loading 狀態
→ 呼叫 productApi.js 的 getProducts()
→ 開發環境 fetch JSON Server
→ 成功取得商品資料 / 發生錯誤
→ 更新 products 或 errorMessage
→ 關閉 loading
→ 畫面重新渲染
```

商品列表頁與商品詳情頁皆支援非同步資料載入，並處理以下狀態：

```txt
loading：商品資料載入中
error：商品資料載入失敗
empty：沒有符合條件的商品
not found：找不到指定商品
success：成功顯示商品資料
```

此外，專案也加入避免重複 fetch 的保護機制，並處理分類 query 在商品資料尚未載入完成時可能被誤判為非法的問題。

### 5. 訂單建立改為 POST API 流程

本專案將原本只在前端建立訂單並保存到 localStorage 的流程，重構為 API 建立流程。

開發環境中，結帳頁送出訂單時會透過 `src/api/orderApi.js` 發送 POST 請求到 JSON Server：

```txt
POST http://localhost:3000/orders
http://localhost:3000/users
```

訂單建立流程：

```txt
CheckoutView
→ handleSubmitOrder()
→ orderStore.createOrder(orderData)
→ createOrderApi(newOrder)
→ POST /orders
→ JSON Server 回傳 createdOrder
→ orders 更新
→ localStorage 同步
→ 清空購物車
→ 導向訂單成功頁
```

送出訂單時會進入 `isSubmitting` 狀態，按鈕會顯示「訂單建立中...」並暫時 disabled，避免使用者重複送出。

若訂單 API 建立失敗，系統會透過 Toast 顯示錯誤提示。

### 6. 開發環境與部署環境分流

本專案部署於 GitHub Pages，而 GitHub Pages 僅支援靜態網站，無法執行 JSON Server。

因此專案在 `productApi.js` 與 `orderApi.js` 中使用 `import.meta.env.DEV` 判斷目前環境：

```txt
開發環境 npm run dev
→ 商品資料使用 JSON Server
→ fetch http://localhost:3000/products
→ 訂單建立 POST http://localhost:3000/orders
→ 後台商品 CRUD 使用 POST / PATCH / DELETE products API
→ 會員註冊與登入使用 GET / POST users API

正式部署 npm run build
→ 商品資料使用 src/data/mockProducts.js
→ 訂單建立使用前端 fallback
→ 後台商品 CRUD 使用前端 fallback
→ 會員註冊與登入使用前端 fallback
→ 訂單資料保存至 localStorage
```

這樣可以同時保留：

```txt
本機開發：
練習真實 API 串接流程

線上 Demo：
穩定顯示商品資料、完成結帳流程，並模擬後台商品 CRUD 操作
```

### 7. 後台商品管理 CRUD

本專案加入後台商品管理頁面，模擬電商後台常見的商品維護流程。

後台商品管理功能包含：

```txt
商品列表
→ 新增商品
→ 編輯商品
→ 刪除商品
→ 商品狀態顯示
→ 後台權限保護
```

開發環境中，後台 CRUD 會透過 JSON Server 串接 RESTful API：

```txt
GET    /products       取得商品列表
POST   /products       新增商品
PATCH  /products/:id   編輯商品
DELETE /products/:id   刪除商品
```

後台商品管理資料流：

```txt
AdminProductsView
→ productStore action
→ productApi.js
→ JSON Server REST API
→ 回傳結果
→ 更新 Pinia products 狀態
→ 後台列表重新渲染
```

新增、編輯與刪除商品時，畫面會處理以下狀態：

```txt
新增中
儲存中
刪除中
操作成功 Toast
操作失敗 Toast
空資料狀態
API 錯誤狀態
```

此外，後台路由加入 `requiresAuth` 與 `requiresAdmin`，模擬只有管理員可以進入後台管理頁面的情境。

### 8. 使用 Vue Router 建立權限保護

專案使用 Route Guard 保護會員頁面、結帳流程與後台管理頁面：

```txt
未登入使用者
→ 進入 /checkout、/member、/orders、/admin/products
→ 自動導向 /login

登入成功後
→ 回到原本想前往的頁面
```

後台商品管理頁額外加入管理員權限判斷：

```txt
requiresAuth：需要登入
requiresAdmin：需要管理員身分
```

目前管理員權限為前端模擬，真實專案中仍需要由後端 API 驗證管理員身分與商品操作權限。

### 9. 使用 localStorage 模擬資料持久化

購物車、登入狀態與訂單資料會保存到 localStorage。

重新整理頁面後，資料仍然可以保留，模擬常見的前端資料保存情境。

### 10. 完整處理空狀態與錯誤狀態

本專案處理多種例外情境：

```txt
找不到商品
商品資料載入中
商品資料載入失敗
空購物車
空結帳
訂單建立失敗
沒有訂單
找不到訂單
非本人訂單
後台商品新增失敗
後台商品更新失敗
後台商品刪除失敗
404 頁面
```

每個狀態都提供清楚說明與下一步操作，讓使用者不會卡住。

---

## 使用技術

* Vue 3
* Vite
* Vue Router
* Pinia
* JavaScript
* HTML
* CSS
* localStorage
* Promise
* async / await
* fetch API
* JSON Server
* REST API
* HTTP GET
* HTTP POST
* HTTP PATCH
* HTTP DELETE
* CRUD
* Route Guard
* Admin Guard
* 模擬 API
* production fallback
* GitHub Pages

---

## 功能列表

### 商品功能

* 商品列表
* 商品詳情頁
* 商品資料 JSON Server API 載入
* 商品資料 production fallback
* 商品 loading 狀態
* 商品 error 狀態
* 商品 empty 狀態
* 商品 not found 狀態
* 商品搜尋
* 商品分類篩選
* 商品價格排序
* 售完商品狀態
* 低庫存商品狀態
* 庫存上限判斷
* 避免商品資料重複載入
* API 載入失敗時可重新載入

### 購物車功能

* 加入購物車
* 同商品數量累加
* 商品數量增加與減少
* 商品數量歸零時移除
* 移除單一商品
* 清空購物車
* 購物車總數量
* 購物車總金額
* 購物車 localStorage 保存
* 空購物車狀態

### 會員功能

* 會員註冊
* 註冊表單驗證
* 註冊帳號重複檢查
* `GET /users?email=xxx` 查詢帳號是否已存在
* `POST /users` 新增會員
* 註冊成功後導向登入頁
* 註冊成功後自動帶入 Email 至登入頁
* 會員登入
* 登入表單驗證
* `GET /users?email=xxx` 查詢使用者
* 登入密碼比對
* 帳號不存在提示
* 密碼錯誤提示
* 會員登出
* 登入狀態保存
* 顯示會員名稱
* admin / user 角色權限判斷
* Route Guard 權限保護
* 後台 requiresAdmin 權限保護
* 未登入導向登入頁
* 登入後導回原本想去的頁面
* 已登入時避免重複進入登入頁

### 結帳功能

* 收件人姓名驗證
* 手機號碼格式驗證
* 收件地址驗證
* 付款方式選擇
* 訂單備註
* 送出訂單 loading 狀態
* 訂單送出 submitting 狀態
* 防止重複送出
* 訂單建立失敗 Toast 提示
* 空購物車不可結帳

### 訂單功能

* 建立訂單
* 訂單 POST API 建立
* JSON Server `/orders` API 串接
* 訂單 production fallback
* 訂單成功頁
* 我的訂單列表
* 訂單詳情頁
* 只顯示目前會員自己的訂單
* 最新訂單排序在最上方
* 找不到訂單狀態
* 非本人訂單權限阻擋
* 訂單資料 localStorage 保存

### 後台管理功能

* 後台商品列表
* 後台商品新增
* 後台商品編輯
* 後台商品刪除
* 商品 CRUD API 串接
* `POST /products` 新增商品
* `PATCH /products/:id` 更新商品
* `DELETE /products/:id` 刪除商品
* 商品新增表單驗證
* 商品編輯表單資料帶入
* 商品新增中狀態
* 商品更新中狀態
* 商品刪除中狀態
* 商品操作成功 Toast
* 商品操作失敗 Toast
* 刪除商品前二次確認
* 後台商品 empty 狀態
* 後台商品 error 狀態
* 後台管理員權限保護

### UI / UX

* Toast 操作提示
* loading 狀態畫面
* error 狀態畫面
* empty 狀態畫面
* not found 狀態畫面
* creating 狀態
* updating 狀態
* deleting 狀態
* LoadingState 共用元件
* ErrorState 共用元件
* 高對比文字設計
* RWD 響應式版面
* 手機版按鈕與卡片排版優化

---

## 頁面路由

| 路徑                   | 功能            |
| -------------------- | ------------- |
| `/`                  | 首頁            |
| `/product`           | 商品列表          |
| `/product/:id`       | 商品詳情          |
| `/cart`              | 購物車           |
| `/checkout`          | 結帳頁面          |
| `/login`             | 登入頁面          |
| `/register`          | 註冊頁面          |
| `/member`            | 會員中心          |
| `/orders`            | 我的訂單          |
| `/orders/:id`        | 訂單詳情          |
| `/order-success/:id` | 訂單成功頁         |
| `/admin/products`    | 後台商品管理      |
| `/:pathMatch(.*)*`   | 404 Not Found |

---

## 測試帳號

本專案在開發環境中使用 JSON Server 模擬會員 API。

### 開發環境測試帳號

請先啟動 JSON Server：

```bash
npm run server
```

可使用以下帳號測試不同權限：

```txt
管理員帳號
Email：admin@gmail.com
Password：123456
role：admin
可進入：/admin/products
```

```txt
一般會員帳號
Email：user@gmail.com
Password：123456
role：user
不可進入：/admin/products
```

也可以透過註冊頁新增一般會員：

```txt
/register
```

註冊時會先透過 `GET /users?email=xxx` 檢查帳號是否重複，沒有重複才會透過 `POST /users` 新增會員。

### 線上 Demo 登入方式

由於 GitHub Pages 是靜態部署環境，無法執行 JSON Server，因此線上 Demo 使用 production fallback 模擬登入：

```txt
Email：任意有效 Email
Password：123456
```

線上 Demo 登入後會模擬為測試管理員身分，方便展示後台商品管理流程。

此權限僅為前端作品展示用途。真實專案中，會員註冊、登入、密碼 hash、token 發放與管理員權限驗證都應由後端 API 處理。

---

## 安裝與啟動

### 1. 安裝套件

```bash
npm install
```

### 2. 啟動前端開發伺服器

```bash
npm run dev
```

### 3. 啟動 JSON Server 模擬後端

開發環境若要使用 JSON Server API，請另外開一個終端機執行：

```bash
npm run server
```

JSON Server 啟動後，可查看商品與訂單 API：

```txt
http://localhost:3000/products
http://localhost:3000/products/1
http://localhost:3000/orders
http://localhost:3000/users
```

### 4. 建立正式版

```bash
npm run build
```

### 5. 預覽正式版

```bash
npm run preview
```

---

## 開發環境說明

本專案在開發時建議同時啟動兩個服務：

```txt
前端開發伺服器：
npm run dev
http://localhost:5173

模擬後端 API：
npm run server
http://localhost:3000/products
http://localhost:3000/orders
http://localhost:3000/users
```

前端會透過 `fetch()` 向 JSON Server 取得商品資料，透過 POST API 建立訂單，透過 GET / POST API 操作會員註冊與登入，並透過 POST / PATCH / DELETE API 操作後台商品 CRUD。

若未啟動 JSON Server，商品頁會顯示錯誤狀態，註冊與登入會顯示錯誤提示，訂單送出會顯示錯誤 Toast，後台新增、編輯與刪除商品也會顯示錯誤 Toast，提示確認 JSON Server 是否已啟動。

---

## 專案資料保存方式

本專案使用 localStorage 模擬前端資料保存：

| key      | 用途         |
| -------- | ---------- |
| `cart`   | 保存購物車資料    |
| `orders` | 保存訂單資料     |
| `token`  | 保存登入 token |
| `user`   | 保存會員資料     |

---

## 模擬 API 說明

本專案使用 JSON Server 模擬後端 REST API，商品資料、訂單資料與會員資料存放於 `db.json`。

開發環境中，前端會透過 `src/api/productApi.js`、`src/api/orderApi.js` 與 `src/api/authApi.js` 串接 JSON Server。

商品 API：

```txt
GET    http://localhost:3000/products
GET    http://localhost:3000/products/:id
POST   http://localhost:3000/products
PATCH  http://localhost:3000/products/:id
DELETE http://localhost:3000/products/:id
```

訂單 API：

```txt
GET  http://localhost:3000/orders
POST http://localhost:3000/orders
GET  http://localhost:3000/orders/:id
```


會員 API：

```txt
GET  http://localhost:3000/users
GET  http://localhost:3000/users?email=xxx
POST http://localhost:3000/users
```

會員註冊與登入 API 流程：

```txt
RegisterView
→ authStore.register(registerData)
→ registerUserApi(userData)
→ GET /users?email=xxx 檢查帳號重複
→ 無重複才 POST /users
→ JSON Server 回傳 createdUser
→ Toast 顯示註冊成功
→ 導向 /login?email=xxx
```

```txt
LoginView
→ authStore.login(loginData)
→ loginUserApi(loginData)
→ GET /users?email=xxx
→ 查詢使用者
→ 比對密碼
→ 登入成功後保存 token / user
→ localStorage 同步登入狀態
→ Route Guard 判斷登入與管理員權限
```

商品 API 請求流程：

```txt
ProductView / ProductDetailView
→ productStore.fetchProducts()
→ getProducts()
→ fetch("http://localhost:3000/products")
→ response.ok 檢查請求是否成功
→ response.json() 解析 JSON
→ products 更新
→ 畫面重新渲染
```

後台商品 CRUD 流程：

```txt
AdminProductsView
→ 新增 / 編輯 / 刪除商品
→ productStore.createProduct / updateProduct / deleteProduct
→ productApi.js
→ POST / PATCH / DELETE products API
→ JSON Server 更新 db.json
→ Pinia products 狀態同步更新
→ 後台商品列表重新渲染
```

訂單 API 建立流程：

```txt
CheckoutView
→ handleSubmitOrder()
→ orderStore.createOrder(orderData)
→ createOrderApi(newOrder)
→ POST http://localhost:3000/orders
→ JSON Server 回傳 createdOrder
→ orders 更新
→ localStorage 同步
→ 清空購物車
→ 導向訂單成功頁
```

若 API 載入、建立或操作失敗，前端會透過 error state 或 Toast 顯示錯誤提示。

### GitHub Pages 部署說明

由於 GitHub Pages 僅支援靜態網站，不會執行 JSON Server，因此本專案使用 production fallback 設計。

`productApi.js` 與 `orderApi.js` 會透過 `import.meta.env.DEV` 判斷目前環境：

```txt
開發環境：
使用 JSON Server API

正式部署環境：
商品資料使用 src/data/mockProducts.js
訂單建立使用前端 fallback
會員註冊與登入使用前端 fallback
後台商品 CRUD 使用前端 fallback
訂單資料保存至 localStorage
```

這樣可以確保：

```txt
本機開發時可以練習 GET / POST / PATCH / DELETE API 串接
線上 Demo 也能穩定顯示商品、完成註冊與登入展示流程、完成結帳流程，並模擬後台商品 CRUD 操作
```

由於 GitHub Pages 無法執行 JSON Server，線上 Demo 中的註冊、登入、新增、編輯與刪除商品屬於前端 fallback 模擬操作；重新整理頁面後，商品資料會回到原本的 mockProducts 狀態，註冊資料也不會永久寫入後端資料庫。

---

## 專案學習重點

這個專案主要練習以下 Vue 前端開發能力：

* 使用 Vue 3 Composition API 管理元件邏輯
* 使用 props / emit 拆分元件責任
* 使用 computed 管理衍生資料
* 使用 watch 監聽資料並同步 localStorage
* 使用 Pinia 管理跨元件狀態
* 使用 Pinia action 管理非同步資料載入流程
* 使用 JSON Server 模擬 REST API
* 使用 GET /users?email=xxx 查詢會員資料
* 使用 POST /users 新增會員資料
* 實作註冊帳號重複檢查
* 實作登入帳號不存在與密碼錯誤處理
* 使用 Pinia action 封裝會員註冊與登入邏輯
* 使用 fetch API 串接商品資料
* 使用 POST API 建立訂單資料
* 使用 RESTful API 設計商品 CRUD 流程
* 使用 POST API 新增商品
* 使用 PATCH API 更新商品資料
* 使用 DELETE API 刪除商品
* 使用 Pinia action 封裝新增、編輯、刪除商品邏輯
* 使用表單狀態管理後台新增與編輯商品表單
* 使用 response.ok 檢查 HTTP 回應狀態
* 使用 response.json() 解析 JSON 資料
* 使用 Promise 模擬 API 載入與送出時間
* 使用 async / await 處理非同步資料載入、訂單建立與後台 CRUD 流程
* 使用 try / catch / finally 處理 API 成功、失敗與 loading 狀態
* 使用 isSubmitting 處理訂單送出狀態並防止重複送出
* 使用 creating / updating / deleting 狀態處理後台操作中狀態
* 使用 Vue Router 建立多頁路由
* 使用動態路由取得商品與訂單資料
* 使用 Route Guard 控制登入權限
* 使用 `requiresAdmin` 模擬後台管理員權限保護
* 理解前端權限保護與後端權限驗證的差異
* 使用 localStorage 模擬資料持久化
* 使用表單驗證處理使用者輸入
* 使用條件渲染處理 loading、error、empty、not found 與 success 狀態
* 抽出 LoadingState 與 ErrorState 共用狀態元件
* 處理非同步資料載入後的 query 驗證與狀態同步問題
* 避免重複 fetch，減少不必要的資料請求
* 使用 `import.meta.env.DEV` 處理開發環境與正式部署環境差異
* 使用 production fallback 確保 GitHub Pages Demo 穩定運作
* 理解 GitHub Pages 靜態部署與 JSON Server 本機開發環境的差異
* 使用 RWD CSS 優化手機版畫面

---

## 專案狀態

目前已完成主要電商流程，並將商品資料、會員註冊、會員登入、訂單建立與後台商品管理改為 API 架構：

```txt
商品瀏覽
→ 商品詳情
→ 加入購物車
→ 會員註冊 / 登入
→ 結帳
→ POST API 建立訂單
→ 訂單成功
→ 我的訂單
→ 訂單詳情
→ 後台商品管理 CRUD
```

目前商品資料、會員註冊、會員登入、訂單建立與後台商品 CRUD 在開發環境中使用 JSON Server 模擬後端 REST API。

正式部署環境則使用 mock data 與 fallback 機制，確保 GitHub Pages 線上 Demo 可以正常瀏覽商品、展示註冊與登入流程、建立訂單，並模擬後台商品新增、編輯與刪除流程。

---

## 未來可擴充方向

* 將 JSON Server 替換為真實後端 API
* 將商品資料、訂單資料與會員資料串接資料庫
* 將目前 JSON Server 會員流程升級為真實後端會員系統
* 加入更完整的後台儀表板
* 加入訂單狀態管理
* 加入後台訂單管理
* 加入商品圖片上傳功能
* 加入商品分類管理
* 加入金流串接
* 加入收藏商品功能
* 加入商品評價功能
* 加入 API 分頁與搜尋參數
* 加入 TypeScript
* 加入單元測試與元件測試

---

## 備註

此專案目前為前端練習作品。

開發環境中，商品資料、訂單資料與後台商品管理皆使用 JSON Server 模擬 REST API：

```txt
GET /products
POST /products
PATCH /products/:id
DELETE /products/:id
POST /orders
GET /users?email=xxx
POST /users
```

正式部署環境中，商品資料使用 `mockProducts` 作為 fallback，會員註冊、會員登入、訂單建立與後台商品 CRUD 則使用前端 fallback 模擬操作成功，確保 GitHub Pages 線上 Demo 可以完整操作。

會員登入狀態、購物車與訂單資料目前使用 localStorage 模擬前端資料保存。

目前的會員 token 與後台管理員權限屬於前端 Route Guard 模擬，真實專案中仍需由後端 API 驗證使用者是否具備新增、編輯與刪除商品的權限。

若未來擴充，可將 JSON Server 替換為真實後端 API，並加入資料庫、密碼 hash、真實 token 驗證、金流串接、圖片上傳與後台訂單管理功能。