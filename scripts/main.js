function getOctagonPoints(r) {
  return `${r / 3},${r} ${r},${r / 3} ${r},${-r / 3} ${r / 3},${-r} ${-r / 3},${-r} ${-r},${-r / 3} ${-r},${r / 3} ${-r / 3},${r}`;
}

const chartParent = document.getElementById("chartHolder");
const width = chartParent.offsetWidth;
const height = chartParent.offsetHeight;
var root;

const bigSize = 125;
const smallSize = 75;
const bigFont = "24px";
const smallFont = "16px";

const svg = d3
  .create("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("viewBox", [-(2 * width) / 3, -height / 3, width, height])
  .attr("style", "max-width: 100%; height: auto;");
chartParent.append(svg.node());
d3.json("data.json").then(function (json) {
  console.log(json);
  root = d3.hierarchy(json);
  // links = root.links();
  root.childrenCollapsed = true;
  root.hidden = false;
  for (var i = 1; i < root.descendants().length; i++) {
    root.descendants()[i].hidden = true;
    root.descendants()[i].childrenCollapsed = true;
  }
  update(root);
});

function update(focusNode) {
  //only draw nonhidden nodes
  svg.selectAll("line").remove();
  svg.selectAll("polygon").remove();
  svg.selectAll("text").remove();
  var nodesToDraw = root.descendants().filter(function (d) {
    return !d.hidden;
  });

  if (focusNode != root) {
    const index = nodesToDraw.indexOf(focusNode.parent);
    nodesToDraw.splice(index, 1);
    console.log(nodesToDraw);
  }
  // console.log("update called");
  // console.log(nodesToDraw);
  // console.log(focusNode); // L1 focus node is hidden??
  // console.log(focusNode.parent);
  var links = root.links().filter(function (d) {
    return d.source.hidden && d.target.hidden;
  });

  const simulation = d3
    .forceSimulation(nodesToDraw)
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
      d3.forceCollide((d) => (d.parent == null ? bigSize : smallSize) + 10),
    )
    .force("x", d3.forceX())
    .force("y", d3.forceY());

  const link = svg
    .append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(links)
    .join("line");
  const visNodes = svg.append("g").selectAll("g").data(nodesToDraw).join("g");

  visNodes
    .append("polygon")
    .attr("points", (d) =>
      getOctagonPoints(d.parent == null ? bigSize : smallSize),
    )
    .attr("fill", "#663399");

  visNodes
    .append("text")
    .text((d) => d.data.name)
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .style("font-size", (d) => (d.parent == null ? bigFont : smallFont));
  var parentNode;
  if (focusNode != root) {
    parentNode = svg
      .append("g")
      .selectAll("g")
      .data(focusNode.parent)
      .join("g");
    parentNode
      .append("circle")
      .attr("r", 100)
      // .attr("cx")
      // .attr("cy")
      .style("fill", "#45b1ce00");
  }

  simulation.on("tick", () => {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    visNodes.attr("transform", (d) => `translate(${d.x},${d.y})`);
    if (focusNode != root) {
      parentNode
        .attr("cx", function (d) {
          return d.x;
        })
        .attr("cy", function (d) {
          return d.y;
        });
    }
  });

  visNodes.on("click", onNodeClick);
  if (focusNode != root) {
    parentNode.on("click", onNodeClick);
  }
}

function onNodeClick(d) {
  const targetNode = this.__data__;
  var nextFocus = targetNode;
  if (targetNode.children != null) {
    if (targetNode.childrenCollapsed) {
      //already collapsed
      targetNode.children.forEach((child) => {
        child.hidden = false;
      });
      targetNode.childrenCollapsed = false;
    } else {
      targetNode.children.forEach((child) => {
        child.hidden = true;
      });
      targetNode.childrenCollapsed = true;
      if (targetNode != root) {
        nextFocus = targetNode.parent;
      }
    }
    update(nextFocus);
  } else {
    console.log("nothing to expand :(");
  }

  // // console.log(targetNode);
  // // console.log(targetNode.parent);
  // if (targetNode.childrenCollapsed) {
  //   //expand
  //   console.log("this was collapsed , expanding");
  //   targetNode.children.forEach((child) => {
  //     child.hidden = false;
  //   });
  //   targetNode.childrenCollapsed = false;
  //   if (targetNode != root) {
  //     targetNode.parent.children.forEach((child) => {
  //       child.hidden = true;
  //     });
  //     targetNode.parent.childrenCollapsed = true;
  //   }
  //   update(targetNode);
  // } else {
  //   //collapse
  //   console.log("this was expanded, collapsing");
  //   targetNode.children.forEach((child) => {
  //     child.hidden = true;
  //   });
  //   targetNode.childrenCollapsed = true;
  //   if (targetNode != root) {
  //     targetNode.parent.children.forEach((child) => {
  //       child.hidden = false;
  //     });
  //     targetNode.parent.childrenCollapsed = false;
  //     update(targetNode.parent);
  //   } else {
  //     update(targetNode);
  //   }
  // }
}
