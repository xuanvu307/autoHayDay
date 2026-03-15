auto.waitFor();
requestScreenCapture();


const soAccChayMotVong = 15;     // max 90 farm mỗi agent 30 farm
var nangDat = true;
const nangBarn = true;
const nangSilo = true;
const soVongNangKho = 30;

const launchName = "ru.xomka.hdagent2";

var accHienTai = [100, 52];
//copy file

var pkg = "com.supercell.hayday";
var source = "/storage/emulated/0/Download/data/filecao";
var dest = "/data/data/" + pkg + "/update/data";
if (!files.exists(source)) {
    exit();
}
shell("am force-stop " + pkg, true);
sleep(600);
shell("su -c 'rm -rf \"" + dest + "\"'", true);
shell("su -c 'mkdir -p \"" + dest + "\"'", true);
shell("su -c 'cp -af \"" + source + "/.\" \"" + dest + "/\"'", true);

sleep(1000)
toast("Đang copy file Game")
sleep(1000)


// bấm dấu X
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

function checkPopupX() {
    var pts = [[455, 160], [460, 160], [450, 160], [455, 155], [455, 165]];
    for (var i = 0; i < pts.length; i++) {
        waitIfPaused()
        if (soMauTaiDiem(pts[i][0], pts[i][1], "#E63D46", 50)) {
            click(pts[i][0], pts[i][1]);
            sleep(500);
        }
    }
}

const toadoCao = [
    [232, 81], [329, 110], [247, 83], [317, 120], [265, 70],
    [333, 114], [279, 69], [348, 111], [390, 16], [66, 207],
]

const toadoGieo = [
    [263, 111], [318, 106], [287, 78], [288, 134], [311, 82],
    [150, 109], [344, 105], [189, 70], [293, 156], [296, 46],
    [340, 123], [195, 75], [390, 16], [66, 207],
]
function taoToado(buocNhay) {
    const lastList = toadoCao.length - 1;
    if (toadoCao.length % 2 == 0) {
        const x1 = toadoCao[lastList - 1][0];
        const y1 = toadoCao[lastList - 1][1];
        toadoCao.push([x1 + buocNhay, y1 + buocNhay / 2])
        toadoGieo.push([x1 + buocNhay, y1 + buocNhay / 2])
    } else {
        const x2 = toadoCao[lastList - 1][0];
        const y2 = toadoCao[lastList - 1][1];
        toadoCao.push([x2 + buocNhay, y2 + buocNhay / 2])
        toadoGieo.push([x2 + buocNhay, y2 + buocNhay / 2])
    }
}

for (let i = 0; i < 30; i++) {
    taoToado(8);
}

function cao() {
    gestures([3000].concat(toadoCao))
}
function gieo() {
    gestures([3000].concat(toadoGieo))
}


// thao tác cào + trồng

function caoLua() {
    waitIfPaused();
    click(298, 105);
    waitIfPaused();
    sleep(800);
    waitIfPaused();
    cao();
    checkPopupX();
    waitIfPaused();
    sleep(1500);
    waitIfPaused();
    click(298, 105);
    waitIfPaused();
    sleep(800);
    waitIfPaused();
    gieo();
    waitIfPaused();
    checkPopupX();
    sleep(500);
}

// chạy agent
function moAgent() {
    app.launchPackage(launchName);
    waitIfPaused();
    sleep(1500);
    waitIfPaused();
    if (soMauTaiDiem(621, 40, "#f57c00", 20)) {
        waitIfPaused();
        tap(621, 40, 3000);
        waitIfPaused();
    } else {
        waitIfPaused();
        click(accHienTai[0], accHienTai[1]);
        waitIfPaused();
        timeLoadFarm();
    }
}

