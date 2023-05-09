function sendSlackMessage() {
  const prop = give_propertiesService();
  let OAuth_token = prop.getProperty("OAuth_token"); // Slack APIのToken
  let channel_id = prop.getProperty("channel_id"); // 送信先のチャンネルID
  const url = "https://slack.com/api/chat.postMessage";

  var today = new Date();
  var year = today.getFullYear();
  var month = ("0" + (today.getMonth() + 1)).slice(-2);
  var day = ("0" + today.getDate()).slice(-2);
  var initialDate = year + "-" + month + "-" + day;

  var message = {
	"blocks": [
		{
			"type": "divider"
		},
		{
			"type": "input",
			"element": {
				"type": "datepicker",
				"initial_date": initialDate,
				"placeholder": {
					"type": "plain_text",
					"text": "日付の選択",
					"emoji": true
				},
				"action_id": "datepicker-action"
			},
			"label": {
				"type": "plain_text",
				"text": "利用年月日",
				"emoji": true
			}
		},
		{
			"type": "input",
			"element": {
				"type": "static_select",
				"placeholder": {
					"type": "plain_text",
					"text": "番号の選択",
					"emoji": true
				},
				"options": [
					{
						"text": {
							"type": "plain_text",
							"text": "1",
							"emoji": true
						},
						"value": "value-0"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "2",
							"emoji": true
						},
						"value": "value-1"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "3",
							"emoji": true
						},
						"value": "value-4"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "4",
							"emoji": true
						},
						"value": "value-5"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "5",
							"emoji": true
						},
						"value": "value-6"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "6",
							"emoji": true
						},
						"value": "value-7"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "7",
							"emoji": true
						},
						"value": "value-8"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "8",
							"emoji": true
						},
						"value": "value-9"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "9",
							"emoji": true
						},
						"value": "value-10"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "10",
							"emoji": true
						},
						"value": "value-11"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "11",
							"emoji": true
						},
						"value": "value-12"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "12",
							"emoji": true
						},
						"value": "value-13"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "13",
							"emoji": true
						},
						"value": "value-14"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "14",
							"emoji": true
						},
						"value": "value-15"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "15",
							"emoji": true
						},
						"value": "value-16"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "16",
							"emoji": true
						},
						"value": "value-17"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "17",
							"emoji": true
						},
						"value": "value-18"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "18",
							"emoji": true
						},
						"value": "value-19"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "19",
							"emoji": true
						},
						"value": "value-20"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "20",
							"emoji": true
						},
						"value": "value-21"
					}
				],
				"action_id": "static_select-action-seat"
			},
			"label": {
				"type": "plain_text",
				"text": "利用する座席の番号",
				"emoji": true
			}
		},
		{
			"type": "input",
			"element": {
				"type": "static_select",
				"placeholder": {
					"type": "plain_text",
					"text": "時間の選択",
					"emoji": true
				},
				"options": [
					{
						"text": {
							"type": "plain_text",
							"text": "7:00",
							"emoji": true
						},
						"value": "value-0"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "8:00",
							"emoji": true
						},
						"value": "value-1"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "9:00",
							"emoji": true
						},
						"value": "value-2"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "10:00",
							"emoji": true
						},
						"value": "value-3"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "11:00",
							"emoji": true
						},
						"value": "value-4"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "12:00",
							"emoji": true
						},
						"value": "value-5"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "13:00",
							"emoji": true
						},
						"value": "value-6"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "14:00",
							"emoji": true
						},
						"value": "value-7"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "15:00",
							"emoji": true
						},
						"value": "value-8"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "16:00",
							"emoji": true
						},
						"value": "value-9"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "17:00",
							"emoji": true
						},
						"value": "value-10"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "18:00",
							"emoji": true
						},
						"value": "value-11"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "19:00",
							"emoji": true
						},
						"value": "value-12"
					}
				],
				"action_id": "static_select-action-ts"
			},
			"label": {
				"type": "plain_text",
				"text": "利用開始予定時間",
				"emoji": true
			}
		},
		{
			"type": "input",
			"element": {
				"type": "static_select",
				"placeholder": {
					"type": "plain_text",
					"text": "時間の選択",
					"emoji": true
				},
				"options": [
					{
						"text": {
							"type": "plain_text",
							"text": "8:00",
							"emoji": true
						},
						"value": "value-1"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "9:00",
							"emoji": true
						},
						"value": "value-2"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "10:00",
							"emoji": true
						},
						"value": "value-3"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "11:00",
							"emoji": true
						},
						"value": "value-4"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "12:00",
							"emoji": true
						},
						"value": "value-5"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "13:00",
							"emoji": true
						},
						"value": "value-6"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "14:00",
							"emoji": true
						},
						"value": "value-7"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "15:00",
							"emoji": true
						},
						"value": "value-8"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "16:00",
							"emoji": true
						},
						"value": "value-9"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "17:00",
							"emoji": true
						},
						"value": "value-10"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "18:00",
							"emoji": true
						},
						"value": "value-11"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "19:00",
							"emoji": true
						},
						"value": "value-12"
					}
				],
				"action_id": "static_select-action-te"
			},
			"label": {
				"type": "plain_text",
				"text": "利用終了予定時間",
				"emoji": true
			}
		},
		{
			"type": "input",
			"element": {
				"type": "checkboxes",
				"options": [
					{
						"text": {
							"type": "plain_text",
							"text": "名前有りで予約する",
							"emoji": true
						},
						"value": "true"
					}
				],
				"initial_options": [
					{
						"text": {
							"type": "plain_text",
							"text": "名前有りで予約する",
							"emoji": true
						},
						"value": "true"
					}
				],
				"action_id": "checkboxes-action"
			},
			"label": {
				"type": "plain_text",
				"text": "名前の有無",
				"emoji": true
			}
		},
		{
			"type": "divider"
		},
		{
			"type": "actions",
			"elements": [
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": "Submit",
						"emoji": true
					},
					"value": "button",
					"action_id": "actionId-0"
				}
			]
		}
	]
};
  
  var options = { // Slack APIへのリクエストのオプション
    'method': 'post',
    'headers': {
      'Authorization': 'Bearer ' + OAuth_token,
      'Content-Type': 'application/json'
    },
    'payload': JSON.stringify({
      'channel': channel_id,
      'blocks': message.blocks,
      "as_user":true
    })
  };
  
  var response = UrlFetchApp.fetch(url, options); // Slack APIへのリクエストを送信
  Logger.log(response.getContentText()); // Slack APIからのレスポンスをログに出力
}

function give_propertiesService(){
  const prop = PropertiesService.getScriptProperties();
  return prop
}
