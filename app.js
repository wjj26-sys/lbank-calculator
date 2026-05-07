const dateInput = document.getElementById("dateInput");
const timeInput = document.getElementById("timeInput");
const positionInput = document.getElementById("positionInput");
const sideInput = document.getElementById("sideInput");
const leverageInput = document.getElementById("leverageInput");
const entryInput = document.getElementById("entryInput");
const targetInput = document.getElementById("targetInput");
const codeInput = document.getElementById("codeInput");

const saveNameInput = document.getElementById("saveNameInput");
const savedCodeSelect = document.getElementById("savedCodeSelect");

const dateRender = document.getElementById("dateRender");
const positionRender = document.getElementById("positionRender");
const sideRender = document.getElementById("sideRender");
const leverageRender = document.getElementById("leverageRender");
const pnlRender = document.getElementById("pnlRender");
const entryRender = document.getElementById("entryRender");
const targetRender = document.getElementById("targetRender");
const codeValueRender = document.getElementById("codeValueRender");
const qrImage = document.getElementById("qrImage");

const PATH = {
  date: "assets/date-white-thin/",
  pnl: "assets/pnl-green/",
  price: "assets/price-white-bold/",
  code: "assets/code-white-bold/",
  position: "assets/position/",
  side: "assets/side/",
  barcode: "assets/barcode/",
  leverage: "assets/leverage/"
};

const STORAGE_KEY = "lbankSavedCodes";
const MAX_SAVED_CODES = 300;
const MAX_CODE_LENGTH = 5;
const MAX_LEVERAGE = 500;

/*
  네가 수정한 배치값 유지!
*/
const LEVERAGE_POSITION = {
  long: {
    left: 504,
    top: 244
  },
  short: {
    left: 507,
    top: 244
  }
};

const dateMap = {
  "0": "0.png",
  "1": "1.png",
  "2": "2.png",
  "3": "3.png",
  "4": "4.png",
  "5": "5.png",
  "6": "6.png",
  "7": "7.png",
  "8": "8.png",
  "9": "9.png",
  "-": "dash.png",
  ":": "colon.png"
};

const pnlMap = {
  "0": "0.png",
  "1": "1.png",
  "2": "2.png",
  "3": "3.png",
  "4": "4.png",
  "5": "5.png",
  "6": "6.png",
  "7": "7.png",
  "8": "8.png",
  "9": "9.png",
  ".": "dot.png",
  "+": "plus.png",
  "%": "percent.png"
};

const priceMap = {
  "0": "0.png",
  "1": "1.png",
  "2": "2.png",
  "3": "3.png",
  "4": "4.png",
  "5": "5.png",
  "6": "6.png",
  "7": "7.png",
  "8": "8.png",
  "9": "9.png",
  ",": "comma.png",
  ".": "dot.png"
};

const codeMap = {
  "0": "0.png",
  "1": "1.png",
  "2": "2.png",
  "3": "3.png",
  "4": "4.png",
  "5": "5.png",
  "6": "6.png",
  "7": "7.png",
  "8": "8.png",
  "9": "9.png"
};

/* 코드: 대문자 + 영어/숫자만 + 최대 5글자 */
function normalizeCode(value) {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, MAX_CODE_LENGTH);
}

function getCodeRawLength(value) {
  return String(value || "")
    .replace(/[^A-Za-z0-9]/g, "")
    .length;
}

function forceUppercaseInput(input) {
  input.value = normalizeCode(input.value);
}

/* 날짜 + 시간 합치기 */
function getDateTimeText() {
  const dateValue = dateInput.value || "2026-04-24";
  const timeValue = timeInput.value || "16:43:57";

  return `${dateValue} ${timeValue}`;
}

/* 현재 날짜/현재 시간 자동 세팅 */
function pad2(value) {
  return String(value).padStart(2, "0");
}

function setCurrentDateTime() {
  const now = new Date();

  const year = now.getFullYear();
  const month = pad2(now.getMonth() + 1);
  const day = pad2(now.getDate());

  const hour = pad2(now.getHours());
  const minute = pad2(now.getMinutes());
  const second = pad2(now.getSeconds());

  dateInput.value = `${year}-${month}-${day}`;
  timeInput.value = `${hour}:${minute}:${second}`;
}

/* 이미지 숫자/기호 class 이름 만들기 */
function getSafeCharName(char) {
  const names = {
    ".": "dot",
    ",": "comma",
    "+": "plus",
    "%": "percent",
    "-": "dash",
    ":": "colon"
  };

  if (names[char]) return names[char];
  if (/[0-9]/.test(char)) return "num-" + char;

  return "unknown";
}

