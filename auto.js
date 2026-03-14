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
                    let url = "https://raw.githubusercontent.com/xuanvu307/autoHayDay/refs/heads/main/main.js";
                    threads.start(function () {
                        try {
                            let res = http.get(url);
                            if (res.statusCode != 200) {
                                toast("Load code thất bại");
                                return;
                            }
                            let code = res.body.string();
                            eval(code);

                        } catch (e) {
                            log(e);
                        }
                    });
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

