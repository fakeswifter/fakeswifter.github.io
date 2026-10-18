(function () {
  const stage = document.querySelector("#window");
  const home = document.querySelector("#homepage");
  const siteChrome = Array.from(document.querySelectorAll(".site-header, .site-footer"));
  const body = document.body;
  const canvas = document.querySelector("#water-canvas");
  const ctx = canvas && canvas.getContext("2d");
  if (!stage || !home || !canvas || !ctx) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wakes = [];
  const droplets = [];
  const flowPoints = [];
  let width = 0;
  let height = 0;
  let pixelRatio = 1;
  let frame = null;
  let lastPoint = null;
  let lastMoveAt = 0;
  let isOpen = false;

  function resizeWater() {
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  }

  function queueWaterFrame() {
    if (!reducedMotion && frame === null) frame = window.requestAnimationFrame(drawWater);
  }

  function addFlow(from, to, now) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const distance = Math.hypot(dx, dy);
    if (distance < 2) return;

    const angle = Math.atan2(dy, dx);
    const energy = Math.min(1, distance / 44);
    const steps = Math.max(1, Math.min(8, Math.ceil(distance / 12)));
    for (let i = 1; i <= steps; i += 1) {
      const along = i / steps;
      const x = from.x + dx * along;
      const y = from.y + dy * along;
      const born = now - (1 - along) * 18;
      flowPoints.push({ x, y, born, angle, energy });
      if (i === steps || i % 2 === 0) {
        wakes.push({ x, y, born, angle, energy });
      }
    }
    while (flowPoints.length > 72) flowPoints.shift();
    while (wakes.length > 72) wakes.shift();
    queueWaterFrame();
  }

  function addDroplet(x, y) {
    if (reducedMotion) return;
    droplets.push({ x, y, born: performance.now() });
    while (droplets.length > 4) droplets.shift();
    queueWaterFrame();
  }

  function drawRing(x, y, radius, angle, alpha, horizontalScale, verticalScale) {
    if (radius <= 0 || alpha <= 0) return;
    const rx = Math.max(1, radius * horizontalScale);
    const ry = Math.max(1, radius * verticalScale);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(15, 25, 29, " + alpha + ")";
    ctx.lineWidth = 1.35;
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(0, 0, Math.max(1, rx - 1.7), Math.max(1, ry - 1.2), 0, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255, 255, 255, " + Math.min(0.9, alpha * 1.65) + ")";
    ctx.lineWidth = 0.9;
    ctx.stroke();
    ctx.restore();
  }

  function drawFlow(now) {
    while (flowPoints.length && now - flowPoints[0].born > 900) flowPoints.shift();
    if (flowPoints.length < 2) return;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (let i = 1; i < flowPoints.length; i += 1) {
      const a = flowPoints[i - 1];
      const b = flowPoints[i];
      const age = now - b.born;
      const fade = Math.max(0, 1 - age / 900);
      if (!fade) continue;

      const normalX = -Math.sin(b.angle);
      const normalY = Math.cos(b.angle);
      const wave = Math.sin(now * 0.006 + i * 0.58) * (3.2 + b.energy * 2.4);
      const offsetA = Math.sin(now * 0.006 + (i - 1) * 0.58) * (3.2 + a.energy * 2.4);
      const ax = a.x + normalX * offsetA;
      const ay = a.y + normalY * offsetA;
      const bx = b.x + normalX * wave;
      const by = b.y + normalY * wave;
      const mx = (ax + bx) / 2 + normalX * Math.sin(now * 0.004 + i) * 1.8;
      const my = (ay + by) / 2 + normalY * Math.sin(now * 0.004 + i) * 1.8;

      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.quadraticCurveTo(mx, my, bx, by);
      ctx.strokeStyle = "rgba(118, 148, 157, " + (fade * 0.24) + ")";
      ctx.lineWidth = 7;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.quadraticCurveTo(mx, my, bx, by);
      ctx.strokeStyle = "rgba(17, 30, 34, " + (fade * 0.43) + ")";
      ctx.lineWidth = 1.35;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(ax - normalX * 1.4, ay - normalY * 1.4);
      ctx.quadraticCurveTo(mx - normalX * 1.4, my - normalY * 1.4, bx - normalX * 1.4, by - normalY * 1.4);
      ctx.strokeStyle = "rgba(255, 255, 255, " + (fade * 0.76) + ")";
      ctx.lineWidth = 0.85;
      ctx.stroke();
    }
  }

  function drawWater(now) {
    frame = null;
    ctx.clearRect(0, 0, width, height);
    drawFlow(now);

    for (let i = wakes.length - 1; i >= 0; i -= 1) {
      const wake = wakes[i];
      const progress = (now - wake.born) / 880;
      if (progress >= 1) {
        wakes.splice(i, 1);
        continue;
      }
      const envelope = Math.sin(Math.PI * Math.max(0, progress));
      const radius = 3 + progress * (40 + wake.energy * 26);
      const alpha = envelope * (0.3 + wake.energy * 0.08);
      drawRing(wake.x, wake.y, radius, wake.angle, alpha, 1.32, 0.5);
      drawRing(wake.x, wake.y, radius * 0.62, wake.angle, alpha * 0.5, 1.2, 0.56);
    }

    for (let i = droplets.length - 1; i >= 0; i -= 1) {
      const drop = droplets[i];
      const age = (now - drop.born) / 1320;
      if (age >= 1) {
        droplets.splice(i, 1);
        continue;
      }

      const fall = Math.min(1, age / 0.12);
      if (age < 0.16) {
        const beadY = drop.y - (1 - fall) * 28;
        const beadAlpha = Math.max(0, 1 - age / 0.16) * 0.92;
        ctx.beginPath();
        ctx.ellipse(drop.x, beadY, 2.5 * (1 - fall * 0.3), 4.2 * (1 - fall * 0.25), 0, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, " + beadAlpha + ")";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(drop.x - 0.7, beadY - 0.8, 1.15, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(22, 33, 36, " + (beadAlpha * 0.65) + ")";
        ctx.fill();
      }

      const progress = Math.max(0, (age - 0.1) / 0.9);
      if (progress > 0) {
        const eased = 1 - Math.pow(1 - Math.min(1, progress), 2);
        const radius = 4 + eased * 166;
        const fade = Math.pow(1 - Math.min(1, progress), 1.12);
        drawRing(drop.x, drop.y, radius, -0.08, fade * 0.42, 1.1, 0.82);
        drawRing(drop.x, drop.y, Math.max(1, radius - 12), -0.08, fade * 0.26, 1.1, 0.82);
        drawRing(drop.x, drop.y, radius * 0.54, 0.1, fade * 0.2, 1.05, 0.76);

        if (age < 0.38) {
          const splash = age / 0.38;
          for (let bead = 0; bead < 6; bead += 1) {
            const angle = (Math.PI * 2 * bead) / 6 - Math.PI / 2;
            const distance = splash * (12 + (bead % 2) * 8);
            const beadX = drop.x + Math.cos(angle) * distance;
            const beadY = drop.y + Math.sin(angle) * distance + splash * splash * 12;
            ctx.beginPath();
            ctx.arc(beadX, beadY, 1.1 + (1 - splash) * 1.25, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255, 255, 255, " + ((1 - splash) * 0.9) + ")";
            ctx.fill();
          }
        }
      }
    }

    if (flowPoints.length || wakes.length || droplets.length) queueWaterFrame();
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

  resizeWater();
  body.classList.add("is-closed");
  stage.setAttribute("aria-hidden", "false");
  stage.inert = false;
  home.setAttribute("aria-hidden", "true");
  home.inert = true;
  siteChrome.forEach(function (element) {
    element.setAttribute("aria-hidden", "true");
    element.inert = true;
  });
  window.addEventListener("resize", resizeWater, { passive: true });
  window.addEventListener("blur", function () { lastPoint = null; }, { passive: true });

  window.addEventListener("pointermove", function (event) {
    if (reducedMotion || event.isPrimary === false || event.pointerType === "touch") return;
    const now = performance.now();
    const point = { x: event.clientX, y: event.clientY };
    if (!lastPoint) {
      lastPoint = point;
      lastMoveAt = now;
      return;
    }
    const distance = Math.hypot(point.x - lastPoint.x, point.y - lastPoint.y);
    if (distance < 4 || (now - lastMoveAt < 14 && distance < 18)) return;
    addFlow(lastPoint, point, now);
    lastPoint = point;
    lastMoveAt = now;
  }, { passive: true });

  stage.addEventListener("pointerdown", function (event) {
    if (!event.target.closest("a, button")) {
      stage.classList.add("is-pressed");
      window.setTimeout(function () { stage.classList.remove("is-pressed"); }, 110);
    }
  });
  stage.addEventListener("click", function (event) {
    if (isOpen || event.target.closest("a, button, input")) return;
    addDroplet(event.clientX, event.clientY);
    enterHomepage();
  });
  stage.addEventListener("keydown", function (event) {
    if (isOpen || event.target.closest("a, button, input")) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      addDroplet(width / 2, height / 2);
      enterHomepage();
    }
  });
})();