/*
  이미지 숫자 렌더링
  groupName 예시:
  date-dash / date-colon
  pnl-plus / pnl-dot / pnl-percent
  price-comma / price-dot
*/
function renderImageText(target, text, folderPath, map, groupName = "") {
  target.innerHTML = "";

  String(text).split("").forEach((char) => {
    if (char === " ") {
      const space = document.createElement("span");
      space.className = "space";
      target.appendChild(space);
      return;
    }

    const fileName = map[char];
    if (!fileName) return;

    const img = document.createElement("img");
    img.src = folderPath + fileName;
    img.alt = char;

    const safeName = getSafeCharName(char);

    img.classList.add("digit-img");

    if (groupName) {
      img.classList.add(`${groupName}-${safeName}`);
    }

    target.appendChild(img);
  });
}

/* 레버리지: 숫자는 날짜 숫자 이미지, x는 이미지 */
function renderLeverage(value) {
  leverageRender.innerHTML = "";

  String(value).split("").forEach((char) => {
    const fileName = dateMap[char];
    if (!fileName) return;

    const img = document.createElement("img");
    img.src = PATH.date + fileName;
    img.alt = char;

    img.classList.add("leverage-num");
    img.classList.add(`leverage-${getSafeCharName(char)}`);

    leverageRender.appendChild(img);
  });

  const xImg = document.createElement("img");
  xImg.src = PATH.leverage + "x.png";
  xImg.alt = "x";
  xImg.classList.add("leverage-x-img");

  leverageRender.appendChild(xImg);
}

/* 롱/숏에 따라 레버리지 위치 따로 적용 */
function applyLeveragePosition(side) {
  const position = LEVERAGE_POSITION[side] || LEVERAGE_POSITION.long;

  leverageRender.style.left = `${position.left}px`;
  leverageRender.style.top = `${position.top}px`;
}

/* 코드: 영어는 폰트, 숫자는 코드 전용 흰색 숫자 이미지 */
function renderMixedCode(code) {
  codeValueRender.innerHTML = "";

  const upperCode = normalizeCode(code);

  upperCode.split("").forEach((char) => {
    if (/[0-9]/.test(char)) {
      const fileName = codeMap[char];

      if (!fileName) return;

      const img = document.createElement("img");
      img.src = PATH.code + fileName;
      img.alt = char;

      img.classList.add("code-number-img");
      img.classList.add(`code-${getSafeCharName(char)}`);

      codeValueRender.appendChild(img);
    } else {
      const span = document.createElement("span");
      span.className = "code-letter";
      span.textContent = char;
      codeValueRender.appendChild(span);
    }
  });
}

/*
  가격 입력 규칙
  BTC: 최대 5자리, 마지막 1자리 소수점
  예) 12345 -> 1,234.5

  ETH: 최대 6자리, 마지막 2자리 소수점
  예) 229367 -> 2,293.67
*/
function getPriceRuleByPosition(positionValue) {
  if (positionValue === "btcusdt-perp") {
    return {
      decimals: 1,
      maxDigits: 5,
      zeroText: "0,000.0"
    };
  }

  if (positionValue === "ethusdt-perp") {
    return {
      decimals: 2,
      maxDigits: 6,
      zeroText: "0,000.00"
    };
  }

  return {
    decimals: 2,
    maxDigits: 6,
    zeroText: "0,000.00"
  };
}

function normalizePriceInput(value, positionValue) {
  const rule = getPriceRuleByPosition(positionValue);

  return String(value || "")
    .replace(/[^0-9]/g, "")
    .slice(0, rule.maxDigits);
}

function parsePriceInputToNumber(value, positionValue) {
  const rule = getPriceRuleByPosition(positionValue);
  const digits = normalizePriceInput(value, positionValue);

  if (!digits) return 0;

  const numberValue = Number(digits) / Math.pow(10, rule.decimals);

  if (!Number.isFinite(numberValue)) return 0;

  return numberValue;
}

function formatPriceFromInput(value, positionValue) {
  const rule = getPriceRuleByPosition(positionValue);
  const numberValue = parsePriceInputToNumber(value, positionValue);

  if (!numberValue) {
    return rule.zeroText;
  }

  return numberValue.toLocaleString("en-US", {
    minimumFractionDigits: rule.decimals,
    maximumFractionDigits: rule.decimals
  });
}

function sanitizePriceInputs(positionValue) {
  const rule = getPriceRuleByPosition(positionValue);

  entryInput.maxLength = rule.maxDigits;
  targetInput.maxLength = rule.maxDigits;

  entryInput.value = normalizePriceInput(entryInput.value, positionValue);
  targetInput.value = normalizePriceInput(targetInput.value, positionValue);
}

