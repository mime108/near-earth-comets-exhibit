const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const stars = [];
const asteroids = [];
const satellites = [];

function animateStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stars.forEach(star => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${star.hue}, 70%, 80%, ${star.opacity})`;
    ctx.shadowBlur = 15;
    ctx.shadowColor = `hsla(${star.hue}, 70%, 80%, 0.5)`;
    ctx.fill();
    star.opacity += star.speed;
    if (star.opacity > 1 || star.opacity < 0) star.speed = -star.speed;
  });

  asteroids.forEach(asteroid => {
    ctx.beginPath();
    ctx.arc(asteroid.x, asteroid.y, asteroid.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(200, 200, 200, ${asteroid.opacity})`;
    ctx.fill();
    asteroid.x += asteroid.speedX;
    asteroid.y += asteroid.speedY;
    if (asteroid.x < 0 || asteroid.x > canvas.width) asteroid.speedX = -asteroid.speedX;
    if (asteroid.y < 0 || asteroid.y > canvas.height) asteroid.speedY = -asteroid.speedY;
  });

  satellites.forEach(satellite => {
    ctx.beginPath();
    ctx.moveTo(satellite.x, satellite.y - satellite.radius);
    ctx.lineTo(satellite.x + satellite.radius, satellite.y + satellite.radius);
    ctx.lineTo(satellite.x - satellite.radius, satellite.y + satellite.radius);
    ctx.closePath();
    ctx.fillStyle = `rgba(255, 255, 255, ${satellite.opacity})`;
    ctx.fill();
    satellite.x += satellite.speedX;
    satellite.y += satellite.speedY;
    if (satellite.x < 0 || satellite.x > canvas.width) satellite.speedX = -satellite.speedX;
    if (satellite.y < 0 || satellite.y > canvas.height) satellite.speedY = -satellite.speedY;
  });

  requestAnimationFrame(animateStars);
}

for (let i = 0; i < 300; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 2,
    opacity: Math.random(),
    speed: Math.random() * 0.015,
    hue: Math.random() * 60 + 200
  });
}

for (let i = 0; i < 20; i++) {
  asteroids.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 3 + 2,
    speedX: (Math.random() - 0.5) * 0.5,
    speedY: (Math.random() - 0.5) * 0.5,
    opacity: Math.random() * 0.5 + 0.3
  });
}

for (let i = 0; i < 10; i++) {
  satellites.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 2 + 1,
    speedX: (Math.random() - 0.5) * 0.7,
    speedY: (Math.random() - 0.5) * 0.7,
    opacity: Math.random() * 0.4 + 0.5
  });
}

animateStars();

function backToSpiral() {
  spiralSvg.selectAll(".orbit-path").remove();
  spiralSvg.selectAll(".orbit-comet").remove();
  d3.select("#spiral-info-card").style("display", "none");
  d3.select("#back-to-spiral").remove();
  spiralSvg.selectAll(".arc")
    .transition()
    .duration(500)
    .style("opacity", 1);
}

const spiralWidth = 800;
const spiralHeight = 800;
const spiralMargin = { top: 100, right: 100, bottom: 100, left: 100 };
const spiralInnerWidth = spiralWidth - spiralMargin.left - spiralMargin.right;
const spiralInnerHeight = spiralHeight - spiralMargin.top - spiralMargin.bottom;

const spiralSvg = d3.select("#spiral-visualization")
  .attr("width", spiralWidth)
  .attr("height", spiralHeight)
  .append("g")
  .attr("transform", `translate(${spiralWidth / 2},${spiralHeight / 2})`);

const spiralDefs = spiralSvg.append("defs");
const spiralFilter = spiralDefs.append("filter").attr("id", "glow");
spiralFilter.append("feGaussianBlur").attr("stdDeviation", 3).attr("result", "coloredBlur");
const spiralFeMerge = spiralFilter.append("feMerge");
spiralFeMerge.append("feMergeNode").attr("in", "coloredBlur");
spiralFeMerge.append("feMergeNode").attr("in", "SourceGraphic");

const timelineWidth = 1000;
const timelineHeight = 600;
const timelineMargin = { top: 50, right: 50, bottom: 50, left: 50 };
const timelineInnerWidth = timelineWidth - timelineMargin.left - timelineMargin.right;
const timelineInnerHeight = timelineHeight - timelineMargin.top - timelineMargin.bottom;

const timelineSvg = d3.select("#timeline-visualization")
  .attr("width", timelineWidth)
  .attr("height", timelineHeight)
  .append("g")
  .attr("transform", `translate(${timelineMargin.left},${timelineMargin.top})`);

const timelineDefs = timelineSvg.append("defs");
const lensFlare = timelineDefs.append("filter").attr("id", "lens-flare");
lensFlare.append("feGaussianBlur")
  .attr("in", "SourceGraphic")
  .attr("stdDeviation", "5")
  .attr("result", "blur");