function timeLoadFarm(timeout, tolerance) {
    timeout = timeout ?? 30000;
    tolerance = tolerance ?? 65;
    let start = Date.now(), found = false;
    let points = [[27, 252], [30, 252], [24, 252]];
    while (Date.now() - start < timeout) {
        checkPopupX();
        waitIfPaused();
        for (let [x, y] of points) {
            if (soMauTaiDiem(x, y, "#B1803C", tolerance)) {
                found = true;
                return;
            }
        }
        if (found) break;
        waitIfPaused();
        sleep(2000);
        waitIfPaused();
    }
    if (!found) {
        toast("Lỗi load farm chờ load lại")
        moAgent();
    }
    return found;
}
var acc = 1;

function tangAcc() {
  if (acc > 90) {
    acc = 1;
    accHienTai = [100, 52];
    launchName = "ru.xomka.hdagent2";
  } else if (acc == 61 && soAccChayMotVong > 60) {
    accHienTai = [100, 52];
    launchName = "ru.xomka.hdagent4";
  } else if (acc == 31 && soAccChayMotVong > 30) {
    accHienTai = [100, 52];
    launchName = "ru.xomka.hdagent3";
  } else if (acc % 2 == 1) {
    accHienTai[0] = 100;
    accHienTai[1] += 22;
  } else {
    accHienTai[0] = 450;
  }
  moAgent();
}

// mua đất

var mauMau = [
    { x: 78, y: 125, r: 255, g: 233, b: 45 }, { x: 76, y: 125, r: 255, g: 232, b: 40 },
    { x: 80, y: 125, r: 255, g: 249, b: 183 }, { x: 78, y: 123, r: 252, g: 239, b: 95 },
    { x: 78, y: 127, r: 254, g: 220, b: 73 }
];
var SAI_SO = 25;
function checkCucCoin5Diem(img) {
    for (var i = 0; i < mauMau.length; i++) {
        var pt = mauMau[i], c = images.pixel(img, pt.x, pt.y)
        return (Math.abs(colors.red(c) - pt.r) <= SAI_SO &&
            Math.abs(colors.green(c) - pt.g) <= SAI_SO &&
            Math.abs(colors.blue(c) - pt.b) <= SAI_SO);
    }
    return false;
}
function buildLanePoints(start, end, slots) {
    var pts = [];
    for (var i = 0; i < slots; i++) {
        var t = (slots === 1) ? 0.5 : i / (slots - 1);
        var x = Math.round(start[0] + (end[0] - start[0]) * t);
        var y = Math.round(start[1] + (end[1] - start[1]) * t);
        pts.push([x, y]);
    }
    return pts;
}
var lanes = [
    { name: "Làn 2", start: [358, 80], end: [164, 131], slots: 15 },
    { name: "Làn 3", start: [375, 88], end: [174, 188], slots: 15 },
    { name: "Làn 4", start: [392, 96], end: [185, 246], slots: 15 },
    { name: "Làn 5", start: [409, 104], end: [195, 303], slots: 15 },
    { name: "Làn 6", start: [426, 112], end: [206, 361], slots: 15 },
    { name: "Làn 7", start: [443, 120], end: [216, 418], slots: 15 },
    { name: "Làn 8", start: [460, 128], end: [227, 476], slots: 15 },
    { name: "Làn 9", start: [477, 136], end: [237, 533], slots: 15 },
    { name: "Làn 10", start: [494, 144], end: [248, 591], slots: 15 }
];
function vaoShopHayDay() {
    waitIfPaused();
    click(25, 446); sleep(800);
    waitIfPaused();
    click(25, 446); sleep(800);
    waitIfPaused();
    click(292, 116); sleep(800);
}

function keoDatFullGesture() {
    if (nangDat) {
        vaoShopHayDay();
        var A = [44, 91], B = [578, 202], DURATION = 1000;
        outer: for (var laneIdx = 0; laneIdx < lanes.length; laneIdx++) {
            var lane = lanes[laneIdx];
            var points = buildLanePoints(lane.start, lane.end, lane.slots);
            for (var slotIdx = 0; slotIdx < points.length; slotIdx++) {
                var img0 = null; try { img0 = captureScreen(); } catch (e) { }
                if (!img0) break outer;
                var ok = checkCucCoin5Diem(img0);
                try { images.recycle(img0); } catch (e) { }
                if (!ok) break outer;
                var C = points[slotIdx];
                waitIfPaused();
                gestures([DURATION, A, B, C]);
                waitIfPaused();
                sleep(800);
                click(29, 452);
                waitIfPaused();
                sleep(800);
            }
        }
    }
}

