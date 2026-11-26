# Py径

Py径是可在浏览器中学习和练习 Python 的静态站点，包括 12 节基础课程、23 节进阶课程、题库和综合项目。在线编辑器使用 Pyodide 0.27.7 运行 Python 3.12.7。在线体验：https://lazy-xiaochen.github.io/py-path/

## 本地启动

需要 Node.js 22.18 或更新版本。在项目目录运行以下命令。

```sh
npm ci
npm run dev
```

在浏览器打开终端显示的本地地址。安装依赖后，站点从本地提供 Python 运行时。

## 构建与静态发布

```sh
npm run build
npm run preview
```

将整个 `dist/` 上传到静态服务器，通过 HTTP 或 HTTPS 访问。可以部署在站点根目录，也可以放在 `/py-path/` 等子路径。请一并部署 `assets/`、`runtime/`、`third-party/` 等目录。课程使用井号路由，打开子页面时仍从同一个入口加载。构建会替换 `dist/` 的旧资产，并生成随包分发的依赖声明 `third-party/README.txt` 和 `third-party/editor.txt`。

## 测试

```sh
npm run typecheck
npm test
npx playwright install chromium
npm run test:e2e
npm run test:e2e:audit
```

`test:e2e` 检查网站交互与提交流程，`test:e2e:audit` 用浏览器中的平台运行器和评测函数验证课程、参考解及结项，其测试构建位于 `.vite/runtime-audit/`。测试可通过环境变量 `PLAYWRIGHT_CHANNEL=msedge` 或 `PLAYWRIGHT_CHANNEL=chrome` 使用电脑上已安装的 Edge 或 Chrome。

## 浏览器本地存储

草稿、代码文件、学习进度、作答和错题记录保存在当前浏览器的本地存储中。使用同一浏览器配置及同一站点来源（协议、域名、端口）可继续学习。切换浏览器配置、使用隐私窗口或清除站点数据会影响记录可见性。站点无登录同步，也没有在服务器上执行学习者提交的代码。
