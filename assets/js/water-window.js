const stage = document.querySelector("#window");
      const home = document.querySelector("#homepage");
      const siteChrome = [...document.querySelectorAll(".site-header, .site-footer")];
      const body = document.body;
      const canvas = document.querySelector("#water-canvas");
      const ctx = canvas.getContext("2d");
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const wakes = [];
      const drops = [];
      let width = 0;
      let height = 0;
      let pixelRatio = 1;
      let frame = null;
      let lastPoint = null;
      let lastWakeAt = 0;
      let open = false;

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

      function addWake(x, y, dx, dy) {
        if (reducedMotion) return;
        wakes.push({ x, y, born: performance.now(), angle: Math.atan2(dy, dx), strength: Math.min(1, Math.hypot(dx, dy) / 34) });
        if (wakes.length > 32) wakes.shift();
        queueWaterFrame();
      }

      function addWaterDrop(x, y) {
        if (reducedMotion) return;
        drops.push({ x, y, born: performance.now() });
        if (drops.length > 6) drops.shift();
        queueWaterFrame();
      }

      function drawRing(x, y, radius, angle, alpha, widthScale = 1.35, heightScale = .62) {
        if (radius <= 0 || alpha <= 0) return;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.ellipse(0, 0, radius * widthScale, Math.max(1, radius * heightScale), 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(18, 18, 18, ${alpha * .42})`;
        ctx.lineWidth = 1.15;
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(0, 0, Math.max(1, radius * widthScale - 1.5), Math.max(1, radius * heightScale - 1), 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * .66})`;
        ctx.lineWidth = .8;
        ctx.stroke();
        ctx.restore();
      }

      function drawWater(now) {
        frame = null;
        ctx.clearRect(0, 0, width, height);
        ctx.save();
        ctx.globalCompositeOperation = "source-over";

        for (let i = wakes.length - 1; i >= 0; i -= 1) {
          const wake = wakes[i];
          const t = (now - wake.born) / 720;
          if (t >= 1) { wakes.splice(i, 1); continue; }
          const eased = 1 - (1 - t) * (1 - t);
          const radius = 5 + eased * (90 + wake.strength * 60);
          const alpha = (1 - t) ** 1.7 * (.17 + wake.strength * .1);
          drawRing(wake.x, wake.y, radius, wake.angle, alpha);
          drawRing(wake.x, wake.y, radius * .48, wake.angle, alpha * .48, 1.18, .54);
          const glow = ctx.createRadialGradient(wake.x, wake.y, 0, wake.x, wake.y, 24 + radius * .16);
          glow.addColorStop(0, `rgba(255, 255, 255, ${alpha * .25})`);
          glow.addColorStop(1, "rgba(255, 255, 255, 0)");
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.ellipse(wake.x, wake.y, 24 + radius * .16, 11 + radius * .08, wake.angle, 0, Math.PI * 2);
          ctx.fill();
        }

        for (let i = drops.length - 1; i >= 0; i -= 1) {
          const drop = drops[i];
          const age = (now - drop.born) / 1100;
          if (age >= 1) { drops.splice(i, 1); continue; }
          const fall = Math.min(1, age / .11);
          const impact = Math.max(0, (age - .09) / .91);
          const impactEase = 1 - (1 - Math.min(1, impact)) ** 2;
          if (age < .15) {
            const beadY = drop.y - (1 - fall) * 22;
            const beadAlpha = Math.min(1, (1 - age / .15) * .85);
            ctx.fillStyle = `rgba(255,255,255,${beadAlpha})`;
            ctx.beginPath();
            ctx.ellipse(drop.x, beadY, 2.8 * (1 - fall * .35), 4.4 * (1 - fall * .3), 0, 0, Math.PI * 2);
            ctx.fill();
          }
          if (impact > 0) {
            const radius = 8 + impactEase * 152;
            const fade = (1 - Math.min(1, impact)) ** 1.25;
            drawRing(drop.x, drop.y, radius, -.12, fade * .32, 1.45, .54);
            drawRing(drop.x, drop.y, Math.max(1, radius - 12), -.12, fade * .19, 1.45, .54);
            drawRing(drop.x, drop.y, Math.max(1, radius * .48), .12, fade * .2, 1.15, .7);
            if (age < .34) {
              const splashT = age / .34;
              for (let bead = 0; bead < 5; bead += 1) {
                const angle = (Math.PI * 2 * bead) / 5 - Math.PI / 2;
                const distance = splashT * (12 + (bead % 2) * 7);
                const beadX = drop.x + Math.cos(angle) * distance;
                const beadY = drop.y + Math.sin(angle) * distance + splashT * splashT * 11;
                ctx.fillStyle = `rgba(255,255,255,${(1 - splashT) * .74})`;
                ctx.beginPath();
                ctx.arc(beadX, beadY, 1.2 + (1 - splashT) * .8, 0, Math.PI * 2);
                ctx.fill();
              }
            }
          }
        }

        ctx.restore();
        if (wakes.length || drops.length) queueWaterFrame();
      }

      resizeWater();
      window.addEventListener("resize", resizeWater, { passive: true });
      window.addEventListener("pointermove", (event) => {
        if (event.isPrimary === false) return;
        const now = performance.now();
        const point = { x: event.clientX, y: event.clientY };
        if (lastPoint) {
          const dx = point.x - lastPoint.x;
          const dy = point.y - lastPoint.y;
          if (Math.hypot(dx, dy) > 8 && now - lastWakeAt > 32) {
            addWake(lastPoint.x, lastPoint.y, dx, dy);
            lastWakeAt = now;
          }
        }
        lastPoint = point;
      }, { passive: true });

      function setOpen(nextOpen) {
        open = nextOpen;
        stage.classList.toggle("is-open", open);
        body.classList.toggle("is-open", open);
        body.classList.toggle("is-closed", !open);
        stage.setAttribute("aria-hidden", String(open));
        stage.inert = open;
        home.setAttribute("aria-hidden", String(!open));
        home.inert = !open;
        siteChrome.forEach((element) => { element.setAttribute("aria-hidden", String(!open)); element.inert = !open; });
        if (!open) window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
      }

      stage.addEventListener("pointerdown", (event) => {
        if (!open && !event.target.closest("a")) {
          stage.classList.add("is-pressed");
          window.setTimeout(() => stage.classList.remove("is-pressed"), 110);
        }
      });
      stage.addEventListener("click", (event) => {
        if (open || event.target.closest("a, button, .picks-row")) return;
        addWaterDrop(event.clientX, event.clientY);
        setOpen(true);
      });
      stage.addEventListener("keydown", (event) => {
        if (!open && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          addWaterDrop(width / 2, height / 2);
          setOpen(true);
        }
      });
      document.addEventListener("click", (event) => {
        if (open && !event.target.closest("a, button, input, .window-stage")) {
          addWaterDrop(event.clientX, event.clientY);
          setOpen(false);
        }
      });
      document.addEventListener("keydown", (event) => {
        if (open && event.key === "Escape") {
          addWaterDrop(width / 2, height / 2);
          setOpen(false);
        }
      });
      setOpen(false);
