function setTrigger() {
  let triggers = ScriptApp.getScriptTriggers();
  
  for(let trigger of triggers){
    let triggerName = trigger.getHandlerFunction();
    if(triggerName != "setTrigger") {
      ScriptApp.deleteTrigger(trigger);
    }
  }


  let now = new Date();
  let y = now.getFullYear();
  let m = now.getMonth();
  let d = now.getDate();

  var timezone = "Asia/Tokyo";

  const date = new Date(y,m,d+7,0,0);

  ScriptApp.newTrigger("controlSheets")
  .timeBased()
  .inTimezone(timezone)
  .at(date)
  .create()
  
}


