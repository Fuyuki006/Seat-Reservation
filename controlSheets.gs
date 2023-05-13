function controlSheets() {
  let checkReferenceSourceSheet = giveCheckSheet()["reference"]; //座席確認用の Sheet
  
  let weekdays = ["月", "火", "水", "木", "金", "土","日"];
  let startDate = new Date(); // 現在の日付
  let options = {year: "numeric", month: "long", day: "numeric"}; //年・月・日　の設定
  
  weekdays = weekdays.map(function(name, index) {
    const HOURS = 24;
    const MINUTES = 60;
    const SECONDS = 60;
    const MILLIS = 1000;

    let sheetDate = new Date(startDate.getTime() + index * HOURS * MINUTES * SECONDS * MILLIS); // 日付を計算
    let sheetName = sheetDate.toLocaleDateString("ja-JP", options); // シート名を作成
    return sheetName;
  });

  //シートの枚数の最小値
  const MIN_SHEET_NUM = 1;

  //シートの枚数による処理
  if(checkReferenceSourceSheet.getNumSheets() != MIN_SHEET_NUM){
    deleteAndSetInitSheet(weekdays[0]); //@deleteAndSetInitSheet 関数
  }
  else{checkReferenceSourceSheet.insertSheet().setName(weekdays[0]); // dummy を除いた1枚目のシートを作成
  }

  createTable(weekdays[0]); //作成したdummy を除いた1枚目のシートに対して @createTable

  //dummy を除いた他のシートに 1 枚目のシートをコピーして作成
  weekdays.forEach((sheetName,index) => {
    if(weekdays[0] != sheetName){
      sheetCopyAnotherFile(weekdays[0],sheetName)
    }
  })

  seatState(); //@seatState

}

//seat state => 座席の予約状況を管理する初期状態を作成する
function seatState(){

  const SEAT_STATE_ROW = 1; //シートの state を管理しているシートの 行
  const SEAT_STATE_COLUMN = 2; //シートの state を管理しているシートの 列

  //時間を ~ で結合した配列 7:00~8:00など
  let durationArray = timeFormat()[1];

  //座席の数の 1 ユニット: 10席を基準
  let baseSeatArray = timeFormat()[2];

  let baseSeatLen = baseSeatArray.length; //座席数の基準の配列の長さ = 種類数
  let timeLen = durationArray.length; //時間の配列の長さ = 種類数

  //時間の間隔の種類の分の要素がある配列 もっとも内側の配列
  let copyOftimeLenToZerosArray = new Array(timeLen).fill(0);

  const ALL_SEAT_NUM = 20; //全座席数

  //座席数分 時間の間隔の種類の分の要素がある配列(copyOftimeLenToZerosArray) を格納
  let seatCombineTimeArray = new Array(ALL_SEAT_NUM).fill(copyOftimeLenToZerosArray).map((value) => {
    return value.slice();
  });

  const WEEK_DAYS_NUM = 7; //一週間分の日数
  
  //一週間分 座席数分格納した配列(seatCombineTimeArray) を格納
  let seatStateFormatArray = new Array(WEEK_DAYS_NUM).fill(seatCombineTimeArray).map((value) => {
    return value.slice();
  });

  //配列を文字列に
  let strSeatStateFormatArray = JSON.stringify(seatStateFormatArray);

  //配列をシートに出力
  sheet.getRange(SEAT_STATE_ROW,SEAT_STATE_COLUMN).setValue(strSeatStateFormatArray);
}

// 座席確認用の　Format　となる table を作成 & コピー元を 1 枚目に移動
function createTable(sheetName) {

  let checkReferenceSourceSheet = giveCheckSheet()["reference"];
  let checkSheet = giveCheckSheet(sheetName)["sheet"]; //座席確認用の Sheet

  tableSets(checkSheet); //@tableSets
  checkSheet.activate(); //sheetをアクティブにする

  //移動させる初期値
  const SHEET_INIT_POSITION = 1;

  //そのシートを SHEET_INIT_POSITION 枚目に移動
  checkReferenceSourceSheet.moveActiveSheet(SHEET_INIT_POSITION);

}

// 特定の 1 枚以外を削除して initSheetName という名のシートを作成する
function deleteAndSetInitSheet(initSheetName) {
  let checkReferenceSourceSheet = giveCheckSheet()["reference"];
  let DUMMY_CHECK_SHEET_NAME = "dummy";

  let sheets_name = sheetsNameList();
  sheets_name.map((name) => {
    if(name != DUMMY_CHECK_SHEET_NAME){
      let sheet = checkReferenceSourceSheet.getSheetByName(name);
  
      checkReferenceSourceSheet.deleteSheet(sheet);
    }
  });
  checkReferenceSourceSheet.insertSheet().setName(initSheetName);
}

//座席確認用のシートの名前を返す関数
function sheetsNameList() {
  let checkReferenceSourceSheet = giveCheckSheet()["reference"] //座席確認用SPREADSHEET 
  let checkSheets = checkReferenceSourceSheet.getSheets();
  let checkSheetsNames = checkSheets.map((sheet) => {
    return sheet.getSheetName();
  });

  return checkSheetsNames;
}