// nâng kho
function actionBarn() {
    if (nangBarn) {
        waitIfPaused();
        sleep(500);
        waitIfPaused();
        click(454, 21); sleep(500);
        waitIfPaused();
        click(321, 350); sleep(500);
        waitIfPaused();
        click(282, 299); sleep(500);
    }
}
function actionSilo() {
    if (nangSilo) {
        waitIfPaused();
        click(422, 5); sleep(500);
        waitIfPaused();
        click(321, 350); sleep(500);
        waitIfPaused();
        click(282, 299); sleep(500);
    }
}

function nang() {
    keoDatFullGesture();
    actionBarn();
    actionSilo();
}

// làm bánh mì
function banhMi() {
    click(72, 185); sleep(50);
    click(258, 150); sleep(50);
    click(258, 150); sleep(50);
    click(258, 150); sleep(50);
    click(258, 150); sleep(500);
    waitIfPaused();
    swipe(200, 110, 240, 160, 100);
    swipe(200, 110, 240, 160, 100);
    swipe(200, 110, 240, 160, 100);
    swipe(200, 110, 240, 160, 100);
}



//bắt đầu chạy

var vong = 0;
threads.start(function () {
    while (true) {
        vong++;
        if (vong > 65) {
            nangDat = false;
        }
        for (var i = 1; i <= soAccChayMotVong; i++) {
            moAgent();
            waitIfPaused();
            sleep(3000)
            toast("Vòng " + vong + " Acc " + acc);
            if (timeLoadFarm(acc, vong)) {
                waitIfPaused();
                caoLua();
                waitIfPaused();
                banShop();
                waitIfPaused();
                if (vong % soVongNangKho === 1) {
                    waitIfPaused();
                    nang();
                    waitIfPaused();
                    sleep(500);
                    waitIfPaused();
                    checkPopupX();
                    waitIfPaused();
                    sleep(500);
                }
                waitIfPaused();
                sleep(800);
            }
            acc++;
            tangAcc();
        }
    }
});


