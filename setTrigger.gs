function setTrigger() {
  let triggers = ScriptApp.getScriptTriggers();

  const STR_SET_TRIGGER = "setTrigger";
  const STR_CONTROL_SHEET = "controlSheets";
  
  for(let trigger of triggers){
    let triggerName = trigger.getHandlerFunction();
    if(triggerName != STR_SET_TRIGGER) {
      ScriptApp.deleteTrigger(trigger);
    }
  }


  let now = new Date();
  let nowYear = now.getFullYear();
  let nowMonth = now.getMonth();
  let nowDate = now.getDate();

  const TIMEZONE = "Asia/Tokyo";

  const WEEK_DAYS_NUM = 7;

  const HOUR = 0;

  const MINUTE = 0;

  const nextWeekDateZeros = new Date(nowYear,nowMonth,nowDate + WEEK_DAYS_NUM,HOUR,MINUTE);

  ScriptApp.newTrigger(STR_CONTROL_SHEET)
  .timeBased()
  .inTimezone(TIMEZONE)
  .at(nextWeekDateZeros)
  .create();
  
}


