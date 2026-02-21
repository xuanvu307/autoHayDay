"ui";

ui.statusBarColor("#2196F3");

ui.layout(
    <frame bg="#f5f5f5">
        <vertical>
            <vertical bg="#1976D2" padding="18">
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
                    marginTop="4" />
            </vertical>

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
                        id="btnClick"
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
                alpha = "0.8"
                margin="12"
                w="*"
                h="*" />
        </frame>

    </frame>
);


ui.btnClick.on("click", function () {

    let kieuBan = ui.banBo.isChecked() ? 1 : 0;

    let loaiHang = 0;
    if (ui.barn.isChecked()) loaiHang = 1;
    else if (ui.silo.isChecked()) loaiHang = 2;
    else if (ui.modat.isChecked()) loaiHang = 3;
    else if (ui.barnSilo.isChecked()) loaiHang = 4;

    let config = { kieuBan, loaiHang };

    let path = files.join(files.cwd(), "upBarn.js");

    if (!files.exists(path)) {
        toast("Không tìm thấy upBarn.js");
        return;
    }

    ui.finish();

    engines.execScriptFile(path, {
        arguments: config
    });


});

