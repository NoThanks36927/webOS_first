class Octagon {
  text = "";
  children = [];
  constructor(givenText, givenIsParent, childrenGiven) {
    text = givenText;
    isParent = givenIsParent;
    children = childrenGiven;
  }

  addChildren(childrenToAdd) {
    for (let i = 0; i < childrenToAdd.length; i++) {
      this.children.push(childrenToAdd[i]);
    }
  }
  isParent() {
    return this.children !== undefined && this.children.length != 0;
  }
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

const simulation = d3
  .forceSimulation(nodes)
  .force(
    "link",
    d3
      .forceLink(links)
      .id((d) => d.id)
      .distance(500)
      .strength(2),
  )
  .force("charge", d3.forceManyBody())
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

// const node = svg
//   .append("g")
//   .attr("stroke", "#fff")
//   .attr("stroke-width", 1.5)
//   .selectAll("circle")
//   .data(nodes)
//   .join("circle")
//   .attr("r", (d) => (d.data.isMain == true ? 75 : 75))
//   .attr("fill", "#663399");

// node.append("text")
//     .attr("x", 8)
//     .attr("y", "5em")
//     .text(d => d.data.name)
//   .clone(true).lower()
//     .attr("fill", "none")
//     .attr("stroke", "white")
//     .attr("stroke-width", 3);

const node = svg
  .append("g")
  .attr("fill", "currentColor")
  .attr("stroke-linecap", "round")
  .attr("stroke-linejoin", "round")
  .selectAll("g")
  .data(nodes)
  .join("circle")
  .attr("r", (d) => (d.data.isMain == true ? 100 : 75))
  .attr("fill", "#663399")
  .join("g");

node
  .append("text")
  .attr("x", 8)
  .attr("y", "0.31em")
  .text((d) => d.data.name)
  .clone(true)
  .lower()
  .attr("fill", "none")
  .attr("stroke", "white")
  .attr("stroke-width", 3);

simulation.on("tick", () => {
  link
    .attr("x1", (d) => d.source.x)
    .attr("y1", (d) => d.source.y)
    .attr("x2", (d) => d.target.x)
    .attr("y2", (d) => d.target.y);

  node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
});

// Append the SVG element.
chartParent.append(svg.node());
