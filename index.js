const channelAccessToken = 'xJDP5i5HkrbQjpMSuKErT0Djyp/r+OQxjjaNJ/H+bFbEP6esa/1bcKJr2eNilMeCy7jve90C0Pxf1CZrsoGvTigkOWzzJdAMuCyiWcDAyqtP0yk3467SAv+JXGQt3cgXUu8Dey2I0tZumMqeZ/TFdgdB04t89/1O/w1cDnyilFU=';
const url = 'https://api.line.me/v2/bot/message/reply';

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const firebase = require('firebase-admin');

const app = express();

app.use(bodyParser.json());

const server = app.listen(process.env.PORT, () => {
  console.log(`Node.js is listening to PORT: ${server.address().port}`);
});

app.get('/', (req, res, next) => {
  res.json('Hello World!');
});

app.post('/webhook', function (req, res, next) {
  res.status(200).end();

  for (let event of req.body.events) {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${channelAccessToken}`
    };

    if (event.type === 'message') {
      if (event.message.text === 'ハロー') {
        axios.post(url, {
          replyToken: event.replyToken,
          messages: [{
            type: 'text',
            text: 'こんにちは'
          }]
        }, { headers });
      } else if (event.message.text === 'テスト') {
        axios.post(url, {
          replyToken: event.replyToken,
          messages: [{
            type: 'template',
            altText: 'これはテンプレートメッセージです。このバージョンでは対応していません。',
            template: {
              type: 'carousel',
              columns: [
                {
                  thumbnailImageUrl: 'https://res.cloudinary.com/tsundoku/image/upload/v1550587379/p_002.jpg',
                  title: '白咲 花',
                  text: 'しろさき はな',
                  actions: [{
                    type: 'postback',
                    label: 'かわいい',
                    data: 'hana'
                  }]
                },
                {
                  thumbnailImageUrl: 'https://res.cloudinary.com/tsundoku/image/upload/v1550587383/p_003.jpg',
                  title: '星野 ひなた',
                  text: 'ほしの ひなた',
                  actions: [{
                    type: 'postback',
                    label: 'かわいい',
                    data: 'hinata'
                  }]
                },
                {
                  thumbnailImageUrl: 'https://res.cloudinary.com/tsundoku/image/upload/v1550587388/p_004.jpg',
                  title: '姫坂 乃愛',
                  text: 'ひめさか のあ',
                  actions: [{
                    type: 'postback',
                    label: 'かわいい',
                    data: 'noa'
                  }]
                }
              ]
            }
          }]
        }, { headers }).catch(error => console.log(error));
      } else if (event.message.text === 'テスト2') {
        console.log({
          type: process.env.type,
          project_id: process.env.project_id,
          project_key_id: process.env.project_key_id,
          private_key: process.env.private_key,
          client_email: process.env.client_email,
          client_id: process.env.client_id,
          auth_url: process.env.auth_url,
          token_url: process.env.token_url,
          auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
          client_x509_cert_url: process.env.client_x509_cert_url
        });
      }
    } else if (event.type === 'postback') {
      axios.post(url, {
        replyToken: event.replyToken,
        messages: [{
          type: 'text',
          text: event.postback.data === 'hana'
              ? '花「ありがとうございます。」'
              : (event.postback.data === 'hinata'
                  ? 'ひなた「やったぁー！」'
                  : '乃愛「でっしょー？私が世界で一番かわいい！」')
        }]
      }, { headers });
    }
  }
});
