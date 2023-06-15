# Seat-Reservation.ver1
Google Apps Script で書き、Slack API と連携させた座席予約用のアプリケーション (ver1) です。

座席の取り合いになることを回避する目的で作成しました。

その週の期間内での座席予約が可能で、その期間は毎週更新されます。

## プレビュー

### images
<div>
  <p align="center">
    <img width="80%"src="https://github.com/Fuyuki006/Seat-Reservation/assets/125243602/17531328-6592-4389-9a9b-79bfc41d0008">
  </p>
</div>
                                                                                                                           
<div display="flex">
  <p align="center">
    <img width="40%" src="https://github.com/Fuyuki006/Seat-Reservation/assets/125243602/c7dd377c-bc7a-4408-91e1-4e9900bc228a">  
    <img width="40%" src="https://github.com/Fuyuki006/Seat-Reservation/assets/125243602/7da9d42c-edb5-4ab2-8bb0-594321cfe188">
  </p>
</div>

### gifs

#### 座席の予約
フォームでの操作
![download](https://github.com/Fuyuki006/Seat-Reservation/assets/125243602/3ff09fcc-7a9f-4fd7-bc1f-f0e21fba2248)


#### 実装手順
Slack に埋め込んだ、座席を確認するためのスプレッドシート上での確認
![download](https://github.com/Fuyuki006/Seat-Reservation/assets/125243602/1d785254-302c-4519-b1b5-428ae09def4f)

#### Errors

必要事項の未記入
![download](https://github.com/Fuyuki006/Seat-Reservation/assets/125243602/dc1ace66-4016-42b0-9b57-43843e54f885)

その週以外の日付の選択
![download](https://github.com/Fuyuki006/Seat-Reservation/assets/125243602/72b4419a-7582-439e-8283-a7af931e62a6)

## 実装手順
- ソース(Google Apps Script) のダウンロード
1. [Node.js](https://nodejs.org/en/download) バージョン 4.7.4 以降のインストール
2. Google Apps Script API を オン にする。[こちらから](https://script.google.com/home/usersettings)。
3. Git Bash 上で以下のコマンドを実行

リポジトリ等のインストール
```bash
git clone https://github.com/Fuyuki006/Seat-Reservation.git
cd Seat-Reservation
npm install
```

[clasp](https://github.com/google/clasp) へのログイン
```bash
npm run login
```

ソース用スプレッドシートの作成等
```bash
npm run setup
```

作成したスプレッドシートへのデプロイ
```bash
npm run deploy
```

- <a id="description_create_sheet"></a>他のスプレッドシートの作成
1. [こちらから](https://drive.google.com/drive/my-drive)、新規 -> Google スプレッドシート で新しいスプレッドシートを作成する
2. スプレッドシートの URL で `https://docs.google.com/spreadsheets/d/<スプレッドシートのID>/edit` にある スプレッドシートのID を控えておく
3. 1\. と 2. の操作を [座席を確認するためのスプレッドシート](#実装手順) と 座席のデータを管理するためのスプレッドシート の 2枚分 繰り返す

- <a id="slack_api_settings_1"></a>Slack API の設定-1
1. [こちら](https://api.slack.com/apps)にアクセス
2. Create New App -> From an app manifest を選択
3. アプリを動作させる Slack ワークスペースを選択
4. JSON に manifest.json の中身をコピー & ペースト
5. 「Create」 する
6. Settings の Install App -> Install Workspace を許可して、ワークスペースに追加
7. <a id="link7"></a>Features の OAuth & Permissions にある OAuth Tokens for Your Workspace で 「xoxb-」から始まる Bot User OAuth Token を控えておく

- スクリプトプロパティの設定
1. [こちら](https://drive.google.com/drive/my-drive)にアクセスし、先ほど作成されたソース用スプレッドシート(seat-reservation-srcという名前のスプレッドシート) を開く
2. 拡張機能 -> Apps Script で Google Apps Scriptを開く
3. <a id="property_settings"></a>歯車のマーク(プロジェクトの設定)から、「スクリプトプロパティを追加」で以下のプロパティを設定

| プロパティ名 | プロパティの値 |
| ----------- | ------------- |
| OAUTH_TOKEN | [Bot User OAuth Token (xoxb-...)](#link7) |
| CHANNEL_ID | [フォーム](#座席の予約) を送信する Slack のワークスペースにある任意の チャンネルID |
| CHECK_SPREADSHEET_ID | [こちら](#description_create_sheet) で控えた 座席を確認するためのスプレッドシート の スプレッドシートID |
| DATA_SPREADSHEET_ID | [こちら](#description_create_sheet) で控えた 座席のデータを管理するためのスプレッドシート の スプレッドシートID |

- Google Apps Script のデプロイ
1. ソース用スプレッドシート(seat-reservation-src) を開く
2. 以下の画像の赤枠にある「共有」を押す

<div display="flex">
  <p align="center">
    <img src="https://github.com/Fuyuki006/Seat-Reservation/assets/125243602/fa367035-7c12-4385-973b-72efeb0c39fa"> 
  </p>
</div>

3. 以下の画像にある「一般的なアクセス」で「リンクを知っている全員」にする

<div display="flex">
  <p align="center">
    <img width=50% height=50% src="https://github.com/Fuyuki006/Seat-Reservation/assets/125243602/c7df3f13-ed47-4b13-9ae2-477a08179b6e"> 
  </p>
</div>

4. ソース用スプレッドシート(seat-reservation-src) のシートの画面に戻る
5. 拡張機能 -> Apps Script で Google Apps Scriptを開く
6. 以下の画像の「デプロイ」を押し、赤枠の「新しいデプロイ」を押す

<div display="flex">
  <p align="center">
    <img src="https://github.com/Fuyuki006/Seat-Reservation/assets/125243602/9c10d5c3-d268-4990-b6b6-db80ef095839"> 
  </p>
</div>

7. 下の画像の歯車のアイコンから「ウェブアプリ」を選択

<div display="flex">
  <p align="center">
    <img width=50% height=50% src="https://github.com/Fuyuki006/Seat-Reservation/assets/125243602/a9e6570b-a794-4d08-8106-0e2ff00c6357"> 
  </p>
</div>

8. 「アクセスできるユーザー」を「全員」に変更する (Slack APIで利用可能にするため)

<div display="flex">
  <p align="center">
    <img width=50% height=50% src="https://github.com/Fuyuki006/Seat-Reservation/assets/125243602/00591276-deb1-4897-a573-201c550b1bd1"> 
  </p>
</div>

9. 「デプロイ」する

<div display="flex">
  <p align="center">
    <img width=50% height=50% src="https://github.com/Fuyuki006/Seat-Reservation/assets/125243602/e862e88d-1788-4813-bec5-148a645bb79b"> 
  </p>
</div>

10. アクセスを承認する必要がある場合は承認する

<div display="flex">
  <p align="center">
    <img width=50% height=50% src="https://github.com/Fuyuki006/Seat-Reservation/assets/125243602/424aaf7e-a14f-4565-8716-db572c131420"> 
  </p>
</div>

11. <a id="refrain_url"></a>「ウェブアプリ」の URLを「コピー」するか控えておく

<div display="flex">
  <p align="center">
    <img width=50% height=50% src="https://github.com/Fuyuki006/Seat-Reservation/assets/125243602/8b793fdc-ee93-432a-8796-a65b1052a0e4"> 
  </p>
</div>

- Slack API の設定-2
1. [こちらから](https://api.slack.com/apps)、「Slack API の設定-1」 で「Create New App」した「App」の画面に戻る
2. 「Features」の「Interactivity & Shortcuts」

<div display="flex">
  <p align="center">
    <img src="https://github.com/Fuyuki006/Seat-Reservation/assets/125243602/556bf8d5-4ab8-42f8-bd50-822253c99c5a"> 
  </p>
</div>

3. 「Interactivity & Shortcuts」を 「On」にする

<div display="flex">
  <p align="center">
    <img src="https://github.com/Fuyuki006/Seat-Reservation/assets/125243602/a6e3d8dc-8168-40b9-b4c0-d68e2a640bad"> 
  </p>
</div>

4. 「Google Apps Script のデプロイ」の「[11.「ウェブアプリ」の URLを「コピー」するか控えておく](#refrain_url)」で控えた URL を「Request URL」の下の入力欄に入力する
5. 「Save Changes」を押す

<div display="flex">
  <p align="center">
    <img src="https://github.com/Fuyuki006/Seat-Reservation/assets/125243602/13c6810e-a0a3-441e-bc1d-60a4839a0c32"> 
  </p>
</div>

- Google Apps Script からのフォームの送信
1. [こちら](#property_settings)で「CHANNEL_ID」に設定した「Slack のワークスペースにある任意のチャンネル」に移動
2. チャンネル名をクリック

<div display="flex">
  <p align="center">
    <img src="https://github.com/Fuyuki006/Seat-Reservation/assets/125243602/83df0824-5a2e-47f2-b06b-ed6ec34227bf"> 
  </p>
</div>

3. 「インテグレーション」をクリック

<div display="flex">
  <p align="center">
    <img src="https://github.com/Fuyuki006/Seat-Reservation/assets/125243602/e4d96f97-3ac2-44bb-a083-972f1ff69fed"> 
  </p>
</div>

4. 「アプリを追加する」をクリック

<div display="flex">
  <p align="center">
    <img src="https://github.com/Fuyuki006/Seat-Reservation/assets/125243602/a9b91807-7732-4c11-bff1-6b79562480ab"> 
  </p>
</div>
## 注意



## 使い方
-　

## 使用している技術

### Google Apps Script
- サーバーレスでアプリケーションが作成できること
- 見やすさの面も考慮して、座席の予約状況を管理するだけなら Google スプレッドシートで十分

という点から使用。

### Slack API
- コミュニケーションツールとして、Slack が使用されていた
- Slack で既に備わっている便利な機能も使えたから (メンション，DMなど)

という点から使用。

## 主な機能
- 座席の予約
- 予約の確認
- スプレッドシートの自動更新 (予約確認のためのシート)


## 改善点
- 座席予約のためのSlack 上にある UI
- 座席予約状況の表示 (配色)
- 機能の追加 (削除機能など)
- プログラムの可読性
  - パラメータ用の Script
- README は 必要な情報のみに絞る (それ以外は記事に)
