---
layout: personal
title: 首页
permalink: /
description: fakeswifter · 北京交通大学 2026 级硕士研究生 · 深圳技术大学 2022 级本科生 · Apple Swift Student Challenge 2024 Winner。
---
<div class="home-page">
  <section class="hero" aria-labelledby="hero-title">
    <div class="hero-copy">
      <p class="eyebrow">Hello / 你好</p>
      <h1 id="hero-title">我是<br>fakeswifter.</h1>
      <p class="hero-lead">在学习、做东西，也把每周值得记住的信号留下来。</p>
      <div class="hero-links">
        <a href="#about">About me</a>
        <a href="{{ '/weekly/' | relative_url }}">Read weekly notes <span aria-hidden="true">→</span></a>
      </div>
    </div>
    <figure class="portrait-wrap">
      <span class="portrait-index" aria-hidden="true">01</span>
      <img class="portrait" src="{{ '/assets/img/avatar.png' | relative_url }}" alt="fakeswifter 的头像" width="460" height="460">
    </figure>
  </section>

  <section class="about-strip" id="about" aria-labelledby="about-heading">
    <p class="section-kicker">Brief introduction</p>
    <div class="about-grid">
      <h2 id="about-heading">现在与来处</h2>
      <div class="about-copy">
        <p>我是 fakeswifter，北京交通大学 2026 级硕士研究生，深圳技术大学 2022 级本科生。</p>
        <p>Apple Swift Student Challenge 2024 Winner.</p>
      </div>
      <dl class="facts">
        <div><dt>Now</dt><dd>BJTU · Master 2026</dd></div>
        <div><dt>Before</dt><dd>SZTU · Bachelor 2022</dd></div>
        <div><dt>Selected</dt><dd>Swift Student Challenge 2024</dd></div>
      </dl>
    </div>
  </section>

  <section class="weekly-signal" aria-labelledby="weekly-heading">
    <div class="section-head">
      <div>
        <p class="section-kicker">Recent signal</p>
        <h2 id="weekly-heading">最新周记</h2>
      </div>
      <a class="view-all" href="{{ '/weekly/' | relative_url }}">查看全部 <span aria-hidden="true">→</span></a>
    </div>
    <p class="weekly-intro">每周整理主页访问、GitHub 动态和新 Star 的开源项目。周日先生成草稿，确认后再公开。</p>
    {% include weekly-list.liquid limit=3 %}
  </section>
</div>
