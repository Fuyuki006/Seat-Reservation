//受け取ったデータを処理する関数 
function processData(dataArray) {

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

  let checkReferenceSourceSheet = giveCheckSheet()["reference"]; //座席確認用SPREADSHEET 


  const EPS = 0.5; //座席 前半(1~10)後半(11~20)判別のための値

  const STATE_DATA_SHEET_NAME = "state"; //座席の状態を管理するシートの名前

  let timeFormatArray = timeFormat()[0]; //時間の種類の配列

  let checkSheets = checkReferenceSourceSheet.getSheets(); //シートの取得

  //シートの名前の取得
  let sheetsName = checkSheets.map((sheet) =>{
    return sheet.getName();
  });

  //予約された年月日がシート名に存在しない場合の処理
  if(!sheetsName.includes(date)){
    const DUMMY_EXISTENCE = 1; //dummyが1シート分存在
    const INDEX_ADJUSTMENT= 1; //indexは0から開始する

    //エラーメッセージ、予約可能年月日の最初、予約可能年月日の最後
    return [STR_SHEET_NAME_ERROR,sheetsName[0],sheetsName[sheetsName.length - DUMMY_EXISTENCE - INDEX_ADJUSTMENT]]; 
  }

  //時間の種類から n 時 の n のみを取り出した配列
  let hourArray = timeFormatArray.map((value) => {
    return parseInt(value.split(":")[0]);
  })

  //予約した開始時間が終了時間を超えてはいけない
  if(hourArray[startTime] >= hourArray[endTime]){
    return STR_TIME_SELECT_ERROR; //エラーであることを返す
  }

  let durationArray = timeFormat()[1]; //時間を ~ で結合した配列 7:00~8:00など

  let baseSeatArray = timeFormat()[2]; //座席の数の 1 ユニット: 10席を基準

  let baseSeatLen = baseSeatArray.length; //座席数の基準の配列の長さ = 種類数
  let timeLen = durationArray.length; //時間の配列の長さ = 種類数

  let quotient = Math.floor(seatNum/(baseSeatLen + EPS)); //前半(1~10)後半(11~20)の判別


  const INIT_SPACE = 2; //sheetの上から最初の2行の空白
  const TIME_AND_SEAT_SPACE = 1; // 時間 / 座席番号 と書かれているセルの分

  const ADDITION_SPACE = 1; //前半(1~10)　から 後半(11~20) (もちろんそれ以降も)　追加するごとに設ける空白

  const SEAT_SPACE = 1; //座席番号が実際に書いてある分 1,14,20など

  //座席が書いてある 行
  let seatRow = quotient * (timeLen + ADDITION_SPACE + TIME_AND_SEAT_SPACE) + INIT_SPACE + TIME_AND_SEAT_SPACE; 

  //座席が書いてある 列
  let seatColumn = seatNum - quotient * baseSeatLen + TIME_AND_SEAT_SPACE;

  

  let startTimeRow = parseInt(startTime) + SEAT_SPACE; //利用開始予定時間の行
  let endTimeRow = parseInt(endTime) + SEAT_SPACE; //利用終了予定時間の行

  //名前の有無の処理
  if(!checkBox ) {
    userName = null; //名前無しにする
  }

  let indexOfDay = sheetsName.indexOf(date); // 利用年月日の　index
  let indexOfSeat = seatNum - 1; //座席の index

  let dataSheet = giveDataSheet(STATE_DATA_SHEET_NAME)["sheet"]; //データ管理用のシート

  const SEAT_STATE_ROW = 1; //座席の予約状況が管理されている 行
  const SEAT_STATE_COLUMN = 2; //座席の予約状況が管理されている 列

  let strSeatState = dataSheet.getRange(SEAT_STATE_ROW,SEAT_STATE_COLUMN).getValues(); //座席の予約状況の取得

  let arraySeatState = JSON.parse(strSeatState); //座席の予約状況を配列に変換

  //指定された年月日と座席番号の予約状況から予約された時間帯の範囲で取り出す
  let actualReserveSegment = arraySeatState[indexOfDay][indexOfSeat].slice(startTime, endTime); 

  //時間間隔のFormatから予約された時間帯の範囲で取り出す
  let timeArraySegment = durationArray.slice(startTime, endTime);

  //予約されようとしている年月日、座席、時間帯の配列の要素がすべて 0 => どこも予約されていないかチェック
  let allZerosCheck = actualReserveSegment.every(element => element == 0);

  //予約されている部分があったときの処理
  if(!allZerosCheck){
    let mergedArray = mergeOnesArray(actualReserveSegment);
    let message = compressArray(mergedArray,timeArraySegment).join("、\n");
    return [STR_RESERVED_TIME_ERROR,message];
  }
  //予約されている部分がなかったときの処理
  else{

    const FILL_VAL = 1; // 配列を fill する値  1 => 予約する

    arraySeatState[indexOfDay][indexOfSeat].fill(FILL_VAL,startTime,endTime); //予約 (1)で埋める

    strSeatState = JSON.stringify(arraySeatState); //一度データを文字列に情報を変換

    dataSheet.getRange(SEAT_STATE_ROW,SEAT_STATE_COLUMN).setValue(strSeatState); //そのデータをスプシに保存

    drawCellsForRow(date,seatRow,seatColumn,startTimeRow,endTimeRow,userName); // @controlSheets.gs

    //予約完了のメッセージ
    const NOTIFY_YOUR_RESERVED_INFO_MESSAGE = "利用年月日: " + date + 
    "\n座席番号: " + seatNum + 
    "\n利用予定時間: " + timeFormatArray[startTime] + "~" +  timeFormatArray[endTime] +
    "\nで予約しました !";

    //予約完了したことを示すテキスト、予約完了のメッセージ
    return [STR_COMPLETE_RESERVATION,NOTIFY_YOUR_RESERVED_INFO_MESSAGE];
  }

  return;

  
}

// 1 をまとめる関数 [1,0,0,1,1,1,0] => [1,0,0,3,0]
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

// 対象の配列 (targetArray) を 圧縮させる形の配列 (compressionDestArray) に圧縮する関数 
function compressArray(compressDestArray,targetArray){
  let result = [];
  let excess = 0; // 基準となる数字より余った分が蓄積される
  const BASE_VAL = 1; //基準となる数字
  compressDestArray.forEach((value, index, array) => {
    if (value == 1) {
      result.push(targetArray[index + excess]);
    } 
    else if(value > 1) {
      result.push(mergeTimeRanges(targetArray,index + excess ,value));
      excess += value - BASE_VAL;
    }
});

return result;
}

//時間の範囲をまとめる関数 7:00~8:00, 8:00~9:00 => 7;00~9:00
function mergeTimeRanges(array,start,count) {
  const CONTAIN_INITIAL_VAL = 1;
  const COMBINE_TIME_CHARACTER = "~"; //時間を結合している文字
  let newStartTime = array[start].split(COMBINE_TIME_CHARACTER )[0];
  let newEndTime = array[start + count - CONTAIN_INITIAL_VAL].split(COMBINE_TIME_CHARACTER)[1];

  return newStartTime + COMBINE_TIME_CHARACTER + newEndTime;

}
