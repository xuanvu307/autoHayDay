auto.waitFor();
requestScreenCapture();

// khai báo

let launchName = "ru.xomka.hdagent3";
const path = "/sdcard/Download/MaFarm.txt";
const soOShop = 9;


const toaDoOShop = [
  [320, 214], [253, 214], [253, 280], [320, 280], [387, 214],
  [186, 214], [186, 280], [387, 280], [454, 214]
]

// tải mã farm
var url = "http://192.168.1.2:8000/maFarm.txt";


var res = http.get(url);

if (res.statusCode == 200) {
  files.writeBytes(path, res.body.bytes());
  toast("Tải thành công!");
} else {
  toast("Lỗi: " + res.statusCode);
}


//config data
let config = engines.myEngine().execArgv;
var kieuBan = config.kieuBan;
var loaiHang = config.loaiHang;
var banRandom = true;
if (kieuBan === 1) {
  banRandom = false;
}


// chuyển acc

shell("am force-stop " + "ru.xomka.hdagent3", true); sleep(300);
var listAcc = "/storage/emulated/0/Download/null.realm";
var HDAgent = "/data/data/ru.xomka.hdagent3/files/null.realm";
shell("su -c 'cp -f \"" + listAcc + "\" \"" + HDAgent + "\"'", true);
app.launchPackage(launchName);
sleep(500)


var acc = 1;

// tạo log
var now = new Date();
var fileName = "upBarn_" +
  now.getFullYear() +
  (now.getMonth() + 1) +
  now.getDate() + "_" +
  now.getHours() +
  now.getMinutes() + ".txt";

var LOG_PATH = "/storage/emulated/0/Download/log/" + fileName;


function writeLog(text) {
  let time = new Date().toLocaleTimeString();
  files.append(LOG_PATH, "[" + time + "] " + text + "\n");
}

