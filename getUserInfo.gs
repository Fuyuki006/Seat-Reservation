function getSlackUserInfo(uid) {
  
  const prop = give_propertiesService();

  const OAuth_token = prop.getProperty("OAuth_token");
  
  const options = {
    "method" : "get",
    "contentType": "application/x-www-form-urlencoded",
    "payload" : { 
      "token": OAuth_token
    }
  };
  
  const url = "https://slack.com/api/users.list";
  const response = UrlFetchApp.fetch(url, options);
  
  const members = JSON.parse(response).members;

  const members_info_map = getSlackUserInfo_processing(members);

  const uid_index = members_info_map[0].indexOf(uid);

  const user_real_name = members_info_map[1][uid_index];

  const user_mail_address = members_info_map[2][uid_index];

  const u_info_list = [user_real_name,uid,user_mail_address];

  return u_info_list;

  
}

function getSlackUserInfo_processing(members){
  let members_id_list= members.map(function(value){
    if (!value.deleted && !value.is_bot && value.id !== "USLACKBOT"){
      return value.id;
    }
  });

  let members_username_list= members.map(function(value){
    if (!value.deleted && !value.is_bot && value.id !== "USLACKBOT"){
      return value.real_name;
    }
  });

  let members_mail_list= members.map(function(value){
    if (!value.deleted && !value.is_bot && value.id !== "USLACKBOT"){
      return value.profile.email;
    }
  });

  members_id_list = list_filter(members_id_list);
  members_username_list =list_filter(members_username_list);
  members_mail_list =list_filter(members_mail_list);
  return [members_id_list,members_username_list,members_mail_list];
}

function list_filter(list){
  const new_list = list.filter(function(value){
    return value != null;
  });
  return new_list;
}