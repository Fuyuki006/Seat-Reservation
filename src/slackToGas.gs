//Slack からのデータ受け取り 関数名は doPost 固定
function doPost(e) {

  //例外の種類
  const STR_SHEET_NAME_ERROR = "SHEET_NAME_ERROR"; //適切なシート名が指定されなかった時
  const STR_TIME_SELECT_ERROR = "TIME_SELECT_ERROR"; //適切な時間帯が予約されなかった時
  const STR_RESERVED_ERROR = "RESERVED_ERROR"; //予約されていた時

  const STR_COMPLETE_RESERVATION = "COMPLETE_RESERVATION"; //座席予約完了

  const FORM_DATA_SHEET_NAME = "formdata"; //座席データ管理用のシート名

  //BLOCKS_ACTION_ID_NAME  @gasToSlack.gs で作成した blocks のそれぞれの action-id の 値
  const SEAT_ACTIONID = "static_select-action-seat"; //座席番号の static select
  const TS_ACTIONID = "static_select-action-ts"; //利用開始予定時間の static select
  const TE_ACTIONID = "static_select-action-te"; //利用終了予定時間の static select
  const DATE_ACTIONID = "datepicker-action"; //利用年月日の datepicker
  const CHECK_ACTIONID = "checkboxes-action"; //名前の有無の checkbox

  const BUTTON_TYPE_NAME = "button"; //Submit ボタン button

  //selected 実際に選択された値を格納しているキー名
  const SEAT_OPTION = "selected_option"; 
  const TS_OPTION = "selected_option";
  const TE_OPTION = "selected_option";
  const DATE_OPTION = "selected_date";
  const CHECK_OPTION = "selected_options";

  const PAYLOAD_USER = "user"; //受け取ったデータの user 情報
  const PAYLOAD_ACTIONS = "actions"; //受け取ったデータの actions 情報
  const PAYLOAD_STATE = "state"; //受け取ったデータの state 情報

  const CLICK_ID = "id"; //button を click したユーザーの ID を指定

  let dataSheet = giveDataSheet(FORM_DATA_SHEET_NAME)["sheet"]; //参照元シートを取得

  let payload  = JSON.parse(e["parameter"]["payload"]); //受け取ったデータ

  let clickUser = payload[PAYLOAD_USER]; //クリックしたユーザー
  let clickUserId = clickUser[CLICK_ID]; //クリックしたユーザーの ID


  let typeActions = payload[PAYLOAD_ACTIONS][0];

  // buttonが押された時の処理
  if(typeActions["value"] == BUTTON_TYPE_NAME){

    let typeState = payload[PAYLOAD_STATE]["values"]; //stateのデータ

    //入力されたデータを処理して typeInputs に保持
    let typeInputs = getCompressObj(typeState); //input のデータ

    let statSelectSeat = typeInputs[SEAT_ACTIONID]; //座席番号
    let statSelectTs = typeInputs[TS_ACTIONID]; //利用開始予定時間
    let statSelectTe = typeInputs[TE_ACTIONID]; //利用終了予定時間
    let datePicker = typeInputs[DATE_ACTIONID]; //利用年月日
    let checkBox = typeInputs[CHECK_ACTIONID]; //名前の有無


    let sSSVal = statSelectSeat[SEAT_OPTION]; //座席番号 実際の値
    let sTSVal = statSelectTs[TS_OPTION]; //利用開始予定時間 実際の値
    let sTEVal = statSelectTe[TE_OPTION]; //利用終了予定時間 実際の値
    let dPVal = datePicker[DATE_OPTION]; //利用年月日 実際の値
    let cBVal = checkBox[CHECK_OPTION][0]; //名前の有無 実際の値

    let requirementCheckArray = [clickUserId,sSSVal,sTSVal,sTEVal,dPVal]; //必要記入事項 nullだと問題がある要素の配列

    //必要記入事項がすべて記入されていないときの処理
    if(requirementCheckArray.includes(null)){
      const NONE_REQUIREMENT_MESSAGE = "必要事項が記入されていません !";
      warnMessage(clickUserId,NONE_REQUIREMENT_MESSAGE); //クリックしたユーザー(clickUserId)に対して、NONE_REQUIREMENT_MESSAGE を送信
      return;
    }
    //必要記入事項がすべて記入されているときの処理
    else{

      sSSVal = sSSVal["value"];
      sSSVal = sSSVal.split("value-"); //value-〇 の 〇の部分を取得
      sTSVal = sTSVal["value"];
      sTSVal = sTSVal.split("value-"); //value-〇 の 〇の部分を取得
      sTEVal = sTEVal["value"];
      sTEVal = sTEVal.split("value-"); //value-〇 の 〇の部分を取得
      dPVal = dPVal.split("-"); //yyyy-mm-dd の yyyy mm dd それぞれ取得

      //cBval => 名前の有無のチェックボックスが null で無いときの処理
      if(cBVal) {
        cBVal = cBVal.value;
      }

      let year = dPVal[0]; //yyyyの取り出し
      let month = dPVal[1].replace(/^0+/, ""); //頭の0(05,06など)を取り除いた mm の取り出し
      let day = dPVal[2].replace(/^0+/, ""); //頭の0(05,06など)を取り除いた dd の取り出し

      dPVal = year + "年" + month + "月" + day + "日";

      let registerDataArray = [clickUserId,sSSVal[1],sTSVal[1],sTEVal[1],dPVal,cBVal]; //登録されたデータ

      let userName = getSlackUserInfo(clickUserId)[0]; //@getUserInfo.gs

      registerDataArray.unshift(userName); //ユーザー名を registerDataArray の 1 番目に入れる

      let timeFormatArray = timeSeatFormat()[0]; //@timeSeatFormat.gs

      //データの表示のためのObj
      let displayData = [userName,clickUserId,sSSVal[1]-1,timeFormatArray[sTSVal[1]],timeFormatArray[sTEVal[1]],dPVal,cBVal];

      //登録されたデータをシートに出力
      dataSheet.getRange(dataSheet.getLastRow() + 1,1,1,displayData.length).setValues([displayData]);

      let result = processData(registerDataArray); //@processDataFunc.gs 登録データに対して様々な処理(processData関数) 結果を代入

      //processData 関数を用いてデータを処理する @processDataFunc.gs
      if(result == STR_TIME_SELECT_ERROR){ //正しい利用開始予定時間と利用終了予定時間が選択されなかった場合の処理
        const INVALID_USE_TIME_MESSAGE = "正しい利用開始予定時間と利用終了予定時間を選択してください。";
        warnMessage(clickUserId,INVALID_USE_TIME_MESSAGE); //@here warnMessage関数
      };

      if(result[0] == STR_SHEET_NAME_ERROR){ //正しい利用年月日が選択されなかった場合の処理
        const INVALID_USE_DATE_MESSAGE = "正しい利用年月日を選択してください";
        warnMessage(clickUserId,INVALID_USE_DATE_MESSAGE);
        
        const AVAILABLE_START_DATE = result[1]; //選択可能な利用年月日のはじめ
        const AVAILABLE_END_DATE = result[2] //選択可能な利用年月日のおわり

        const NOTIFY_AVAILABLE_DATE_MESSAGE = "選択可能な利用年月日は、\n" + AVAILABLE_START_DATE + "~" + AVAILABLE_END_DATE + "\nの間です。";
        warnMessage(clickUserId,NOTIFY_AVAILABLE_DATE_MESSAGE);
      };

      if(result[0] == STR_RESERVED_ERROR){ //既に予約済みの時間帯があった場合の処理
        const NOTIFY_RESERVED_TIME_MESSAGE = "既に予約済みの時間帯があります。";
        warnMessage(clickUserId,NOTIFY_RESERVED_TIME_MESSAGE);

        const RESERVED_TIME = result[1];

        const NOTIFY_ACTUAL_RESERVED_TIME_MESSAGE = "予約済みの利用予定時間は、\n" + RESERVED_TIME + "\nです。\nこの時間帯以外の予約をお願いします。";
        warnMessage(clickUserId,NOTIFY_ACTUAL_RESERVED_TIME_MESSAGE);
      };

      if(result[0] == STR_COMPLETE_RESERVATION){ //予約が問題なく完了したときの処理
        const NOTIFY_YOUR_RESERVED_INFO_MESSAGE = result[1];
        warnMessage(clickUserId,NOTIFY_YOUR_RESERVED_INFO_MESSAGE);
      };
      
      return;
    }
  }

}

//値に含まれる各Objectを取り出し、それらをまとめてObjectとして出力する特殊な関数
//{"fruit":{"apple":1,"banana":3,"grape":0},"color":{"red":2,"blue":1,"green":3}} => 
//{apple=1.0, banana=3.0, blue=1.0, green=3.0, grape=0.0, red=2.0}
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

//userid に対して message で警告する関数
function warnMessage(userid,message) {

  postDirectMessage(userid,message); //@here postDirectMessage 関数

  return;

}

//userid に対して Direct Message を送信する関数
function postDirectMessage(userid,message) {

  let channelId = getUserChannelId(userid); //@here getUserChannelId 関数

  postMessage(userid,message,channelId); //@here postMessage 関数

  return;
  

}

//userid とのプライベートチャンネルを取得 Direct Message を送信するため
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

  //userid とのプライベートチャンネルの ID を取得
  let channelId = data.channel.id; 

  return channelId;
}

//channelId に @ userid をつけて message を送信する関数
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
