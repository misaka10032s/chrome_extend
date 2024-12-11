# 使用說明
1. 新增分頁 chrome://extensions/
2. 點集左上"載入未封裝項目"
3. 選擇NStools資料夾
4. 完成

# contextMenus功能
1. 開啟插件
   - 目前沒啥作用，只是為了測試
2. 重載失敗圖片
   - 作用於page
   - 重載失敗載入的圖片
3. 解除反白限制
    - 作用於page
    - 解除反白限制
4. 試聽 dlsite ASMR
    - 作用於page
    - 試聽dlsite ASMR
    - 僅在dlsite網域出現
5. 快速上車(Nhentai, Wnacg, Pixiv)
    - 作用於selection
    - 選取 N+數字 導向Nhentai
    - 選取 W+數字 導向Wnacg
    - 選取 P+數字 導向Pixiv
6. 使用 N-hentai搜尋
    - 作用於selection
    - 選取文字搜尋N-hentai
7. 使用 Wnacg搜尋
    - 作用於selection
    - 選取文字搜尋Wnacg
8. 前往選取網址
    - 作用於selection
    - 選取文字前往網址，並自動去除空白
9. 使用 saucenao搜尋圖片
    - 作用於image
    - 使用saucenao搜尋圖片
10. 使用 ascii2d搜尋圖片
    - 作用於image
    - 使用ascii2d搜尋圖片
11. 取得巴哈姆特圖片
    - 作用於page
    - 取得巴哈姆特文章圖片連結，並存在剪貼簿
    - 僅在巴哈姆特網域出現
12. 匯出chatGPT圖片
    - 作用於page
    - 匯出chatGPT聊天為圖片
    - 僅在chatGPT網域出現
13. 解析QRcode
    - 作用於image
    - 解析QRcode出現在右上方sweetalert toast對話框 可以複製文字
14. pixiv: 下載所有圖片 (目前無法使用)
    - 作用於page
    - 下載pixiv所有圖片
    - 僅在pixiv網域出現


# redirectOptions功能
1. 把所有網址的fbclid從query string移除
2. 把推特網址的t, s從query string移除


# omnibox功能
1. 在網址列輸入 "ns" 後輸入 <number> <currencyA> to <currencyB> 來查詢匯率 (ex: ns 100 twd to jpy) 支援 NTD(=TWD) 和 RMB(=CNY)



# for developers
## NStools/static/moudle/settings.js
- contextMenus: 設定右鍵選單
- redirectOptions: 設定網址導向(不會重新整理)

## NStools/static/moudle/script.js
- 實作settings.js的功能
- 為了讓settings.js更為簡潔

## NStools/static/moudle/store.js
- 儲存一些全域變數

## NStools/static/moudle/methods.js
- 核心程式，基本上不會更動


## NStools/static/js/html2canvas.js
- 把html轉成canvas的外部程式庫

## NStools/static/js/QrcodeDecoder.js
- 解析QRcode的外部程式庫

## NStools/static/js/sweetalert2@11.js
- 顯示toast的外部程式庫