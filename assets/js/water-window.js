(function () {
  const stage = document.querySelector("#window");
  const home = document.querySelector("#homepage");
  const siteChrome = Array.from(document.querySelectorAll(".site-header, .site-footer"));
  const body = document.body;
  const canvas = document.querySelector("#water-canvas");
  const ctx = canvas && canvas.getContext("2d");
  if (!stage || !home || !canvas || !ctx) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const sampler = document.createElement("canvas");
  sampler.width = 1;
  sampler.height = 1;
  const sampleCtx = sampler.getContext("2d", { willReadFrequently: true });
  const washes = [];
  const droplets = [];
  let width = 0;
  let height = 0;
  let pixelRatio = 1;
  let frame = null;
  let lastPoint = null;
  let lastMoveAt = 0;
  let lastSampleAt = 0;
  let lastSample = [255, 255, 255];
  let seedCounter = 0;
  let isOpen = false;
  let pendingClickColor = null;

  function resizeCanvas() {
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  }

  function queueFrame() {
    if (!reducedMotion && frame === null) frame = window.requestAnimationFrame(drawWater);
  }

  function parseCssColor(value) {
    const match = value && value.match(/rgba?\(([^)]+)\)/i);
    if (!match) return null;
    const parts = match[1].replace(/\s*\/\s*/, ",").split(/[,\s]+/).filter(Boolean);
    if (parts.length < 3) return null;
    const toChannel = function (part) {
      const number = parseFloat(part);
      return part.indexOf("%") >= 0 ? Math.round(number * 2.55) : Math.max(0, Math.min(255, Math.round(number)));
    };
    const alpha = parts.length > 3 ? Math.max(0, Math.min(1, parseFloat(parts[3]))) : 1;
    return [toChannel(parts[0]), toChannel(parts[1]), toChannel(parts[2]), Number.isNaN(alpha) ? 1 : alpha];
  }

  function over(top, bottom) {
    const alpha = top[3];
    return [
      Math.round(top[0] * alpha + bottom[0] * (1 - alpha)),
      Math.round(top[1] * alpha + bottom[1] * (1 - alpha)),
      Math.round(top[2] * alpha + bottom[2] * (1 - alpha)),
      1
    ];
  }

  function sampleImage(image, x, y) {
    if (!sampleCtx || !image || !image.complete || !image.naturalWidth || !image.naturalHeight) return null;
    const rect = image.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;

    const scale = Math.max(rect.width / image.naturalWidth, rect.height / image.naturalHeight);
    const renderedWidth = image.naturalWidth * scale;
    const renderedHeight = image.naturalHeight * scale;
    const offsetX = (renderedWidth - rect.width) / 2;
    const offsetY = (renderedHeight - rect.height) / 2;
    const sourceX = Math.max(0, Math.min(image.naturalWidth - 1, (x - rect.left + offsetX) / scale));
    const sourceY = Math.max(0, Math.min(image.naturalHeight - 1, (y - rect.top + offsetY) / scale));
    try {
      sampleCtx.clearRect(0, 0, 1, 1);
      sampleCtx.drawImage(image, sourceX, sourceY, 1, 1, 0, 0, 1, 1);
      const pixel = sampleCtx.getImageData(0, 0, 1, 1).data;
      return [pixel[0], pixel[1], pixel[2], pixel[3] / 255];
    } catch (error) {
      return null;
    }
  }

  function sampleBackdrop(x, y) {
    const wasClosed = body.classList.contains("is-closed");
    const previousVisibility = stage.style.visibility;
    const previousHomeInert = home.inert;
    const previousChromeInert = siteChrome.map(function (element) { return element.inert; });
    if (wasClosed) {
      stage.style.visibility = "hidden";
      home.inert = false;
      siteChrome.forEach(function (element) { element.inert = false; });
    }

    const target = document.elementFromPoint(x, y);
    if (wasClosed) {
      stage.style.visibility = previousVisibility;
      home.inert = previousHomeInert;
      siteChrome.forEach(function (element, index) { element.inert = previousChromeInert[index]; });
    }

    if (!target) return [255, 255, 255];
    const image = target.closest && target.closest("img");
    const imageColor = image && sampleImage(image, x, y);
    if (imageColor && imageColor[3] > 0.05) return over(imageColor, [255, 255, 255, 1]).slice(0, 3);

    const chain = [];
    let current = target;
    while (current && current !== document.documentElement) {
      chain.unshift(current);
      current = current.parentElement;
    }
    let color = [255, 255, 255, 1];
    chain.forEach(function (element) {
      const background = parseCssColor(window.getComputedStyle(element).backgroundColor);
      if (background && background[3] > 0) color = over(background, color);
    });
    return color.slice(0, 3);
  }

  function watercolorColor(sample) {
    const maximum = Math.max(sample[0], sample[1], sample[2]);
    const minimum = Math.min(sample[0], sample[1], sample[2]);
    const luminance = sample[0] * 0.2126 + sample[1] * 0.7152 + sample[2] * 0.0722;
    const chroma = maximum - minimum;
    const waterTint = [77, 117, 128];
    const amount = chroma < 20 ? (luminance > 220 ? 0.46 : luminance < 70 ? 0.34 : 0.24) : 0.13;
    return sample.map(function (channel, index) {
      return Math.round(channel * (1 - amount) + waterTint[index] * amount);
    });
  }

  function rgba(color, alpha) {
    return "rgba(" + color[0] + ", " + color[1] + ", " + color[2] + ", " + Math.max(0, Math.min(1, alpha)) + ")";
  }

  function mixTowardInk(color, amount) {
    return color.map(function (channel) { return Math.round(channel * (1 - amount) + 24 * amount); });
  }

  function randomFor(seed) {
    let value = seed >>> 0;
    return function () {
      value = (value * 1664525 + 1013904223) >>> 0;
      return value / 4294967296;
    };
  }

  function addWash(x, y, angle, energy, color, now) {
    const random = randomFor(++seedCounter + Math.round(x * 17 + y * 41 + now));
    const grains = [];
    for (let i = 0; i < 10; i += 1) {
      const direction = random() * Math.PI * 2;
      const distance = Math.sqrt(random()) * (7 + energy * 11);
      grains.push({
        x: Math.cos(direction) * distance,
        y: Math.sin(direction) * distance,
        size: 0.55 + random() * 1.35,
        alpha: 0.24 + random() * 0.34,
        shade: random() * 0.2
      });
    }
    washes.push({
      x: x,
      y: y,
      angle: angle,
      energy: energy,
      color: color,
      born: now,
      life: 1180 + random() * 360,
      seed: random() * Math.PI * 2,
      edge: Array.from({ length: 16 }, function () { return 0.78 + random() * 0.42; }),
      grains: grains
    });
    while (washes.length > 64) washes.shift();
    queueFrame();
  }

  function addFlow(from, to, now) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const distance = Math.hypot(dx, dy);
    if (distance < 2) return;
    if (now - lastSampleAt > 34) {
      lastSample = watercolorColor(sampleBackdrop(to.x, to.y));
      lastSampleAt = now;
    }

    const angle = Math.atan2(dy, dx);
    const energy = Math.min(1, distance / 42);
    const steps = Math.max(1, Math.min(7, Math.floor(distance / 15)));
    for (let i = 1; i <= steps; i += 1) {
      const along = i / steps;
      addWash(
        from.x + dx * along,
        from.y + dy * along,
        angle,
        energy,
        lastSample.slice(),
        now - (1 - along) * 16
      );
    }
  }

  function addDroplet(x, y, color) {
    if (reducedMotion) return;
    const sampled = color || watercolorColor(sampleBackdrop(x, y));
    const now = performance.now();
    droplets.push({ x: x, y: y, color: sampled, born: now, seed: ++seedCounter });
    while (droplets.length > 4) droplets.shift();
    addWash(x, y, 0, 1, sampled.slice(), now);
    queueFrame();
  }

  function drawWash(wash, now) {
    const age = now - wash.born;
    const progress = Math.max(0, Math.min(1, age / wash.life));
    const decay = Math.pow(1 - progress, 1.25);
    const swell = 1 - Math.pow(1 - progress, 2);
    const radius = 7 + swell * (17 + wash.energy * 17);
    const pigmentAlpha = decay * (0.19 + wash.energy * 0.1);
    const cos = Math.cos(wash.angle);
    const sin = Math.sin(wash.angle);

    ctx.save();
    ctx.translate(wash.x, wash.y);
    ctx.rotate(wash.angle);
    ctx.beginPath();
    for (let i = 0; i < wash.edge.length; i += 1) {
      const theta = (Math.PI * 2 * i) / wash.edge.length;
      const breathe = Math.sin(now * 0.0024 + wash.seed + i * 0.83) * 0.045;
      const edgeRadius = radius * (wash.edge[i] + breathe);
      const px = Math.cos(theta) * edgeRadius * 1.22;
      const py = Math.sin(theta) * edgeRadius * 0.78;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.clip();

    const washColor = ctx.createRadialGradient(0, 0, radius * 0.08, 0, 0, radius * 1.34);
    washColor.addColorStop(0, rgba(wash.color, pigmentAlpha * 0.26));
    washColor.addColorStop(0.56, rgba(wash.color, pigmentAlpha * 0.68));
    washColor.addColorStop(0.82, rgba(wash.color, pigmentAlpha * 0.48));
    washColor.addColorStop(1, rgba(wash.color, 0));
    ctx.fillStyle = washColor;
    ctx.fillRect(-radius * 1.5, -radius * 1.5, radius * 3, radius * 3);

    ctx.beginPath();
    ctx.ellipse(0, 0, radius * 1.1, radius * 0.69, 0, 0, Math.PI * 2);
    ctx.strokeStyle = rgba(mixTowardInk(wash.color, 0.2), decay * (0.12 + wash.energy * 0.08));
    ctx.lineWidth = 0.8 + wash.energy * 0.45;
    ctx.stroke();
    ctx.restore();

    for (let i = 0; i < wash.grains.length; i += 1) {
      const grain = wash.grains[i];
      const drift = progress * (7 + wash.energy * 10);
      const px = wash.x + grain.x + cos * drift * 0.2;
      const py = wash.y + grain.y + sin * drift * 0.2;
      const grainAlpha = decay * grain.alpha;
      const grainColor = mixTowardInk(wash.color, grain.shade);
      ctx.beginPath();
      ctx.arc(px, py, grain.size * (1 - progress * 0.22), 0, Math.PI * 2);
      ctx.fillStyle = rgba(grainColor, grainAlpha);
      ctx.fill();
    }
  }

  function drawDrop(drop, now) {
    const age = now - drop.born;
    const progress = Math.max(0, (age - 110) / 1060);
    const fall = Math.min(1, age / 110);
    if (age < 150) {
      const beadY = drop.y - (1 - fall) * 26;
      const alpha = Math.max(0, 1 - age / 150);
      ctx.beginPath();
      ctx.ellipse(drop.x, beadY, 2.3 * (1 - fall * 0.25), 4 * (1 - fall * 0.2), 0, 0, Math.PI * 2);
      ctx.fillStyle = rgba(drop.color, alpha * 0.82);
      ctx.fill();
    }
    if (progress <= 0 || progress >= 1) return;

    const swell = 1 - Math.pow(1 - progress, 2);
    const radius = 5 + swell * 150;
    const fade = Math.pow(1 - progress, 1.12);
    ctx.save();
    ctx.translate(drop.x, drop.y);
    ctx.rotate(-0.08);
    [1, 0.89, 0.58].forEach(function (scale, index) {
      ctx.beginPath();
      ctx.ellipse(0, 0, radius * scale, radius * scale * (index === 2 ? 0.78 : 0.84), 0, 0, Math.PI * 2);
      ctx.strokeStyle = rgba(index === 1 ? mixTowardInk(drop.color, 0.3) : drop.color, fade * (index === 0 ? 0.34 : index === 1 ? 0.22 : 0.16));
      ctx.lineWidth = index === 0 ? 1.15 : 0.8;
      ctx.stroke();
    });
    ctx.restore();

    if (age < 420) {
      const splash = age / 420;
      const random = randomFor(drop.seed);
      for (let i = 0; i < 8; i += 1) {
        const angle = (Math.PI * 2 * i) / 8 + random() * 0.18;
        const distance = splash * (10 + (i % 3) * 5);
        ctx.beginPath();
        ctx.arc(drop.x + Math.cos(angle) * distance, drop.y + Math.sin(angle) * distance, 0.7 + (1 - splash) * 1.25, 0, Math.PI * 2);
        ctx.fillStyle = rgba(drop.color, (1 - splash) * 0.58);
        ctx.fill();
      }
    }
  }

  function drawWater(now) {
    frame = null;
    ctx.clearRect(0, 0, width, height);
    for (let i = washes.length - 1; i >= 0; i -= 1) {
      if (now - washes[i].born >= washes[i].life) washes.splice(i, 1);
      else drawWash(washes[i], now);
    }
    for (let i = droplets.length - 1; i >= 0; i -= 1) {
      if (now - droplets[i].born >= 1320) droplets.splice(i, 1);
      else drawDrop(droplets[i], now);
    }
    if (washes.length || droplets.length) queueFrame();
  }

  function enterHomepage() {
    if (isOpen) return;
    isOpen = true;
    stage.classList.add("is-open");
    body.classList.remove("is-closed");
    body.classList.add("is-open");
    stage.setAttribute("aria-hidden", "true");
    stage.inert = true;
    home.setAttribute("aria-hidden", "false");
    home.inert = false;
    siteChrome.forEach(function (element) {
      element.setAttribute("aria-hidden", "false");
      element.inert = false;
    });
  }

  function colorAtPointer(x, y, now) {
    if (now - lastSampleAt > 34) {
      lastSample = watercolorColor(sampleBackdrop(x, y));
      lastSampleAt = now;
    }
    return lastSample.slice();
  }

  resizeCanvas();
  body.classList.add("is-closed");
  stage.setAttribute("aria-hidden", "false");
  stage.inert = false;
  home.setAttribute("aria-hidden", "true");
  home.inert = true;
  siteChrome.forEach(function (element) {
    element.setAttribute("aria-hidden", "true");
    element.inert = true;
  });
  window.addEventListener("resize", resizeCanvas, { passive: true });
  window.addEventListener("blur", function () { lastPoint = null; }, { passive: true });

  window.addEventListener("pointermove", function (event) {
    if (reducedMotion || event.isPrimary === false || event.pointerType === "touch") return;
    const now = performance.now();
    const point = { x: event.clientX, y: event.clientY };
    if (!lastPoint) {
      lastPoint = point;
      lastMoveAt = now;
      colorAtPointer(point.x, point.y, now);
      return;
    }
    const distance = Math.hypot(point.x - lastPoint.x, point.y - lastPoint.y);
    if (distance < 4 || (now - lastMoveAt < 12 && distance < 16)) return;
    addFlow(lastPoint, point, now);
    lastPoint = point;
    lastMoveAt = now;
  }, { passive: true });

  stage.addEventListener("pointerdown", function (event) {
    pendingClickColor = colorAtPointer(event.clientX, event.clientY, performance.now());
    if (!event.target.closest("a, button")) {
      stage.classList.add("is-pressed");
      window.setTimeout(function () { stage.classList.remove("is-pressed"); }, 110);
    }
  });
  stage.addEventListener("click", function (event) {
    if (isOpen || event.target.closest("a, button, input")) return;
    addDroplet(event.clientX, event.clientY, pendingClickColor);
    enterHomepage();
  });
  stage.addEventListener("keydown", function (event) {
    if (isOpen || event.target.closest("a, button, input")) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const color = colorAtPointer(width / 2, height / 2, performance.now());
      addDroplet(width / 2, height / 2, color);
      enterHomepage();
    }
  });
  document.addEventListener("click", function (event) {
    if (!body.classList.contains("is-open") || event.target.closest("a, button, input, .window-stage")) return;
    addDroplet(event.clientX, event.clientY, colorAtPointer(event.clientX, event.clientY, performance.now()));
  });
})();