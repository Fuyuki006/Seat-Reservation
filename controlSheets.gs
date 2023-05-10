function controlSheets() {
  let check_spreadsheet_id = givePropertiesService().getProperty("check_spreadsheet_id");
  let checkReferenceSourceSheet = SpreadsheetApp.openById(check_spreadsheet_id);
  
  let sheetNames = ["月", "火", "水", "木", "金", "土","日"];
  let startDate = new Date(); // 現在の日付
  let options = {year: "numeric", month: "long", day: "numeric"};
  
  sheetNames = sheetNames.map(function(name, index) {
    const HOURS = 24;
    const MINUTES = 60;
    const SECONDS = 60;
    const MILLIS = 1000;
    let sheetDate = new Date(startDate.getTime() + index * HOURS * MINUTES * SECONDS * MILLIS); // 日付を計算
    let sheetName = sheetDate.toLocaleDateString("ja-JP", options); // シート名を作成
    return sheetName;
  });

  const MIN_SHEET_NUM = 1;
  if(checkReferenceSourceSheet.getNumSheets() != MIN_SHEET_NUM){
    deleteSheet(sheetNames[0]);
  }
  else{checkReferenceSourceSheet.insertSheet().setName(sheetNames[0]); // シートを作成
  }

  createTable(sheetNames[0]);


  sheetNames.map(function(sheetName,index) {
    if(sheetNames[0] != sheetName){
      sheetCopyAnotherFile(sheetNames[0],sheetName)
    }
  })

  createSeatStateFormat();

}

function createSeatStateFormat(){
  let DATA_SPREADSHEET_ID = givePropertiesService().getProperty("DATA_SPREADSHEET_ID");
  let dataReferenceSourceSheet = SpreadsheetApp.openById(DATA_SPREADSHEET_ID);
  let sheet = dataReferenceSourceSheet.getSheetByName(STATE_DATA_SHEET_NAME);


  let timeArray = ["7:00","8:00","9:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00"];

  let COMBINE_TIME_CHARACTER = "~";

  let durationArray = timeArray.map(function(time,index) {
    if(index != timeArray.length - 1){
    return time + COMBINE_TIME_CHARACTER + timeArray[index + 1];
    }
  })

  durationArray.pop(null);

  let baseSeatArray = [1,2,3,4,5,6,7,8,9,10];

  let baseSeatLen = baseSeatArray.length;
  let timeLen = durationArray.length;

  let copyOftimeLenToZerosArray = new Array(timeLen).fill(0);

  const BASE_SEAT_TIMES = 2;

  let totalSeatNum = baseSeatLen * BASE_SEAT_TIMES;

  let seatCombineTimeArray = new Array(totalSeatNum).fill(copyOftimeLenToZerosArray).map(function (value) {
    return value.slice();
  });

  const WEEK_DAYS_NUM = 7;
  
  let seatStateFormatArray = new Array(WEEK_DAYS_NUM).fill(seatCombineTimeArray).map(function (value) {
    return value.slice();
  });

  let strSeatStateFormatArray = str = JSON.stringify(seatStateFormatArray);
  sheet.getRange(1,2).setValue(strSeatStateFormatArray);
}

function createTable(sheetName) {
  const CHECK_SPREADSHEET_ID = givePropertiesService().getProperty("CHECK_SPREADSHEET_ID");
  let checkReferenceSourceSheet = SpreadsheetApp.openById(CHECK_SPREADSHEET_ID);
  let sheet = checkReferenceSourceSheet.getSheetByName(sheetName);
  tableSets(sheet);
  sheet.activate();

  const SHEET_INIT_POSITION = 1;
  checkReferenceSourceSheet.moveActiveSheet(SHEET_INIT_POSITION);

}

function deleteSheet(new_sheet_name) {
  const CHECK_SPREADSHEET_ID = givePropertiesService().getProperty("CHECK_SPREADSHEET_ID");
  let checkReferenceSourceSheet = SpreadsheetApp.openById(CHECK_SPREADSHEET_ID);
  let DAMMY_CHECK_SHEET_NAME = "dummy";

  let sheetsNames = sheetsNameList();
  sheetsNames.map(function(name) {
    if(name != "DAMMY_CHECK_SHEET_NAME"){
      let sheet = spreadsheet.getSheetByName(name);
  
      spreadsheet.deleteSheet(sheet);
    }
  });
  spreadsheet.insertSheet().setName(new_sheet_name);
}

