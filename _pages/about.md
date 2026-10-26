---
layout: personal
title: Weekly Picks
permalink: /
description: fakeswifter 的每周书影音分享与个人主页。
---
{% assign current_issue = site.weekly_picks | sort: "date" | reverse | first %}
<section id="window" class="window-stage" role="region" tabindex="0" aria-labelledby="weekly-picks-title" aria-description="点击窗面空白处进入主页；进入后可从右上角 Weekly Picks 访问推荐归档；也可按回车或空格进入">
  <div class="shutter shutter-left" aria-hidden="true"></div><div class="shutter shutter-right" aria-hidden="true"></div>
  <div class="window-content"><div class="pick-center">
    <h1 id="weekly-picks-title">Weekly Picks</h1>
    <div class="picks-list window-pick-list">
      {% if current_issue and current_issue.picks %}
        {% for item in current_issue.picks %}
          {% assign item_cover = item.cover %}
          {% unless item.cover contains '://' %}{% assign item_cover = item.cover | relative_url %}{% endunless %}
          {% if item.url %}<a class="picks-row" href="{{ item.url | escape }}" target="_blank" rel="noopener noreferrer">{% else %}<article class="picks-row">{% endif %}
            <p class="picks-category">{{ item.category | default: "Pick" | escape }}</p>
            {% if item.cover %}<img class="picks-cover" src="{{ item_cover | escape }}" alt="{{ item.title | escape }} 配图" width="104" height="104" decoding="async">{% else %}<span class="picks-cover-empty" aria-hidden="true"></span>{% endif %}
            <h2 class="picks-name">{{ item.title | escape }}</h2><p class="picks-creator">{{ item.creator | default: "" | escape }}</p><span class="picks-open" aria-hidden="true">↗</span>
          {% if item.url %}</a>{% else %}</article>{% endif %}
        {% endfor %}
      {% else %}
        {% assign pick_categories = "book,film,music" | split: "," %}
        {% if current_issue %}{% for category in pick_categories %}
          {% assign item = current_issue[category] %}
          {% if item and item.title %}
            {% case category %}
              {% when "book" %}{% assign category_label = "Book" %}
              {% when "film" %}{% assign category_label = "Film" %}
              {% when "music" %}{% assign category_label = "Music" %}
            {% endcase %}
            {% assign item_cover = item.cover %}
            {% unless item.cover contains '://' %}{% assign item_cover = item.cover | relative_url %}{% endunless %}
            {% if item.url %}<a class="picks-row" href="{{ item.url | escape }}" target="_blank" rel="noopener noreferrer">{% else %}<article class="picks-row">{% endif %}
              <p class="picks-category">{{ category_label }}</p>
              {% if item.cover %}<img class="picks-cover" src="{{ item_cover | escape }}" alt="{{ item.title | escape }} 配图" width="104" height="104" decoding="async">{% else %}<span class="picks-cover-empty" aria-hidden="true"></span>{% endif %}
              <h2 class="picks-name">{{ item.title | escape }}</h2><p class="picks-creator">{{ item.creator | default: "" | escape }}</p><span class="picks-open" aria-hidden="true">↗</span>
            {% if item.url %}</a>{% else %}</article>{% endif %}
          {% endif %}
        {% endfor %}{% endif %}
      {% endif %}
    </div>
  </div></div>
</section>
<div id="homepage" class="home-page" aria-hidden="true" inert>

  <section class="hero" aria-labelledby="hero-title">
    <div class="hero-copy">
      <h2 id="hero-title" tabindex="-1" aria-label="我是 fakeswifter."><span class="typewriter" data-typewriter aria-hidden="true">我是 fakeswifter.</span></h2>
      <p class="hero-lead">BJTU 2026 / SZTU 2022. Apple Swift Student Challenge 2024 Winner.</p>
      <div class="hero-links">
        <a href="{{ '/guess/' | relative_url }}">Guess <span aria-hidden="true">→</span></a>
        <a href="{{ '/research/' | relative_url }}">Research</a>
        <a href="https://github.com/fakeswifter">GitHub <span aria-hidden="true">↗</span></a>
      </div>
    </div>
    <figure class="portrait-wrap">
      <img class="portrait" src="{{ '/assets/img/avatar.jpg' | relative_url }}" alt="fakeswifter 的头像" width="460" height="460">
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

<canvas id="water-canvas" class="water-canvas" aria-hidden="true"></canvas>
<script defer src="{{ '/assets/js/water-window.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