lensFlare.append("feColorMatrix")
  .attr("in", "blur")
  .attr("type", "matrix")
  .attr("values", "1 0 0 0 0  0 1.2 0 0 0  0 0 1.2 0 0.1  0 0 0 1 0")
  .attr("result", "colorShift");
lensFlare.append("feComposite")
  .attr("in", "SourceGraphic")
  .attr("in2", "colorShift")
  .attr("operator", "arithmetic")
  .attr("k1", "0")
  .attr("k2", "1")
  .attr("k3", "1")
  .attr("k4", "0");

const highlightFilter = timelineDefs.append("filter").attr("id", "highlight-glow");
highlightFilter.append("feGaussianBlur").attr("stdDeviation", 3).attr("result", "coloredBlur");
const highlightFeMerge = highlightFilter.append("feMerge");
highlightFeMerge.append("feMergeNode").attr("in", "coloredBlur");
highlightFeMerge.append("feMergeNode").attr("in", "SourceGraphic");

const sunGradient = spiralDefs.append("radialGradient")
  .attr("id", "sun-gradient");
sunGradient.append("stop")
  .attr("offset", "0%")
  .attr("stop-color", "#FFD700");
sunGradient.append("stop")
  .attr("offset", "100%")
  .attr("stop-color", "#FF8C00");

function clearGlowGarden() {
  d3.select("#info-card").style("display", "none");
  timelineSvg.selectAll(".connection-line").remove();
  timelineSvg.selectAll(".comet-orb").classed("highlighted-orb", false);
}

document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    const sectionId = item.getAttribute('data-section');
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
  });
});

