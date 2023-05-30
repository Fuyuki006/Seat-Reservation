# Seat-Reservation.ver1
Google Apps Script で書き、Slack API と連携させた座席予約用のアプリケーション (ver1) です。

座席の取り合いになることを回避する目的で作成しました。

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

- 他のスプレッドシートの作成
1. [こちらから](https://drive.google.com/drive/my-drive)、新規 -> Google スプレッドシート で新しいスプレッドシートを作成する。
2. スプレッドシートの URL で "https://docs.google.com/spreadsheets/d/<スプレッドシートのID>/edit" にある スプレッドシートのID を控えておく。
3. 1\. と 2. の操作を [座席を確認するためのスプレッドシート](#実装手順) と 座席のデータを管理するためのシート の 2枚分 繰り返す。
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
