"ui";
ui.statusBarColor("#1565C0");
var storage = storages.create("APP_LICENSE");
var savedKey = storage.get("user_key", "");
// ===== START =====
showLoginPage();
// ================= LOGIN =================
function showLoginPage() {
    ui.layout(
        <frame bg="#E3F2FD">
            <vertical gravity="center" padding="30">

                <card w="*" cardCornerRadius="16dp" cardElevation="8dp">
                    <vertical padding="25">

                        <text text="AUTO TOOL PRO"
                            textSize="22sp"
                            textStyle="bold"
                            textColor="#1565C0"
                            gravity="center" />

                        <text text="Nhập key để sử dụng"
                            gravity="center"
                            marginBottom="20"
                            textColor="#555" />

                        <input id="keyInput"
                            hint="Nhập key..."
                            text={savedKey} />
                        <text id="helpText"
                            text="Hướng dẫn lấy KEY"
                            textColor="#1565C0"
                            gravity="right"
                            marginTop="4" />

                        <button id="btnLogin"
                            text="KÍCH HOẠT"
                            marginTop="20"
                            bg="#1565C0"
                            textColor="#ffffff" />

                        <text id="statusText"
                            text=""
                            marginTop="10"
                            textColor="#D32F2F"
                            gravity="center" />

                    </vertical>
                </card>

            </vertical>
        </frame>
    );
    ui.helpText.click(() => {
        dialogs.alert(
            "Hướng dẫn",
            "1. Nhập KEY được cấp\n2. Nhấn KÍCH HOẠT\n3. Nếu key hợp lệ tool sẽ mở \n4. Liên hệ 0825528999 để nhận KEY"
        );
    });

    if (savedKey) {
        checkKey(savedKey);
    }

    ui.btnLogin.on("click", function () {
        let key = ui.keyInput.text();
        if (!key) {
            ui.statusText.setText("Vui lòng nhập key");
            return;
        }
        checkKey(key);
    });
}

// ================= CHECK KEY =================
function checkKey(key) {

    ui.statusText.setText("Đang kiểm tra...");

    threads.start(function () {
        var androidId = device.getAndroidId();
        try {
            var url = "http://47.84.93.84/check?key=" + key + "&device=" + androidId;

            var res = http.get(url, { timeout: 8000 });

            if (res.statusCode != 200) {
                throw "Server lỗi: " + res.statusCode;
            }

            var data = res.body.json();

            ui.run(function () {

                if (data.status) {
                    storage.put("user_key", key);
                    data.key = key;
                    showDashboard(data);
                } else {
                    ui.statusText.setText(data.message || "Key không hợp lệ");
                }

            });

        } catch (e) {
            ui.run(function () {
                ui.statusText.setText("Không kết nối được máy chủ");
            });
        }

    });
}
// ================= TẠO FILE SETTING =================
var configPath = "/sdcard/Download/config.json";

if (!files.exists(configPath)) {
    let defaultConfig = {
        "cao": {
            "farm": 43,
            "moDat": false,
            "barn": true,
            "silo": false,
            "cayTrong": "lua",
            "chayXe": false,
            "banhMi": false
        },
        "upBarn": {
            "banRd": true,
            "loaiHang": "rac",
            "tokenTele": "",
            "idChat": "",
            "sendTele": false
        },
        "theMau": {
            "theMau": "xe",
            "help": true
        },
        "nextAcc": 22,
        "deviceName": "máy Test",
        "test": "test"
    }
    files.write(configPath, JSON.stringify(defaultConfig, null, 4));
}


