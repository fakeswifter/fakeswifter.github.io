---
layout: personal
title: Weekly Picks
permalink: /
description: fakeswifter 的每周书影音分享与个人主页。
---
{% assign current_issue = site.weekly_picks | sort: "date" | reverse | first %}
<section class="weekly-picks-home" aria-labelledby="weekly-picks-title">
  <header class="weekly-picks-heading">
    <h1 id="weekly-picks-title" aria-label="Weekly Picks"><span class="typewriter" data-typewriter aria-hidden="true">Weekly Picks</span></h1>
    {% if current_issue %}<p class="weekly-picks-week">WEEK {{ current_issue.week }} · {{ current_issue.date | date: "%Y" }}</p>{% endif %}
    <a class="weekly-picks-archive" href="{{ '/picks/' | relative_url }}">Archive <span aria-hidden="true">→</span></a>
  </header>
  {% if current_issue %}
    {% include weekly-pick-list.liquid issue=current_issue %}
  {% endif %}
</section>

<div class="home-page">
  <section class="hero" aria-labelledby="hero-title">
    <div class="hero-copy">
      <h2 id="hero-title" aria-label="我是 fakeswifter."><span class="typewriter" data-typewriter aria-hidden="true">我是 fakeswifter.</span></h2>
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
