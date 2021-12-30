import moment from 'moment';
import {Loading} from './animation.js';

const main = document.getElementById('main');
const con = document.createElement('div');
const d1 = document.createElement('div');
const d2 = document.createElement('div');
const d3 = document.createElement('div');
const d4 = document.createElement('div');
con.appendChild(d1);
con.appendChild(d2);
con.appendChild(d3);
con.appendChild(d4);
main.appendChild(con);

let a = new Loading(con, d1, d2, d3, d4);

a.animationStart()


var exampleSocket = new WebSocket('ws://192.168.1.25:5000');

let count = 0;

window.onscroll = function() {
  let distanceScrolled = document.documentElement.scrollTop;
  if(distanceScrolled > 1000 && count === 0){
    let btnTop = document.createElement('button');
    btnTop.innerHTML = 'ASA';
    main.insertBefore(btnTop, main.childNodes[0]);
    count++;
  }
}

exampleSocket.onopen = function (event) {
  exampleSocket.send('get_feed');
};

function send_msg () {
  exampleSocket.send('caos');
}

function create_article (data, where) {
  let article = document.createElement('article')
  article.className = 'article';

  let link = document.createElement('a');
  link.href = data.link;
  link.target = '_blank';
  article.appendChild(link);

  let title = document.createElement('h1');
  title.className = 'title';
  title.innerHTML = data.title;
  link.appendChild(title);

  let time = document.createElement('p');
  let formated_time = moment.unix(data.published_at).format('dddd, MMMM Do YYYY, h:mm:ss a');
  // let formated_time = data.published_at;
  time.className = 'time';
  time.innerHTML = formated_time;
  article.appendChild(time);

  if(data.image){
    let image_container = document.createElement('div');
    image_container.className = 'image-container';
    let image = document.createElement('img');
    image.src = data.image;
    image_container.appendChild(image);
    article.appendChild(image_container);
  }

  let desc = document.createElement('p');
  desc.innerHTML = data.description;
  desc.className= 'desc';
  article.appendChild(desc);

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
        a.animationEnd();
        for(let i = 0; i < data[1].length; i++){
          create_article(data[1][i], 'after');
        }
      }else if(data[0].code === 'new_msg'){
        create_article(data[1], 'before');
      }
    };
    reader.readAsText(event.data);
  }
}
