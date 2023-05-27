//uid に対応するユーザーの情報(実際の名前・ユーザーID・メールアドレス)
function getSlackUserInfo(uid) {

  const prop = givePropertiesService(); //@giveProperties.gs

  const OAUTH_TOKEN = prop.getProperty("OAUTH_TOKEN"); //Slackのトークン
  
  const options = {
    "method" : "get",
    "contentType": "application/x-www-form-urlencoded",
    "payload" : { 
      "token": OAUTH_TOKEN
    }
  };
  
  const url = "https://slack.com/api/users.list"; //Slack API でワークスペース内のユーザー取得
  const response = UrlFetchApp.fetch(url, options); // Slack APIへのリクエストを送信
  
  const members = JSON.parse(response).members; //メンバー(ユーザー)一覧

  const membersInfoMap = getSlackUserInfoProcessing(members); //@here getSlackUserInfoProcessing 関数

  const indexForUid = membersInfoMap[0].indexOf(uid); //uid に対する index の取得

  const userRealName = membersInfoMap[1][indexForUid]; //uid に対する実際の名前の取得

  const userMailAddress = membersInfoMap[2][indexForUid]; //uid に対するメールアドレスの取得

  const userInfoArray = [userRealName,uid,userMailAddress]; //uid に対する情報を配列にまとめる

  return userInfoArray; //情報を返す

  
}

//Bot や削除済みデータを除いた Slack ユーザーのデータ処理
function getSlackUserInfoProcessing(members){
  //ユーザーの ID 格納
  let membersIdArray= members.map((value) => {
    if (!value.deleted && !value.is_bot && value.id !== "USLACKBOT"){
      return value.id;
    }
  });

  //ユーザーの 実際の名前 格納
  let membersUserNameArray= members.map((value) => {
    if (!value.deleted && !value.is_bot && value.id !== "USLACKBOT"){
      return value.real_name;
    }
  });

  //ユーザーの メールアドレス 格納
  let membersMailArray= members.map((value) =>{
    if (!value.deleted && !value.is_bot && value.id !== "USLACKBOT"){
      return value.profile.email;
    }
  });

  membersIdArray = arrayFilter(membersIdArray); //Filter したメンバー全員の ID
  membersUserNameArray =arrayFilter(membersUserNameArray); //Filter したメンバー全員の ユーザー名
  membersMailArray =arrayFilter(membersMailArray); //Filter したメンバー全員の メールアドレス
  return [membersIdArray,membersUserNameArray,membersMailArray];
}

//nullデータを処理するためのFilter [null,1,0,2,2,null,3,null,null] => [1,0,2,2,3]
function arrayFilter(array){
  const filteredArray = array.filter((value) => {
    return value != null;
  });
  
  return filteredArray;
}
