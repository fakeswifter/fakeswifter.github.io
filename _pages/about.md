---
layout: personal
title: 首页
permalink: /
description: fakeswifter · 北京交通大学 2026 级硕士研究生 · 深圳技术大学 2022 级本科生 · Apple Swift Student Challenge 2024 Winner。
---
<div class="home-page">
  <section class="hero" aria-labelledby="hero-title">
    <div class="hero-copy">
      <h1 id="hero-title" aria-label="我是 fakeswifter."><span class="typewriter" data-typewriter aria-hidden="true">我是 fakeswifter.</span></h1>
      <p class="hero-lead">BJTU 2026 / SZTU 2022. Apple Swift Student Challenge 2024 Winner.</p>
      <div class="hero-links">
        <a href="{{ '/guess/' | relative_url }}">Guess <span aria-hidden="true">→</span></a>
        <a href="{{ '/research/' | relative_url }}">Research</a>
        <a href="https://github.com/fakeswifter">GitHub <span aria-hidden="true">↗</span></a>
      </div>
    </div>
    <figure class="portrait-wrap">
      <img class="portrait" src="{{ '/assets/img/avatar.png' | relative_url }}" alt="fakeswifter 的头像" width="460" height="460">
    </figure>
  </section>

  <section class="blog-section" aria-labelledby="blog-heading">
    <div class="section-head">
      <h2 id="blog-heading">Blog</h2>
      <a class="view-all" href="{{ '/blog/' | relative_url }}">全部文章 <span aria-hidden="true">→</span></a>
    </div>
    <p class="blog-intro">研究、代码与工具的记录。</p>
    {% include post-list.liquid limit=3 %}
  </section>
</div>
