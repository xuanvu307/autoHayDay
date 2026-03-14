"ui";

ui.statusBarColor("#1565C0");

var storage = storages.create("APP_LICENSE");
var savedKey = storage.get("user_key", "");

storage.put("loader_path", engines.myEngine().getSource());

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

                    loadAuto();

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

function loadAuto() {

    toast("Đang tải tool...");

    let url = "https://raw.githubusercontent.com/xuanvu307/autoHayDay/main/main.js";

    threads.start(function () {

        try {

            let r = http.get(url);

            if (r.statusCode != 200) {
                toast("Server lỗi");
                return;
            }

            let code = r.body.string();

            // tắt script cũ
            engines.all().forEach(e => {
                if (e.id != engines.myEngine().id) {
                    e.forceStop();
                }
            });

            // chạy script chính
            engines.execScript("auto_main", code);

            ui.run(() => ui.finish());

        } catch (e) {

            log(e);
            toast("Không tải được script");

        }

    });

}