function calculatePnlPercent(entry, target, leverage, side) {
  const entryPrice = Number(entry);
  const targetPrice = Number(target);
  const lev = Number(leverage);

  if (!entryPrice || !targetPrice || !lev) {
    return 0;
  }

  if (side === "long") {
    return ((targetPrice - entryPrice) / entryPrice) * lev * 100;
  }

  if (side === "short") {
    return ((entryPrice - targetPrice) / entryPrice) * lev * 100;
  }

  return 0;
}

/* 마이너스면 +0.00% 표시 */
function formatPnl(value) {
  const safeValue = Number.isFinite(value) ? value : 0;

  if (safeValue <= 0) {
    return "+0.00%";
  }

  return "+" + safeValue.toFixed(2) + "%";
}

/* 레버리지 500 초과 시 경고 */
function normalizeLeverage(showAlert = false) {
  let leverageValue = Number(leverageInput.value);

  if (!Number.isFinite(leverageValue) || leverageValue < 1) {
    leverageValue = 1;
  }

  if (leverageValue > MAX_LEVERAGE) {
    leverageValue = MAX_LEVERAGE;

    if (showAlert) {
      alert("레버리지는 최대 500까지 입력할 수 있어!");
    }
  }

  leverageInput.value = leverageValue;

  return leverageValue;
}

/*
  코드 안에서 첫 번째 알파벳을 찾아 바코드 선택
  예:
  A1ELS → a.png
  5UQ4L → u.png
  123AB → a.png
*/
function getFirstLetterFromCode(code) {
  const normalized = normalizeCode(code);
  const match = normalized.match(/[A-Z]/);

  return match ? match[0].toLowerCase() : "";
}

function getBarcodeImageByCode(code) {
  const firstLetter = getFirstLetterFromCode(code);

  if (/^[a-z]$/.test(firstLetter)) {
    return PATH.barcode + firstLetter + ".png";
  }

  return PATH.barcode + "a.png";
}

function updateBarcode(code) {
  qrImage.src = getBarcodeImageByCode(code);
}

function getSavedCodes() {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) return [];

    return parsed;
  } catch (error) {
    console.error("저장된 코드 읽기 실패:", error);
    return [];
  }
}

function setSavedCodes(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error("코드 저장 실패:", error);
    return false;
  }
}

function refreshSavedCodeList() {
  const savedCodes = getSavedCodes();

  savedCodeSelect.innerHTML = `<option value="">선택하세요</option>`;

  savedCodes.forEach((item, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = `${item.name} (${item.code})`;
    savedCodeSelect.appendChild(option);
  });
}

function saveCode() {
  const rawLength = getCodeRawLength(codeInput.value);
  const code = normalizeCode(codeInput.value);
  let name = saveNameInput.value.trim();

  if (rawLength > MAX_CODE_LENGTH) {
    alert(`코드는 최대 ${MAX_CODE_LENGTH}글자까지만 가능해!`);
    codeInput.value = code;
    updateAll();
    return;
  }

  if (!code) {
    alert("코드를 입력해줘!");
    return;
  }

  if (!/[A-Z]/.test(code)) {
    alert("코드에는 A~Z 알파벳이 최소 1개 들어가야 해!");
    return;
  }

  const savedCodes = getSavedCodes();

  if (!name) {
    name = `코드${savedCodes.length + 1}`;
  }

  const sameNameIndex = savedCodes.findIndex((item) => item.name === name);
  const sameCodeIndex = savedCodes.findIndex((item) => item.code === code);

  if (sameNameIndex !== -1) {
    savedCodes[sameNameIndex] = { name, code };
  } else if (sameCodeIndex !== -1) {
    savedCodes[sameCodeIndex] = { name, code };
  } else {
    if (savedCodes.length >= MAX_SAVED_CODES) {
      alert(`저장 가능한 코드는 최대 ${MAX_SAVED_CODES}개야. 오래된 코드를 삭제하고 다시 저장해줘!`);
      return;
    }

    savedCodes.push({ name, code });
  }

  const success = setSavedCodes(savedCodes);

  if (!success) {
    alert("저장 공간이 부족해서 저장하지 못했어. 필요 없는 코드를 삭제해줘!");
    return;
  }

  codeInput.value = code;
  saveNameInput.value = "";

  refreshSavedCodeList();
  updateAll();

  alert("코드 저장 완료!");
}