// ================= DASHBOARD =================
function showDashboard(data) {

    ui.layout(
        <vertical bg="#F5F7FA">


            <vertical bg="#1565C0" padding="20">

                <horizontal gravity="center_vertical">

                    <vertical layout_weight="1">

                        <text text={"XIN CHÀO:  " + device.brand + "  " + device.model}
                            textColor="#ffffff"
                            textSize="20sp"
                            textStyle="bold" />

                        <text text={"Key: " + data.key + " | HSD: " + data.expire}
                            textColor="#BBDEFB"
                            textSize="13sp"
                            marginTop="3" />

                    </vertical>


                    <card id="cardLogout"
                        cardCornerRadius="30dp"
                        cardElevation="4dp"
                        foreground="?attr/selectableItemBackground"
                        w="60dp"
                        h="60dp">

                        <frame gravity="center">
                            <text text="Logout"
                                marginTop="11sp"
                                marginLeft="3sp"
                                textSize="16sp"
                                textColor="#D32F2F" />
                        </frame>

                    </card>

                </horizontal>

            </vertical>


            <vertical padding="20">

                <card id="card1"
                    cardCornerRadius="16dp"
                    cardElevation="8dp"
                    marginBottom="15"
                    foreground="?attr/selectableItemBackground">

                    <horizontal padding="20" gravity="center_vertical">

                        <text text="🌾"
                            textSize="22sp"
                            marginRight="15" />

                        <vertical layout_weight="1">
                            <text text="Auto Cào Lúa"
                                textSize="16sp"
                                textStyle="bold" />
                            <text text="Tự động thao tác nhanh"
                                textSize="12sp"
                                textColor="#666" />
                        </vertical>
                        <text id="rightText1"
                            text="Hoạt Động"
                            textSize="16sp"
                            textStyle="bold"
                            textColor="#1565C0"
                            padding="8 4"
                            gravity="center"
                            layout_gravity="center_vertical" />

                    </horizontal>
                </card>
                <card id="card2"
                    cardCornerRadius="16dp"
                    cardElevation="8dp"
                    marginBottom="15"
                    foreground="?attr/selectableItemBackground">

                    <horizontal padding="20" gravity="center_vertical">


                        <text text="🛒"
                            textSize="22sp"
                            marginRight="15" />


                        <vertical layout_weight="1">
                            <text text="Auto UP ĐỒ"
                                textSize="16sp"
                                textStyle="bold" />
                            <text text="Chế độ nâng cao"
                                textSize="12sp"
                                textColor="#666" />
                        </vertical>


                        <text id="rightText2"
                            text="Hoạt Động"
                            textSize="16sp"
                            textStyle="bold"
                            textColor="#1565C0"
                            padding="8 4"
                            gravity="center"
                            layout_gravity="center_vertical" />
                    </horizontal>

                </card>
                <card id="card3"
                    cardCornerRadius="16dp"
                    cardElevation="8dp"
                    marginBottom="15"
                    foreground="?attr/selectableItemBackground">

                    <horizontal padding="20" gravity="center_vertical">

                        <text text="👨"
                            textSize="22sp"
                            marginRight="15" />

                        <vertical layout_weight="1">
                            <text text="Auto Thuê Tom"
                                textSize="16sp"
                                textStyle="bold" />
                            <text text="Tự động thao tác nhanh"
                                textSize="12sp"
                                textColor="#666" />
                        </vertical>
                        <text id="rightText3"
                            text="OFF"
                            textSize="16sp"
                            textStyle="bold"
                            textColor="#000000"
                            padding="8 4"
                            gravity="center"
                            layout_gravity="center_vertical" />

                    </horizontal>
                </card>

                <card id="card4"
                    cardCornerRadius="16dp"
                    cardElevation="8dp"
                    marginBottom="15"
                    foreground="?attr/selectableItemBackground">

                    <horizontal padding="20" gravity="center_vertical">

                        <text text="🚚"
                            textSize="22sp"
                            marginRight="15" />

                        <vertical layout_weight="1">
                            <text text="Auto Thẻ Màu"
                                textSize="16sp"
                                textStyle="bold" />
                            <text text="Chế độ nâng cao"
                                textSize="12sp"
                                textColor="#666" />
                        </vertical>
                        <text id="rightText4"
                            text="Hoạt Động"
                            textSize="16sp"
                            textStyle="bold"
                            textColor="#1565C0"
                            padding="8 4"
                            gravity="center"
                            layout_gravity="center_vertical" />

                    </horizontal>
                </card>

                <card id="cardSetting"
                    cardCornerRadius="16dp"
                    cardElevation="8dp"
                    foreground="?attr/selectableItemBackground">

                    <horizontal padding="20" gravity="center_vertical">

                        <text text="⚙"
                            textSize="22sp"
                            marginRight="15" />

                        <text text="Cài đặt"
                            textSize="16sp"
                            textStyle="bold" />

                    </horizontal>
                </card>


            </vertical>

        </vertical>
    );

    function addPressEffect(view) {
        view.setOnTouchListener(function (v, event) {
            if (event.getAction() == 0) {
                v.setScaleX(0.97);
                v.setScaleY(0.97);
            } else if (event.getAction() == 1 || event.getAction() == 3) {
                v.setScaleX(1);
                v.setScaleY(1);
            }
            return false;
        });
    }

    addPressEffect(ui.card1);
    addPressEffect(ui.card2);
    addPressEffect(ui.card3);
    addPressEffect(ui.card4);
    addPressEffect(ui.cardSetting);
    addPressEffect(ui.cardLogout);
    //let CryptoJS = require("./crypto-js");
    function decryptCode(data) {

        let key = CryptoJS.SHA256("abc1");

        let decrypted = CryptoJS.AES.decrypt(
            data,
            key,
            { iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000") }
        );

        return decrypted.toString(CryptoJS.enc.Utf8);
    }
    function cao(d) {
        var url = "http://47.84.93.84/code?key=" + d.key + "&device=" + device.getAndroidId();

        let r = http.get(url);
        let data1 = r.body.json();
        if (data1.status) {
            eval(data1.code)

        } else {
            toast("Bạn không có quyền truy cập auto");
        }
    }
    // ===== CLICK EVENTS =====
    ui.card1.on("click", function () {
        threads.start(function () {
            cao(data);
        });
    });

    ui.card2.on("click", function () {
        uiUpbarn(data);
    });
    ui.card3.on("click", function () {
        toast("Auto chưa được cài đặt");
    });
    ui.card4.on("click", function () {
        toast("Auto chưa được cài đặt");
    });
    ui.cardSetting.on("click", function () {
        showSettingPage(data);
    });

    ui.cardLogout.on("click", function () {
        storage.remove("user_key");
        // engines.execScriptFile("/sdcard/Scripts/temp_main.js");
        engines.myEngine().forceStop();
    });
}

function uiUpbarn(data) {
    ui.statusBarColor("#2196F3");
    ui.layout(
        <frame bg="#f5f5f5">
            <vertical>
                <horizontal bg="#1976D2" padding="12" gravity="center_vertical">
                    <text
                        id="btnBackHome"
                        text="🔙"
                        textSize="30sp"
                        textColor="#f5f5f5"
                        padding="8" />
                    <vertical layout_weight="1">
                        <text
                            text="AUTO UP ĐỒ"
                            textColor="#ffffff"
                            textSize="20sp"
                            textStyle="bold"
                            gravity="center" />

                        <text
                            text="Công Cụ Hỗ Trợ Tự Động"
                            textColor="#BBDEFB"
                            textSize="12sp"
                            gravity="center"
                            marginTop="2" />
                    </vertical>

                </horizontal>

                <scroll>
                    <vertical padding="16">

                        <card w="*" marginBottom="16"
                            cardCornerRadius="12dp"
                            cardElevation="4dp"
                            bg="#ffffff">
                            <vertical padding="16">
                                <text text="Kiểu Bán"
                                    textStyle="bold"
                                    marginBottom="8" />
                                <radiogroup id="rgBan" orientation="horizontal">
                                    <radio id="banBo" text="Bán Bộ" />
                                    <radio id="banRandom" text="Random" checked="true" />
                                </radiogroup>
                            </vertical>
                        </card>

                        <card w="*" marginBottom="16"
                            cardCornerRadius="12dp"
                            cardElevation="4dp"
                            bg="#ffffff">
                            <vertical padding="16">
                                <text text="Loại Hàng"
                                    textStyle="bold"
                                    marginBottom="8" />
                                <radiogroup id="rgLoai">
                                    <radio id="rac" text="Rác" checked="true" />
                                    <radio id="barn" text="Barn" />
                                    <radio id="silo" text="Silo" />
                                    <radio id="modat" text="Mở Đất" />
                                    <radio id="barnSilo" text="Barn + Silo" />
                                </radiogroup>
                            </vertical>
                        </card>

                        <button
                            id="btnStart"
                            text="BẮT ĐẦU"
                            textSize="16sp"
                            textStyle="bold"
                            bg="#4CAF50"
                            textColor="#ffffff"
                            h="50"
                            w="*" />

                    </vertical>
                </scroll>

            </vertical>
            <frame
                w="*"
                h="*">
                <text
                    text="© 2026 Xuan Vu"
                    textSize="12sp"
                    textColor="#c01111ff"
                    gravity="right|bottom"
                    layout_gravity="right|bottom"
                    alpha="0.8"
                    margin="12"
                    w="*"
                    h="*" />
            </frame>

        </frame>
    );

    ui.btnBackHome.on("click", function () {
        showDashboard(data);
    });

    ui.btnStart.on("click", function () {
        let banRd = ui.banRandom.checked;
        let loaiHang = "rac";
        if (ui.barn.checked) loaiHang = "barn"
        else if (ui.silo.checked) loaiHang = "silo"
        else if (ui.modat.checked) loaiHang = "modat"
        else if (ui.barnSilo.checked) loaiHang = "baSi"

        // let path = files.join(files.cwd(), "/upBarn.js");

        // if (!files.exists(path)) {
        //     toast("Không tìm thấy upBarn.js");
        //     return;
        // }
        let config = JSON.parse(files.read(configPath));
        config.upBarn.banRd = banRd;
        config.upBarn.loaiHang = loaiHang;
        files.write(configPath, JSON.stringify(config));
        showDashboard(data);
    });


}
// ================= SETTINGS PAGE =================
function showSettingPage(data) {
    ui.layout(
        <vertical bg="#F5F7FA">

            <vertical bg="#1565C0" padding="20">
                <text text="CÀI ĐẶT"
                    textColor="#ffffff"
                    textSize="20sp"
                    textStyle="bold" />
            </vertical>
            <scroll layout_weight="1">
                <vertical padding="20">
                    <card w="*"
                        marginBottom="16"
                        cardCornerRadius="12dp"
                        cardElevation="4dp"
                        bg="#ffffff">
                        <vertical padding="16">
                            <text text="Số Farm cào (1-90)"
                                textStyle="bold"
                                marginBottom="8" />
                            <input id="farmQty"
                                inputType="number" />
                        </vertical>
                    </card>
                    <horizontal marginBottom="16">
                        <card layout_weight="1"
                            marginRight="8"
                            cardCornerRadius="12dp"
                            cardElevation="4dp"
                            bg="#ffffff">
                            <vertical padding="16">
                                <text text="Chạy Xe"
                                    textStyle="bold"
                                    marginBottom="8" />
                                <radiogroup id="chayXe" orientation="horizontal">
                                    <radio id="caoXe" text="Có" />
                                    <radio id="caoKXe" text="Không" />
                                </radiogroup>
                            </vertical>
                        </card>
                        <card layout_weight="1"
                            marginRight="8"
                            cardCornerRadius="12dp"
                            cardElevation="4dp"
                            bg="#ffffff">
                            <vertical padding="16">
                                <text text="Làm Bánh Mì"
                                    textStyle="bold"
                                    marginBottom="8" />
                                <radiogroup id="banhMi" orientation="horizontal">
                                    <radio id="coBanhMi" text="Có" />
                                    <radio id="kBanhMi" text="Không" />
                                </radiogroup>
                            </vertical>
                        </card>
                    </horizontal>
                    <horizontal marginBottom="16">
                        <card layout_weight="1"
                            marginRight="8"
                            cardCornerRadius="12dp"
                            cardElevation="4dp"
                            bg="#ffffff">
                            <vertical padding="16">
                                <text text="Loại Cây Trồng"
                                    textStyle="bold"
                                    marginBottom="8" />
                                <radiogroup id="stCay"
                                    orientation="vertical">

                                    <radio id="lua"
                                        text="Cào Lúa" />

                                    <radio id="caRot"
                                        text="Cà Rốt" />

                                    <radio id="mia"
                                        text="Mía" />
                                </radiogroup>
                            </vertical>
                        </card>
                        <card layout_weight="1"
                            marginLeft="8"
                            cardCornerRadius="12dp"
                            cardElevation="4dp"
                            bg="#ffffff">
                            <vertical padding="16">

                                <text text="Nâng"
                                    textStyle="bold"
                                    marginBottom="8" />

                                <checkbox id="nbarn"
                                    text="Nâng Barn" />

                                <checkbox id="nsilo"
                                    text="Nâng Silo" />

                                <checkbox id="nmodat"
                                    text="Mua Đất" />
                            </vertical>
                        </card>
                    </horizontal>
                    <button id="btnSave"
                        text="Lưu"
                        marginTop="20"
                        bg="#1565C0"
                        textColor="#ffffff" />

                </vertical>

            </scroll>

            <horizontal h="60"
                bg="#ffffff"
                elevation="6">

                <button id="menuHome"
                    text="🏠"
                    layout_weight="1"
                    textSize="20sp"
                    bg="#00000000" />

                <button id="menuSetting"
                    text="🌾"
                    layout_weight="1"
                    textSize="20sp"
                    bg="#00000000" />

                <button id="menuLog"
                    text="📄"
                    layout_weight="1"
                    textSize="20sp"
                    bg="#00000000" />

            </horizontal>

        </vertical>
    );

    var config = JSON.parse(files.read(configPath));

    ui.nbarn.checked = config.cao.barn;
    ui.nsilo.checked = config.cao.silo;
    ui.nmodat.checked = config.cao.moDat;
    ui.farmQty.setText(String(config.cao.farm));

    if (config.cao.cayTrong == "lua") ui.lua.checked = true;
    if (config.cao.cayTrong == "carot") ui.caRot.checked = true;
    if (config.cao.cayTrong == "mia") ui.mia.checked = true;

    if (config.cao.chayXe) {
        ui.caoXe.checked = true;
    } else {
        ui.caoKXe.checked = true;
    }

    if (config.cao.banhMi) {
        ui.coBanhMi.checked = true;
    } else {
        ui.kBanhMi.checked = true;
    }

    ui.btnSave.on("click", function () {

        var barn = ui.nbarn.checked;
        var silo = ui.nsilo.checked;
        var modat = ui.nmodat.checked;
        var banhMi = ui.coBanhMi.checked;
        var chayXe = ui.caoXe.checked;

        var farm = parseInt(ui.farmQty.text());

        if (isNaN(farm)) {
            farm = 15;
        }

        var cay = "lua";

        if (ui.mia.checked) {
            cay = "mia";
        } else if (ui.caRot.checked) {
            cay = "carot";
        } else {
            cay = "lua";
        }

        let setting = "/sdcard/Download/config.json";
        let config = {};

        if (files.exists(setting)) {
            config = JSON.parse(files.read(setting));
        }

        config.cao.barn = barn;
        config.cao.silo = silo;
        config.cao.moDat = modat;
        config.cao.cayTrong = cay;
        config.cao.banhMi = banhMi;
        config.cao.chayXe = chayXe;

        if (farm <= 90) {
            config.cao.farm = farm;
        } else {
            config.cao.farm = farm % 90;
        }

        files.write(setting, JSON.stringify(config));

        showDashboard(data);

    });
    ui.menuHome.click(function () {
        showSettingPage2(data);
    });

    ui.menuSetting.click(function () {
        showSettingPage(data);
    });

    ui.menuLog.click(function () {
        showSettingPage3(data);
    });
}

function showSettingPage2(data) {
    ui.layout(
        <vertical bg="#F5F7FA">

            <vertical bg="#1565C0" padding="20">
                <text text="CÀI ĐẶT 2"
                    textColor="#ffffff"
                    textSize="20sp"
                    textStyle="bold" />
            </vertical>

            <scroll layout_weight="1">

                <vertical padding="20">

                    <card w="*" marginBottom="16"
                        cardCornerRadius="12dp"
                        cardElevation="4dp"
                        bg="#ffffff">
                        <vertical padding="16">
                            <text text="Số Farm cào(1-90)"
                                textStyle="bold"
                                marginBottom="8" />
                            <input id="farmQty" inputType="number" />
                        </vertical>
                    </card>

                    <card w="*" marginBottom="16"
                        cardCornerRadius="12dp"
                        cardElevation="4dp"
                        bg="#ffffff">
                        <vertical padding="16">

                            <text text="Loại Cây Trồng"
                                textStyle="bold"
                                marginBottom="8" />

                            <radiogroup id="stCay" orientation="horizontal">
                                <radio id="lua" text="Cào Lúa" />
                                <radio id="caRot" text="Cà Rốt" />
                                <radio id="mia" text="Mía" />
                            </radiogroup>

                        </vertical>
                    </card>

                    <card w="*" marginBottom="16"
                        cardCornerRadius="12dp"
                        cardElevation="4dp"
                        bg="#ffffff">
                        <vertical padding="16">

                            <text text="Nâng"
                                textStyle="bold"
                                marginBottom="8" />

                            <checkbox id="nbarn" text="Nâng Barn" />
                            <checkbox id="nsilo" text="Nâng Silo" />
                            <checkbox id="nmodat" text="Mua Đất" />

                        </vertical>
                    </card>

                    <button id="btnBack"
                        text="Lưu"
                        marginTop="20"
                        bg="#1565C0"
                        textColor="#ffffff" />

                </vertical>

            </scroll>


            <horizontal h="60" bg="#ffffff" elevation="6">

                <button id="menuHome"
                    text="🏠"
                    layout_weight="1"
                    textSize="20sp"
                    bg="#00000000" />

                <button id="menuSetting"
                    text="🌾"
                    layout_weight="1"
                    textSize="20sp"
                    bg="#00000000" />

                <button id="menuLog"
                    text="📄"
                    layout_weight="1"
                    textSize="20sp"
                    bg="#00000000" />

            </horizontal>

        </vertical>
    );
    ui.menuHome.click(function () {
        showSettingPage2(data);
    });

    ui.menuSetting.click(function () {
        showSettingPage(data);
    });

    ui.menuLog.click(function () {
        showSettingPage3(data);
    });
}
function showSettingPage3(data) {
    ui.layout(
        <vertical bg="#F5F7FA">

            <vertical bg="#1565C0" padding="20">
                <text text="CÀI ĐẶT 3"
                    textColor="#ffffff"
                    textSize="20sp"
                    textStyle="bold" />
            </vertical>

            <scroll layout_weight="1">

                <vertical padding="20">

                    <card w="*" marginBottom="16"
                        cardCornerRadius="12dp"
                        cardElevation="4dp"
                        bg="#ffffff">
                        <vertical padding="16">
                            <text text="Số Farm cào(1-90)"
                                textStyle="bold"
                                marginBottom="8" />
                            <input id="farmQty" inputType="number" />
                        </vertical>
                    </card>

                    <card w="*" marginBottom="16"
                        cardCornerRadius="12dp"
                        cardElevation="4dp"
                        bg="#ffffff">
                        <vertical padding="16">

                            <text text="Loại Cây Trồng"
                                textStyle="bold"
                                marginBottom="8" />

                            <radiogroup id="stCay" orientation="horizontal">
                                <radio id="lua" text="Cào Lúa" />
                                <radio id="caRot" text="Cà Rốt" />
                                <radio id="mia" text="Mía" />
                            </radiogroup>

                        </vertical>
                    </card>

                    <card w="*" marginBottom="16"
                        cardCornerRadius="12dp"
                        cardElevation="4dp"
                        bg="#ffffff">
                        <vertical padding="16">

                            <text text="Nâng"
                                textStyle="bold"
                                marginBottom="8" />

                            <checkbox id="nbarn" text="Nâng Barn" />
                            <checkbox id="nsilo" text="Nâng Silo" />
                            <checkbox id="nmodat" text="Mua Đất" />

                        </vertical>
                    </card>

                    <button id="btnBack"
                        text="Lưu"
                        marginTop="20"
                        bg="#1565C0"
                        textColor="#ffffff" />

                </vertical>

            </scroll>


            <horizontal h="60" bg="#ffffff" elevation="6">

                <button id="menuHome"
                    text="🏠"
                    layout_weight="1"
                    textSize="20sp"
                    bg="#00000000" />

                <button id="menuSetting"
                    text="🌾"
                    layout_weight="1"
                    textSize="20sp"
                    bg="#00000000" />

                <button id="menuLog"
                    text="📄"
                    layout_weight="1"
                    textSize="20sp"
                    bg="#00000000" />

            </horizontal>

        </vertical>
    );
    ui.menuHome.click(function () {
        showSettingPage2(data);
    });

    ui.menuSetting.click(function () {
        showSettingPage(data);
    });

    ui.menuLog.click(function () {
        showSettingPage3(data);
    });
}