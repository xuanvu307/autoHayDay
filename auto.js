"ui";

ui.statusBarColor("#1565C0");

var storage = storages.create("APP_LICENSE");
var savedKey = storage.get("user_key", "");

showLoginPage();
function showLoginPage() {
    ui.layout(
        <frame bg="#E3F2FD">
            <vertical gravity="center" padding="30">

                <card w="*" cardCornerRadius="16dp" cardElevation="8dp">
                    <vertical padding="25">
                        <text text="AUTO BY XUAN VU"
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

function checkKey(key) {
    ui.statusText.setText("Đang kiểm tra...");
    threads.start(function () {
        try {
            let androidId = device.getAndroidId();
            let url = "http://47.84.93.84/check?key=" + key + "&device=" + androidId;
            let res = http.get(url);
            let data = res.body.json();
            ui.run(function () {
                if (data.status) {
                    storage.put("user_key", key);
                    data.key = key;
                    loadAuto(data);
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

function loadAuto(data) {
    let dir = "/sdcard/Scripts/cache/";
    files.ensureDir(dir);
    files.listDir(dir).forEach(name => {
        files.remove(dir + name);
    });
    let path = dir + "tmp_main.js";
    
    threads.start(function () {
        try {
            let serverData = getCode(data);
            if (!serverData) {
                toast("Không lấy được dữ liệu server");
                return;
            }
            let r = http.get(serverData);
            if (r.statusCode != 200) {
                toast("Không tải được code");
                return;
            }
            let code = r.body.string();
            files.write(path, code);
            engines.execScriptFile(path);
            ui.run(() => ui.finish());
        } catch (e) {
            log(e);
            toast("Lỗi tải tool");
        }
    });
}
function getCode(d) {
    try {
        let url = "http://47.84.93.84/code?key=" + d.key + "&device=" + device.getAndroidId();
        let r = http.get(url);
        if (r.statusCode != 200) {
            return null;
        }
        let data = r.body.json();
        if (data.status) {
            return data.code; 
        }
    } catch (e) {
        log(e);
    }
    return null;
}