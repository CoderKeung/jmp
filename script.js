const DEAL_URL = "http://127.0.0.1:8001/deal";
const DOWNLOAD_URL = "http://127.0.0.1:8001/download";
const DOMAINLIST = [
  "www.jianpian.cn",
  "www.meipian.cn",
  "www.wztg0.cn"
];
const ID_ARRAY = [];

function main() {
  var inputUrl = document.getElementById('inputUrl').value;
  if (isValidURL(inputUrl) && noCovered(inputUrl)) {
    dealArticle(inputUrl);
  }
}

function noCovered(url){
  const newUrl = new URL(url);
  var pathname = newUrl.pathname;
  var hostname = newUrl.hostname;
  var parts = pathname.split("/");
  var articleId;
  if (hostname == DOMAINLIST[0] || hostname == DOMAINLIST[2]) {
    articleId = parts[2]; 
  }
  if (hostname == DOMAINLIST[1]) {
    articleId = parts[1];
  }
  if (ID_ARRAY.includes(articleId)) {
    swal({
      title: "转换过了！",
      icon: "error"
    })
    return false;
  } else {
    return true;
  }
}

function dealArticle(inputUrl) {
  showLoader();
  var url = DEAL_URL + '?url=' + encodeURIComponent(inputUrl);
  // 发送 GET 请求
  fetch(url)
    .then(response => response.json())
    .then(articleData => {
      if (articleData.success) {
        createArticleList(articleData);
        ID_ARRAY.push(articleData.id);
        swal({
          title: "转换成功",
          icon: "success"
        })
      } else {
        swal({
          title: "转换失败",
          icon: "error"
        })
      }
    hideLoader();
    })
    .catch(error => {
      // 处理错误
      console.error('Error:', error);
    });
}
function createArticleList(articleData) {
  var articleArea = document.getElementById('articleArea');
  var newArticleList = document.createElement('li');
  var span = document.createElement('span');
  newArticleList.textContent = "💡 ";
  span.textContent = articleData.title;
  newArticleList.classList.add('articleListItem');
  newArticleList.setAttribute('id', articleData.id)
  newArticleList.addEventListener('click', getArticleFile)
  newArticleList.appendChild(span);
  articleArea.appendChild(newArticleList);
  articleArea.style.display = "block";
}
function showLoader(){
  var loader = document.getElementById("loader");
  loader.style.display = "block";
}
function hideLoader(){
  var loader = document.getElementById("loader");
  loader.style.display = "none";
}
function getArticleFile() {
  const url = DOWNLOAD_URL + '?id=' + encodeURIComponent(this.id);
  const title = this.querySelector('span').textContent;
  fetch(url)
    .then(response => response.blob())
    .then(blob => {
      saveAs(blob, title+'.docx');
    })
    .catch(error => {
      console.error('Error:', error);
    })
}

function isValidURL(url) {
  const regex = /^(ftp|http|https):\/\/[^ "]+$/;
  if (!regex.test(url)) {
    swal({
      title: "链接有误",
      icon: "error"
    });
    return false;
  } else {
    const hostname = new URL(url).hostname;
    if (DOMAINLIST.includes(hostname)) {
      return true;
    } else {
      swal({
        title: "链接有误",
        icon: "error"
      });
      return false;
    }
  }
}