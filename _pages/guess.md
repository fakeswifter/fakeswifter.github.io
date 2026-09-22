---
layout: personal
title: Guess
permalink: /guess/
description: 八个词，藏着一个名字。
guess: true
---
<div class="guess-index">
  <header class="guess-head">
    <h1 aria-label="Guess"><span class="typewriter" data-typewriter aria-hidden="true">Guess</span></h1>
    <p>八个英文单词，藏着一个名字。</p>
  </header>

  <div class="guess-puzzle">
    <section class="guess-board-wrap" aria-labelledby="board-title">
      <div class="guess-board-head">
        <h2 id="board-title">Name grid</h2>
        <span class="guess-progress" aria-live="polite">0 / 8</span>
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

    <form class="guess-form" autocomplete="off">
      <ol class="guess-clues">
        <li>
          <label for="guess-j">热带地区茂密的森林 <span>6 letters</span></label>
          <input id="guess-j" data-answer="jungle" data-letter="j" type="text" spellcheck="false">
        </li>
        <li>
          <label for="guess-h">远处天地相接的线 <span>7 letters</span></label>
          <input id="guess-h" data-answer="horizon" data-letter="h" type="text" spellcheck="false">
        </li>
        <li>
          <label for="guess-i">四面环水的陆地 <span>6 letters</span></label>
          <input id="guess-i" data-answer="island" data-letter="i" type="text" spellcheck="false">
        </li>
        <li>
          <label for="guess-y">用来编织的长股纤维 <span>4 letters</span></label>
          <input id="guess-y" data-answer="yarn" data-letter="y" type="text" spellcheck="false">
        </li>
        <li>
          <label for="guess-a">极地天空中的彩色光带 <span>6 letters</span></label>
          <input id="guess-a" data-answer="aurora" data-letter="a" type="text" spellcheck="false">
        </li>
        <li>
          <label for="guess-n">一天中没有阳光的部分 <span>5 letters</span></label>
          <input id="guess-n" data-answer="night" data-letter="n" type="text" spellcheck="false">
        </li>
        <li>
          <label for="guess-o">面积最大的咸水水域 <span>5 letters</span></label>
          <input id="guess-o" data-answer="ocean" data-letter="o" type="text" spellcheck="false">
        </li>
        <li>
          <label for="guess-g">由恒星、气体和尘埃组成的巨大系统 <span>6 letters</span></label>
          <input id="guess-g" data-answer="galaxy" data-letter="g" type="text" spellcheck="false">
        </li>
      </ol>
      <button class="guess-reset" type="reset">清空</button>
    </form>
  </div>
</div>