function sendTelegramLog(message) {

  let token = "8510927556:AAFB_jD4OTOnrY7MnpoC3TBDgR1OgsIsRTY";
  let chatId = "1490023864";

  let url = "https://api.telegram.org/bot" + token + "/sendMessage";

  http.post(url, {
    chat_id: chatId,
    text: message
  }, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
}

//copy file

var pkg = "com.supercell.hayday";
if (loaiHang === 0) {
  var source = "/storage/emulated/0/Download/data/up/xarac";
}
if (loaiHang === 1) {
  var source = "/storage/emulated/0/Download/data/up/barn";
}
if (loaiHang === 2) {
  var source = "/storage/emulated/0/Download/data/up/si";
}
if (loaiHang === 3) {
  var source = "/storage/emulated/0/Download/data/up/md";
}
if (loaiHang === 4) {
  var source = "/storage/emulated/0/Download/data/up/barnSi";
}
var dest = "/data/data/" + pkg + "/update/data";
if (!files.exists(source)) {
  exit();
}
shell("am force-stop " + pkg, true); sleep(600);
shell("su -c 'rm -rf \"" + dest + "\"'", true);
shell("su -c 'mkdir -p \"" + dest + "\"'", true);
shell("su -c 'cp -af \"" + source + "/.\" \"" + dest + "/\"'", true);


// lấy mã
function checkFileMa(path) {
  if (!files.exists(path)) {
    toast("Chưa có file tên MaFarm")
    exit();
  }
  let content = files.read(path);
  if (!content || content.trim() === "") {
    toast("File rỗng")
    exit();
  }
}

checkFileMa(path);

function layMa(path) {
  let content = files.read(path);
  if (!content || content.trim() === "") {
    toast("Đã hết mã")
    exit();
  }
  let lines = content.split(/\r?\n/);
  let firstLine = lines.shift();
  firstLine = firstLine.replace(/[#\s]/g, "");
  files.write(path, lines.join("\n"));
  return firstLine;
}

//xử lý màu
function choMauClick(x, y, targetColor, threshold, timeout, isClick) {
  timeout = timeout ?? 15000;
  var start = Date.now();
  while (true) {
    tamDung();
    var img = captureScreen();
    var c = images.pixel(img, x, y);
    if (colors.isSimilar(c, targetColor, threshold)) {
      if (isClick) {
        click(x, y);
      }
      return true;
    }
    if (timeout && Date.now() - start > timeout) {
      return false;
    }
    sleep(200);
  }
}


function choChuyenMau(x, y, targetColor, threshold, timeout, isClick) {
  timeout = timeout ?? 15000;
  var startTime = Date.now();
  while (true) {
    tamDung();
    if (timeout > 0 && Date.now() - startTime > timeout) {
      return false;
    }
    var img = captureScreen();
    var currentColor = images.pixel(img, x, y);
    if (colors.isSimilar(currentColor, targetColor, threshold)) {
      return true;
    }
    sleep(200);
    if (isClick) {
      click(x, y);
    }
  }
}


function soMauTaiDiem(x, y, mauCanSo, doLech) {
  try {
    var img = captureScreen();
    var mau = images.pixel(img, x, y);
    img.recycle();
  } catch (error) {
    toast(error);
  }
  return colors.isSimilar(mau, mauCanSo, doLech || 10);
}

function bamDauX() {
  var pts = [[590, 74], [478, 135], [480, 130], [518, 118], [520, 118]];
  for (var i = 0; i < pts.length; i++) {
    tamDung()
    if (soMauTaiDiem(pts[i][0], pts[i][1], "#E63D46", 50)) {
      click(pts[i][0], pts[i][1]);
      sleep(500);
    }
  }
}

// login

function moAgent() {
  app.launchPackage(launchName);
  sleep(2000);
  if (soMauTaiDiem(621, 40, "#f57c00", 20)) {
    tamDung();
    tap(621, 40, 3000);
  }
  if (soMauTaiDiem(260, 60, "#F57c00", 20)) {
    toast("Hết Acc");
    exit();
  } else {
    tamDung();
    click(100, 50);
    checklogin();
  }
}


function checklogin(timeout, tolerance) {
  timeout = timeout ?? 30000;
  tolerance = tolerance ?? 65;
  let start = Date.now(), found = false;
  let points = [[27, 252], [30, 252], [24, 252]];
  let targetR = 177, targetG = 128, targetB = 60;
  while (Date.now() - start < timeout) {
    tamDung();
    bamDauX();
    let img = captureScreen();
    for (let [x, y] of points) {
      let c = images.pixel(img, x, y);
      let r = colors.red(c), g = colors.green(c), b = colors.blue(c);
      if (Math.hypot(r - targetR, g - targetG, b - targetB) <= tolerance) { found = true; break; }
    }
    if (found) break;
    sleep(2000);
  }
  if (!found) {
    toast("Lỗi load farm tiến hành load lại...")
    moAgent();
  }
  return found;
}

// ô shop
function tap(x, y, ms) {
  click(x, y);
  sleep(ms == null ? 50 : ms);
}
function nutBan() {
  tap(436, 350);
}
function nutCong() {
  for (let i = 0; i < 6; i++) {
    click(466, 173);
  }
  sleep(10)
}

function nutTru() {
  tap(379, 175, 20);
}

function oSo(x, tru = false) {
  tamDung();
  sleep(70);
  tamDung()
  tap(144, 226, 70);
  tamDung()
  click(x, 177);
  tamDung()
  nutCong();
  if (tru) {
    tamDung()
    nutTru();
  }
  nutBan();
}
function oSo1() {
  sleep(100)
  tap(144, 226, 80);
  oSo(310, true);
}
function oSo1Rd() {
  sleep(100)
  tap(144, 226, 80);
  oSo(210, true);
}
function oSo23() {
  oSo(310);
}
function oSo456() {
  oSo(254);
}
function oSo789() {
  oSo(200);
}

// Bán 
function vaoShop() {
  let dem = 0;
  while (!soMauTaiDiem(480, 130, "#E63D46")) {
    tamDung()
    tap(20, 136, 800);
    dem++;
    if (dem > 30) {
      alert("không vào được shop")
    }
  }
}


function upHang() {
  if (soOShop < 1 || soOShop > 9) {
    toast("số ô shop nằm ngoài khoảng cho phép");
    return;
  }

  const tap3 = (x, y) => {
    tamDung();
    tap(x, y, 20);
    tamDung();
    tap(425, 108);
    tamDung();
    tap(x, y, 20);
  };

  const getFuncRandom = (index) => {
    if (index === 0) {
      return loaiHang === 0 ? oSo789 : oSo1Rd;
    }
    return oSo789;
  };

  const getFuncNormal = (index) => {
    if (index === 0) return oSo1;
    if (index === 1 || index === 2) return oSo23;
    if (index >= 3 && index <= 5) return oSo456;
    return oSo789;
  };

  for (let i = 0; i < soOShop; i++) {
    let [x, y] = toaDoOShop[i];

    let handler = banRandom
      ? getFuncRandom(i)
      : getFuncNormal(i);

    tap3(x, y);
    handler();
  }
}
//add frend
function moDanhSach() {
  tamDung();
  tap(610, 455, 1000);
  tamDung();
  tap(254, 439, 800);
}
function xoaBan() {
  tamDung()
  tap(281, 118, 1000);
  while (true) {
    if (soMauTaiDiem(410, 220, "#F5C03F", 20)) {
      tamDung();
      for (let i = 0; i < 3; i++) {
        tap(410, 220, 1)
        tap(410, 220, 1)
        tap(410, 220, 1)
        tap(410, 260, 1)
        tap(410, 260, 1)
        tap(410, 260, 1)
      }
    } else {
      break;
    }
  }
}
function xoaLoiMoi() {
  while (true) {
    tamDung();
    if (soMauTaiDiem(490, 277, "#ED434C", 20)) {
      for (let i = 0; i < 3; i++) {
        tamDung();
        tap(490, 277, 10)
        tamDung();
        tap(490, 277, 10)
      }
    } else {
      break;
    }
  }
}
function xoaTheoDoi() {
  tap(419, 117, 1200);
  while (true) {
    if (soMauTaiDiem(410, 220, "#F5C03F", 20)) {
      for (let i = 0; i < 6; i++) {
        tap(410, 220, 10)
        tap(410, 260, 10)
      }
    } else {
      break;
    }
  }
}

function ketBan() {
  let first = layMa(path);
  tamDung();
  tap(221, 123, 500);
  tamDung();
  click(240, 172);
  tamDung();
  tap(240, 172);
  tamDung();
  input(first);
  tamDung();
  sleep(500);
  tap(445, 165);
  sleep(100);

  if (!choMauClick(410, 240, "#59ce39", 30, 15000, true)) {
    toast("Lỗi kết bạn tiến hành load và up lại")
    moAgent();
    addMa();
  }

  if (!choChuyenMau(410, 240, "#fff9db", 30, 15000, false)) {
    toast("Lỗi kết bạn tiến hành load và up lại")
    moAgent();
    addMa();
  }
  toast("# " + first + " OK");
  writeLog("#" + first + " OK");
  sleep(1000);
  acc++;
}
function addMa() {
  moDanhSach();
  xoaLoiMoi();
  xoaBan();
  // xoaTheoDoi();
  ketBan();
}

function xoaAcc() {
  tamDung();
  sleep(1200);
  tamDung();
  press(100, 50, 1000);
  tamDung();
  sleep(1000);
  tamDung();
  tap(50, 140, 1000)
  tamDung();
  tap(423, 263, 1000)
  tamDung();
  if (soMauTaiDiem(260, 60, "#F57c00", 20)) {
    toast("Hết Acc");
    let content = files.read(LOG_PATH);
    let ib = "Máy 40: \n" + content
    sendTelegramLog(ib);
    dialogs.alert("KẾT QUẢ", content);
    exit();
  } else {
    tamDung();
    tap(100, 50, 2000);
    checklogin();
  }
}

function chayNgayDi() {
  moAgent();
  while (true) {
    sleep(200)
    vaoShop()
    upHang();
    sleep(200);
    bamDauX();
    bamDauX();
    addMa();
    app.launchPackage(launchName);
    xoaAcc();
  }
}
"auto";
"floaty";
"threads";

// ===================================================
// TẠO BẢNG NÚT ĐIỀU KHIỂN FLOATY
// ===================================================
var panel = floaty.window(
  <frame bg="#11000000" padding="4">
    <vertical>
      <button id="btnPause" text="⏸ PAUSE" textSize="12sp" padding="6" />
      <button id="btnStop" text="⛔ STOP" textSize="12sp" padding="6" />
    </vertical>
  </frame>
);

panel.setSize(-2, -2);
panel.setPosition(2, 300);

var paused = false;


panel.btnPause.on("click", () => {
  paused = !paused;
  panel.btnPause.setText(paused ? "▶ CONTINUE" : "⏸ PAUSE");
  toast(paused ? "Tạm dừng" : "Tiếp tục");
});

panel.btnStop.on("click", () => {
  exit();
  toast("Đã dừng Auto");
});

function tamDung() {
  while (paused) {
    sleep(500);
  }
}


chayNgayDi();