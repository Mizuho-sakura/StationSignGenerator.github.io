// --- 共通のスケール（圧縮）調整ロジック ---
function getScaleX(length) {
  if (length >= 10) return 0.55;
  if (length >= 9)  return 0.62;
  if (length >= 8)  return 0.7;
  if (length >= 7)  return 0.8;
  return 1.0;
}

// --- 共通の字間調整（tspan）ロジック ---
// id: 対象のSVGテキスト要素ID, text: 文字列, type: 'main'か'sub'（メイン駅名か前後駅名かで間隔を変える）
function updateTspanSpacing(elementId, text, type = 'sub') {
  const el = document.getElementById(elementId);
  el.innerHTML = "";
  const len = text.length;

  // 5文字以上、または0文字はそのまま表示
  if (len >= 5 || len === 0) {
    el.textContent = text;
    return;
  }

  const chars = [...text];
  let spacing = 0;

  if (type === 'main') {
    // 中央の大きなひらがな用
    if (len === 4) spacing = 520;
    if (len === 3) spacing = 760;
    if (len === 2) spacing = 1300;
  } else {
    // 漢字や前後駅の小さい文字用
    if (len === 4) spacing = 200;
    if (len === 3) spacing = 300;
    if (len === 2) spacing = 600;
  }

  const totalWidth = (chars.length - 1) * spacing;
  chars.forEach((ch, i) => {
    const t = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
    t.textContent = ch;
    const x = -totalWidth / 2 + i * spacing;
    t.setAttribute("x", x);
    t.setAttribute("y", 0);
    el.appendChild(t);
  });
}

// --- 各イベントハンドラ ---

// ナンバリング位置
function adjustNumberingPosition() {
  const text = document.getElementById("input-ja").value;
  const group = document.getElementById("numbering-group");
  let baseX = (text.length >= 6) ? -700 : -600;
  group.setAttribute("transform", `translate(${baseX}, -300) scale(0.6)`);
}

// メインひらがな
function handleMainJa() {
  const text = document.getElementById("input-ja").value;
  // スケール
  const scale = getScaleX(text.length);
  document.getElementById("name-ja-group").setAttribute("transform", `translate(1800, 600) scale(${scale}, 1)`);
  // 字間
  updateTspanSpacing("station-ja", text, 'main');
  // ナンバリング位置も連動
  adjustNumberingPosition();
}

// メイン漢字
function handleMainKanji() {
  const text = document.getElementById("input-kana").value;
  updateTspanSpacing("station-kana", text, 'sub');
}

// 前駅
function handleBs() {
  const text = document.getElementById("input-bs").value;
  const scale = getScaleX(text.length);
  document.getElementById("name-bs-group").setAttribute("transform", `translate(720, 1950) scale(${scale}, 1)`);
  updateTspanSpacing("b_station_ja", text, 'sub');
}

// 次駅
function handleNs() {
  const text = document.getElementById("input-ns").value;
  const scale = getScaleX(text.length);
  document.getElementById("name-ns-group").setAttribute("transform", `translate(2880, 1950) scale(${scale}, 1)`);
  updateTspanSpacing("n_station_ja", text, 'sub');
}

// --- イベントリスナーの登録 ---
document.getElementById("input-ja").addEventListener("input", handleMainJa);
document.getElementById("input-kana").addEventListener("input", handleMainKanji);
document.getElementById("input-bs").addEventListener("input", handleBs);
document.getElementById("input-ns").addEventListener("input", handleNs);

// --- 初期実行（リロード時に位置を合わせる） ---
handleMainJa();
handleMainKanji();
handleBs();
handleNs();
