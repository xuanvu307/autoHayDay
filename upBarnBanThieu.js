auto.waitFor();
requestScreenCapture();

// khai báo

let launchName = "ru.xomka.hdagent3";
const path = "/sdcard/Download/MaFarm.txt";
const soOShop = 9;
toast("đã sang file")
//config data
let config = engines.myEngine().execArgv;
var kieuBan = config.kieuBan;   
var loaiHang = config.loaiHang;  
var banRandom = true;
if (kieuBan === 1) {
  banRandom = false;
}
const toaDoOShop = [
  [320, 214], [253, 214], [253, 280], [320, 280], [387, 214],
  [186, 214], [186, 280], [387, 280], [454, 214]
]

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
var copy = shell("su -c 'cp -af \"" + source + "/.\" \"" + dest + "/\"'", true);


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
  threshold = threshold ?? 10;
  timeout = timeout ?? 15000;

  var start = Date.now();

  while (true) {

    if (timeout > 0 && Date.now() - start > timeout) {
      return false;
    }

    var img;
    try {
      img = captureScreen();
      var c = images.pixel(img, x, y);
    } catch (e) {
      if (img) img.recycle();
      return false;
    }

    img.recycle();
    var r1 = colors.red(c);
    var g1 = colors.green(c);
    var b1 = colors.blue(c);

    var r2 = colors.red(targetColor);
    var g2 = colors.green(targetColor);
    var b2 = colors.blue(targetColor);

    var isMatch =
      Math.abs(r1 - r2) <= threshold &&
      Math.abs(g1 - g2) <= threshold &&
      Math.abs(b1 - b2) <= threshold;

    if (isMatch) {
      if (isClick) {
        click(x, y);
      }
      return true;
    }

    sleep(200);
  }
}


function choChuyenMau(x, y, targetColor, threshold, timeout, isClick) {
  threshold = threshold ?? 10;
  timeout = timeout ?? 15000;
  var startTime = Date.now();

  while (true) {
    if (timeout > 0 && Date.now() - startTime > timeout) {
      return false;
    }
    var img;
    try {
      img = captureScreen();
      var currentColor = images.pixel(img, x, y);
    } catch (e) {
      if (img) img.recycle();
      return false;
    }
    img.recycle();
    var r1 = colors.red(currentColor);
    var g1 = colors.green(currentColor);
    var b1 = colors.blue(currentColor);

    var r2 = colors.red(targetColor);
    var g2 = colors.green(targetColor);
    var b2 = colors.blue(targetColor);
    var isMatch =
      Math.abs(r1 - r2) <= threshold &&
      Math.abs(g1 - g2) <= threshold &&
      Math.abs(b1 - b2) <= threshold;
    if (isMatch) {
      return true;
    }
    if (isClick) {
      click(x, y);
    }

    sleep(200);
  }
}



function soMauTaiDiem(x, y, mauCanSo, doLech) {
  doLech = doLech || 10;

  try {
    var img = captureScreen();
    var mau = images.pixel(img, x, y);
    img.recycle();
  } catch (error) {
    toast(error);
    return false;
  }

  var r1 = colors.red(mau);
  var g1 = colors.green(mau);
  var b1 = colors.blue(mau);

  var r2 = colors.red(mauCanSo);
  var g2 = colors.green(mauCanSo);
  var b2 = colors.blue(mauCanSo);

  return (
    Math.abs(r1 - r2) <= doLech &&
    Math.abs(g1 - g2) <= doLech &&
    Math.abs(b1 - b2) <= doLech
  );
}


function bamDauX() {
  var pts = [[590, 74], [478, 135], [480, 130], [518, 118], [520, 118]];
  for (var i = 0; i < pts.length; i++) {
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
    tap(621, 40, 3000);
  }
  if (soMauTaiDiem(260, 60, "#F57c00", 20)) {
    toast("Hết Acc");
    exit();
  } else {
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
    toast("Lỗi load farm")
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
  tap(379, 175,20);
}

function oSo(x, tru = false) {
  sleep(70)
  tap(144, 226, 70);
  click(x, 177);
  nutCong();
  if (tru) {
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
    tap(x, y,20);
    tap(425, 108,10);
    tap(x, y,20);
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
  tap(610, 455, 1000);
  tap(254, 439, 800)
}
function xoaBan() {
  tap(281, 118, 1200);
  while (true) {
    if (soMauTaiDiem(410, 220, "#F5C03F", 20)) {
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
    if (soMauTaiDiem(490, 277, "#ED434C", 20)) {
      for (let i = 0; i < 3; i++) {
        tap(490, 277, 10)
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
  tap(221, 123, 500);
  click(240, 172);
  tap(240, 172);
  input(first);
  sleep(500);
  tap(445, 165);
  sleep(100);

  if (!choMauClick(410, 240, "#59ce39", 30, 15000, true)) {
    toast("ADD LỖI")
    return;
  }
  if (!choChuyenMau(410, 240, "#fff9db", 30, 15000, false)) {
    toast("ADD LỖI")
    return;
  }

  toast("Đã add xong");
  sleep(1000);
}
function addMa() {
  moDanhSach();
  xoaLoiMoi();
  xoaBan();
  // xoaTheoDoi();
  ketBan();
}

function xoaAcc() {
  sleep(1200);
  press(100, 50, 1000);
  sleep(1000);
  tap(50, 140, 1000)
  tap(423, 263, 1000)
  if (soMauTaiDiem(260, 60, "#F57c00", 20)) {
    toast("Hết Acc");
    exit();
  } else {
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

chayNgayDi();