const header = document.getElementById('home-header');
const main = document.getElementById('home-page');
const input = document.getElementById('link-text');
const container = document.getElementById('links-cont');
const addBtn = document.getElementById('add-btn');
const feedBtn = document.getElementById('feed-btn');

let links = [];
let keys = (Object.keys(window.localStorage));

addBtn.addEventListener('click', checkLink);
container.addEventListener('click', deleteLink);
feedBtn.addEventListener('click', getFeed);


if(keys.length > 0){
  for(let i = 0; i < keys.length; i++){
    links.push(localStorage.getItem(keys[i]));
  }
  writeLink();
}


function writeLink () {
  for(let i = 0; i < keys.length; i++){
    let one_link = document.createElement('div');
    let link = document.createElement('p');
    let deleteI = document.createElement('i');
    one_link.className='one-link';
    link.innerHTML = localStorage.getItem(keys[i]);;
    deleteI.className = 'far fa-trash-alt';
    one_link.appendChild(link);
    one_link.appendChild(deleteI);
    one_link.id = container.children.length;
    container.appendChild(one_link);
  }
  feedBtn.style.display = 'block';
}

function isLink (link) {
  let re = /^(?=https)(?=.*rss)/;
  const result = re.test(link);
  console.log(result);
  return result;
}

function newLink () {
  if(keys.length > 0){
    for(let i = 0; i < keys.length; i++){
      let value = localStorage.getItem(keys[i]);
      if(value === input.value){
        return false;
      }else{
        return true;
      }
    }
  }else{
    return true
  }
}

function checkLink () {
  if(newLink){
    if(isLink(input.value)){
      addLink();
    }else{
      alert('Please insert valid RSS link!');
      input.value = '';
    }
  }else{
    alert('Link exists!');
    input.value = '';
  }
}

function addLink () {
  if(input.value !== ''){
    let one_link = document.createElement('div');
    let link = document.createElement('p');
    let deleteI = document.createElement('i');
    one_link.className='one-link';
    link.innerHTML = input.value;
    links.push(input.value);
    deleteI.className = 'far fa-trash-alt';
    one_link.appendChild(link);
    one_link.appendChild(deleteI);
    one_link.id = container.children.length;
    container.appendChild(one_link);
    localStorage.setItem(`link${one_link.id}`, input.value);
    keys = Object.keys(window.localStorage);
    input.value = '';
    feedBtn.style.display = 'block';
  }else{
    alert('Please insert link!');
  }
}

function deleteLink (e) {
  if(e.target.tagName === 'I'){
    let value = e.target.parentNode.childNodes[0].textContent;
    for(let i = 0; i < keys.length; i++){
      let item = localStorage.getItem(keys[i]);
      if(item === value){
        localStorage.removeItem(keys[i]);
      }
    }
    let index = links.indexOf(value);
    links.splice(index,1);
    e.target.parentElement.remove();
    if(container.children.length === 0){
      feedBtn.style.display = 'none';
    }
  }
}

function getFeed () {
  window.location.href = '/';
}

