# Thiết kế Bổ sung Theme Light (`IntelliJ IDEA New UI Light (Pro)`), Đổi tên Extension & Push GitHub

## 1. Mục đích & Lý do (Intent & Why)
Mở rộng bộ extension từ chỉ hỗ trợ giao diện tối sang hỗ trợ đầy đủ cả 2 giao diện chính thức của JetBrains (**IntelliJ IDEA New UI Dark (Pro)** và **IntelliJ IDEA New UI Light (Pro)**), cho phép người dùng chuyển đổi trực tiếp qua menu **Color Theme** của IDE, đồng thời đổi tên extension thành **IntelliJ IDEA New UI (Pro)** (`jetbrains-intellij-new-ui-pro`) để đồng bộ với repository GitHub `https://github.com/Hieu4tuoii/IntelliJ-IDEA-New-UI-Pro-.git`.

## 2. Mục tiêu, Phi mục tiêu & Điều cần tránh (Goals, Non-Goals, Anti-Goals)
- **Goals:**
  - **Bảo toàn 100% Theme Dark hiện tại:** Giữ nguyên tuyệt đối mọi mã màu workbench, `semanticTokenColors`, `tokenColors`, icon SVG gốc và hành vi của `IntelliJ IDEA New UI Dark (Pro)`.
  - **Thêm `IntelliJ IDEA New UI Light (Pro)` (`uiTheme: "vs"`):** Xây dựng bảng màu chuẩn JetBrains `ExperimentalLight` (`light.xml`) với hơn 320 khóa màu workbench (Editor `#FFFFFF`, Sidebar/Toolbar/StatusBar `#F7F8FA` / `#EBECF0`, Accent `#3574F0`, Selection `#A6D2FF` / `#D4E2FF`, Line Highlight `#F5F8FE`, Diff/Gutter chuẩn IntelliJ Light) cùng bộ quy tắc Semantic Highlighting & TextMate sâu cho Java/Spring Boot và TypeScript/React (Keyword `#0033B3`, Field/Property `#871094`, Method Declaration `#00627A`, String `#067D17`, Number `#1750EB`, Annotation `#9E880D`, Comment `#8C8C8C`, Doc Comment `#497C54`).
  - **Hỗ trợ File Icons cho bản Light:** Bổ sung biến thể icon sáng (`svgs/light/*.svg` và nhánh `light` trong `intellij-new-ui-file-icons.json`) để khi chọn theme Light trong IDE, bộ icon file/folder tự động hiển thị tông sáng chuẩn `expui` Light mà không chạm vào các icon của bản Dark.
  - **Đổi tên trực tiếp qua menu Color Theme của IDE:** Trong `extension.js`, mặc định vẫn là `IntelliJ IDEA New UI Dark (Pro)`, nhưng nếu người dùng đã chọn `IntelliJ IDEA New UI Light (Pro)` trong menu Color Theme của IDE thì `extension.js` sẽ giữ nguyên lựa chọn đó (không ghi đè ngược lại về Dark).
  - **Đổi tên Extension toàn diện:** Đổi `name` thành `jetbrains-intellij-new-ui-pro`, `displayName` thành `IntelliJ IDEA New UI (Pro)`, phiên bản `1.2.0`, thư mục nguồn `jetbrains-intellij-new-ui-pro/`, gói `dist/jetbrains-intellij-new-ui-pro-1.2.0.vsix`, và tự động gỡ bỏ các bản cài đặt `-dark` cũ trong `.antigravity` / `.antigravity-ide`.
  - **Đẩy lên GitHub:** Cấu hình `remote origin` tới `https://github.com/Hieu4tuoii/IntelliJ-IDEA-New-UI-Pro-.git` và push lên nhánh `main`.
- **Non-Goals:** Không thêm cài đặt hay phím tắt phụ để đổi theme vì người dùng muốn chuyển trực tiếp qua menu Color Theme sẵn có của IDE.
- **Anti-Goals:** Tuyệt đối không làm thay đổi bất kỳ màu sắc, độ tương phản, font chữ, keymap hay icon nào khi đang ở `IntelliJ IDEA New UI Dark (Pro)`.

## 3. Ràng buộc (Constraints)
- File `themes/intellij-new-ui-dark-pro.json` và toàn bộ kiểm thử của bản Dark phải giữ nguyên 100% giá trị.
- Chuyển đổi qua lại giữa `IntelliJ IDEA New UI Dark (Pro)` và `IntelliJ IDEA New UI Light (Pro)` trong menu Color Theme (`Ctrl+K Ctrl+T`) hoạt động mượt mà ngay lập tức.
- Toàn bộ bài test trong `tests/*.test.mjs` phải pass (`npm test`).