function deleteSavedCode() {
  const selectedIndex = savedCodeSelect.value;

  if (selectedIndex === "") {
    alert("삭제할 코드를 먼저 선택해줘!");
    return;
  }

  const savedCodes = getSavedCodes();
  savedCodes.splice(Number(selectedIndex), 1);

  const success = setSavedCodes(savedCodes);

  if (!success) {
    alert("삭제 내용을 저장하지 못했어. 다시 시도해줘!");
    return;
  }

  refreshSavedCodeList();
  savedCodeSelect.value = "";
  saveNameInput.value = "";

  alert("코드 삭제 완료!");
}

function applySelectedCode() {
  const selectedIndex = savedCodeSelect.value;

  if (selectedIndex === "") return;

  const savedCodes = getSavedCodes();
  const selected = savedCodes[Number(selectedIndex)];

  if (!selected) return;

  codeInput.value = normalizeCode(selected.code);
  saveNameInput.value = selected.name;

  updateAll();
}

function updateAll() {
  const dateTimeText = getDateTimeText();
  const positionValue = positionInput.value;
  const sideValue = sideInput.value;
  const leverageValue = normalizeLeverage(false);
  const codeValue = normalizeCode(codeInput.value);

  codeInput.value = codeValue;

  sanitizePriceInputs(positionValue);

  const entryValue = parsePriceInputToNumber(entryInput.value, positionValue);
  const targetValue = parsePriceInputToNumber(targetInput.value, positionValue);

  renderImageText(dateRender, dateTimeText, PATH.date, dateMap, "date");

  positionRender.src = PATH.position + positionValue + ".png";
  sideRender.src = PATH.side + sideValue + ".png";

  applyLeveragePosition(sideValue);
  renderLeverage(leverageValue);

  const pnlPercent = calculatePnlPercent(entryValue, targetValue, leverageValue, sideValue);
  const pnlText = formatPnl(pnlPercent);

  renderImageText(pnlRender, pnlText, PATH.pnl, pnlMap, "pnl");

  renderImageText(
    entryRender,
    formatPriceFromInput(entryInput.value, positionValue),
    PATH.price,
    priceMap,
    "price"
  );

  renderImageText(
    targetRender,
    formatPriceFromInput(targetInput.value, positionValue),
    PATH.price,
    priceMap,
    "price"
  );

  renderMixedCode(codeValue);
  updateBarcode(codeValue);
}

/* 계산하기 버튼용 */
function calculateNow() {
  updateAll();
}

async function downloadShot() {
  const captureArea = document.getElementById("captureArea");

  const canvas = await html2canvas(captureArea, {
    backgroundColor: "#000000",
    scale: 5,
    useCORS: true
  });

  const link = document.createElement("a");
  link.download = "lbank-result.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

/* 일반 입력 */
[
  dateInput,
  timeInput,
  positionInput,
  sideInput
].forEach((input) => {
  input.addEventListener("input", updateAll);
  input.addEventListener("change", updateAll);
});

/* 가격 입력: BTC 5자리 / ETH 6자리 제한 */
entryInput.addEventListener("input", () => {
  entryInput.value = normalizePriceInput(entryInput.value, positionInput.value);
  updateAll();
});

entryInput.addEventListener("change", () => {
  entryInput.value = normalizePriceInput(entryInput.value, positionInput.value);
  updateAll();
});

targetInput.addEventListener("input", () => {
  targetInput.value = normalizePriceInput(targetInput.value, positionInput.value);
  updateAll();
});

targetInput.addEventListener("change", () => {
  targetInput.value = normalizePriceInput(targetInput.value, positionInput.value);
  updateAll();
});

/* 포지션 바뀌면 가격 자리수 규칙도 즉시 적용 */
positionInput.addEventListener("change", () => {
  sanitizePriceInputs(positionInput.value);
  updateAll();
});

/* 레버리지 입력: 500 초과 시 경고 */
leverageInput.addEventListener("input", () => {
  normalizeLeverage(true);
  updateAll();
});

leverageInput.addEventListener("change", () => {
  normalizeLeverage(true);
  updateAll();
});

/* 코드 입력: 대문자 + 최대 5글자 */
codeInput.addEventListener("input", () => {
  const rawLength = getCodeRawLength(codeInput.value);

  forceUppercaseInput(codeInput);

  if (rawLength > MAX_CODE_LENGTH) {
    alert(`코드는 최대 ${MAX_CODE_LENGTH}글자까지만 가능해!`);
  }

  updateAll();
});

codeInput.addEventListener("change", () => {
  forceUppercaseInput(codeInput);
  updateAll();
});

savedCodeSelect.addEventListener("change", applySelectedCode);

refreshSavedCodeList();
setCurrentDateTime();
updateAll();