function banShop() {

    // 🎨 Danh sách màu tinh gọn
    var colorList = [
        { id: 1, color: "#3579FE" }, { id: 2, color: "#5B3A8E" },
        { id: 5, color: "#4D91E6" }, { id: 7, color: "#3F7BE0" },
        { id: 8, color: "#3FE150" }, { id: 9, color: "#0F9448" },
        { id: 16, color: "#E06090" }, { id: 17, color: "#C23C71" },
        { id: 19, color: "#B87346" }, { id: 20, color: "#4FA2C6" },
        { id: 21, color: "#2D84AF" }, { id: 25, color: "#C07D45" },
        { id: 28, color: "#F8E8CF" }, { id: 33, color: "#E58A9D" },
        { id: 35, color: "#000000" }
    ];

    // 📐 Vùng tứ giác quét
    var quad = [[298, 53], [297, 28], [365, 32], [361, 61]];
    var xs = [], ys = [];
    for (var i = 0; i < quad.length; i++) {
        xs.push(quad[i][0]);
        ys.push(quad[i][1]);
    }
    var minX = Math.min.apply(null, xs);
    var maxX = Math.max.apply(null, xs);
    var minY = Math.min.apply(null, ys);
    var maxY = Math.max.apply(null, ys);
    var region = [minX, minY, maxX - minX, maxY - minY];
    var threshold = 38;

    // 🎯 Điểm kiểm tra quanh dấu "/"
    var CHECK = [
        { x: 441, y: 183 }, { x: 442, y: 183 }, { x: 443, y: 183 },
        { x: 442, y: 184 }, { x: 442, y: 182 }
    ];

    // 🟢 Nút bấm
    var YES = { x: 431, y: 372 };
    var NO = { x: 502, y: 328 };
    var CONFIRM = { x: 276, y: 319 };

    // 🧠 Hàm kiểm tra điểm nằm trong vùng tứ giác
    function pointInQuad(px, py, q) {
        function sign(p1, p2, p3) {
            return (p1[0] - p3[0]) * (p2[1] - p3[1]) - (p2[0] - p3[0]) * (p1[1] - p3[1]);
        }
        var b1 = sign([px, py], q[0], q[1]) < 0;
        var b2 = sign([px, py], q[1], q[2]) < 0;
        var b3 = sign([px, py], q[2], q[3]) < 0;
        var b4 = sign([px, py], q[3], q[0]) < 0;
        return (b1 === b2) && (b2 === b3) && (b3 === b4);
    }

    // 🎨 Nhận dạng màu quanh dấu "/"
    function detectColor(img) {
        var red = 0, white = 0, green = 0;
        for (var k = 0; k < CHECK.length; k++) {
            var p = CHECK[k];
            var c = images.pixel(img, p.x, p.y);
            var r = colors.red(c), g = colors.green(c), b = colors.blue(c);
            var isRed = (r >= 200 && (r - g) >= 60 && (r - b) >= 60);
            var isWhite = (Math.min(r, g, b) >= 210 && (Math.max(r, g, b) - Math.min(r, g, b)) <= 25);
            var isGrass = (g > r + 30 && g > b + 30 && g >= 90);
            if (isRed) red++;
            if (isWhite) white++;
            if (isGrass) green++;
        }
        if (red >= 3) return "🔴";
        if (white >= 3) return "⚪";
        if (green >= 3) return "🟢";
        return "🟠";
    }

    // 🚀 Luồng xử lý khách
    var customers = 0;
    var usedColors = [];

    while (customers < 4) {
        var img = captureScreen();
        var foundNPC = null;
        waitIfPaused();
        for (var i = 0; i < colorList.length; i++) {
            var id = colorList[i].id;
            var color = colorList[i].color;
            if (usedColors.indexOf(id) >= 0) continue;

            var p = findColor(img, color, { region: region, threshold: threshold });
            if (p && pointInQuad(p.x, p.y, quad)) {
                foundNPC = { id: id, color: color, x: p.x, y: p.y };
                usedColors.push(id);
                break;
            }
        }
        img.recycle();

        if (!foundNPC) {
            toast("Hết khách");
            break;
        }
        click(foundNPC.x, foundNPC.y);
        waitIfPaused();
        sleep(800);

        var img2 = captureScreen();
        var state = detectColor(img2);
        img2.recycle();

        if (state === "🔴") {
            toast("Không đủ hàng");
            click(NO.x, NO.y);
        } else {
            toast("Xác nhận");
            click(YES.x, YES.y);
            waitIfPaused();
            sleep(800);
            click(CONFIRM.x, CONFIRM.y);
            waitIfPaused();
            sleep(800);
            click(399, 350);
            waitIfPaused();
            sleep(800);
        }

        customers++;
        toast("Đã xử lý khách " + customers);
        sleep(1200);
    }
    toast("Xong, tổng: " + customers + " khách");
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
            <text id = "txt" text = "Chờ Load" textSize="12sp" padding="6" />
        </vertical>
    </frame>
);

panel.setSize(-2, -2);
panel.setPosition(2, 300);

var paused = false;

panel.txt.setText("V:" + vong+ " A: " + acc);
panel.btnPause.on("click", () => {
    paused = !paused;
    panel.btnPause.setText(paused ? "▶ CONTINUE" : "⏸ PAUSE");
    toast(paused ? "Tạm dừng" : "Tiếp tục");
});

panel.btnStop.on("click", () => {
    exit();
    toast("Đã dừng Auto");
});

function waitIfPaused() {
    while (paused) {
        sleep(500);
    }
}
