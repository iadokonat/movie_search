'use scrict';

{
  

  const form = document.getElementById('form');
  // divタグ(APIから返ってきた画像を入れる場所)
  const div = document.getElementById('movie-img');
  const btn = document.getElementById('addbtn');

  // 検索結果をjsonから受け取る関数
  async function callApi(searchWord, div, pageNum) {
    // apiキー
    const apiKey = '57585d1e9624443028acab0f0647ea14';
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=ja&region=ja&page=${pageNum}`;
    const res = await fetch(`${url}&query=${searchWord}`);
    // 検索結果をjsonに変換した配列
    const users = await res.json();
    console.log(users);
    const img = users.results.map(data => {
      if (data.poster_path) {
        // 映画の画像
        return data;
      } else {
        return null;
      }
    });
    img.forEach(data => {
      // 画像のURLがあるものだけ
      if (data) {
        // imgタグを生成
        const imgTag = document.createElement('img');
        // src属性に画像のURLを付与
        imgTag.setAttribute('src', `https://image.tmdb.org/t/p/w500/${data.poster_path}`);
        imgTag.setAttribute('class', data.id);
        // HTML内のdivタグに追加
        div.appendChild(imgTag);
      }
    });

  }


  const app = new Vue({
    el: '#app',
    data: {
      showPage: 'searchPage',
      // input内のデータ
      searchWord: '',
      // 取得するデータのページ
      pageNum: 1,
    },
    methods: {
      // titleをクリックしたとき
      toHome: function() {
        this.searchWord ='';
        this.showPage = 'searchPage';
      },
      // 検索されたとき
      isSearch: function(e) {
        const div = e.target.nextElementSibling;
        const divChild = div.children.length;
        // divタグ内にある子要素を削除
        for (let i = 0; i < divChild; i++) {
          div.firstChild.remove();
        }
        // 取得するデータページをリセット
        this.pageNum = 1;
        // フォーム内が空じゃないとき
        if (this.searchWord) {
          // 検索結果を表示する関数
          const showResult = function() {
            console.log(div.children);
            this.showPage = 'searchResult';         
          }
          // 検索結果をjsonから受け取る関数
          callApi(this.searchWord, div, this.pageNum)
            .then(() => {
              if (div.children.length) {
                this.showPage = 'searchResult';
              } else {
                this.showPage = 'searchPage';
              }
            });
          // フォーム内を空にする
          // this.searchWord = '';
        }
        
      },

      isDetail: async function(e) {
        // 表示したい映画のID
        const detailId = e.target.className;
        // apiキー
        const apiKey = '57585d1e9624443028acab0f0647ea14';
        const res = await fetch(`https://api.themoviedb.org/3/movie/${detailId}?api_key=${apiKey}&language=ja&region=ja`);
        // 検索結果をjsonに変換した配列
        const detailData = await res.json();
        console.log(detailData);
        // imgタグを生成
        const imgTag = document.createElement('img');
        // src属性に画像のURLを付与
        imgTag.setAttribute('src', `https://image.tmdb.org/t/p/w500/${detailData.poster_path}`);
        // h1タグ生成
        const title = document.createElement('h1');
        // h1にタイトルを入れる
        title.textContent = detailData.title;
        // h2タグ生成
        const overviewTitle = document.createElement('h2');
        // h2にタイトルを入れる
        overviewTitle.textContent = 'あらすじ';
        // pタグを生成
        const overview = document.createElement('p');
        // あらすじを作成
        overview.textContent = detailData.overview;

        // HTML内のdivタグに追加
        const divDetail = document.getElementById('detail');
        divDetail.appendChild(imgTag);
        divDetail.appendChild(title);
        divDetail.appendChild(overviewTitle);
        divDetail.appendChild(overview);
        
        this.showPage = 'detailPage';
      },

      // addボタンが押されたとき
      isAdd: function(e) {
        const div = e.target.previousElementSibling;
        // 取得するデータの新しいページ
        this.pageNum++;
        // 検索結果をjsonから受け取る関数
        callApi(this.searchWord, div, this.pageNum);
        // フォーム内を空にする
        // this.searchWord = '';
        
      },
    },
  });

}