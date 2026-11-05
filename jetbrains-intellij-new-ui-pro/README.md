# IntelliJ IDEA New UI (Pro)

Bộ extension giao diện, biểu tượng & phím tắt toàn diện chuẩn **IntelliJ IDEA New UI (Dark & Light)** cho Antigravity IDE / VS Code:

- **Color Themes (chuyển đổi trực tiếp qua menu Color Theme `Ctrl+K Ctrl+T`):**
  - **`IntelliJ IDEA New UI Dark (Pro)`:** Hơn 320 mã màu Workbench chuẩn `ExperimentalDark` (`#1E1F22` / `#2B2D30` / `#3574F0`) cùng bộ quy tắc Semantic Highlighting chuyên sâu cho Java / Spring Boot và TypeScript / React.
  - **`IntelliJ IDEA New UI Light (Pro)`:** Bảng màu sáng chuẩn `ExperimentalLight` (`#FFFFFF` / `#F7F8FA` / `#EBECF0` / `#3574F0`) cùng bộ Semantic Highlighting & TextMate chuẩn `light.xml` của JetBrains.
- **File Icon Theme (`intellij-new-ui-file-icons`):** Bộ biểu tượng vector SVG 16x16 chuẩn `expui` (tự động thích ứng theo cả nền Dark và Light), phân biệt chính xác Java `Class`, `Interface`, `Enum`, `Record`, `Abstract Class`, `Annotation`, `Exception`, `Test`, Spring Boot, Maven, Gradle, TypeScript/React.
- **Product Icon Theme (`intellij-new-ui-product-icons`):** Bộ font biểu tượng thanh công cụ (`.woff`) chuẩn nét mảnh của IntelliJ New UI.
- **IntelliJ IDEA Keymap (Tích hợp sẵn, có thể bật/tắt):** 45 phím tắt cốt lõi chuẩn IntelliJ (`Alt+Enter`, `Ctrl+N`, `Ctrl+E`, `Ctrl+Alt+L`, `Shift+F6`, `Ctrl+Y`, `Ctrl+D`,...).
- **Typography:** Kết hợp cùng bộ font chính thức `JetBrains Mono`.

## Cài đặt tùy chỉnh (Settings UI)

Mở **Settings (`Ctrl+,`)** và tìm `IntelliJ New UI`:
1. **`intellijNewUi.enableKeymap`** *(Mặc định: `true`)*: Bật/tắt toàn bộ phím tắt kiểu IntelliJ IDEA ngay lập tức mà không cần tắt giao diện/màu sắc/icon. Có thể bật/tắt nhanh qua Command Palette: `IntelliJ New UI: Toggle IntelliJ Keymap (On/Off)`.
2. **`intellijNewUi.onlyApplyInJavaProjects`** *(Mặc định: `false`)*: Khi bật, phím tắt và giao diện/icon IntelliJ IDEA sẽ chỉ kích hoạt khi mở dự án Java (có `pom.xml`, `build.gradle`, hoặc `.java`), tự động trả về mặc định cho các dự án khác với **0% ảnh hưởng hiệu năng** trong lúc code.
