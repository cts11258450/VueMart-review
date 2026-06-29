# VueMart Review

## 線上 Demo

[點此查看線上作品](https://cts11258450.github.io/VueMart-review/)
 

VueMart Review 是一個使用 Vue 3、Vue Router 與 Pinia 製作的前端電商作品。

專案包含商品列表、商品詳情、購物車、會員登入、結帳流程、訂單建立、會員訂單紀錄與訂單詳情等功能。

這個專案主要用來練習 Vue 3 Composition API、元件拆分、狀態管理、路由管理、表單驗證、localStorage 資料保存，以及完整的前端購物流程。

---

## 專案畫面截圖

> 截圖準備中，之後可補上實際作品畫面。

### 首頁 / 商品列表

![首頁](./screenshots/home.png)

## 專案畫面截圖

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

### 訂單成立
![訂單成立](./screenshots/order-success.png)

### 訂單成立畫面 2
![訂單成立畫面 2](./screenshots/order-success-1.png)

### 訂單紀錄
![訂單紀錄](./screenshots/orderHistory.png)

### 訂單詳情
![訂單詳情](./screenshots/orderDetail.png)

---



## 專案特色

- 使用 Vue 3 Composition API 開發
- 使用 Vue Router 建立多頁式前端路由
- 使用 Pinia 管理商品、購物車、會員、訂單與 Toast 狀態
- 使用 localStorage 保存購物車、登入狀態與訂單資料
- 支援商品搜尋、分類篩選與價格排序
- 支援商品詳情頁與動態路由
- 支援購物車加入、移除、數量調整與庫存上限判斷
- 支援會員登入、登出與 Route Guard 權限保護
- 支援結帳表單驗證與送出 loading 狀態
- 支援訂單建立、訂單成功頁、我的訂單與訂單詳情
- 支援非本人訂單權限判斷
- 完整處理空狀態與錯誤狀態
- 具備 RWD 響應式版面

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
productStore：商品資料
cartStore：購物車資料
authStore：會員登入狀態
orderStore：訂單資料
toastStore：提示訊息
```

這讓資料責任更清楚，也方便不同頁面共用狀態。

### 3. 使用 Vue Router 建立權限保護

專案使用 Route Guard 保護會員頁面與結帳流程：

```txt
未登入使用者
→ 進入 /checkout、/member、/orders
→ 自動導向 /login

登入成功後
→ 回到原本想前往的頁面
```

### 4. 使用 localStorage 模擬資料持久化

購物車、登入狀態與訂單資料會保存到 localStorage。

重新整理頁面後，資料仍然可以保留，模擬常見的前端資料保存情境。

### 5. 完整處理空狀態與錯誤狀態

本專案處理多種例外情境：

```txt
找不到商品
空購物車
空結帳
沒有訂單
找不到訂單
非本人訂單
404 頁面
```

每個狀態都提供清楚說明與下一步操作，讓使用者不會卡住。

---

## 使用技術

- Vue 3
- Vite
- Vue Router
- Pinia
- JavaScript
- HTML
- CSS
- localStorage

---

## 功能列表

### 商品功能

- 商品列表
- 商品詳情頁
- 商品搜尋
- 商品分類篩選
- 商品價格排序
- 商品找不到狀態
- 售完商品狀態
- 庫存上限判斷

### 購物車功能

- 加入購物車
- 同商品數量累加
- 商品數量增加與減少
- 商品數量歸零時移除
- 移除單一商品
- 清空購物車
- 購物車總數量
- 購物車總金額
- 購物車 localStorage 保存
- 空購物車狀態

### 會員功能

- 會員登入
- 會員登出
- 登入狀態保存
- 顯示會員名稱
- Route Guard 權限保護
- 未登入導向登入頁
- 登入後導回原本想去的頁面
- 已登入時避免重複進入登入頁

### 結帳功能

- 收件人姓名驗證
- 手機號碼格式驗證
- 收件地址驗證
- 付款方式選擇
- 訂單備註
- 送出訂單 loading 狀態
- 防止重複送出
- 空購物車不可結帳

### 訂單功能

- 建立訂單
- 訂單成功頁
- 我的訂單列表
- 訂單詳情頁
- 只顯示目前會員自己的訂單
- 最新訂單排序在最上方
- 找不到訂單狀態
- 非本人訂單權限阻擋

### UI / UX

- Toast 操作提示
- 空狀態畫面
- 錯誤狀態畫面
- 高對比文字設計
- RWD 響應式版面
- 手機版按鈕與卡片排版優化

---

## 頁面路由

| 路徑 | 功能 |
| --- | --- |
| `/` | 首頁 |
| `/product` | 商品列表 |
| `/product/:id` | 商品詳情 |
| `/cart` | 購物車 |
| `/checkout` | 結帳頁面 |
| `/login` | 登入頁面 |
| `/member` | 會員中心 |
| `/orders` | 我的訂單 |
| `/orders/:id` | 訂單詳情 |
| `/order-success/:id` | 訂單成功頁 |
| `/:pathMatch(.*)*` | 404 Not Found |

---

## 測試帳號

本專案使用模擬登入，不串接真實後端 API。

```txt
Email：可輸入任意 Email
Password：123456
```

登入成功後，系統會建立假的 token 並保存至 localStorage。

---

## 安裝與啟動

### 1. 安裝套件

```bash
npm install
```

### 2. 啟動開發伺服器

```bash
npm run dev
```

### 3. 建立正式版

```bash
npm run build
```

### 4. 預覽正式版

```bash
npm run preview
```

---

## 專案資料保存方式

本專案使用 localStorage 模擬前端資料保存：

| key | 用途 |
| --- | --- |
| `cart` | 保存購物車資料 |
| `orders` | 保存訂單資料 |
| `token` | 保存登入 token |
| `user` | 保存會員資料 |

---

## 專案學習重點

這個專案主要練習以下 Vue 前端開發能力：

- 使用 Vue 3 Composition API 管理元件邏輯
- 使用 props / emit 拆分元件責任
- 使用 computed 管理衍生資料
- 使用 watch 監聽資料並同步 localStorage
- 使用 Pinia 管理跨元件狀態
- 使用 Vue Router 建立多頁路由
- 使用動態路由取得商品與訂單資料
- 使用 Route Guard 控制登入權限
- 使用 localStorage 模擬資料持久化
- 使用表單驗證處理使用者輸入
- 使用條件渲染處理空狀態與錯誤狀態
- 使用 RWD CSS 優化手機版畫面

---

## 專案狀態

目前已完成主要電商流程：

```txt
商品瀏覽
→ 商品詳情
→ 加入購物車
→ 結帳
→ 建立訂單
→ 訂單成功
→ 我的訂單
→ 訂單詳情
```

---

## 未來可擴充方向

- 串接後端 API
- 加入真實會員註冊與登入
- 串接資料庫保存商品與訂單
- 加入管理後台
- 加入商品新增、編輯、刪除功能
- 加入訂單狀態管理
- 加入金流串接
- 加入圖片上傳功能
- 加入收藏商品功能
- 加入商品評價功能

---

## 備註

此專案目前為前端練習作品，資料皆儲存在瀏覽器 localStorage。

若未來擴充，可加入後端 API、資料庫、真實會員系統、金流串接與管理後台。