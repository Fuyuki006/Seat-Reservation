function controlSheets() {
  const check_spreadsheet_id = give_propertiesService().getProperty("check_spreadsheet_id");
  let referenceSourceSheet = SpreadsheetApp.openById(check_spreadsheet_id);
  
  let  sheetNames = ["月", "火", "水", "木", "金", "土","日"];
  const startDate = new Date(); // 現在の日付
  const options = {year: "numeric", month: "long", day: "numeric"};
  
  sheetNames = sheetNames.map(function(name, index) {
    const sheetDate = new Date(startDate.getTime() + index * 24 * 60 * 60 * 1000); // 日付を計算
    const sheetName = sheetDate.toLocaleDateString("ja-JP", options); // シート名を作成
    return sheetName;
  });
  if(referenceSourceSheet.getNumSheets() != 1){
    deleteSheet(sheetNames[0]);
  }
  else{referenceSourceSheet.insertSheet().setName(sheetNames[0]); // シートを作成
  }

  createTable(sheetNames[0]);


  sheetNames.map(function(sheetName,index) {
    if(sheetNames[0] != sheetName){
      sheetCopyAnotherFile(sheetNames[0],sheetName)
    }
  })

  seatState();

}

function seatState(){
 const data_spreadsheet_id = give_propertiesService().getProperty("data_spreadsheet_id");
  referenceSourceSheet = SpreadsheetApp.openById(data_spreadsheet_id);
  let sheet = referenceSourceSheet.getSheetByName("state"); //参照元シートを取得

  const time_kind = ["7:00","8:00","9:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00"];

  const time_interval = time_kind.map(function(time,index) {
    if(index != time_kind.length - 1){
    return time + "~" + time_kind[index + 1];
    }
  })

  time_interval.pop(null);

  const seat_kind = [1,2,3,4,5,6,7,8,9,10];

  const seat_length = seat_kind.length;
  const ti_length = time_interval.length;

  const arr = new Array(ti_length).fill(0);

  const new_arr = new Array(seat_length * 2).fill(arr).map(function (value) {
    return value.slice();
  });

  const seat_state = new Array(7).fill(new_arr).map(function (value) {
    return value.slice();
  });

  const str_seat_state = str = JSON.stringify(seat_state);
  sheet.getRange(1,2).setValue(str_seat_state);
}

function createTable(sheetName) {
  const check_spreadsheet_id = give_propertiesService().getProperty("check_spreadsheet_id");
  const referenceSourceSheet = SpreadsheetApp.openById(check_spreadsheet_id);
  const sheet = referenceSourceSheet.getSheetByName(sheetName);
  tableSets(sheet);
  sheet.activate();
  referenceSourceSheet.moveActiveSheet(1);

}

function deleteSheet(new_sheet_name) {
  const check_spreadsheet_id = give_propertiesService().getProperty("check_spreadsheet_id");
  const spreadsheet = SpreadsheetApp.openById(check_spreadsheet_id);

  const sheets_name = sheetsNameList();
  sheets_name.map(function(name) {
    if(name != "dummy"){
      const sheet = spreadsheet.getSheetByName(name);
  
      spreadsheet.deleteSheet(sheet);
    }
  });
  spreadsheet.insertSheet().setName(new_sheet_name);
}

function sheetsNameList() {
  const check_spreadsheet_id = give_propertiesService().getProperty("check_spreadsheet_id");
  const referenceSourceSheet = SpreadsheetApp.openById(check_spreadsheet_id);
  const sheets_list = referenceSourceSheet.getSheets();
  const sheets_name = sheets_list.map(function(sheet) {
    return sheet.getSheetName();
  }) 


  return sheets_name;
}

function tableSets(sheet) {
  const time_kind = ["7:00","8:00","9:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00"];

  const time_interval = time_kind.map(function(time,index) {
    if(index != time_kind.length - 1){
    return time + "~" + time_kind[index + 1];
    }
  })

  time_interval.pop(null);

  const seat_kind = [1,2,3,4,5,6,7,8,9,10];

  const seat_length = seat_kind.length;
  const ti_length = time_interval.length;


  sheet.getRange(1,2).setBackground("#e6e6fa");
  sheet.getRange(1,3).setValue("←予約済み");

  sheet.getRange(3,1).setValue("時間 / 座席番号");

  sheet.getRange(3 + ti_length + 2,1).setValue("時間 / 座席番号");

  time_interval.map(function(value,index) {
    sheet.getRange(index + 4,1).setValue(value)
  });



  time_interval.map(function(value,index) {
    sheet.getRange(index + 2 + ti_length + 4,1).setValue(value)
  });

  seat_kind.map(function(num,index) {
    sheet.getRange(3,index + 2).setValue(num)
  });

  seat_kind.map(function(num,index) {
    sheet.getRange(3 + ti_length + 2,index + 2).setValue(num + seat_length)
  });
  

  // sheet.getRange(1 + 2,1).setValue([1]);




}

function sheetCopyAnotherFile(baseSheetName,sheetName) {
//スクリプトに紐付いたアクティブなシートをコピー対象のシートとして読み込む
const check_spreadsheet_id = give_propertiesService().getProperty("check_spreadsheet_id");
const referenceSourceSheet = SpreadsheetApp.openById(check_spreadsheet_id);
const sheet = referenceSourceSheet.getSheetByName(baseSheetName);
sheet.activate();
const newSheet = referenceSourceSheet.duplicateActiveSheet();

newSheet.setName(sheetName);
const sheetNum = referenceSourceSheet.getNumSheets();

referenceSourceSheet.moveActiveSheet(sheetNum - 1); //シートを一番後ろから 1 つ前に追加
}

function give_propertiesService(){
  const prop = PropertiesService.getScriptProperties();
  return prop
}


function drawCellsForRow(sheet_name,row,column,start_row,end_row,u_name){
  const check_spreadsheet_id = give_propertiesService().getProperty("check_spreadsheet_id");
  const referenceSourceSheet = SpreadsheetApp.openById(check_spreadsheet_id);
  const sheet = referenceSourceSheet.getSheetByName(sheet_name);

  if(!sheet) {
    new Error("Invalid Sheet");
    return;
  }

  sheet.getRange(row + start_row,column,end_row - start_row,1)
  .merge()
  .setBorder(true,true,true,true,true,true,null,SpreadsheetApp.BorderStyle.SOLID_MEDIUM)
  .setBackground("#e6e6fa");

  if(u_name) {
    sheet.getRange(row + start_row,column,end_row - start_row,1).setHorizontalAlignment("center"); // 水平方向に中央ぞろえする
    sheet.getRange(row + start_row,column,end_row - start_row,1).setVerticalAlignment("middle"); // 垂直方向に中央ぞろえする
    sheet.getRange(row + start_row,column,end_row - start_row,1).setValue(u_name); // 結合したセルの中央に文字を入れる
  }

}

function give_propertiesService(){
  const prop = PropertiesService.getScriptProperties();
  return prop
}


