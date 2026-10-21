# OctoSense website

OctoSense 的学术项目网站。网站源码位于 `aiot-lab/OctoSense` 的 `website` 分支，由 GitHub Pages 发布。

- 网站：https://aiot-lab.github.io/OctoSense/
- 论文：https://arxiv.org/abs/2610.12405
- OctoSense 代码：https://github.com/aiot-lab/OctoSense

## 本地查看

无需安装依赖或执行构建，在本仓库根目录运行：

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

浏览器打开 http://127.0.0.1:8765/ 。

## 部署与更新

GitHub Pages 从 `website` 分支的根目录发布；推送提交后自动更新。`.nojekyll` 保持原生静态文件，不经过 Jekyll 转换。资源路径均相对于当前页面，适用于项目子路径。

## 文件

- `index.html`：论文介绍、语义轴对比、数据集、共享处理和实验配置。
- `styles.css`、`tensor-model.css`：页面和三维 Cube 样式。
- `app.js`、`tensor-demo.js`：数据集与配置交互，以及 Cube 翻滚动画。
- `content.js`：数据集目录、模型库与实验配置。
- `assets/`：字体、图标、论文 Figure 1、真实信号派生展示素材、样本元信息和公开配置。

所有自动轮转均使用 3 秒间隔。数据集和实验配置区域在鼠标悬停或键盘操作时暂停轮转。

本仓库仅包含网站发布文件，不包含原始数据集、实验运行记录或本地 QA 材料。网站无需 Python 或 OctoSense 运行时。

## 素材来源

Figure 1 来自 [OctoSense 论文](https://arxiv.org/html/2610.12405v1#S1.F1)，遵循论文的 CC BY 4.0 许可。频谱与 Cube 表面为 SignFi 信号派生的展示素材。Source Sans 3 和 IBM Plex Mono 字体的 OFL 许可保存在 `assets/` 中。
