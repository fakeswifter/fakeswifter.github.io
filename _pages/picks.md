---
layout: personal
title: Archive
permalink: /picks/
description: 每周书影音推荐归档。
---
<section class="picks-archive">
  <div class="picks-current-meta">
    <span>WEEKLY PICKS</span>
    <span>ARCHIVE</span>
  </div>
  <header class="picks-archive-head">
    <h1 aria-label="Archive"><span class="typewriter" data-typewriter aria-hidden="true">Archive</span></h1>
    <p>按周整理的书、电影与音乐。</p>
  </header>
  {% assign issues = site.weekly_picks | sort: "date" | reverse %}
  {% if issues.size > 0 %}
    <ol class="picks-archive-list">
      {% for issue in issues %}
        <li>
          <a href="{{ issue.url | relative_url }}">
            <span class="archive-week">WEEK {{ issue.week }}</span>
            <time datetime="{{ issue.date | date: '%Y-%m-%d' }}">{{ issue.date | date: "%Y.%m.%d" }}</time>
            <span class="archive-title">{{ issue.title | escape }}</span>
            <span class="archive-arrow" aria-hidden="true">↗</span>
          </a>
        </li>
      {% endfor %}
    </ol>
  {% else %}
    <p class="picks-empty-copy">推荐更新后会收录在这里。</p>
  {% endif %}
</section>
