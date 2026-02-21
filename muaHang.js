auto.waitFor();
requestScreenCapture();

var launchName = "ru.xomka.hdagent2";


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



function tap(x, y, ms) {
  click(x, y);
  sleep(ms == null ? 50 : ms);
}

function bamDauX() {
  var pts = [[590, 74], [518, 118], [520, 118], [522, 81]];
  for (var i = 0; i < pts.length; i++) {
    if (soMauTaiDiem(pts[i][0], pts[i][1], "#E63D46", 50)) {
      click(pts[i][0], pts[i][1]);
      sleep(500);
    }
  }
}



function moAgent() {
  app.launchPackage(launchName);
  sleep(1500);
  if (soMauTaiDiem(621, 40, "#f57c00", 20)) {
    tap(621, 40, 3000);
  } else {
    click(accHienTai[0], accHienTai[1]);
    timeLoadFarm();
  }
}


function timeLoadFarm(timeout, tolerance) {
  timeout = timeout ?? 30000;
  tolerance = tolerance ?? 65;
  let start = Date.now(), found = false;
  let points = [[27, 252], [30, 252], [24, 252]];
  while (Date.now() - start < timeout) {
    bamDauX();
    for (let [x, y] of points) {
      if (soMauTaiDiem(x, y, "#B1803C", tolerance)) {
        found = true;
        return;
      }
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
//add frend
function moDanhSach() {
  tap(610, 455, 1000);
  tap(254, 439, 800);
}
function xoaBan() {
  tap(281, 118, 1000);
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
  choChuyenMau(410, 220, "#f5c03f", 20, 10000, true)
}

function ketBan() {
  tap(221, 123, 500);
  click(240, 172);
  tap(240, 172);
  input(maFarm);
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
  toast("Add thành công");
  sleep(1000);
}
function addMa() {
  moDanhSach();
  // xoaTheoDoi();
 
    ketBan();
  
    xoaLoiMoi();
    xoaBan();
  
}

function xoaAcc() {
  app.launchPackage(launchName);
  sleep(1500);
  press(1, 1, 1000);
  sleep(1000);
  tap(1,  92, 1000)
  tap(431, 263, 1000)
  if (1) {
    tangAcc();
  } else {
    tap(1, 1, 2000);
    timeLoadFarm();
  }
}


while(true){
    
}