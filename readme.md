# 使用說明
1. 新增分頁 chrome://extensions/
2. 點集左上"載入未封裝項目"
3. 選擇NStools資料夾
4. 完成

# contextMenus功能
1. 開啟插件
   - 目前沒啥作用，只是為了測試
1. 重載失敗圖片
   - 作用於page
   - 重載失敗載入的圖片
1. 解除反白限制
    - 作用於page
    - 解除反白限制
1. 試聽 dlsite ASMR
    - 作用於page
    - 試聽dlsite ASMR
    - 僅在dlsite網域出現
1. 快速上車(Nhentai, Wnacg, Pixiv)
    - 作用於selection
    - 選取 N+數字 導向Nhentai
    - 選取 W+數字 導向Wnacg
    - 選取 P+數字 導向Pixiv
1. 使用 N-hentai搜尋
    - 作用於selection
    - 選取文字搜尋N-hentai
1. 使用 Wnacg搜尋
    - 作用於selection
    - 選取文字搜尋Wnacg
1. 前往選取網址
    - 作用於selection
    - 選取文字前往網址，並自動去除空白
1. 使用 saucenao搜尋圖片
    - 作用於image
    - 使用saucenao搜尋圖片
1. 使用 ascii2d搜尋圖片
    - 作用於image
    - 使用ascii2d搜尋圖片
1. 使用 trace.me搜尋圖片片源
    - 作用於image
    - 使用trace.me搜尋圖片片源
1. 取得巴哈姆特圖片
    - 作用於page
    - 取得巴哈姆特文章圖片連結，並存在剪貼簿
    - 僅在巴哈姆特網域出現
1. 下載巴哈姆特圖片
    - 作用於page
    - 取得巴哈姆特文章圖片連結，並一次下載
    - 僅在巴哈姆特網域出現
1. 匯出chatGPT圖片
    - 作用於page
    - 匯出chatGPT聊天為圖片
    - 僅在chatGPT網域出現
1. 解析QRcode
    - 作用於image
    - 解析QRcode出現在右上方sweetalert toast對話框 可以複製文字
1. pixiv: 下載所有圖片
    - 作用於page
    - 下載pixiv所有圖片
    - 僅在pixiv網域出現
1. 移除iopenmall R18遮擋圖
    - 作用於page
    - 移除iopenmall R18遮擋圖
    - 僅在iopenmall網域出現


# redirectOptions功能
1. 把所有網址的fbclid從query string移除
2. 把推特網址的t, s從query string移除


# omnibox(url搜尋欄位)功能
1. 在網址列輸入 "ns" 後輸入 <number> <currencyA> to <currencyB> 來查詢匯率 (ex: ns 100 twd to jpy) 支援 NTD(=TWD) 和 RMB(=CNY)


# key設定
1. 在 NStools 建立資料夾 secret
2. 在 secret 建立檔案 key.js
3. 在 key.js 輸入以下程式碼
```javascript
export default {
    "exchangerate-api.com": "your key", // 匯率查詢
    ...
}
```



# for developers
## NStools/static/module/menu.js
- contextMenus: 設定右鍵選單
- redirectOptions: 設定網址導向(不會重新整理)

## NStools/static/module/menu.js
- 實作menu.js的功能
- 為了讓menu.js更為簡潔

## NStools/static/module/utils.js
- 一些共用的function，給menu.js使用

## NStools/static/module/store.js
- 儲存一些全域變數

## NStools/static/module/core.js
- 核心程式，基本上不會更動


## NStools/static/js/html2canvas.js
- 把html轉成canvas的外部程式庫

## NStools/static/js/QrcodeDecoder.js
- 解析QRcode的外部程式庫

## NStools/static/js/sweetalert2@11.js
- 顯示toast的外部程式庫







# 開啟應用程式設定步驟

> manifest.json 需要權限: nativeMessaging

幾個自定義變數
- <route-to-native-messaging-host.json>：Native Messaging Host 的設定檔
- <com.mycompany.exelauncher>：Native Messaging Host 的名稱
- <path-to-your-executable>：你的可執行檔的路徑，可以絕對路徑或相對路徑，相對路徑是跟據"Native Messaging Host 的設定檔"，可以.exe 或 .py(如果有安裝 Python)
- <your-extension-id>：你的 Chrome 擴充功能 ID

1. 設定 registry
   - 將以下內容儲存成.json，並放在 <route-to-native-messaging-host.json>
   - 將 `<your-extension-id>` 替換為你的 Chrome 擴展 ID

```json
{
    "name": "<com.mycompany.exelauncher>",
    "description": "Native messaging host for ExeLauncher",
    "path": "<path-to-your-executable>",
    "type": "stdio",
    "allowed_origins": [
        "chrome-extension://<your-extension-id>/"
    ]
}
```

2. 設定 registry
   - 將以下內容儲存為 `隨便.reg`，並執行以新增到 Windows Registry 中

```reg
Windows Registry Editor Version 5.00

[HKEY_CURRENT_USER\Software\Google\Chrome\NativeMessagingHosts\<com.mycompany.exelauncher>]
@="<route-to-native-messaging-host.json>"
```

修改 reg name (wrongName 改成 correctName) 的方法
```reg
Windows Registry Editor Version 5.00

Windows Registry Editor Version 5.00

[-HKEY_CURRENT_USER\Software\Google\Chrome\NativeMessagingHosts\wrongName]

[HKEY_CURRENT_USER\Software\Google\Chrome\NativeMessagingHosts\correctName]
@="<route-to-native-messaging-host.json>"
```

3. <path-to-your-executable> python範例
```python
import sys
import struct
import json
import subprocess

def read_message():
    raw_length = sys.stdin.buffer.read(4)
    if len(raw_length) == 0:
        sys.exit(0)
    message_length = struct.unpack('=I', raw_length)[0]
    message = sys.stdin.buffer.read(message_length).decode('utf-8')
    return json.loads(message)

def send_message(message):
    encoded = json.dumps(message).encode('utf-8')
    sys.stdout.buffer.write(struct.pack('=I', len(encoded)))
    sys.stdout.buffer.write(encoded)
    sys.stdout.buffer.flush()

def main():
    message = read_message()
    if message.get("command") == "run":
        subprocess.Popen(["notepad.exe"])
        send_message({"status": "executed"})
    else:
        send_message({"status": "unknown command"})

if __name__ == "__main__":
    main()
```