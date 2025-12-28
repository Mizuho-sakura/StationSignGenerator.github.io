/* =================================================================
   要素の取得
================================================================= */
const stationJa   = document.getElementById("station-ja");
const stationKana = document.getElementById("station-kana");
const stationEn   = document.getElementById("station-en");
const locationEl  = document.getElementById("location");

const bStationJa  = document.getElementById("b_station_ja");
const bStationEn  = document.getElementById("b_station_en");
const nStationJa  = document.getElementById("n_station_ja");
const nStationEn  = document.getElementById("n_station_en");

const toggleImgBox = document.getElementById("toggle-img-box");
const imgInput     = document.getElementById("img-input");
const imgGroup     = document.getElementById("img-box-group");
const uploadedImg  = document.getElementById("uploaded-img");

/* =================================================================
   テキスト入力のイベントリスナー
================================================================= */
document.getElementById("input-ja").addEventListener("input", e => stationJa.textContent = e.target.value);
document.getElementById("input-kana").addEventListener("input", e => stationKana.textContent = e.target.value);
document.getElementById("input-en").addEventListener("input", e => stationEn.textContent = e.target.value.toUpperCase());
document.getElementById("input-lc").addEventListener("input", e => locationEl.textContent = "(" + e.target.value + ")");

document.getElementById("input-bs").addEventListener("input", e => bStationJa.textContent = e.target.value);
document.getElementById("input-bs-en").addEventListener("input", e => bStationEn.textContent = e.target.value);
document.getElementById("input-ns").addEventListener("input", e => nStationJa.textContent = e.target.value);
document.getElementById("input-ns-en").addEventListener("input", e => nStationEn.textContent = e.target.value);


/* =================================================================
   シンボルマーク画像処理（アップロード & D&D & ON/OFF）
================================================================= */

// 共通: 画像ファイルを読み込んでSVGにセットする関数
function loadStationImage(file) {
  if (!file) return;
  // 画像ファイル以外は弾く（簡易チェック）
  if (!file.type.startsWith('image/')) {
    alert('画像ファイルを選択してください');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(event) {
    uploadedImg.setAttribute("href", event.target.result);
  };
  reader.readAsDataURL(file);
}

// 1. 通常のファイル選択変更時
imgInput.addEventListener("change", function(e) {
  loadStationImage(e.target.files[0]);
});

// 2. ドラッグ＆ドロップ対応
// デフォルトの挙動（ファイルを開くなど）を無効化
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  imgInput.addEventListener(eventName, (e) => {
    e.preventDefault();
    e.stopPropagation();
  }, false);
});

// ドラッグ中（見た目を変えるなど必要ならここに記述）
imgInput.addEventListener('dragover', () => {
  if (!imgInput.disabled) {
    imgInput.style.backgroundColor = '#e0e0e0'; // ハイライト
  }
});
imgInput.addEventListener('dragleave', () => {
  imgInput.style.backgroundColor = ''; // 元に戻す
});

// ドロップ時
imgInput.addEventListener('drop', (e) => {
  imgInput.style.backgroundColor = ''; // 元に戻す
  if (imgInput.disabled) return; // 無効時は処理しない

  const dt = e.dataTransfer;
  const files = dt.files;
  loadStationImage(files[0]);
});

// 3. シンボルマーク表示 ON/OFF 切り替え
toggleImgBox.addEventListener("change", updateImgBoxState);

function updateImgBoxState() {
  const isChecked = toggleImgBox.checked;
  
  // SVG上の表示切替
  imgGroup.style.display = isChecked ? "block" : "none";
  
  // 入力フォームの無効化・グレーアウト
  imgInput.disabled = !isChecked;
  
  if (isChecked) {
    imgInput.style.opacity = "1";
    imgInput.style.cursor = "pointer";
  } else {
    imgInput.style.opacity = "0.4"; // 薄くする
    imgInput.style.cursor = "not-allowed";
  }
}

// 初期状態の反映
updateImgBoxState();


/* =================================================================
   ナンバリング情報
================================================================= */
// イニシャル
document.getElementById("line-initial").addEventListener("input", e => {
  document.getElementById("numbering-initial").textContent = e.target.value.toUpperCase();
});

// 駅番号
document.getElementById("station-number").addEventListener("input", e => {
  document.getElementById("numbering-num").textContent = e.target.value;
});

// 土台の色
document.getElementById("numbering-color").addEventListener("input", e => {
  document.getElementById("numbering-bg").setAttribute("fill", e.target.value);
});

// ON/OFF
document.getElementById("toggle-numbering").addEventListener("change", function() {
  document.getElementById("numbering-group").style.display = this.checked ? "block" : "none";
});


/* =================================================================
   PNG 出力処理
================================================================= */
document.getElementById("png-btn").addEventListener("click", async () => {
  const svg = document.getElementById("sign");

  // font.css を読み込む (同じディレクトリにある前提)
  // ※ローカル環境でCORSエラーが出る場合は、サーバー経由で実行するか、
  //   フォント埋め込みを省略する必要があります。
  let fontCSS = "";
  try {
    fontCSS = await fetch("font.css").then(r => r.text());
  } catch (e) {
    console.warn("font.css could not be loaded. Fonts might not apply in PNG.", e);
  }

  // SVG を文字列化
  let svgData = new XMLSerializer().serializeToString(svg);

  // SVG 内にフォントを埋め込む
  // svgタグの直後にstyleタグを挿入
  svgData = svgData.replace(
    /<svg([^>]*)>/,
    `<svg$1><style>${fontCSS}</style>`
  );

  // SVG → PNG 変換
  const img = new Image();
  img.onload = function () {
    const canvas = document.createElement("canvas");
    canvas.width = 3600;
    canvas.height = 2500;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    const png = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = png;
    link.download = "station.png";
    link.click();
  };

  img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgData);
});
