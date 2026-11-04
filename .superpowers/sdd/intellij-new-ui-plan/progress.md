# SDD ledger — plan: C:\Users\ADMIN\.gemini\antigravity\brain\021d3b7e-2841-4ae0-afd5-797f29c1ae3d\intellij-new-ui-plan.md

Pre-flight interface check:
- Task 1 -> Task 5: `elaand.jetbrains-intellij-new-ui-dark` & `elaand.jetbrains-intellij-keymap` manifests consumed by packaging/installation script. Match verified.
- Task 2 -> Task 1/5: `./themes/intellij-new-ui-dark-pro.json` matches manifest `contributes.themes[0].path`. Match verified.
- Task 3 -> Task 1/5: `./icons/file-icons/intellij-new-ui-file-icons.json` matches manifest `contributes.iconThemes[0].path`. Match verified.
- Task 4 -> Task 1/5: `./icons/product-icons/intellij-new-ui-product-icons.json` matches manifest `contributes.productIconThemes[0].path`. Match verified.
Task 1: complete (commits 5661e72, tests: node --test tests/manifest.test.mjs -> 1/1 pass)
Task 2: complete (commits 5661e72..6395e7f, tests: node --test tests/*.test.mjs -> 2/2 pass)
Task 3: complete (commits 6395e7f..13ce463, tests: node --test tests/*.test.mjs -> 3/3 pass)
Task 4: complete (commits 13ce463..7d06c06, tests: node --test tests/product-icons.test.mjs -> 1/1 pass)
