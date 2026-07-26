function getOctagonPoints(r) {
  return `${r / 3},${r} ${r},${r / 3} ${r},${-r / 3} ${r / 3},${-r} ${-r / 3},${-r} ${-r},${-r / 3} ${-r},${r / 3} ${-r / 3},${r}`;
}

const DATA_JSON =
  '{"name": "What\'s next?", "isMain": true,"children": [{"name": "Projects","children":"", "isMain": false},{ "name": "School", "children":"", "isMain": false},{ "name":"Studying(Fun)", "children":"", "isMain": false}, { "name":"Unwind",  "children":"", "isMain": false} ] }';
const data = JSON.parse(DATA_JSON);

console.log(data);
const chartParent = document.getElementById("chartHolder");
const width = chartParent.offsetWidth;
const height = chartParent.offsetHeight;

const root = d3.hierarchy(data);
const links = root.links();
const nodes = root.descendants();
const bigSize = 125;
const smallSize = 75;

const simulation = d3
  .forceSimulation(nodes)
  .force(
    "link",
    d3
      .forceLink(links)
      .id((d) => d.id)
      .distance(300)
      .strength(0.5),
  )
  .force("charge", d3.forceManyBody())
  .force(
    "collision",
    d3.forceCollide((d) => (d.data.isMain ? bigSize : smallSize) + 10),
  )
  .force("x", d3.forceX())
  .force("y", d3.forceY());

const svg = d3
  .create("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("viewBox", [-width / 2, -height / 2, width, height])
  .attr("style", "max-width: 100%; height: auto;");

const link = svg
  .append("g")
  .attr("stroke", "#999")
  .attr("stroke-opacity", 0.6)
  .selectAll("line")
  .data(links)
  .join("line");

const node = svg.append("g").selectAll("g").data(nodes).join("g");

node
  .append("polygon")
  .attr("points", (d) => getOctagonPoints(d.data.isMain ? bigSize : smallSize))
  .attr("fill", "#663399");

node
  .append("text")
  .text((d) => d.data.name)
  .attr("text-anchor", "middle")
  //  .attr("dominant-baseline", "middle")
  .attr("fill", "white")
  .style("font-size", (d) => (d.data.isMain ? "24px" : "16px"));

simulation.on("tick", () => {
  link
    .attr("x1", (d) => d.source.x)
    .attr("y1", (d) => d.source.y)
    .attr("x2", (d) => d.target.x)
    .attr("y2", (d) => d.target.y);

  node.attr("transform", (d) => `translate(${d.x},${d.y})`);
});

chartParent.append(svg.node());
