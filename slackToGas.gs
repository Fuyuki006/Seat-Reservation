function doPost(e) {

  const STR_SHEET_NAME_ERROR = "SHEET_NAME_ERROR";
  const STR_TIME_SELECT_ERROR = "TIME_SELECT_ERROR";
  const STR_RESERVED_ERROR = "RESERVED_ERROR";

  const STR_COMPLETE_RESERVATION = "COMPLETE_RESERVATION";

  const FORM_DATA_SHEET_NAME = "formdata";

  //BLOCKS_ACTION_ID_NAME  @gasToSlack.gs で作成した blocks のそれぞれの action-id の 値
  const SEAT_ACTIONID = "static_select-action-seat";
  const TS_ACTIONID = "static_select-action-ts";
  const TE_ACTIONID = "static_select-action-te";
  const DATE_ACTIONID = "datepicker-action";
  const CHECK_ACTIONID = "checkboxes-action";

  const BUTTON_TYPE_NAME = "button";

  //selected 実際に選択された値を格納しているキー名
  const SEAT_OPTION = "selected_option";
  const TS_OPTION = "selected_option";
  const TE_OPTION = "selected_option";
  const DATE_OPTION = "selected_date";
  const CHECK_OPTION = "selected_options";

  const PAYLOAD_USER = "user";
  const PAYLOAD_ACTIONS = "actions";
  const PAYLOAD_STATE = "state";

  const CLICK_ID = "id";

  let dataSheet = giveDataSheet(FORM_DATA_SHEET_NAME)["sheet"]; //参照元シートを取得

  let payload  = JSON.parse(e["parameter"]["payload"]);

  let clickUser = payload[PAYLOAD_USER];
  let clickUserId = clickUser[CLICK_ID];


  let typeActions = payload[PAYLOAD_ACTIONS ][0];

  if(typeActions["value"] == BUTTON_TYPE_NAME){

    let typeState = payload[PAYLOAD_STATE]["values"];

    //入力されたデータを処理して typeInputs に保持
    let typeInputs = getCompressObj(typeState);

    let statSelectSeat = typeInputs[SEAT_ACTIONID];
    let statSelectTs = typeInputs[TS_ACTIONID];
    let statSelectTe = typeInputs[TE_ACTIONID];
    let datePicker = typeInputs[DATE_ACTIONID];
    let checkBox = typeInputs[CHECK_ACTIONID];


    let sSSVal = statSelectSeat[SEAT_OPTION];
    let sTSVal = statSelectTs[TS_OPTION];
    let sTEVal = statSelectTe[TE_OPTION];
    let dPVal = datePicker[DATE_OPTION];
    let cBVal = checkBox[CHECK_OPTION][0];

    let requirementCheckArray = [clickUserId,sSSVal,sTSVal,sTEVal,dPVal];

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
      let year = dPVal[0];
      let month = dPVal[1].replace(/^0+/, "");
      let day = dPVal[2].replace(/^0+/, "");

      dPVal = year + "年" + month + "月" + day + "日";

      let registerDataArray = [clickUserId,sSSVal[1],sTSVal[1],sTEVal[1],dPVal,cBVal];

      let userName = getSlackUserInfo(clickUserId)[0]; //@getUserInfo.gs

      registerDataArray.unshift(userName);

      let timeArray = ["7:00","8:00","9:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00"];

      //データの表示のためのObj
      let displayData = [userName,clickUserId,sSSVal[1]-1,timeArray[sTSVal[1]],timeArray[sTEVal[1]],dPVal,cBVal];

      dataSheet.getRange(dataSheet.getLastRow() + 1,1,1,displayData.length).setValues([displayData]);

      let result = processData(registerDataArray);

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

        const RESERVED_TIME = result[1];

        const NOTIFY_ACTUAL_RESERVED_TIME_MESSAGE = "予約済みの利用予定時間は、\n" + RESERVED_TIME + "\nです。\nこの時間帯以外の予約をお願いします。";
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
function getCompressObj(obj){
  let objInVal= 
  Object.entries(obj).map(([innerKey,innerValue]) => {
    return innerValue;
  });

  let compressObj = objInVal.reduce((acc,obj) => {
    return Object.assign(acc,obj);
  },{});

  return compressObj;
}

function warnMessage(userid,message) {

  postDirectMessage(userid,message);

  return;

}

function postDirectMessage(userid,message) {

  let channelId = getUserChannelId(userid);

  postMessage(userid,message,channelId);

  return;
  

}

function getUserChannelId(userid){

  let prop = givePropertiesService();
  let url = "https://slack.com/api/conversations.open";

  let OAUTH_TOKEN = prop.getProperty("OAUTH_TOKEN");
  
  let payload = {
    "token" : OAUTH_TOKEN,
    "users" : userid
  };

  let params = {
    "method" : "post",
    "payload" : payload
  };

  let response = UrlFetchApp.fetch(url,params);

  let data = JSON.parse(response.getContentText());
  Logger.log(response);
  let channelId = data.channel.id;

  return channelId;
}

function postMessage(userid,message,channelId) {
  let prop = givePropertiesService();
  let url = "https://slack.com/api/chat.postMessage";

  let OAUTH_TOKEN = prop.getProperty("OAUTH_TOKEN");
  
  let payload = {
    "token" : OAUTH_TOKEN,
    "channel" : channelId,
    "text" : "<@"+ userid + ">\n" + message
  };
  
  let params = {
    "method" : "post",
    "payload" : payload
  };
  
  // Slackに投稿する
  UrlFetchApp.fetch(url, params);
  

}
