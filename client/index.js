import moment from 'moment';

const main = document.getElementById('main');

var exampleSocket = new WebSocket('ws://127.0.0.1:5000');


exampleSocket.onopen = function (event) {
  exampleSocket.send('get_feed');
};

function send_msg () {
  exampleSocket.send('caos');
}

function create_article (data, where) {
  let article = document.createElement('article')
  article.className = 'article';
  let title = document.createElement('h1');
  title.className = 'title';
  let time = document.createElement('p');
  let image_container = document.createElement('div');
  image_container.className = 'image-container';
  let image = document.createElement('img');
  let formated_time = moment.unix(data.published_at).format('dddd, MMMM Do YYYY, h:mm:ss a');

  title.innerHTML = data.title;
  time.innerHTML = formated_time;
  image.src = data.image;

  image_container.appendChild(image);
  article.appendChild(title);
  article.appendChild(time);
  article.appendChild(image_container);
  if(where === 'after'){
    main.appendChild(article);
  }else if(where === 'before'){
    main.insertBefore(article, main.childNodes[0]);
  }
}

exampleSocket.onmessage = function (event) {
  if(event.data instanceof Blob) {
    let reader = new FileReader();
    reader.onload = function () {
      const data = JSON.parse(reader.result);
      if(data[0].code === 'feed'){
        for(let i = 0; i < data[1].length; i++){
          create_article(data[1][i], 'after');
        }
      }else if(data[0].code === 'new_msg'){
        create_article(data[1], 'before');
      }
    };
    reader.readAsText(event.data);
  }else{
    let asa = document.createElement('h2');
    asa.innerHTML = event.data;
    main.insertBefore(asa, main.childNodes[0]);
  }
}