//座席確認用の　Format　となる table を作成
function tableSets(sheet) {
  
  const STR_RESERVED_FORMAT = "←予約済み";
  const COLOR_CODE_FORMAT = "#e6e6fa";
  const STR_TIME_SEAT_DIVIDE_FORMAT = "時間 / 座席番号";

  const COLOR_POSITION_ROW = 1;
  const COLOR_POSITION_COLUMN = 2;

  const RESERVED_POSITION_ROW = 1;
  const RESERVED_POSITION_COLUMN = 3;

  const DIVIDE_POSITION_ROW = 3;
  const DIVIDE_POSITION_COLUMN = 1;

  const INIT_SPACE = 2; //sheetの上から最初の2行の空白

  const TIME_AND_SEAT_SPACE = 1; // 時間 / 座席番号 と書かれているセルの分

  const ADDITION_SPACE = 1; //前半(1~10)　から 後半(11~20) (もちろんそれ以降も)　追加するごとに設ける空白

  let durationArray = timeFormat()[1];

  let baseSeatArray = timeFormat()[2];

  let baseSeatLen = baseSeatArray.length;
  let timeLen = durationArray.length;

  const ALL_SEAT_NUM = 20; //全座席数
  let seatUnitNum = parseInt(ALL_SEAT_NUM / baseSeatLen); // 1 unit ここでは 10席 が何個作れるか　何ユニットあるか

  sheet.getRange(COLOR_POSITION_ROW,COLOR_POSITION_COLUMN).setBackground(COLOR_CODE_FORMAT);
  sheet.getRange(RESERVED_POSITION_ROW,RESERVED_POSITION_COLUMN).setValue(STR_RESERVED_FORMAT);

  sheet.getRange(DIVIDE_POSITION_ROW,DIVIDE_POSITION_COLUMN).setValue(STR_TIME_SEAT_DIVIDE_FORMAT);

  sheet.getRange(DIVIDE_POSITION_ROW + timeLen + TIME_AND_SEAT_SPACE + ADDITION_SPACE,DIVIDE_POSITION_COLUMN).setValue(STR_TIME_SEAT_DIVIDE_FORMAT);

  durationArray.forEach((value, index) => {
    sheet.getRange(index + INIT_SPACE + TIME_AND_SEAT_SPACE + 1,1).setValue(value)
  });
  

  durationArray.forEach((value, index) => {
    sheet.getRange(index + ADDITION_SPACE + seatUnitNum * TIME_AND_SEAT_SPACE + timeLen + INIT_SPACE + 1,1).setValue(value)
  });

  baseSeatArray.forEach((num, index) => {
    sheet.getRange(INIT_SPACE + TIME_AND_SEAT_SPACE,index + TIME_AND_SEAT_SPACE + 1).setValue(num)
  });


  baseSeatArray.forEach((num, index) => {
  sheet.getRange(INIT_SPACE + seatUnitNum * TIME_AND_SEAT_SPACE + timeLen + ADDITION_SPACE, index + TIME_AND_SEAT_SPACE + 1).setValue(num + baseSeatLen);
  });

}

function sheetCopyAnotherFile(baseSheetName,sheetName) {
//スクリプトに紐付いたアクティブなシートをコピー対象のシートとして読み込む
  let checkReferenceSourceSheet = giveCheckSheet()["reference"];
  let checkSheet = giveCheckSheet(baseSheetName)["sheet"];
  checkSheet.activate();
  let newSheet = checkReferenceSourceSheet.duplicateActiveSheet();

newSheet.setName(sheetName);
let sheetNum = checkReferenceSourceSheet.getNumSheets();

const SHEET_POSITION_BACK = 1;

checkReferenceSourceSheet.moveActiveSheet(sheetNum - SHEET_POSITION_BACK); //シートを一番後ろから SHEET_POSITION_BACK つ前に追加
}


function drawCellsForRow(sheetName,row,column,startRow,endRow,userName){
  let checkSheet = giveCheckSheet(sheetName)["sheet"];

  const COLOR_CODE_FORMAT = "#e6e6fa";

  if(!checkSheet) {
    new Error("Invalid Sheet");
    return;
  }

  checkSheet.getRange(row + startRow,column,endRow - startRow,1)
  .merge()
  .setBorder(true,true,true,true,true,true,null,SpreadsheetApp.BorderStyle.SOLID_MEDIUM)
  .setBackground(COLOR_CODE_FORMAT);

  if(userName) {
    checkSheet.getRange(row + startRow,column,endRow - startRow,1).setHorizontalAlignment("center"); // 水平方向に中央ぞろえする
    checkSheet.getRange(row + startRow,column,endRow - startRow,1).setVerticalAlignment("middle"); // 垂直方向に中央ぞろえする
    checkSheet.getRange(row + startRow,column,endRow - startRow,1).setValue(userName); // 結合したセルの中央に文字を入れる
  }

}


