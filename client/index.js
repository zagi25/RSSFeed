import {Loading} from './animation.js';

const main = document.getElementById('main');
const btnTop = document.getElementById('btnTop');
const settBtn = document.getElementById('settBtn');

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

var exampleSocket = new WebSocket('wss://rssfeed-websocket-server.herokuapp.com');

let scrollCount = 0;
let observer;
let isVisible = false;
let articleCount = 20;

if(window.localStorage.length === 0){
  window.location.href = './settings.html';
}

btnTop.addEventListener('click', toTop);
settBtn.addEventListener('click', toSett);


function toTop () {
  document.documentElement.scrollTop = 0;
}

function toSett () {
  exampleSocket.close(); 
  window.location.href = './settings.html';
}

window.onscroll = function() {
  let distanceScrolled = document.documentElement.scrollTop;
  if(distanceScrolled > 1000 && scrollCount === 0){
    btnTop.style.display = 'block';
    scrollCount = 1;
  }else if(distanceScrolled < 1000 && scrollCount === 1){
    btnTop.style.display = 'none';
    scrollCount = 0;
  }
}

exampleSocket.onopen = function (event) {
  const links = window.localStorage;
  const message = {code:'get_feed', data: links};
  exampleSocket.send(JSON.stringify(message));
};

function create_article (data, where, index, length) {
  let no_more = false;

  let article = document.createElement('article')
  article.className = 'article';
  article.id = data.id;

  let link = document.createElement('a');
  link.href = data.data.link;
  link.target = '_blank';
  article.appendChild(link);

  let title = document.createElement('h1');
  title.className = 'title';
  title.innerHTML = data.data.title;
  link.appendChild(title);

  let time = document.createElement('p');
  let formated_time = new Date(data.data.published_at * 1000);
  time.className = 'time';
  time.innerHTML = formated_time.toLocaleString('en-GB');
  article.appendChild(time);

  if(data.data.image){
    let image_container = document.createElement('div');
    image_container.className = 'image-container';
    let image = document.createElement('img');
    image.src = data.data.image;
    image_container.appendChild(image);
    article.appendChild(image_container);
  }

  let desc = document.createElement('p');
  desc.innerHTML = data.data.desc;
  desc.className= 'desc';
  article.appendChild(desc);

  if(length === 20){
    if(index === 15){
      observer = new IntersectionObserver(function ([entry]) {
        if(entry.isIntersecting){
          fetch_more(article);
        }
      },{rootMargin: '0px', threshold: 0.5,});
      observer.observe(article);
    }
  }else if(length < 20){
    if(index === length - 1){
      no_more = true;
    }
  }

  if(where === 'after'){
    main.appendChild(article);
    if(no_more){
      let no_more_news = document.createElement('h1');
      no_more_news.innerHTML = 'No more news';
      no_more_news.className = 'no-news';
      main.appendChild(no_more_news);
    }
  }else if(where === 'before'){
    main.insertBefore(article, main.childNodes[0]);
  }
}

function fetch_more (article) {
  const message = {code:'get_more_feed', data: articleCount};
  exampleSocket.send(JSON.stringify(message));
  observer.unobserve(article);
  articleCount += 20;
}

exampleSocket.onmessage = function (event) {
  if(event.data instanceof Blob) {
    let reader = new FileReader();
    reader.onload = function () {
      const data = JSON.parse(reader.result);
      console.log(data[1]);
      if(data[0].code === 'feed'){
        a.animationEnd();
        for(let i = 0; i < data[1].length; i++){
          create_article(data[1][i], 'after', i, data[1].length);
        }
      }else if(data[0].code === 'new_msg'){
        create_article(data[1], 'before');
      }else if(data[0].code === 'more_feed'){
        for(let i = 0; i < data[1].length; i++){
          create_article(data[1][i], 'after', i, data[1].length);
        }
      }
    };
    reader.readAsText(event.data);
  }
}
