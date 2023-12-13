const DEAL_URL = "https://api.zsm.wiki/deal";
const DOWNLOAD_URL = "https://api.zsm.wiki/download";
const DOMAINLIST = [
  "www.jianpian.cn",
  "www.meipian.cn",
  "www.wztg0.cn"
];
const ID_ARRAY = [];

function main() {
  let inputUrl = document.getElementById('inputUrl').value;
  if (isValidURL(inputUrl) && noCovered(inputUrl)) {
    dealArticle(inputUrl);
  }
}

function getArticleIdFromUrl(url) {
  const newUrl = new URL(url);
  let pathname = newUrl.pathname;
  let hostname = newUrl.hostname;
  let parts = pathname.split("/");
  let articleId;
  if (hostname === DOMAINLIST[0] || hostname === DOMAINLIST[2]) {
    articleId = parts[2];
  }
  if (hostname === DOMAINLIST[1]) {
    articleId = parts[1];
  }
  return articleId;
}

function noCovered(url){
  let articleId = getArticleIdFromUrl(url);
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
  let url = DEAL_URL + '?url=' + encodeURIComponent(inputUrl)
          + "&id=" + getArticleIdFromUrl(inputUrl);
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
  let articleArea = document.getElementById('articleArea');
  let newArticleList = document.createElement('li');
  let span = document.createElement('span');
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
  let loader = document.getElementById("loader");
  loader.style.display = "block";
}
function hideLoader(){
  let loader = document.getElementById("loader");
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