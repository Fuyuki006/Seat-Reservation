function getSlackUserInfo(uid) {
  
  const prop = givePropertiesService();

  const OAUTH_TOKEN = prop.getProperty("OAUTH_TOKEN");
  
  const options = {
    "method" : "get",
    "contentType": "application/x-www-form-urlencoded",
    "payload" : { 
      "token": OAUTH_TOKEN
    }
  };
  
  const url = "https://slack.com/api/users.list";
  const response = UrlFetchApp.fetch(url, options);
  
  const members = JSON.parse(response).members;

  const membersInfoMap = getSlackUserInfoProcessing(members);

  const indexAgainstUid = membersInfoMap[0].indexOf(uid);

  const userRealName = membersInfoMap[1][indexAgainstUid];

  const userMailAddress = membersInfoMap[2][indexAgainstUid];

  const userInfoArray = [userRealName,uid,userMailAddress];

  return userInfoArray;

  
}

function getSlackUserInfoProcessing(members){
  let membersIdList= members.map(function(value){
    if (!value.deleted && !value.is_bot && value.id !== "USLACKBOT"){
      return value.id;
    }
  });

  let membersUserNameList= members.map(function(value){
    if (!value.deleted && !value.is_bot && value.id !== "USLACKBOT"){
      return value.real_name;
    }
  });

  let membersMailList= members.map(function(value){
    if (!value.deleted && !value.is_bot && value.id !== "USLACKBOT"){
      return value.profile.email;
    }
  });

  membersIdList = listFilter(membersIdList);
  membersUserNameList =listFilter(membersUserNameList);
  membersMailList =listFilter(membersMailList);
  return [membersIdList,membersUserNameList,membersMailList];
}

function listFilter(list){
  const filteredList = list.filter(function(value){
    return value != null;
  });
  return filteredList;
}