//Google Apps Script上でトリガーを設定するための関数
function setTrigger() {
  let triggers = ScriptApp.getScriptTriggers(); //設定しているトリガーを取得

  const STR_SET_TRIGGER = "setTrigger"; //このGoogle Apps Script上でトリガーを設定するための関数の名前
  const STR_CONTROL_SHEET = "controlSheets"; //@controlSheets.gs の controlSheets 関数
  
  //トリガー名をすべて取り出す処理
  for(let trigger of triggers){

    //トリガーを削除する
      ScriptApp.deleteTrigger(trigger);
      
  }

  let now = new Date(); //現在
  let nowYear = now.getFullYear(); //年度
  let nowMonth = now.getMonth(); //月
  let nowDate = now.getDate(); //日
  let nowDay = now.getDay()//曜日

  const TIMEZONE = "Asia/Tokyo"; //TimeZone の設定
  
  const TRIGGER_DAY = ScriptApp.WeekDay.MONDAY; //曜日の設定

  const WEEK_DAYS_NUM = 7; //一週間分の日付

  let hour = 0; //何時にトリガーを発生させるか

  const MINUTE = 0; //何分にトリガーを発生させるか

  //現在から一週間後の月曜日の hour 時 MINUTE 分 という時間
  let nextMondayDateZeros = new Date(nowYear,nowMonth,nowDate + WEEK_DAYS_NUM - dayObj(nowDay),hour,MINUTE);

  //controlSheets 関数を動かすトリガーの設定
  ScriptApp.newTrigger(STR_CONTROL_SHEET)
  .timeBased() //時間主導型
  .inTimezone(TIMEZONE) //TimeZone
  .at(nextMondayDateZeros) //nextMondayDateZeros の時間に
  .create(); //トリガーを設定

  hour = 1 //1 時を設定

  //setTrigger 関数を動かすトリガーの設定
  ScriptApp.newTrigger(STR_SET_TRIGGER)
  .timeBased() //時間主導型
  .inTimezone(TIMEZONE) //TimeZone
  .onWeekDay(TRIGGER_DAY) //毎週 TRIGGER_DAY 
  .atHour(hour) //hour 時に
  .create(); //トリガーを設定
  
}

//曜日の配列を調整するためのObject
function dayObj(nowDay) {

  // .getDay() で与えられる曜日に割り振られた番号に応じた番号の変更 曜日:新しい番号
  let newDayObj = {0:6,1:0,2:1,3:2,4:3,5:4,6:5}

  return newDayObj[nowDay];
}
