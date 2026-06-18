/* LIEMAX 3D POV renderer.
   Venue-bound Three.js module extracted from the rough simulator prototype.
   Exposes: window.LIEMAX_POV = { modelForVenue, createComparison } */
window.LIEMAX_POV = (function () {
  const SOURCE_AR = 1.43;
  const HUMAN_HEIGHT_FT = 5.75;
  const EYE_ABOVE_FLOOR_FT = 3.7;
  const DEFAULT_SCREEN_BOTTOM_FT = 5.0;
  const GT_SCREEN_BOTTOM_FT = 2.0;
  const SCREEN_Z_FT = 0;
  const GT_CURVE_RADIUS_FACTOR = 1.5;
  const IMMERSION_WARN_HFOV = 53;
  const REFERENCE_IMAGE_SRC = "assets/pov/spiderverse-143-reference.webp";
  const REFERENCE_IMAGE_LABEL = "Spider-Verse 1.43 reference frame";

  function n(value, fallback = null) {
    return typeof value === "number" && Number.isFinite(value) ? value : fallback;
  }

  function isDome(venue) {
    return venue?.screen?.geometry === "hemispherical";
  }

  function isCinema(venue) {
    return venue?.kind === "cinema";
  }

  function activeProjectionFor(venue, options = {}) {
    return options.filmMode && venue?.filmProjection ? venue.filmProjection : venue?.projection;
  }

  function isFullHeightImax(venue, projection) {
    return venue?.screen?.geometry !== "hemispherical" &&
      venue?.screen?.ar != null &&
      venue.screen.ar <= 1.45 &&
      (
        projection?.min_ar <= 1.43 ||
        venue?.filmProjection?.min_ar <= 1.43 ||
        venue?.screen?.geometry === "slight_curve"
      );
  }

  function modelForVenue(venue, options = {}) {
    const projection = activeProjectionFor(venue, options);
    const screen = venue?.screen || {};
    const seatKey = options.seat || "mid";
    const screenW = n(screen.w);
    const screenH = n(screen.h);
    const seatDistances = {
      front: n(venue?.seat?.front),
      mid: n(venue?.seat?.mid),
      back: n(venue?.seat?.back),
    };
    const hasSeat = n(seatDistances[seatKey]) != null;
    const curved = screen.geometry === "slight_curve";
    const fullHeight = isFullHeightImax(venue, projection);
    const unsupportedReason = !isCinema(venue)
      ? "3D POV currently supports cinema venues only."
      : isDome(venue)
        ? "3D dome POV is WIP because dome projection needs fisheye/hemisphere mapping. Use the 2D dome scale for now."
        : !screenW || !screenH
          ? "3D POV needs known screen width and height."
          : !hasSeat
            ? "3D POV needs the selected seat-distance estimate."
            : null;

    const presentationAr = n(options.presentationAr, n(venue?.defaultPresentationAr, n(projection?.min_ar, n(screen.ar, 1.90))));
    const screenBottomFt = n(
      screen.screenBottomFt,
      curved && fullHeight ? GT_SCREEN_BOTTOM_FT : DEFAULT_SCREEN_BOTTOM_FT
    );
    const curvatureRadiusFt = n(screen.curvatureRadiusFt);

    const projectionWindow = projectionRectFor(screenW, screenH, presentationAr);
    const sourceCrop = textureCropFor(projectionWindow.w / projectionWindow.h, SOURCE_AR);

    return {
      id: venue?.id || "unknown",
      name: venue?.name || "Unknown venue",
      side: options.side || "A",
      kind: venue?.kind,
      supported: !unsupportedReason,
      unsupportedReason,
      screen: {
        w: screenW,
        h: screenH,
        ar: n(screen.ar),
        geometry: screen.geometry || "flat",
        screenBottomFt,
        curvatureRadiusFt,
      },
      projection: {
        label: projection?.label || projection?.display_name || "Unknown projector",
        type: projection?.type || "unknown",
        minAr: n(projection?.min_ar, 1.90),
      },
      presentationAr,
      projectionWindow,
      sourceAr: SOURCE_AR,
      sourceCrop,
      sourceLabel: REFERENCE_IMAGE_LABEL,
      seatKey,
      seatDistance: n(seatDistances[seatKey], n(seatDistances.mid, n(seatDistances.front, n(seatDistances.back, 60)))),
      seatDistances,
      layout: {
        screenZ: SCREEN_Z_FT,
      },
      seatingStyle: curved && fullHeight ? "gt" : "retrofit",
      curveRadiusFactor: curved
        ? (curvatureRadiusFt && screenW ? curvatureRadiusFt / screenW : GT_CURVE_RADIUS_FACTOR)
        : 0,
      sourceConfidence: venue?.sources?.seat?.q || venue?.seat?.source || "unknown",
    };
  }

  function createComparison(container, modelA, modelB, options = {}) {
    while (container.firstChild) container.removeChild(container.firstChild);
    const models = [modelA, modelB].filter(Boolean);
    const unsupported = models.find((model) => !model.supported);
    if (unsupported) {
      const note = document.createElement("div");
      note.className = "pov__wip";
      note.textContent = unsupported.unsupportedReason;
      container.appendChild(note);
      return { dispose() {} };
    }
    if (!window.THREE) {
      const note = document.createElement("div");
      note.className = "pov__wip";
      note.textContent = "3D POV could not load Three.js.";
      container.appendChild(note);
      return { dispose() {} };
    }

    const root = document.createElement("div");
    root.className = `pov__grid ${models.length > 1 ? "pov__grid--compare" : ""}`;
    container.appendChild(root);

    const syncLook = options.syncLook !== false;
    const sharedLook = { yaw: 0, pitch: 0 };
    const viewers = models.map((model, index) => {
      const look = syncLook ? sharedLook : { yaw: 0, pitch: 0 };
      const panel = document.createElement("div");
      panel.className = "pov__panel";
      panel.innerHTML =
        `<div class="pov__viewport">` +
          `<div class="pov__hud"></div>` +
          `<div class="pov__warn">below ${IMMERSION_WARN_HFOV}\u00b0 immersion floor</div>` +
          `<div class="pov__hint">drag to look \u00b7 ${options.syncLook === false ? "independent" : "synced"} cameras</div>` +
          `<button class="pov__fullscreen" type="button" title="Fullscreen">FS</button>` +
        `</div>`;
      root.appendChild(panel);
      return new Viewer(panel.querySelector(".pov__viewport"), panel.querySelector(".pov__hud"), panel.querySelector(".pov__warn"), model, look, index);
    });

    viewers.forEach((viewer) => {
      viewer.onLookChanged = () => (syncLook ? viewers : [viewer]).forEach((item) => item.applyCamera());
      viewer.applyCamera();
    });

    return {
      dispose() {
        viewers.forEach((viewer) => viewer.dispose());
        if (root.parentNode === container) container.removeChild(root);
      },
    };
  }

  function Viewer(viewport, hud, warn, model, sharedLook, index) {
    this.viewport = viewport;
    this.hud = hud;
    this.warn = warn;
    this.model = model;
    this.sharedLook = sharedLook;
    this.onLookChanged = null;
    this.disposers = [];
    this.meshes = [];
    this.raf = null;
    this.eye = EYE_ABOVE_FLOOR_FT;
    this.basePitch = 0;

    const THREE = window.THREE;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    viewport.insertBefore(renderer.domElement, viewport.firstChild);
    renderer.domElement.className = "pov__canvas";
    this.renderer = renderer;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b0d10);
    this.scene = scene;

    const camera = new THREE.PerspectiveCamera(70, 1.6, 0.1, 4000);
    this.camera = camera;
    this.texture = createReferenceTexture(model.side || (index === 0 ? "A" : "B"));

    this.size = () => {
      const w = viewport.clientWidth;
      const h = viewport.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    this.size();
    if (window.ResizeObserver) {
      const ro = new ResizeObserver(this.size);
      ro.observe(viewport);
      this.disposers.push(() => ro.disconnect());
    }

    this.bindLook();
    this.rebuild();
    this.applyCamera();
    this.loop();

    const fsButton = viewport.querySelector(".pov__fullscreen");
    const exitPseudoFullscreen = () => {
      viewport.classList.remove("is-pseudo-fullscreen");
      this.size();
    };
    const onFullscreen = async () => {
      if (document.fullscreenElement === viewport) {
        if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
        return;
      }
      if (viewport.classList.contains("is-pseudo-fullscreen")) {
        exitPseudoFullscreen();
        return;
      }
      let enteredNative = false;
      if (viewport.requestFullscreen) {
        try {
          await viewport.requestFullscreen();
          enteredNative = document.fullscreenElement === viewport;
        } catch (error) {
          enteredNative = false;
        }
      }
      if (!enteredNative) {
        viewport.classList.add("is-pseudo-fullscreen");
        this.size();
      }
    };
    const onFullscreenChange = () => {
      if (document.fullscreenElement !== viewport) exitPseudoFullscreen();
      else this.size();
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape" && viewport.classList.contains("is-pseudo-fullscreen")) exitPseudoFullscreen();
    };
    fsButton.addEventListener("click", onFullscreen);
    this.disposers.push(() => fsButton.removeEventListener("click", onFullscreen));
    document.addEventListener("fullscreenchange", onFullscreenChange);
    window.addEventListener("keydown", onKeyDown);
    this.disposers.push(() => document.removeEventListener("fullscreenchange", onFullscreenChange));
    this.disposers.push(() => window.removeEventListener("keydown", onKeyDown));
  }

  Viewer.prototype.bindLook = function () {
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    const canvas = this.renderer.domElement;
    canvas.style.cursor = "grab";
    canvas.style.touchAction = "none";

    const down = (event) => {
      dragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
      canvas.style.cursor = "grabbing";
      canvas.setPointerCapture?.(event.pointerId);
    };
    const up = () => {
      dragging = false;
      canvas.style.cursor = "grab";
    };
    const move = (event) => {
      if (!dragging) return;
      this.sharedLook.yaw -= (event.clientX - lastX) * 0.004;
      this.sharedLook.pitch += (event.clientY - lastY) * 0.004;
      lastX = event.clientX;
      lastY = event.clientY;
      this.sharedLook.yaw = clamp(this.sharedLook.yaw, -0.95, 0.95);
      this.sharedLook.pitch = clamp(this.sharedLook.pitch, -0.95, 0.95);
      if (this.onLookChanged) this.onLookChanged();
    };

    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    this.disposers.push(() => canvas.removeEventListener("pointerdown", down));
    this.disposers.push(() => canvas.removeEventListener("pointermove", move));
    this.disposers.push(() => window.removeEventListener("pointerup", up));
  };

  Viewer.prototype.floorHeightAt = function (distanceFromScreen) {
    const m = this.model;
    const front = n(m.seatDistances.front, Math.max(0, m.seatDistance - 20));
    const back = n(m.seatDistances.back, Math.max(front + 1, m.seatDistance + 20));
    const span = Math.max(1, back - front);
    const t = clamp((distanceFromScreen - front) / span, 0, 1);
    const slope = m.seatingStyle === "gt" ? 0.53 : 0.29;
    const cap = m.screen.h * (m.seatingStyle === "gt" ? 0.55 : 0.32);
    return Math.min(cap, span * slope) * t;
  };

  Viewer.prototype.rebuild = function () {
    const THREE = window.THREE;
    const m = this.model;
    const scene = this.scene;
    while (this.meshes.length) {
      const mesh = this.meshes.pop();
      scene.remove(mesh);
      disposeObject(mesh);
    }

    const W = m.screen.w;
    const H = m.screen.h;
    const D = m.seatDistance;
    const screenBottom = m.screen.screenBottomFt;
    const screenCenterY = screenBottom + H / 2;
    const screenZ = n(m.layout?.screenZ, SCREEN_Z_FT);

    const floor = buildFloor(D, m, this.floorHeightAt.bind(this));
    scene.add(floor);
    this.meshes.push(floor);

    const frame = new THREE.Mesh(
      buildCurvedPlane(W, H, 72, m.curveRadiusFactor),
      new THREE.MeshBasicMaterial({ color: 0x2a3038, side: THREE.DoubleSide })
    );
    frame.position.set(0, screenCenterY, screenZ);
    scene.add(frame);
    this.meshes.push(frame);

    const mask = new THREE.Mesh(
      buildCurvedPlane(W, H, 72, m.curveRadiusFactor),
      new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide })
    );
    mask.position.set(0, screenCenterY, screenZ + 0.05);
    scene.add(mask);
    this.meshes.push(mask);

    const active = activeRect(m);
    setCoverCrop(this.texture, active.w / active.h, m.sourceAr || SOURCE_AR);
    const image = new THREE.Mesh(
      buildCurvedPlane(active.w, active.h, 72, m.curveRadiusFactor),
      new THREE.MeshBasicMaterial({ map: this.texture, side: THREE.DoubleSide })
    );
    image.position.set(0, screenCenterY, screenZ + 0.10);
    scene.add(image);
    this.meshes.push(image);

    ["front", "mid", "back"].forEach((key) => {
      const seatDist = n(m.seatDistances[key]);
      if (seatDist == null || seatDist >= D - 2) return;
      const row = buildSeatRow(screenZ + seatDist, this.floorHeightAt(seatDist));
      scene.add(row);
      this.meshes.push(row);
    });

    const human = buildHuman();
    human.position.set(W * 0.34, 0, screenZ + 1.4);
    scene.add(human);
    this.meshes.push(human);

    this.eye = this.floorHeightAt(D) + EYE_ABOVE_FLOOR_FT;
    this.basePitch = Math.atan2(screenCenterY - this.eye, D);

    const hFov = 2 * Math.atan((active.w / 2) / D) * 180 / Math.PI;
    const vFov = 2 * Math.atan((active.h / 2) / D) * 180 / Math.PI;
    this.hud.innerHTML =
      `<div><span>venue</span><strong>${escapeHtml(m.name)}</strong></div>` +
      `<div><span>screen</span><strong>${W.toFixed(0)} x ${H.toFixed(0)} ft</strong></div>` +
      `<div><span>seat</span><strong>${m.seatKey} \u00b7 ${D.toFixed(0)} ft</strong></div>` +
      `<div><span>format</span><strong>${m.presentationAr.toFixed(2)} on 1.43 source</strong></div>` +
      `<div><span>image</span><strong>${escapeHtml(m.sourceLabel || REFERENCE_IMAGE_LABEL)}</strong></div>` +
      `<div><span>fov</span><strong>${hFov.toFixed(0)}\u00b0 H \u00b7 ${vFov.toFixed(0)}\u00b0 V</strong></div>`;
    this.warn.classList.toggle("show", hFov < IMMERSION_WARN_HFOV);
  };

  Viewer.prototype.applyCamera = function () {
    const THREE = window.THREE;
    const cam = this.camera;
    const D = this.model.seatDistance;
    const screenZ = n(this.model.layout?.screenZ, SCREEN_Z_FT);
    cam.position.set(0, this.eye, screenZ + D);
    const pitch = this.basePitch + this.sharedLook.pitch;
    const yaw = this.sharedLook.yaw;
    const dir = new THREE.Vector3(
      Math.sin(yaw) * Math.cos(pitch),
      Math.sin(pitch),
      -Math.cos(yaw) * Math.cos(pitch)
    );
    cam.lookAt(cam.position.x + dir.x, cam.position.y + dir.y, cam.position.z + dir.z);
  };

  Viewer.prototype.loop = function () {
    this.raf = requestAnimationFrame(() => this.loop());
    this.renderer.render(this.scene, this.camera);
  };

  Viewer.prototype.dispose = function () {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.disposers.forEach((fn) => fn());
    while (this.meshes.length) disposeObject(this.meshes.pop());
    if (this.texture) this.texture.dispose();
    if (this.renderer) {
      this.renderer.dispose();
      if (this.renderer.domElement?.parentNode) this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
  };

  function buildCurvedPlane(W, H, segs, radiusFactor) {
    const THREE = window.THREE;
    const geo = new THREE.PlaneGeometry(W, H, segs, 1);
    if (radiusFactor > 0) {
      const R = W * radiusFactor;
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const a = x / R;
        pos.setX(i, R * Math.sin(a));
        pos.setZ(i, R * (1 - Math.cos(a)));
      }
      pos.needsUpdate = true;
      geo.computeVertexNormals();
    }
    return geo;
  }

  function activeRect(model) {
    return projectionRectFor(model.screen.w, model.screen.h, model.presentationAr);
  }

  function projectionRectFor(screenW, screenH, presentationAr) {
    const W = screenW;
    const H = screenH;
    const screenAr = W / H;
    const fillsWidth = screenAr <= presentationAr;
    const projectedW = fillsWidth ? W : H * presentationAr;
    const projectedH = fillsWidth ? W / presentationAr : H;
    return {
      w: projectedW,
      h: projectedH,
      horizontalFillPct: Math.min(100, (projectedW / W) * 100),
      verticalFillPct: Math.min(100, (projectedH / H) * 100),
    };
  }

  function buildFloor(cameraDistance, model, floorHeightAt) {
    const THREE = window.THREE;
    const halfW = Math.max(24, model.screen.w * 0.46);
    const screenZ = n(model.layout?.screenZ, SCREEN_Z_FT);
    const farthestSeat = Math.max(
      cameraDistance,
      n(model.seatDistances.back, cameraDistance),
      n(model.seatDistances.mid, cameraDistance),
      n(model.seatDistances.front, cameraDistance)
    );
    const zFront = screenZ - 10;
    const zBack = screenZ + farthestSeat + 28;
    const steps = 90;
    const positions = [];
    const index = [];
    for (let j = 0; j <= steps; j++) {
      const z = zFront + (j / steps) * (zBack - zFront);
      const distance = z - screenZ;
      const y = floorHeightAt(distance);
      positions.push(-halfW, y, z, halfW, y, z);
    }
    for (let k = 0; k < steps; k++) {
      const a = k * 2;
      const b = k * 2 + 1;
      const c = (k + 1) * 2;
      const d = (k + 1) * 2 + 1;
      index.push(a, c, b, b, c, d);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geo.setIndex(index);
    geo.computeVertexNormals();
    return new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0x11161d, side: THREE.DoubleSide }));
  }

  function buildSeatRow(z, floorY) {
    const THREE = window.THREE;
    const group = new THREE.Group();
    const sw = 2.4;
    const sh = 2.3;
    const sd = 1.2;
    const gap = 0.45;
    const count = 11;
    const total = count * (sw + gap);
    const mat = new THREE.MeshBasicMaterial({ color: 0x0a0f14 });
    for (let i = 0; i < count; i++) {
      const seat = new THREE.Mesh(new THREE.BoxGeometry(sw, sh, sd), mat);
      seat.position.set(-total / 2 + i * (sw + gap) + sw / 2, floorY + sh / 2, z);
      group.add(seat);
    }
    return group;
  }

  function buildHuman() {
    const THREE = window.THREE;
    const mat = new THREE.MeshBasicMaterial({ color: 0xc9a55a });
    const geo = new THREE.BoxGeometry(0.85, HUMAN_HEIGHT_FT, 0.3);
    geo.translate(0, HUMAN_HEIGHT_FT / 2, 0);
    return new THREE.Mesh(geo, mat);
  }

  function createReferenceTexture(side) {
    const THREE = window.THREE;
    const canvas = document.createElement("canvas");
    canvas.width = 1430;
    canvas.height = 1000;
    const ctx = canvas.getContext("2d");
    drawReferenceFallback(ctx, canvas, side);
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    const image = new Image();
    image.onload = () => {
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawCoverImage(ctx, image, 0, 0, canvas.width, canvas.height);
      texture.needsUpdate = true;
    };
    image.onerror = () => {
      drawReferenceFallback(ctx, canvas, side);
      texture.needsUpdate = true;
    };
    image.src = REFERENCE_IMAGE_SRC;
    return texture;
  }

  function drawReferenceFallback(ctx, canvas, side) {
    ctx.fillStyle = "#11161d";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, "#1d2733");
    grad.addColorStop(1, "#0d1218");
    ctx.fillStyle = grad;
    ctx.fillRect(70, 70, 1290, 860);
    ctx.strokeStyle = side === "B" ? "#7a3f5c" : "#17476b";
    ctx.lineWidth = 18;
    ctx.strokeRect(70, 70, 1290, 860);
    ctx.strokeStyle = "#c9a55a";
    ctx.lineWidth = 8;
    ctx.globalAlpha = 0.82;
    ctx.beginPath();
    ctx.moveTo(70, 500);
    ctx.lineTo(1360, 500);
    ctx.moveTo(715, 70);
    ctx.lineTo(715, 930);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#efe7d4";
    ctx.font = "72px monospace";
    ctx.textAlign = "center";
    ctx.fillText("1.43 IMAX SOURCE", 715, 470);
    ctx.font = "38px monospace";
    ctx.fillStyle = "#8a949d";
    ctx.fillText("loading reference frame", 715, 555);
  }

  function drawCoverImage(ctx, image, x, y, w, h) {
    const sourceAr = image.naturalWidth / image.naturalHeight;
    const targetAr = w / h;
    let sx = 0;
    let sy = 0;
    let sw = image.naturalWidth;
    let sh = image.naturalHeight;
    if (sourceAr > targetAr) {
      sw = image.naturalHeight * targetAr;
      sx = (image.naturalWidth - sw) / 2;
    } else if (sourceAr < targetAr) {
      sh = image.naturalWidth / targetAr;
      sy = (image.naturalHeight - sh) / 2;
    }
    ctx.drawImage(image, sx, sy, sw, sh, x, y, w, h);
  }

  function setCoverCrop(tex, targetAr, sourceAr) {
    const crop = textureCropFor(targetAr, sourceAr);
    tex.wrapS = tex.wrapT = window.THREE.ClampToEdgeWrapping;
    tex.repeat.set(crop.u, crop.v);
    tex.offset.set(crop.offsetU, crop.offsetV);
    tex.needsUpdate = true;
  }

  function textureCropFor(targetAr, sourceAr) {
    let u;
    let v;
    if (targetAr > sourceAr) {
      u = 1;
      v = sourceAr / targetAr;
    } else {
      v = 1;
      u = targetAr / sourceAr;
    }
    return {
      u,
      v,
      offsetU: (1 - u) / 2,
      offsetV: (1 - v) / 2,
      retainedPct: u * v * 100,
    };
  }

  function disposeObject(object) {
    if (!object) return;
    if (object.traverse) {
      object.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) child.material.forEach((mat) => mat.dispose());
          else child.material.dispose();
        }
      });
    } else {
      if (object.geometry) object.geometry.dispose();
      if (object.material) object.material.dispose();
    }
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  return { modelForVenue, createComparison };
})();