## 4. Các hướng tiếp cận đã cân nhắc (Approaches)
1. **Phương án 1 (Đã chọn): Đổi tên toàn diện sang `IntelliJ IDEA New UI (Pro)` (`jetbrains-intellij-new-ui-pro`) + Thêm theme `IntelliJ IDEA New UI Light (Pro)` + Bổ sung nhánh `light` cho File Icons + Giữ nguyên tuyệt đối bản Dark.**
   - *Đánh đổi:* Cập nhật tên thư mục và đường dẫn trong script/test, nhưng đồng bộ 100% với tên repo GitHub mới và chuẩn hóa trải nghiệm cả Dark lẫn Light.
2. **Phương án 2: Chỉ đổi `displayName`, giữ nguyên ID `jetbrains-intellij-new-ui-dark` và dùng chung bộ icon tối cho cả 2 theme.**
   - *Đánh đổi:* Ít sửa đường dẫn hơn nhưng ID và gói `.vsix` vẫn mang chữ `-dark`, đồng thời icon nền tối sẽ bị gắt trên nền Sidebar sáng.

## 5. Giải pháp kỹ thuật chi tiết (The How)
1. **Đổi tên thư mục & Manifest (`jetbrains-intellij-new-ui-pro/package.json`):**
   - Đổi tên thư mục `jetbrains-intellij-new-ui-dark` -> `jetbrains-intellij-new-ui-pro`.
   - Cập nhật `name`: `"jetbrains-intellij-new-ui-pro"`, `displayName`: `"IntelliJ IDEA New UI (Pro)"`, `version`: `"1.2.0"`.
   - Trong `contributes.themes`, khai báo 2 theme:
     - `IntelliJ IDEA New UI Dark (Pro)` (`uiTheme: "vs-dark"`, `./themes/intellij-new-ui-dark-pro.json`) — giữ nguyên.
     - `IntelliJ IDEA New UI Light (Pro)` (`uiTheme: "vs"`, `./themes/intellij-new-ui-light-pro.json`) — mới.
2. **Sinh Theme Dark & Light (`scripts/build-theme.mjs`):**
   - Giữ nguyên cấu trúc dữ liệu của `darkTheme` và xuất ra `themes/intellij-new-ui-dark-pro.json`.
   - Bổ sung `lightTheme` chuẩn JetBrains `ExperimentalLight` (`light.xml`) với đầy đủ các nhóm màu workbench, semantic tokens, và TextMate scopes đồng bộ chống nhấp nháy chữ (`storage.type.import.java`, `storage.type.package.java`, operators, constructors...), xuất ra `themes/intellij-new-ui-light-pro.json`.
3. **Bổ sung nhánh `light` cho File Icons (`scripts/build-file-icons.mjs` & `extension.js`):**
   - Giữ nguyên 100% `SVGS` và cấu hình gốc của bản Dark.
   - Sinh thêm bộ SVG nền sáng trong `icons/file-icons/svgs/light/*.svg` (định danh `_light_*` trong `iconDefinitions`) và khai báo đối tượng `light` ở cấp cao nhất của `intellij-new-ui-file-icons.json` (VS Code chỉ đọc nhánh `light` khi `uiTheme` là Light, hoàn toàn không ảnh hưởng đến Dark).
   - Trong `extension.js`, khi `applyJavaIconMapping` cập nhật `theme.fileNames[baseName]`, đồng bộ tương ứng vào `theme.light.fileNames[baseName]` nếu nhánh `light` tồn tại.
4. **Tôn trọng lựa chọn Color Theme của IDE (`extension.js` & `scripts/install-and-package.mjs`):**
   - Định nghĩa `INTELLIJ_THEMES = new Set(['IntelliJ IDEA New UI Dark (Pro)', 'IntelliJ IDEA New UI Light (Pro)'])`.
   - Khi ghi cài đặt (`writeSettingsFileAtomically` / `writeWorkspaceSettingsAtomically`), nếu `data['workbench.colorTheme']` đã nằm trong `INTELLIJ_THEMES`, giữ nguyên theme người dùng đang chọn; nếu chưa, áp dụng mặc định `'IntelliJ IDEA New UI Dark (Pro)'`.
   - Cập nhật `scripts/install-and-package.mjs` để đóng gói `dist/jetbrains-intellij-new-ui-pro-1.2.0.vsix`, gỡ sạch các thư mục/gói `jetbrains-intellij-new-ui-dark` cũ và đăng ký `elaand.jetbrains-intellij-new-ui-pro-1.2.0`.
5. **Kiểm thử & Push GitHub:**
   - Cập nhật và bổ sung kiểm thử cho cả Dark & Light trong `tests/*.test.mjs`.
   - Đổi tên nhánh sang `main`, thêm remote `origin https://github.com/Hieu4tuoii/IntelliJ-IDEA-New-UI-Pro-.git` và `git push -u origin main`.

## 6. Phần giao cho Builder (Left to the Builder)
- Chi tiết mã màu phụ trợ của các widget trong `lightTheme` bám sát bảng màu `ExperimentalLight` của IntelliJ IDEA.
- Thực thi cài đặt VSIX mới, chạy toàn bộ test suite và push lên GitHub.
