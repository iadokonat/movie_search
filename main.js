"use scrict";

{
  const form = document.getElementById("form");
  // divタグ(APIから返ってきた画像を入れる場所)
  const div = document.getElementById("movie-img");
  const btn = document.getElementById("addbtn");

  // 検索結果をjsonから受け取る関数
  async function callApi(searchWord, div, pageNum) {
    // apiキー
    const apiKey = "57585d1e9624443028acab0f0647ea14";
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=ja&region=ja&page=${pageNum}`;
    const res = await fetch(`${url}&query=${searchWord}`);
    // 検索結果をjsonに変換した配列
    const users = await res.json();
    console.log(users);
    // 検索件数があるとき
    if (users.results.length) {
      users.results.forEach((data) => {
        // 画像のURLがあるもの
        if (data.poster_path) {
          // imgタグを生成
          const imgTag = document.createElement("img");
          // src属性に画像のURLを付与
          imgTag.setAttribute(
            "src",
            `https://image.tmdb.org/t/p/w500/${data.poster_path}`
          );
          // id属性に映画のIDを付与
          imgTag.setAttribute('id', data.id);
          // HTML内のdivタグに追加
          div.appendChild(imgTag);
        // 画像データがないもの
        } else {
          // divタグを生成
          const imgTag = document.createElement('div');
          // クラスにnoImgを付与
          imgTag.classList.add('noImg', data.id);
          // id属性に映画のIDを付与
          imgTag.setAttribute('id', data.id);
          // 映画のタイトルを表示
          if (data.title) {
            imgTag.textContent = data.title;
          } else {
            imgTag.textContent = 'No Picture';
          }
          // HTML内のdivタグに追加
          div.appendChild(imgTag);
        }
      });
    }
    // 表示できる結果がないとき
    if (div.children.length === users.total_results) {
      div.nextElementSibling.setAttribute('style', 'display: none;');
    }
  }

  const app = new Vue({
    el: "#app",
    data: {
      showPage: "searchPage",
      // input内のデータ
      searchWord: "",
      // 取得するデータのページ
      pageNum: 1,
    },
    methods: {
      // 最初の検索ページへ
      toHome: function () {
        // pタグのdisplay: none;にする
        document.getElementById('para').classList.add('hidden');

        this.searchWord = "";

        // divタグ内にある子要素を削除(前回の検索結果がある場合に削除)
        const detailDiv = document.getElementById('detail');
        const detailDivLen = detailDiv.children.length;
        for (let i = 0; i < detailDivLen; i++) {
          detailDiv.firstChild.remove();
        }

        this.showPage = "searchPage";
      },

      // 検索結果を表示
      isSearch: function (e) {
        const div = document.getElementById('movie-img');
        const divChild = div.children.length;
        // divタグ内にある子要素を削除(前回の検索結果がある場合に削除)
        for (let i = 0; i < divChild; i++) {
          div.firstChild.remove();
        }
        // 検索ページにリセット
        this.showPage = "searchPage";
        // 取得するデータページをリセット
        this.pageNum = 1;
        // フォーム内が空じゃないとき
        if (this.searchWord) {
          // 検索結果をjsonから受け取る関数
          callApi(this.searchWord, div, this.pageNum).then(() => {
            // 検索結果があるとき
            if (div.children.length) {
              this.showPage = "searchResult";
            // 検索結果がないとき
            } else {
              // pタグのdisplay: none;を解除
              document.getElementById('para').classList.remove('hidden');
            }
          });
        }
      },

      // 映画の詳細を表示
      isDetail: async function (e) {
        // divタグ内にある子要素を削除(前回の検索結果がある場合に削除)
        const detailDiv = document.getElementById('detail');
        const detailDivLen = detailDiv.children.length;
        for (let i = 0; i < detailDivLen; i++) {
          detailDiv.firstChild.remove();
        }

        // 表示したい映画のID
        const detailId = e.target.getAttribute('id');
        // apiキー
        const apiKey = "57585d1e9624443028acab0f0647ea14";
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${detailId}?api_key=${apiKey}&language=ja&region=ja`
        );
        // 検索結果をjsonに変換した配列
        const detailData = await res.json();
        console.log(detailData);

        // divタグに生成した要素を追加していく
        const addDiv = function (imgTag) {
          // h1タグ生成
          const title = document.createElement("h1");
          // h1にタイトルを入れる
          if (detailData.title) {
            title.textContent = detailData.title;
          } else {
            title.textContent = 'タイトルの情報はありません';
          }
          // h2タグ生成
          const overviewTitle = document.createElement("h2");
          // h2にタイトルを入れる
          overviewTitle.textContent = "あらすじ";
          // pタグを生成
          const overview = document.createElement("p");
          // あらすじを作成
          if (detailData.overview) {
            overview.textContent = detailData.overview;
          } else {
            overview.textContent ='あらすじの情報はありません'
          }

          // HTML内のdivタグに追加
          detailDiv.appendChild(imgTag);
          detailDiv.appendChild(title);
          detailDiv.appendChild(overviewTitle);
          detailDiv.appendChild(overview);
        };

        // 画像データがあるとき
        if (detailData.poster_path) {
          // imgタグを生成
          const imgTag = document.createElement("img");
          // src属性に画像のURLを付与
          imgTag.setAttribute(
            "src",
            `https://image.tmdb.org/t/p/w500/${detailData.poster_path}`
          );
          addDiv(imgTag);
        } else {
          // divタグを生成
          const imgTag = document.createElement('div');
          // クラスにnoImgとdataのIDを付与
          imgTag.classList.add('noImg');
          // No Pictureと表示
          imgTag.textContent = 'No Picture';
          addDiv(imgTag);
        }
        
        // 映画の詳細ページを表示
        this.showPage = "detailPage";
      },

      // addボタンが押されたとき
      isAdd: function (e) {
        const div = e.target.previousElementSibling;
        // 取得するデータの新しいページ
        this.pageNum++;
        // 検索結果をjsonから受け取る関数
        callApi(this.searchWord, div, this.pageNum);
      },
    },
  });
}
