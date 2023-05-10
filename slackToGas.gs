function doPost(e) {

  const STR_SHEET_NAME_ERROR = "SHEET_NAME_ERROR";
  const STR_TIME_SELECT_ERROR = "TIME_SELECT_ERROR";
  const STR_RESERVED_ERROR = "RESERVED_ERROR";

  const STR_COMPLETE_RESERVATION = "COMPLETE_RESERVATION";

  const FORM_DATA_SHEET_NAME = "formdata";
  
  const data_spreadsheet_id = givePropertiesService().getProperty("data_spreadsheet_id");
  const referenceSourceSheet = SpreadsheetApp.openById(data_spreadsheet_id);
  let sheet = referenceSourceSheet.getSheetByName(FORM_DATA_SHEET_NAME); //参照元シートを取得

  const payload  = JSON.parse(e["parameter"]["payload"]);

  const clickUser = payload["user"];
  const clickUserId = clickUser["id"];


  const typeActions = payload["actions"][0];

    if(typeActions["value"] == "button"){

    const typeState = payload["state"]["values"];
    const typeInputs = getObj_inValue(typeState);

    const statSelectSeat = typeInputs["static_select-action-seat"];
    const statSelectTs = typeInputs["static_select-action-ts"];
    const statSelectTe = typeInputs["static_select-action-te"];
    const datePicker = typeInputs["datepicker-action"];
    const checkBox = typeInputs["checkboxes-action"];


    let sSSVal = statSelectSeat["selected_option"];
    let sTSVal = statSelectTs["selected_option"];
    let sTEVal = statSelectTe["selected_option"];
    let dPVal = datePicker["selected_date"];
    let cBVal = checkBox["selected_options"][0];

    const requirementCheckArray = [clickUserId,sSSVal,sTSVal,sTEVal,dPVal];

    if(requirementCheckArray.includes(null)){
      const NONE_REQUIREMENT_MESSAGE = "必要事項が記入されていません !";
      warnMessage(clickUserId,NONE_REQUIREMENT_MESSAGE);
      return;
    }
    else{

      sSSVal = sSSVal["value"];
      sSSVal = sSSVal.split("value-");
      sTSVal = sTSVal["value"];
      sTSVal = sTSVal.split("value-");
      sTEVal = sTEVal["value"];
      sTEVal = sTEVal.split("value-");
      dPVal = dPVal.split("-");

      if(cBVal) {
        cBVal = cBVal.value;

      }
      const timeArray = ["7:00","8:00","9:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00"];

      const year = dPVal[0];
      const month = dPVal[1].replace(/^0+/, "");
      const day = dPVal[2].replace(/^0+/, "");

      dPVal = year + "年" + month + "月" + day + "日";

      let registerDataArray = [clickUserId,sSSVal[1],sTSVal[1],sTEVal[1],dPVal,cBVal];

      const userName = getSlackUserInfo(clickUserId)[0]; //@getUserInfo.gs

      registerDataArray.unshift(userName);

      //データの表示のためのObj
      const displayData = [userName,clickUserId,sSSVal[1]-1,timeArray[sTSVal[1]],timeArray[sTEVal[1]],dPVal,cBVal];

      sheet.getRange(sheet.getLastRow() + 1,1,1,displayData.length).setValues([displayData]);

      const result = processData(registerDataArray);

      //processData 関数を用いてデータを処理する @processDataFunc.gs
      if(result == STR_TIME_SELECT_ERROR){
        const INVALID_USE_TIME_MESSAGE = "正しい利用開始予定時間と利用終了予定時間を選択してください。";
        warnMessage(clickUserId,INVALID_USE_TIME_MESSAGE);
      };

      if(result[0] == STR_SHEET_NAME_ERROR){
        const INVALID_USE_DATE_MESSAGE = "正しい利用年月日を選択してください";
        warnMessage(clickUserId,INVALID_USE_DATE_MESSAGE);
        
        const AVAILABLE_START_DATE = result[1];
        const AVAILABLE_END_DATE = result[2]

        const NOTIFY_AVAILABLE_DATE_MESSAGE = "選択可能な利用年月日は、\n" + AVAILABLE_START_DATE + "~" + AVAILABLE_END_DATE + "\nの間です。";
        warnMessage(clickUserId,NOTIFY_AVAILABLE_DATE_MESSAGE);
      };

      if(result[0] == STR_RESERVED_ERROR){
        const NOTIFY_RESERVED_TIME_MESSAGE = "既に予約済みの時間帯があります。";
        warnMessage(clickUserId,NOTIFY_RESERVED_TIME_MESSAGE);
        const NOTIFY_ACTUAL_RESERVED_TIME_MESSAGE = "予約済みの利用予定時間は、\n" + result[1] + "\nです。\nこの時間帯以外の予約をお願いします。";
        warnMessage(clickUserId,NOTIFY_ACTUAL_RESERVED_TIME_MESSAGE);
      };

      if(result[0] == STR_COMPLETE_RESERVATION){
        const NOTIFY_YOUR_RESERVED_INFO_MESSAGE = result[1];
        warnMessage(clickUserId,NOTIFY_YOUR_RESERVED_INFO_MESSAGE);
      };
      
      return;

    }
  }

}

//値に含まれる各Objectを取り出し、それらをまとめてObjectとして出力する特殊な関数
function getObj_inValue(obj){
  const obj_inValue= 
  Object.entries(obj).map(([innerKey,innerValue]) => {
    return innerValue;
  });

  const mergeObj = obj_inValue.reduce((acc,obj) => {
    return Object.assign(acc,obj);
  },{});

  return mergeObj;
}

function warnMessage(userid,message) {

  postDirectMessage(userid,message);

  return;

}

function postDirectMessage(userid,message) {

  const channel_id = getDM_ChannelId(userid);

  postMessage(userid,message,channel_id);

  return;
  

}

function getDM_ChannelId(userid){

  const prop = givePropertiesService();
  let url = "https://slack.com/api/conversations.open";

  const OAuth_token = prop.getProperty("OAuth_token");
  
  let payload = {
    "token" : OAuth_token,
    "users" : userid
  };

  let params = {
    "method" : "post",
    "payload" : payload
  };

  const response = UrlFetchApp.fetch(url,params);

  const data = JSON.parse(response.getContentText());
  Logger.log(response);
  const channel_id = data.channel.id;

  return channel_id;
}

function postMessage(userid,message,channel_id) {
  const prop = givePropertiesService();
  const url = "https://slack.com/api/chat.postMessage";

  const OAuth_token = prop.getProperty("OAuth_token");
  
  let payload = {
    "token" : OAuth_token,
    "channel" : channel_id,
    "text" : "<@"+ userid + ">\n" + message
  };
  
  let params = {
    "method" : "post",
    "payload" : payload
  };
  
  // Slackに投稿する
  UrlFetchApp.fetch(url, params);
  

}

function givePropertiesService(){
  const prop = PropertiesService.getScriptProperties();
  return prop
}
