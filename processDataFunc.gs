//受け取ったデータを処理する関数 
function processData(dataArray) {
  
  // 
  let userName = dataArray[0]; //ユーザー名
  let uid = dataArray[1]; //ユーザーID
  let seatNum = dataArray[2] - 1; //座席番号
  let startTime = dataArray[3]; //利用開始予定時間
  let endTime = dataArray[4]; //利用終了予定時間
  let date = dataArray[5];  // 利用年月日 yyyy年mm月dd日
  let checkBox = dataArray[6]; //チェックボックス、名前の有無

  const STR_SHEET_NAME_ERROR = "SHEET_NAME_ERROR"; //適切なシートを指定されなかった時のエラー
  const STR_TIME_SELECT_ERROR = "TIME_SELECT_ERROR"; //適切な時間を指定されなかった時のエラー
  const STR_RESERVED_TIME_ERROR = "RESERVED_ERROR"; //予約済みの時間帯が予約された時のエラー

  const STR_COMPLETE_RESERVATION = "COMPLETE_RESERVATION"; //座席予約完了

  const CHECK_SPREADSHEET_ID = givePropertiesService().getProperty("CHECK_SPREADSHEET_ID"); //座席確認用のSPREADSHEET ID
  let checkReferenceSourceSheet = SpreadsheetApp.openById(CHECK_SPREADSHEET_ID); //座席確認用SPREADSHEET 

  const EPS = 0.5; //座席 前半(1~10)後半(11~20)判別のための値

  const STATE_DATA_SHEET_NAME = "state"; //座席の状態を管理するシートの名前

  //時間の種類の配列
  let timeArray = ["7:00","8:00","9:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00"];

  //シートの取得
  let sheets = checkReferenceSourceSheet.getSheets();

  //シートの名前の取得
  let sheetsName = sheets.map(function(sheet) {
    return sheet.getName();
  });

  //予約された年月日がシート名に存在しない場合の処理
  if(!sheetsName.includes(date)){
    const DUMMY_EXISTENCE = 1; //dummyが1シート文存在
    const INDEX_ADJUSTMENT= 1; //indexは0から開始する

    //エラーメッセージ、予約可能年月日の最初、予約可能年月日の最後
    return [STR_SHEET_NAME_ERROR,sheetsName[0],sheetsName[sheetsName.length - DUMMY_EXISTENCE - INDEX_ADJUSTMENT]]; 
  }

  //時間の種類から n 時 の n のみを取り出した配列
  let hourArray = timeArray.map(function(value) {
    return parseInt(value.split(":")[0]);
  })

  //予約した開始時間が終了時間を超えてはいけない
  if(hourArray[startTime] >= hourArray[endTime]){
    return STR_TIME_SELECT_ERROR; //エラーであることを返す
  }

  //時間を ~ で結合した配列 7:00~8:00など
  let durationArray = timeArray.map(function(time,index) {
    if(index != timeArray.length - 1){
    return time + "~" + timeArray[index + 1];
    }
  })

  //結合した分配列の長さが小さくなる
  durationArray.pop(null);

  //座席の数の 1 ユニット: 10席を基準
  let baseSeatArray = [1,2,3,4,5,6,7,8,9,10];

  let baseSeatLen = baseSeatArray.length; //座席数の基準の配列の長さ = 種類数
  let timeLen = durationArray.length; //時間の配列の長さ = 種類数

  let quotient = Math.floor(seatNum/(baseSeatLen + EPS)); //前半(1~10)後半(11~20)の判別

  let seatRow = quotient * (timeLen + 2) + 3;

  let seatColumn = seatNum - quotient * baseSeatLen + 1;

  let timeRow = parseInt(startTime) + 1;
  let timeColumn = parseInt(endTime) + 1;

  if(!checkBox ) {
    userName = null;
  }

  let indexOfDay = sheetsName.indexOf(date);
  let indexOfSeat = seatNum - 1;

  const DATA_SPREADSHEET_ID = givePropertiesService().getProperty("DATA_SPREADSHEET_ID");
  let dataReferenceSourceSheet = SpreadsheetApp.openById(DATA_SPREADSHEET_ID);
  let sheet = dataReferenceSourceSheet.getSheetByName(STATE_DATA_SHEET_NAME);

　const SEAT_STATE_ROW = 1;
  const SEAT_STATE_COLUMN = 2;

  let strSeatState = sheet.getRange(SEAT_STATE_ROW,SEAT_STATE_COLUMN).getValues();

  let arraySeatState = JSON.parse(strSeatState);

  let actualReserveSegment = arraySeatState[indexOfDay][indexOfSeat].slice(startTime, endTime);
  let timeArraySegment = durationArray.slice(startTime, endTime);

  let allZerosCheck = actualReserveSegment.every(element => element == 0);

  if(!allZerosCheck){
    let continuance_array = mergeOnesArray(actualReserveSegment);
    let message = joinContinuance(continuance_array,timeArraySegment).join("、\n");
    return [STR_RESERVED_TIME_ERROR,message];
  }
  else{

    arraySeatState[indexOfDay][indexOfSeat].fill(1,startTime,endTime);

    strSeatState = JSON.stringify(arraySeatState);

    sheet.getRange(1,2).setValue(strSeatState);

    drawCellsForRow(date,seatRow,seatColumn,timeRow,timeColumn,userName); // @controlSheets.gs

    const NOTIFY_YOUR_RESERVED_INFO_MESSAGE = "利用年月日: " + date + 
    "\n座席番号: " + seatNum + 
    "\n利用予定時間: " + timeArray[startTime] + "~" +  timeArray[endTime] +
    "\nで予約しました !";

    return [STR_COMPLETE_RESERVATION,NOTIFY_YOUR_RESERVED_INFO_MESSAGE];
  }

  return;

  
}

function mergeOnesArray(array){
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
      result.push(transform_stactualReserveSegment(target,index,value));
    }
});

return result;
}

function transform_stactualReserveSegment(durationArray,start,count) {
  let new_start = durationArray[start].split("~")[0];
  let new_end = durationArray[start + count - 1].split("~")[1];

  return new_start + "~" + new_end;

}
