function doPost(e) {
  const data_spreadsheet_id = give_propertiesService().getProperty("data_spreadsheet_id");
  const referenceSourceSheet = SpreadsheetApp.openById(data_spreadsheet_id);
  let sheet = referenceSourceSheet.getSheetByName("formdata"); //参照元シートを取得

  const payload  = JSON.parse(e["parameter"]["payload"]);

  const click_user = payload["user"];
  const c_user_id = click_user["id"];


  const type_actions = payload["actions"][0];

    if(type_actions["value"] == "button"){

    const type_state = payload["state"]["values"];
    const type_inputs = getObj_inValue(type_state);

    const stat_select_seat = type_inputs["static_select-action-seat"];
    const stat_select_ts = type_inputs["static_select-action-ts"];
    const stat_select_te = type_inputs["static_select-action-te"];
    const datepicker = type_inputs["datepicker-action"];
    const checkbox = type_inputs["checkboxes-action"];


    let sss_val = stat_select_seat["selected_option"];
    let sts_val = stat_select_ts["selected_option"];
    let ste_val = stat_select_te["selected_option"];
    let dp_val = datepicker["selected_date"];
    let cb_val = checkbox["selected_options"][0];

    const requirement_check_li = [c_user_id,sss_val,sts_val,ste_val,dp_val];

    if(requirement_check_li.includes(null)){
      let message = "必要事項が記入されていません !";
      warnMessage(c_user_id,message);
      return;
    }
    else{

      sss_val = sss_val["value"];
      sss_val = sss_val.split("value-");
      sts_val = sts_val["value"];
      sts_val = sts_val.split("value-");
      ste_val = ste_val["value"];
      ste_val = ste_val.split("value-");
      dp_val = dp_val.split("-");

      if(cb_val) {
        cb_val = cb_val.value;

      }
      const time_kind = ["7:00","8:00","9:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00"];

      const year = dp_val[0];
      const month = dp_val[1].replace(/^0+/, "");
      const day = dp_val[2].replace(/^0+/, "");

      dp_val = year + "年" + month + "月" + day + "日";


      // sheet = referenceSourceSheet.getSheetByName(dp_val);

      let regit_data = [c_user_id,sss_val[1],sts_val[1],ste_val[1],dp_val,cb_val];

      const u_name = getSlackUserInfo(c_user_id)[0]; //@getUserInfo.gs

      regit_data.unshift(u_name);

      //データの表示のためのObj
      const display_data = [u_name,c_user_id,sss_val[1]-1,time_kind[sts_val[1]],time_kind[ste_val[1]],dp_val,cb_val];

      sheet.getRange(sheet.getLastRow() + 1,1,1,display_data.length).setValues([display_data]);

      const result = processData(regit_data);

      //processData 関数を用いてデータを処理する @processDataFunc.gs
      if(result == "time_select_error"){
        let message = "正しい利用開始予定時間と利用終了予定時間を選択してください。";
        warnMessage(c_user_id,message);
      };

      if(result[0] == "sheet_name_error"){
        let message = "正しい利用年月日を選択してください";
        warnMessage(c_user_id,message);
        message = "選択可能な利用年月日は、\n" + result[1] + "~" + result[2] + "\nの間です。";
        warnMessage(c_user_id,message);
      };

      if(result[0] == "reserved_error"){
        let message = "既に予約済みの時間帯があります。";
        warnMessage(c_user_id,message);
        message = "予約済みの利用予定時間は、\n" + result[1] + "\nです。\nこの時間帯以外の予約をお願いします。";
        warnMessage(c_user_id,message);
      };

      if(result[0] == "complete_reservation"){
        warnMessage(c_user_id,result[1]);
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

  const prop = give_propertiesService();
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
  const prop = give_propertiesService();
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

function give_propertiesService(){
  const prop = PropertiesService.getScriptProperties();
  return prop
}