d3.csv("near-earth-comets.csv").then(data => {
  data.forEach(d => {
    d.TP = +d.TP;
    d.q = +d.q;
    d.P = +d.P;
    d.MOID = +d.MOID;
    d.e = +d.e;
  });

  const uniqueComets = [];
  const seenNames = new Set();
  for (let d of data) {
    const baseName = d.Object_name.split("-")[0];
    if (!seenNames.has(baseName) || uniqueComets.length < 30) {
      uniqueComets.push(d);
      seenNames.add(baseName);
    }
    if (uniqueComets.length >= 30) break;
  }

  const jdToYear = jd => 2000 + (jd - 2451545) / 365.25;
  uniqueComets.forEach(d => d.year = jdToYear(d.TP));

  const xPosition = d3.scaleLinear()
    .domain([d3.min(uniqueComets, d => d.q), d3.max(uniqueComets, d => d.q)])
    .range([0, timelineInnerWidth]);

  const yPosition = d3.scaleLinear()
    .domain([d3.min(uniqueComets, d => d.e), d3.max(uniqueComets, d => d.e)])
    .range([timelineInnerHeight, 0]);

  const sizeScale = d3.scaleLinear()
    .domain([d3.min(uniqueComets, d => d.MOID), d3.max(uniqueComets, d => d.MOID)])
    .range([20, 5]);

  const opacityScale = d3.scaleLinear()
    .domain([d3.min(uniqueComets, d => d.MOID), d3.max(uniqueComets, d => d.MOID)])
    .range([1, 0.3]);

  uniqueComets.forEach((d, i) => {
    const gradientId = `comet-gradient-${i}`;
    const cometGradient = timelineDefs.append("radialGradient")
      .attr("id", gradientId)
      .attr("cx", "0.5")
      .attr("cy", "0.5")
      .attr("r", "0.5")
      .attr("fx", "0.5")
      .attr("fy", "0.5");

    const moidNorm = (d.MOID - d3.min(uniqueComets, d => d.MOID)) / 
                    (d3.max(uniqueComets, d => d.MOID) - d3.min(uniqueComets, d => d.MOID));
    const baseColor = d3.interpolateRgb("#FFD700", "#4682B4")(moidNorm);

    cometGradient.append("stop").attr("offset", "0%").attr("stop-color", "#ffffff").attr("stop-opacity", 1);
    cometGradient.append("stop").attr("offset", "15%").attr("stop-color", d3.color(baseColor).brighter(1.5)).attr("stop-opacity", 0.9);
    cometGradient.append("stop").attr("offset", "40%").attr("stop-color", baseColor).attr("stop-opacity", 0.7);
    cometGradient.append("stop").attr("offset", "75%").attr("stop-color", d3.color(baseColor).darker(0.5)).attr("stop-opacity", 0.3);
    cometGradient.append("stop").attr("offset", "100%").attr("stop-color", d3.color(baseColor).darker(1)).attr("stop-opacity", 0);
  });

  const nodes = uniqueComets.map(d => ({
    ...d,
    x: xPosition(d.q),
    y: yPosition(d.e),
    radius: sizeScale(d.MOID)
  }));

  const simulation = d3.forceSimulation(nodes)
    .force("x", d3.forceX(d => xPosition(d.q)).strength(0.1))
    .force("y", d3.forceY(d => yPosition(d.e)).strength(0.1))
    .force("collide", d3.forceCollide(d => d.radius + 10))
    .stop();

  for (let i = 0; i < 300; i++) simulation.tick();

  const cometGroups = timelineSvg.selectAll(".comet-group")
    .data(nodes)
    .enter()
    .append("g")
    .attr("class", "comet-group")
    .attr("transform", d => `translate(${d.x}, ${d.y})`);

  cometGroups.each(function(d) {
    const group = d3.select(this);
    const radius = sizeScale(d.MOID);
    const numLines = 8;
    const lineLength = radius * 2;

    for (let i = 0; i < numLines; i++) {
      const angle = (i / numLines) * 2 * Math.PI;
      const x1 = 0;
      const y1 = 0;
      const x2 = Math.cos(angle) * lineLength;
      const y2 = Math.sin(angle) * lineLength;

      group.append("line")
        .attr("class", "comet-starburst")
        .attr("x1", x1)
        .attr("y1", y1)
        .attr("x2", x2)
        .attr("y2", y2)
        .attr("stroke", d3.color("#ffffff").darker(0.5))
        .attr("stroke-width", 1)
        .attr("opacity", opacityScale(d.MOID) * 0.5)
        .attr("filter", "url(#lens-flare)");
    }
  });

  const comets = cometGroups.append("circle")
    .attr("class", "comet-orb")
    .attr("r", d => sizeScale(d.MOID))
    .attr("fill", (d, i) => `url(#comet-gradient-${i})`)
    .attr("opacity", d => opacityScale(d.MOID))
    .attr("filter", "url(#lens-flare)")
    .style("mix-blend-mode", "screen");

  const timelineTooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  cometGroups.on("mouseover", function(event, d) {
    timelineTooltip.transition().duration(200).style("opacity", 0.9);
    timelineTooltip.html(`Name: ${d.Object_name}`)
      .style("left", (event.pageX + 15) + "px")
      .style("top", (event.pageY - 30) + "px");
  })
  .on("mouseout", function() {
    timelineTooltip.transition().duration(500).style("opacity", 0);
  })
  .on("click", function(event, d) {
    timelineSvg.selectAll(".connection-line").remove();
    timelineSvg.selectAll(".comet-orb").classed("highlighted-orb", false);

    const similarComets = nodes.filter(other => 
      other !== d && Math.abs(d.year - other.year) <= 5
    );

    similarComets.forEach(target => {
      const line = timelineSvg.append("line")
        .attr("class", "connection-line")
        .attr("x1", d.x)
        .attr("y1", d.y)
        .attr("x2", d.x)
        .attr("y2", d.y)
        .style("opacity", 0);

      line.transition()
        .duration(1000)
        .attr("x2", target.x)
        .attr("y2", target.y)
        .style("opacity", 0.8);
    });

    cometGroups.each(function(other) {
      if (other === d || similarComets.includes(other)) {
        d3.select(this).select(".comet-orb").classed("highlighted-orb", true);
      }
    });

    const infoCard = d3.select("#info-card");
    infoCard.style("display", "block");
    infoCard.html(`
      <h3>${d.Object_name}</h3>
      <p><b>Comets with Similar Perihelion Years:</b> ${similarComets.map(c => c.Object_name).join(", ") || "None"}</p>
      <button onclick="clearGlowGarden()">Clear Selection</button>
    `);
  });

  const radiusScale = d3.scaleLinear()
    .domain([0, d3.max(uniqueComets, d => d.q) * 1.1])
    .range([50, spiralInnerWidth / 4]);

  const lengthScale = d3.scaleLinear()
    .domain([0, d3.max(uniqueComets, d => d.P)])
    .range([Math.PI / 4, 2 * Math.PI]);

  const thicknessScale = d3.scaleLinear()
    .domain([d3.max(uniqueComets, d => d.MOID), 0])
    .range([1, 8]);

  const spiralColorScale = d3.scaleOrdinal()
    .domain(["low", "mid", "high"])
    .range(["#87CEEB", "#FFD700", "#FF8C00"]);

  const a = 1;
  const b = 0.12;

  const arcsData = uniqueComets.map((d, i) => {
    const thetaStart = (i / uniqueComets.length) * 2 * Math.PI;
    const thetaEnd = thetaStart + lengthScale(d.P);
    const rStart = radiusScale(d.q);
    const thetaRange = d3.range(thetaStart, thetaEnd, 0.01);
    const basePoints = thetaRange.map(theta => ({
      x: a * Math.exp(b * theta) * rStart * Math.cos(theta),
      y: a * Math.exp(b * theta) * rStart * Math.sin(theta),
      theta
    }));
    return {
      basePoints,
      thetaRange,
      data: d,
      thickness: thicknessScale(d.MOID),
      color: spiralColorScale(d.e < 0.7 ? "low" : d.e < 0.9 ? "mid" : "high"),
      rStart
    };
  });

  spiralSvg.append("circle")
    .attr("class", "sun")
    .attr("r", 15)
    .attr("fill", "url(#sun-gradient)")
    .attr("filter", "url(#glow)");

  const line = d3.line()
    .x(d => d.x)
    .y(d => d.y)
    .curve(d3.curveCatmullRom);

  const arcElements = spiralSvg.selectAll(".arc")
    .data(arcsData)
    .enter()
    .append("path")
    .attr("class", "arc")
    .attr("d", d => line(d.basePoints))
    .attr("stroke", d => d.color)
    .attr("stroke-width", d => d.thickness);

  let earthVisible = false;
  spiralSvg.on("click", function(event) {
    if (!earthVisible) {
      spiralSvg.append("circle")
        .attr("class", "earth")
        .attr("r", 8)
        .attr("cx", 100)
        .attr("cy", 0)
        .attr("fill", "#00B7EB")
        .attr("filter", "url(#glow)");
      earthVisible = true;
    } else {
      spiralSvg.select(".earth").remove();
      earthVisible = false;
    }
    // this isn't working check later
  });

  const spiralTooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  const isSectionVisible = () => {
    const section = document.getElementById('spiral-section');
    const rect = section.getBoundingClientRect();
    return rect.top >= 0 && rect.bottom <= window.innerHeight;
  };

  arcElements.on("mouseover", function(event, d) {
    if (isSectionVisible()) {
      d3.select(this).attr("stroke", "#4682B4");
      spiralTooltip.transition().duration(200).style("opacity", 0.9);
      spiralTooltip.html(`Name: ${d.data.Object_name}<br>Click to see orbit`)
        .style("left", (event.pageX + 15) + "px")
        .style("top", (event.pageY - 30) + "px");
    }
  })
  .on("mouseout", function(d) {
    d3.select(this).attr("stroke", d => d.color);
    spiralTooltip.transition().duration(500).style("opacity", 0);
  })
  .on("click", function(event, d) {
    event.stopPropagation();
    spiralSvg.selectAll(".arc").transition().duration(500).style("opacity", 0);
    
    const a = d.rStart * 1.5;
    const b = a * (1 - d.data.e);
    
    const orbitPoints = d3.range(0, 2 * Math.PI + 0.01, 0.01).map(theta => ({
      x: a * Math.cos(theta),
      y: b * Math.sin(theta)
    }));
    
    spiralSvg.append("path")
      .attr("class", "orbit-path")
      .attr("d", line(orbitPoints))
      .style("opacity", 0)
      .transition()
      .duration(500)
      .style("opacity", 1);

    const comet = spiralSvg.append("circle")
      .attr("class", "orbit-comet")
      .attr("r", 5);

    function animateOrbit() {
      comet.transition()
        .duration(3000)
        .ease(d3.easeLinear)
        .tween("pathTween", () => {
          const l = orbitPoints.length;
          let i = 0;
          return t => {
            const idx = Math.floor(t * l) % l;
            comet.attr("cx", orbitPoints[idx].x)
                 .attr("cy", orbitPoints[idx].y);
          };
        })
        .on("end", animateOrbit);
    }
    animateOrbit();

    const infoCard = d3.select("#spiral-info-card");
    infoCard.style("display", "block");
    infoCard.html(`
      <h3 class="dashboard-title">${d.data.Object_name}</h3>
      <div class="dashboard-container">
        <div class="dashboard-card">
          <h4>Perihelion Distance</h4>
          <p>${d.data.q.toFixed(2)} AU</p>
          <p class="description">Closest approach to the Sun</p>
        </div>
        <div class="dashboard-card">
          <h4>MOID</h4>
          <p>${d.data.MOID.toFixed(3)} AU</p>
          <p class="description">Minimum distance to Earth's orbit</p>
        </div>
        <div class="dashboard-card">
          <h4>Orbital Period</h4>
          <p>${d.data.P.toFixed(2)} years</p>
          <p class="description">Time to complete one orbit</p>
        </div>
        <div class="dashboard-card">
          <h4>Eccentricity</h4>
          <p>${d.data.e.toFixed(3)}</p>
          <p class="description">Measure of orbit elongation</p>
        </div>
      </div>
    `);

    d3.select("#spiral-content")
      .append("button")
      .attr("id", "back-to-spiral")
      .text("Back to Spiral")
      .on("click", backToSpiral);
  });
});