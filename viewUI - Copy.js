"ui";

ui.layout(
    <vertical padding="16">

        <text text="Bán Bộ Hay Bán Random" textStyle="bold" />

        <radiogroup id="rgBan" orientation="horizontal">
            <radio id="banBo" text="Bộ" />
            <radio id="banRandom" text="Random" checked />
        </radiogroup>

        <text text="Loại Hàng" marginTop="16" textStyle="bold" />

        <radiogroup id="rgLoai" orientation="horizontal">
            <radio id="rac" text="Rác" checked />
            <radio id="barn" text="Barn" />
            <radio id="silo" text="Silo" />
            <radio id="modat" text="Mở Đất" />
            <radio id="barnSilo" text="Barn + Silo" />
        </radiogroup>
        <button id="btnClick" text="OK" />
    </vertical>
);

ui.btnClick.on("click", function () {

    let kieuBan = ui.banBo.isChecked() ? 1 : 0;

    let loaiHang = 0;
    if (ui.barn.isChecked()) loaiHang = 1;
    else if (ui.silo.isChecked()) loaiHang = 2;
    else if (ui.modat.isChecked()) loaiHang = 3;
    else if (ui.barnSilo.isChecked()) loaiHang = 4;

    let config = {kieuBan, loaiHang};

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

