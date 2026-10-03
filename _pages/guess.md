---
layout: personal
title: Guess
permalink: /guess/
description: 横着填，竖着填，最后找到一个名字。
guess: true
---
<div class="guess-index">
  <header class="guess-head">
    <h1 aria-label="Guess"><span class="typewriter" data-typewriter aria-hidden="true">Guess</span></h1>
    <p>横着填，竖着填，最后找到一个名字。</p>
  </header>

  <form class="crossword-form" autocomplete="off">
    <div class="crossword-layout">
      <section class="crossword-panel" aria-labelledby="crossword-title">
        <div class="crossword-panel-head">
          <h2 id="crossword-title">Crossword</h2>
          <span class="guess-progress" aria-live="polite">0 / 8</span>
        </div>
        <div class="crossword-grid" data-crossword aria-label="英文填字游戏"></div>
        <button class="guess-reset" type="reset">清空</button>
      </section>

      <aside class="crossword-side">
        <section class="clue-group" aria-labelledby="across-title">
          <h2 id="across-title">横向</h2>
          <ol class="crossword-clues">
            <li>
              <button type="button" data-entry="galaxy">
                <b>3</b><span>由恒星、气体和尘埃组成的巨大系统</span><small>6 letters</small>
              </button>
            </li>
            <li>
              <button type="button" data-entry="horizon">
                <b>6</b><span>远处天地相接的线</span><small>7 letters</small>
              </button>
            </li>
            <li>
              <button type="button" data-entry="island">
                <b>7</b><span>四面环水的陆地</span><small>6 letters</small>
              </button>
            </li>
          </ol>
        </section>

        <section class="clue-group" aria-labelledby="down-title">
          <h2 id="down-title">纵向</h2>
          <ol class="crossword-clues">
            <li>
              <button type="button" data-entry="aurora">
                <b>1</b><span>极地天空中的彩色光带</span><small>6 letters</small>
              </button>
            </li>
            <li>
              <button type="button" data-entry="ocean">
                <b>2</b><span>面积最大的咸水水域</span><small>5 letters</small>
              </button>
            </li>
            <li>
              <button type="button" data-entry="yarn">
                <b>4</b><span>用来编织的长股纤维</span><small>4 letters</small>
              </button>
            </li>
            <li>
              <button type="button" data-entry="jungle">
                <b>5</b><span>热带地区茂密的森林</span><small>6 letters</small>
              </button>
            </li>
            <li>
              <button type="button" data-entry="night">
                <b>8</b><span>一天中没有阳光的部分</span><small>5 letters</small>
              </button>
            </li>
          </ol>
        </section>

        <section class="name-extract" aria-labelledby="name-grid-title">
          <div class="guess-board-head">
            <h2 id="name-grid-title">Final</h2>
          </div>
          <div class="guess-board" aria-label="隐藏名字的字母网格">
            <span class="guess-cell cell-j" data-cell="j" aria-label="未解开的字母">·</span>
            <span class="guess-cell cell-h" data-cell="h" aria-label="未解开的字母">·</span>
            <span class="guess-cell cell-i" data-cell="i" aria-label="未解开的字母">·</span>
            <span class="guess-cell cell-y" data-cell="y" aria-label="未解开的字母">·</span>
            <span class="guess-cell cell-a" data-cell="a" aria-label="未解开的字母">·</span>
            <span class="guess-cell cell-n" data-cell="n" aria-label="未解开的字母">·</span>
            <span class="guess-cell cell-o" data-cell="o" aria-label="未解开的字母">·</span>
            <span class="guess-cell cell-g" data-cell="g" aria-label="未解开的字母">·</span>
          </div>
          <p class="guess-result" aria-live="polite" hidden>JING · HAO · YAN</p>
        </section>
      </aside>
    </div>
  </form>
</div>
