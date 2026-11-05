# Thiết kế Tối ưu Hiệu năng & Chống Nhấp nháy (Zero-Flicker / Zero-Lag)

## 1. Mục đích & Lý do (Intent & Why)
Đảm bảo trải nghiệm gõ code, chuyển tab, lưu file (`Ctrl+S` / Auto-Save) và mở dự án trong Antigravity IDE mượt mà tuyệt đối, loại bỏ hoàn toàn hiện tượng nhấp nháy chữ (syntax token flash), nhấp nháy icon (icon theme reload flash) và khựng luồng Extension Host do I/O đồng bộ.

## 2. Mục tiêu, Phi mục tiêu & Điều cần tránh (Goals, Non-Goals, Anti-Goals)
- **Goals:**
  - `0` thao tác đọc/ghi đĩa khi mở hoặc lưu các file `.java` đã đúng icon.
  - Không bao giờ ghi đè `intellij-new-ui-file-icons.json` khi icon hiệu lực không đổi (ví dụ: file `.java` là `_java_class` vốn đã là mặc định của đuôi `.java`) hoặc khi 2 file trùng tên khác gói (`a/Const.java` vs `b/Const.java`) tranh chấp nhau.
  - Đồng bộ màu TextMate (`tokenColors`) với Semantic Highlighting (`semanticTokenColors`) cho `package`, `import`, hằng số và constructor để chữ không bị đổi màu (nhấp nháy cam -> xám) sau 200ms khi Language Server tải xong.
  - Quét workspace bất đồng bộ, có nhường luồng (non-blocking) và thu gọn `intellij-new-ui-file-icons.json`.
- **Non-Goals:** Không thay đổi bảng màu chuẩn IntelliJ IDEA New UI Dark hay bộ phím tắt hiện tại.
- **Anti-Goals:** Không để bất kỳ tác vụ nền nào của extension làm reload lại toàn bộ bảng icon hoặc `settings.json` khi người dùng đang gõ code.

## 3. Ràng buộc (Constraints)
- Tương thích 100% với bộ kiểm thử hiện có (`npm test` gồm 5 file test trong `tests/`).
- Giữ nguyên cơ chế cô lập cấu hình dự án Java (`.vscode/settings.json` + `.git/info/exclude`) và đóng gói VSIX.

## 4. Các hướng tiếp cận đã cân nhắc (Approaches)
1. **Hướng 1 (Đã chọn): Tối ưu toàn diện Zero-I/O Runtime + Chống nhấp nháy Icon/Text + Quét bất đồng bộ + Thu gọn JSON Icon.**
   - *Đánh đổi:* Chạm vào cả `extension.js`, `scripts/build-theme.mjs` và `scripts/build-file-icons.mjs`, nhưng giải quyết tận gốc cả 3 nguyên nhân gây giật lag và nhấp nháy chữ/icon.
2. **Hướng 2: Chỉ thêm RAM Cache trong `extension.js`, giữ nguyên file JSON icon và TextMate scopes.**
   - *Đánh đổi:* Sửa ít file hơn nhưng chữ ở dòng `import`/`package` vẫn nhấp nháy từ cam sang xám khi mở file và file JSON icon vẫn phình to.
3. **Hướng 3: Tắt hẳn phân tích nội dung file `.java`, chỉ đoán icon theo tên file.**
   - *Đánh đổi:* Không tốn tài nguyên runtime nhưng làm sai icon của các `interface`/`enum`/`@interface` không đặt tên theo hậu tố.

## 5. Giải pháp kỹ thuật chi tiết (The How)
1. **Chống nhấp nháy Icon & Zero-I/O trong `extension.js`:**
   - Lưu cache `theme.fileNames` trên RAM (`Map`/`Object` trong bộ nhớ) và dùng chung một `Buffer` 4KB tĩnh.
   - Tính icon hiệu lực hiện tại: `currentIcon = theme.fileNames[baseName] || '_java_class'`. Nếu `currentIcon === iconId` thì **không ghi file JSON** (tránh kích hoạt VS Code reload toàn bộ icon gây nhấp nháy).
   - Trong `onDidOpenTextDocument`: nếu file hoặc `baseName` đã được xử lý thì bỏ qua ngay (`O(1)`), tuyệt đối không ghi đè qua lại giữa 2 file trùng tên ở 2 package khác nhau.
   - Trong `onDidSaveTextDocument`: đọc trực tiếp 100 dòng đầu từ bộ nhớ `doc.getText(new vscode.Range(0, 0, 100, 0))` thay vì đọc ổ đĩa, và gom nhóm (debounce 300ms) khi cần ghi file icon JSON.
   - Chuyển `scanWorkspaceJavaIcons` sang duyệt bất đồng bộ theo lô (async chunked walk), chỉ chạy khi `isJavaProject === true`, và kiểm tra nhanh hậu tố tên file (`*Test.java`, `*Exception.java`) trước khi đọc header 4KB.
   - Tối ưu `writeSettingsFileAtomically` / `writeWorkspaceSettingsAtomically`: so sánh trực tiếp thay vì gọi `JSON.stringify` 66 lần, chỉ ghi đĩa khi giá trị thực sự khác biệt.
2. **Chống nhấp nháy chữ (Text Flicker) trong `scripts/build-theme.mjs` & `intellij-new-ui-dark-pro.json`:**
   - Bổ sung `storage.type.import.java`, `storage.type.package.java` vào nhóm màu `#BCBEC4` trong `tokenColors` để các dòng `package`/`import` không bị tô màu cam `#CF8E6D` lúc mới mở file rồi nháy sang xám `#BCBEC4` khi Semantic Highlighting tải xong.
   - Bổ sung scope TextMate cho hằng số tĩnh (`constant.other.java`, `variable.other.constant`) và constructor để khớp ngay từ frame đầu với `semanticTokenColors`.
3. **Thu gọn `intellij-new-ui-file-icons.json` & Sửa phân loại Icon `C` vs `R` (`extension.js`, `scripts/build-file-icons.mjs`):**
   - Trong `classifyJavaContent` và `classifyJavaFile`: chỉ trả về `_java_record` (icon `R`) khi nội dung file thực sự khai báo từ khóa `record TenClass(...)` (hoặc file rỗng có hậu tố `*Record.java`). Các file `*Dto.java`, `*Request.java`, `*Response.java` khai báo `class` sẽ trả về đúng `_java_class` (icon `C`) chuẩn IntelliJ IDEA.
   - Chỉ lưu vào `fileNames` các file Java có icon khác mặc định (`_java_interface`, `_java_enum`, `_java_record`, `_java_abstract`, `_java_annotation`, `_java_exception`, `_java_test`) cùng các mục cần thiết cho test, loại bỏ hàng trăm mục `_java_class` dư thừa và xóa sạch các mục `dto`/`request`/`response` bị gán nhầm sang `_java_record`.

## 6. Phần giao cho Builder (Left to the Builder)
- Chi tiết cài đặt hàm debounce và kích thước lô (batch size) khi duyệt thư mục bất đồng bộ.
- Đóng gói lại VSIX v1.1.0 và cài đặt vào cả `.antigravity` và `.antigravity-ide`.
