# fakeswifter 的个人主页

基于 [al-folio](https://github.com/alshedivat/al-folio) v1 模板，保留原版页面布局与明暗主题。

内容包括首页、项目列表和三个项目介绍。使用公开 GitHub 用户名、头像与仓库信息；没有添加未经确认的教育、职业或论文信息。

## 修改内容

- `_pages/about.md`：首页介绍。
- `_projects/`：项目介绍。
- `_data/socials.yml`：GitHub、邮箱等联系入口。
- `_config.yml`：姓名、语言、站点地址与功能开关。
- `assets/img/avatar.png`：GitHub 公开头像。

## 本地预览

使用 Ruby 4.0 与 Bundler：

```sh
bundle install
bundle exec jekyll serve
```

打开 http://localhost:4000。

## 发布

在自己的账号下新建 `fakeswifter.github.io` 仓库，将本目录的全部文件（包括 `.github`）提交到 `main` 分支。

在仓库 Settings → Pages 中，将 Source 选择为 **GitHub Actions**。运行名为 “Build and deploy personal homepage” 的工作流，成功后访问 https://fakeswifter.github.io。

本项目使用 GitHub 官方 Pages 工作流，不使用模板文档中的 `gh-pages` 分支发布方式。

## 模板定制

保留 al-folio 的版本固定组件和 MIT 许可证。移除了演示内容，关闭未使用的论文、简历、搜索、数学、图片转换和外部文章导入功能。为减少不必要的构建依赖，关闭单独的 JavaScript 压缩插件。未覆盖模板布局或样式文件。
