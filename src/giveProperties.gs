//PropertiesService.getScriptProperties()を使いまわすための関数
function givePropertiesService(){
  let prop = PropertiesService.getScriptProperties();
  return prop
}