function sheetsNameList() {
  let CHECK_SPREADSHEET_ID = givePropertiesService().getProperty("CHECK_SPREADSHEET_ID");
  let checkReferenceSourceSheet = SpreadsheetApp.openById(CHECK_SPREADSHEET_ID);
  let sheetsList = checkReferenceSourceSheet.getSheets();
  let sheetsNames = sheetsList.map(function(sheet) {
    return sheet.getSheetName();
  }) 


  return sheetsNames;
}

function tableSets(sheet) {
  let timeArray = ["7:00","8:00","9:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00"];

  let durationArray = timeArray.map(function(time,index) {
    if(index != timeArray.length - 1){
    return time + "~" + timeArray[index + 1];
    }
  })

  durationArray.pop(null);

  let baseSeatArray = [1,2,3,4,5,6,7,8,9,10];

  let baseSeatLen = baseSeatArray.length;
  let timeLen = durationArray.length;

  const STR_RESERVED_FORMAT = "←予約済み";
  const COLOR_CODE_FORMAT = "#e6e6fa";
  const STR_TIME_SEAT_DIVIDE_FORMAT = "時間 / 座席番号";

  sheet.getRange(1,2).setBackground(COLOR_CODE_FORMAT);
  sheet.getRange(1,3).setValue(STR_RESERVED_FORMAT);

  sheet.getRange(3,1).setValue(STR_TIME_SEAT_DIVIDE_FORMAT);

  sheet.getRange(3 + timeLen + 2,1).setValue(STR_TIME_SEAT_DIVIDE_FORMAT);

  durationArray.map(function(value,index) {
    sheet.getRange(index + 4,1).setValue(value)
  });



  durationArray.map(function(value,index) {
    sheet.getRange(index + 2 + timeLen + 4,1).setValue(value)
  });

  baseSeatArray.map(function(num,index) {
    sheet.getRange(3,index + 2).setValue(num)
  });

  baseSeatArray.map(function(num,index) {
    sheet.getRange(3 + timeLen + 2,index + 2).setValue(num + baseSeatLen)
  });

}

function sheetCopyAnotherFile(baseSheetName,sheetName) {
//スクリプトに紐付いたアクティブなシートをコピー対象のシートとして読み込む
  const CHECK_SPREADSHEET_ID = givePropertiesService().getProperty("CHECK_SPREADSHEET_ID");
  let checkReferenceSourceSheet = SpreadsheetApp.openById(CHECK_SPREADSHEET_ID);
  let sheet = checkReferenceSourceSheet.getSheetByName(baseSheetName);
  sheet.activate();
  let newSheet = checkReferenceSourceSheet.duplicateActiveSheet();

newSheet.setName(sheetName);
let sheetNum = checkReferenceSourceSheet.getNumSheets();

const SHEET_POSITION_BACK = 1;

checkReferenceSourceSheet.moveActiveSheet(sheetNum - SHEET_POSITION_BACK); //シートを一番後ろから SHEET_POSITION_BACK つ前に追加
}


function drawCellsForRow(sheetName,row,column,startRow,endRow,userName){
  const CHECK_SPREADSHEET_ID = givePropertiesService().getProperty("CHECK_SPREADSHEET_ID");
  let checkReferenceSourceSheet = SpreadsheetApp.openById(CHECK_SPREADSHEET_ID);
  let sheet = checkReferenceSourceSheet.getSheetByName(sheetName);

  const COLOR_CODE_FORMAT = "#e6e6fa";

  if(!sheet) {
    new Error("Invalid Sheet");
    return;
  }

  sheet.getRange(row + startRow,column,endRow - startRow,1)
  .merge()
  .setBorder(true,true,true,true,true,true,null,SpreadsheetApp.BorderStyle.SOLID_MEDIUM)
  .setBackground(COLOR_CODE_FORMAT);

  if(userName) {
    sheet.getRange(row + startRow,column,endRow - startRow,1).setHorizontalAlignment("center"); // 水平方向に中央ぞろえする
    sheet.getRange(row + startRow,column,endRow - startRow,1).setVerticalAlignment("middle"); // 垂直方向に中央ぞろえする
    sheet.getRange(row + startRow,column,endRow - startRow,1).setValue(userName); // 結合したセルの中央に文字を入れる
  }

}

function givePropertiesService(){
  let prop = PropertiesService.getScriptProperties();
  return prop
}


