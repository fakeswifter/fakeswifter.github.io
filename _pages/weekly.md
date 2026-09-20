---
layout: personal
title: 周记
description: 每周的记录与回顾。
permalink: /weekly/
nav: true
nav_order: 2
---
<div class="weekly-index">
  <header class="weekly-index-head">
    <h1>周记</h1>
    <p>用 AI 整理主页访问、GitHub 动态，以及这一周新 Star 的开源项目。每一篇都会先成为草稿，由我确认后公开。</p>
  </header>
  <div class="weekly-sources" aria-label="周记数据来源">
    <div><strong>主页访问</strong><p>统计接入后自动总结</p></div>
    <div><strong>GitHub 使用</strong><p>提交、仓库与公开活动</p></div>
    <div><strong>新增 Star</strong><p>这一周发现的开源项目</p></div>
  </div>
  <section class="weekly-archive" aria-labelledby="archive-heading">
    <div class="section-head"><h2 id="archive-heading">全部周记</h2></div>
  {% include weekly-list.liquid %}
  </section>
</div>
