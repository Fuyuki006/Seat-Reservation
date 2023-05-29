//Google Apps Script上でトリガーを設定するための関数
function setTrigger() {
  let triggers = ScriptApp.getScriptTriggers(); //設定しているトリガーを取得

  const STR_SET_TRIGGER = "setTrigger"; //このGoogle Apps Script上でトリガーを設定するための関数の名前
  const STR_CONTROL_SHEET = "controlSheets"; //@controlSheets.gs の controlSheets 関数
  
  //トリガー名をすべて取り出す処理
  for(let trigger of triggers){
    let triggerName = trigger.getHandlerFunction(); //名前を取り出す

    //このトリガー以外を削除する
    if(triggerName != STR_SET_TRIGGER) {
      ScriptApp.deleteTrigger(trigger);
    }
  }


  let now = new Date(); //現在
  let nowYear = now.getFullYear(); //年度
  let nowMonth = now.getMonth(); //月
  let nowDate = now.getDate(); //日

  const TIMEZONE = "Asia/Tokyo"; //TimeZone の設定
  
  const TRIGGER_DAY = ScriptApp.WeekDay.MONDAY; //曜日の設定

  const WEEK_DAYS_NUM = 7; //一週間分の日付

  let hour = 0; //何時にトリガーを発生させるか

  const MINUTE = 0; //何分にトリガーを発生させるか

  //現在から一週間後の hour 時 MINUTE 分 という時間
  let nextWeekDateZeros = new Date(nowYear,nowMonth,nowDate + WEEK_DAYS_NUM,hour,MINUTE);

  //controlSheets 関数を動かすトリガーの設定
  ScriptApp.newTrigger(STR_CONTROL_SHEET)
  .timeBased() //時間主導型
  .inTimezone(TIMEZONE) //TimeZone
  .at(nextWeekDateZeros) //nextWeekDateZeros の時間に
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
