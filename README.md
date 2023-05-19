# Seat-Reservation.ver1
Google Apps Script で書き、Slack API と連携させた座席予約用のアプリケーション (ver1) です。

座席の取り合いになることを回避する目的で作成しました。

## Preview
<div>
  <p align="center">
    <img width="80%"src="https://github.com/Fuyuki006/Seat-Reservation/assets/125243602/55e8ebad-a11e-4940-9c5c-6c8196a1314d">
  </p>
</div>
                                                                                                                           
<div display="flex">
  <p align="center">
    <img width="40%" src="https://github.com/Fuyuki006/Seat-Reservation/assets/125243602/edac7444-c6fa-45b4-a2c7-a48f39659284">  
    <img width="40%" src="https://github.com/Fuyuki006/Seat-Reservation/assets/125243602/90136db1-58fb-4df1-ac55-98d93a61e1e8">
  </p>
</div>

## 使用している技術

### Google Apps Script
- サーバーレスでアプリケーションが作成できること
- 見やすさの面も考慮して、座席の予約状況を管理するだけなら Google スプレッドシートで十分

という点から使用。

### Slack API
- コミュニケーションツールとして、Slack が使用されていた

という点から使用。

## 改善点
- 座席予約のためのSlack 上にある UI
- 座席予約状況の表示 (配色)
- プログラムの可読性
