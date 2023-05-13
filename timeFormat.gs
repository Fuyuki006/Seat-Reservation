function timeFormat() {

  //時間の種類を格納
  let timeFormatArray = ["7:00","8:00","9:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00"];

  let timeFormatLen = timeFormatArray.length;

  let durationArray = timeFormatArray.map((time,index) => {
    if(index != timeFormatLen - 1){
    return time + "~" + timeFormatArray[index + 1];
    }
  })

  //結合した分配列の長さが小さくなる
  durationArray.pop(null);

  //座席の数の 1 ユニット: 10席を基準
  let baseSeatArray = [1,2,3,4,5,6,7,8,9,10];

  return [timeFormatArray,durationArray,baseSeatArray]

}
