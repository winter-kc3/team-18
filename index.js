const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const admin = require('firebase-admin');
const paths = require('./paths.json');

function seek(/*object*/ obj, /*string*/ tag) {
  // 自分 (obj) が tag で指定されているか確認
  if (obj.tag === tag) return obj;

  // 子要素のどれかが tag で指定されているか確認
  if ('child' in obj) {
    for (let i = 0; i < obj.child.length; i++) {
      const result = seek(obj.child[i], tag);
      if (result !== null) return result;
    }
    return null;
  }

  // ヒットしなかった
  return null;
}

admin.initializeApp({
  credential: admin.credential.cert({
    type: process.env.type,
    project_id: process.env.project_id,
    project_key_id: process.env.project_key_id,
    private_key: process.env.private_key.replace(/\\n/g, '\n'),
    client_email: process.env.client_email,
    client_id: process.env.client_id,
    auth_url: process.env.auth_url,
    token_url: process.env.token_url,
    auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
    client_x509_cert_url: process.env.client_x509_cert_url
  })
});

const db = admin.firestore();

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
    if (event.type === 'message') {
      switch (event.message.text) {
        case 'テスト3':
          category(event);
          break;
      }
      return;
    }

    if (event.type === 'postback') {
      const eventPostbackData = event.postback.data;

      reply(event, {
        messages: [{
          type: 'text',
          text: eventPostbackData === 'food'
                ? otherFoodCategory(event) 
                : '観光です。'

        }]
      })
      // for (let i = 0; i < paths.length; i ++) {
      //   const result = seek(paths[i], eventPostbackData);
      //   if (result !== null) {
      //     generateTemplate(event, result);
      //     return;
      //   }
      //   if (i === paths.length - 1) {
      //     console.error('不正な postback です');
      //     return;
      //   }
      // }
    }
  }
});

/*
console.log(JSON.stringify(paths[0].child.map(item => {
  //console.log(item);
  return {
    thumbnailImageUrl: item.image,
    title: item.title,
    text: item.text,
    actions: [{
      type: 'postback',
      label: '選択',
      data: item.tag
    }]
  };
})));
*/

/*
console.log(JSON.stringify([
  {
    thumbnailImageUrl: 'https://d1f5hsy4d47upe.cloudfront.net/38/38c80c991b9ae168c19f9782b48a07b0_t.jpeg',
    title: '飲食',
    text: '>粉物,スイーツ,その他',
    actions: [{
      type: 'postback',
      label: '選択',
      data: 'food'
    }]
  },
  {
    thumbnailImageUrl: 'https://d1f5hsy4d47upe.cloudfront.net/d7/d7204f6c5a25a9bde5ae435b7c3b1ee9_w.jpg',
    title: 'スポット',
    text: '>観光、レジャー',
    actions: [{
      type: 'postback',
      label: '選択',
      data: 'spot'
    }]
  }
]));
*/

// function generateTemplate(event, obj) {
//   if ('child' in obj) {
//     // 質問する
//     const request = {
//       messages: [{
//         type: 'template',
//         altText: 'これはテンプレートメッセージです。このバージョンでは対応していません。',
//         template: {
//           type: 'carousel',
//           columns: obj.child.map(item => {
//             console.log(item);
//             return {
//               thumbnailImageUrl: item.image,
//               title: item.title,
//               text: item.text,
//               actions: [{
//                 type: 'postback',
//                 label: '選択',
//                 data: item.tag
//               }]
//             };
//           })
//         }
//       }]
//     };
//     reply(event, request);
//     return;
//   }

//   // 検索結果を発言する
// }

function category(event) {
  reply(event, {
    messages: [{
      type: 'template',
      altText: 'これはテンプレートメッセージです。このバージョンでは対応していません。',
      template: {
        type: 'carousel',
        columns: [
          {
            thumbnailImageUrl: 'https://d1f5hsy4d47upe.cloudfront.net/38/38c80c991b9ae168c19f9782b48a07b0_t.jpeg',
            title: '飲食',
            text: '>粉物,スイーツ,その他',
            actions: [{
              type: 'postback',
              label: '選択',
              data: 'food'
            }]
          },
          {
            thumbnailImageUrl: 'https://d1f5hsy4d47upe.cloudfront.net/d7/d7204f6c5a25a9bde5ae435b7c3b1ee9_w.jpg',
            title: 'スポット',
            text: '>観光、レジャー',
            actions: [{
              type: 'postback',
              label: '選択',
              data: 'spot'
            }]
          }
        ]
      }
    }]
  })
}
function otherFoodCategory(event) {
  reply(event, {
    messages: [{
      type: 'template',
      altText: 'これはテンプレートメッセージです。このバージョンでは対応していません。',
      template: {
        type: 'carousel',
        columns: [
          {
           thumbnailImageUrl: 'https://d1f5hsy4d47upe.cloudfront.net/38/38c80c991b9ae168c19f9782b48a07b0_t.jpeg',
           title: '和食',
           text: '和食',
           actions: [{
             type: 'postback',
             label: '選択',
             data: 'wasyoku',
             displayText: '和食を選択しました。'
           }]
          },
          {
            thumbnailImageUrl: 'https://d1f5hsy4d47upe.cloudfront.net/38/38c80c991b9ae168c19f9782b48a07b0_t.jpeg',
            title: '中華',
            text: '中華',
            actions: [{
              type: 'postback',
              label: '選択',
              data: 'tyuka',
              displayText: '中華を選択しました。'
            }]
          }
        ]
      }
    }]
  })
}


async function reply(event, body) {
  try {
    await axios.post('https://api.line.me/v2/bot/message/reply', {
      replyToken: event.replyToken,
      ...body
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.channel_access_token}`
      }
    });
  } catch (e) {
    console.log(e);
  }
}
