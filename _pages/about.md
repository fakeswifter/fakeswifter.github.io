---
layout: personal
title: Weekly Picks
permalink: /
description: 每周推荐一本书、一部电影、一张唱片。
---
<div class="picks-page">
  <header class="picks-masthead">
    <div class="picks-masthead-meta" aria-label="栏目类型">
      <span>READ · WATCH · LISTEN</span>
      <span>WEEKLY NOTES</span>
    </div>
    <h1 class="picks-title" aria-label="Weekly Picks"><span class="typewriter" data-typewriter aria-hidden="true">Weekly Picks</span></h1>
    <div class="picks-masthead-deck">
      <h2>每周书影音</h2>
      <p>每周一册书、一部电影、一张唱片。</p>
    </div>
    <div class="picks-byline">
      <span>fakeswifter</span>
      <span>BJTU 2026 · SZTU 2022 · Apple Swift Student Challenge 2024 Winner</span>
      <a href="{{ '/research/' | relative_url }}">Research <span aria-hidden="true">↗</span></a>
    </div>
  </header>

  {% assign current_issue = site.weekly_picks | sort: "date" | reverse | first %}
  {% if current_issue %}
    <section class="picks-current" aria-labelledby="current-picks-title">
      <div class="picks-current-meta">
        <span>WEEK {{ current_issue.week }}</span>
        <time datetime="{{ current_issue.date | date: '%Y-%m-%d' }}">{{ current_issue.date | date: "%b %d, %Y" }}</time>
      </div>
      <div class="picks-section-head">
        <h2 id="current-picks-title">本周推荐</h2>
        <a href="{{ '/picks/' | relative_url }}">Archive <span aria-hidden="true">→</span></a>
      </div>
      {% include weekly-pick-list.liquid issue=current_issue %}
    </section>
  {% else %}
    <section class="picks-current picks-empty" aria-labelledby="current-picks-title">
      <p class="section-kicker">WEEKLY PICKS</p>
      <h2 id="current-picks-title">本周推荐尚未发布。</h2>
      <a href="{{ '/picks/' | relative_url }}">Archive <span aria-hidden="true">→</span></a>
    </section>
  {% endif %}
</div>
