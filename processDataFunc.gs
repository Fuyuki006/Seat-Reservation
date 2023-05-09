function processData(dataList) {
  
  // 
  let u_name = dataList[0]; //ユーザー名
  const uid = dataList[1]; //ユーザーID
  const seat_num = dataList[2] - 1; //座席番号
  const time_start = dataList[3]; //利用開始予定時間
  const time_end = dataList[4]; //利用終了予定時間
  const date = dataList[5];  // 利用年月日 yyyy年mm月dd日
  const check = dataList[6]; //チェックボックス、名前の有無

  const u_mail = getSlackUserInfo(uid)[2]; //ユーザーのメールアドレス

  const u_info = [u_name,uid,u_mail];

  // userCheck(uid,u_info);

  const check_spreadsheet_id = give_propertiesService().getProperty("check_spreadsheet_id");
  const check_referenceSourceSheet = SpreadsheetApp.openById(check_spreadsheet_id);

  const sheets = check_referenceSourceSheet.getSheets();
  const sheets_name = sheets.map(function(sheet) {
    return sheet.getName();
  });

  if(!sheets_name.includes(date)){
    return ["sheet_name_error",sheets_name[0],sheets_name[sheets_name.length - 2]];
  }


  const time_kind = ["7:00","8:00","9:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00"];

  const t_hours = time_kind.map(function(value) {
    return parseInt(value.split(":")[0]);
  })

  if(t_hours[time_start] >= t_hours[time_end]){
    return "time_select_error";
  }

  const time_interval = time_kind.map(function(time,index) {
    if(index != time_kind.length - 1){
    return time + "~" + time_kind[index + 1];
    }
  })

  time_interval.pop(null);

  const seat_kind = [1,2,3,4,5,6,7,8,9,10];

  const seat_length = seat_kind.length;
  const ti_length = time_interval.length;

  const quotient = Math.floor(seat_num/(seat_length + 0.5));

  const seat_row = quotient * (ti_length + 2) + 3;

  const seat_column = seat_num - quotient * seat_length + 1;

  const time_row = parseInt(time_start) + 1;
  const time_column = parseInt(time_end) + 1;

  if(!check ) {
    u_name = null;
  }

  const index_day = sheets_name.indexOf(date);
  const index_seat = seat_num - 1;

  const data_spreadsheet_id = give_propertiesService().getProperty("data_spreadsheet_id");
  const data_referenceSourceSheet = SpreadsheetApp.openById(data_spreadsheet_id);
  const sheet = data_referenceSourceSheet.getSheetByName("state");

  let str_seat_state = sheet.getRange(1,2).getValues();

  const seat_state = JSON.parse(str_seat_state);

  const r_interval = seat_state[index_day][index_seat].slice(time_start, time_end);
  const r_time_interval = time_interval.slice(time_start, time_end);

  const zeros_check = r_interval.every(element => element == 0);

  if(!zeros_check){
    const continuance_array = countContinuance(r_interval);
    let message = joinContinuance(continuance_array,r_time_interval).join("、\n");
    return ["reserved_error",message];
  }
  else{

    seat_state[index_day][index_seat].fill(1,time_start,time_end);

    str_seat_state = JSON.stringify(seat_state);

    sheet.getRange(1,2).setValue(str_seat_state);

    drawCellsForRow(date,seat_row,seat_column,time_row,time_column,u_name); // @controlSheets.gs

    message = "利用年月日: " + date + 
    "\n座席番号: " + seat_num + 
    "\n利用予定時間: " + time_kind[time_start] + "~" +  time_kind[time_end] +
    "\nで予約しました !";

    return ["complete_reservation",message];
  }

  return;

  
}

function userCheck(uid,u_info) {
  const member_spreadsheet_id = give_propertiesService().getProperty("member_spreadsheet_id");
  const referenceSourceSheet = SpreadsheetApp.openById(member_spreadsheet_id);
  
  
  //参照元シートを取得
  const sheet = referenceSourceSheet.getSheetByName("メンバー表");
  
  let userid_map= sheet.getRange(2,2,sheet.getLastRow() - 1,1).getValues();

  let userid_list = userid_map.map(function(value){
      return value[0].toString();});

  if (userid_list.includes(uid)){
      return true;
  }

  sheet.appendRow(u_info); //登録してないなら、ついでに登録
}

function countContinuance(array){
  let result = [];
  let sum = 0;

  array.forEach((value, index, array) => {
    if (value == 1) {
      sum++;
      if (index == array.length - 1) {
        result.push(sum);
      }
    } else {
      if (sum > 0) {
        result.push(sum);
      }
      result.push(value);
      sum = 0;
    }
});

return result;
}

function joinContinuance(continuance_array,target){
  let result = [];

  continuance_array.forEach((value, index, array) => {
    if (value == 1) {
      result.push(target[index]);
    } 
    else if(value > 1) {
      result.push(transform_str_interval(target,index,value));
    }
});

return result;
}

function transform_str_interval(time_interval,start,count) {
  const new_start = time_interval[start].split("~")[0];
  const new_end = time_interval[start + count - 1].split("~")[1];

  return new_start + "~" + new_end;

}
