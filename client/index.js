const header = document.getElementById('home-header');
const main = document.getElementById('home-page');
const input = document.getElementById('link-text');
const container = document.getElementById('links-cont');
const addBtn = document.getElementById('add-btn');
const saveBtn = document.getElementById('save-btn');

addBtn.addEventListener('click', addLink);
container.addEventListener('click', deleteLink);
saveBtn.addEventListener('click', saveLinks);

let links = [];
let storage = window.localStorage;

header.style.display = 'none';
main.style.display = 'none';


if(storage.length > 0){
  window.location.href = './feed.html';
}else{
  header.style.display = 'flex';
  main.style.display = 'flex';
}


function addLink () {
  let one_link = document.createElement('div');
  let link = document.createElement('p');
  let deleteI = document.createElement('i');
  one_link.className='one-link';
  link.innerHTML = input.value;
  links.push(input.value);
  console.log(links);
  deleteI.className = 'far fa-trash-alt';
  one_link.appendChild(link);
  one_link.appendChild(deleteI);
  one_link.id = container.children.length;
  container.appendChild(one_link);
  input.value = '';
  saveBtn.style.display = 'block';
}

function deleteLink (e) {
  if(e.target.tagName === 'I'){
    let value = e.target.parentNode.childNodes[0].textContent;
    let index = links.indexOf(value);
    links.splice(index,1);
    e.target.parentElement.remove();
    if(container.children.length === 0){
      saveBtn.style.display = 'none';
    }
  }
}

function saveLinks () {
  for(let i = 0; i < links.length; i++){
    localStorage.setItem(`link${i}`, links[i]);
  }
  window.location.href = './feed.html';
}
