function giveDataSheet(sheetName) {
  const DATA_SPREADSHEET_ID = givePropertiesService().getProperty("DATA_SPREADSHEET_ID");
  let dataReferenceSourceSheet = SpreadsheetApp.openById(DATA_SPREADSHEET_ID);
  let dataSheet = dataReferenceSourceSheet.getSheetByName(sheetName);

  return {"reference": dataReferenceSourceSheet,"sheet": dataSheet};
}

function giveCheckSheet(sheetName) {
  const CHECK_SPREADSHEET_ID = givePropertiesService().getProperty("CHECK_SPREADSHEET_ID"); //座席確認用のSPREADSHEET ID
  let checkReferenceSourceSheet = SpreadsheetApp.openById(CHECK_SPREADSHEET_ID); //座席確認用SPREADSHEET 
  let checkSheet = checkReferenceSourceSheet.getSheetByName(sheetName);

  return {"reference":checkReferenceSourceSheet,"sheet":checkSheet};
}
