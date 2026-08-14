function getOctagonPoints(r) {
  const a = 0.70710678118;
  // const h = factor * r;
  const y = (2 * r) / (1 + 2 * a);
  return `${-0.5 * y},${r} ${0.5 * y},${r} ${r},${0.5 * y} ${r},${-0.5 * y} ${0.5 * y},${-r} ${-0.5 * y},${-r} ${-r},${-0.5 * y} ${-r},${0.5 * y}`;
  // return `${r / 3},${r} ${r},${r / 3} ${r},${-r / 3} ${r / 3},${-r} ${-r / 3},${-r} ${-r},${-r / 3} ${-r},${r / 3} ${-r / 3},${r}`;
  // return `${h - r},${r} ${r - h},${r} ${r},${r - h} ${r},${h - r} ${r - h},${-r} ${h - r},${-r} ${-r},${h - r} ${-r},${r - h}`;
  return ``;
}

const chartParent = document.getElementById("chartHolder");
const width = chartParent.offsetWidth;
const height = chartParent.offsetHeight;
var root;

const bigSize = 125;
const smallSize = 75;
const bigFont = "24px";
const smallFont = "16px";
const smallestFont = "12px";

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
  svg.selectAll("a").remove();
  var nodesToDraw = root.descendants().filter(function (d) {
    if (d.hidden) {
      return false;
    }
    let ancestor = focusNode.parent;
    while (ancestor) {
      if (d == ancestor) {
        return false;
      }
      ancestor = ancestor.parent;
      // if current node is current ancestor, hide. continue checking against older ancestors until root reached. if still clear, show.
    }
    return true;
  });

  var links = root.links().filter(function (d) {
    return !d.source.hidden && !d.target.hidden;
  });

  const simulation = d3
    .forceSimulation(nodesToDraw)
    .force(
      "link",
      d3
        .forceLink(links)
        .id((d) => d.id)
        .distance(500)
        .strength(0.1),
    )
    .force("charge", d3.forceManyBody())
    .force(
      "collision",
      d3.forceCollide((d) => (d.parent == null ? bigSize : smallSize) + 20),
    )
    .force("x", d3.forceX())
    .force("y", d3.forceY());

  const link = svg
    .append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0)
    .selectAll("line")
    .data(links)
    .join("line");
  const visNodes = svg.append("g").selectAll("g").data(nodesToDraw).join("g");

  visNodes.each(function (d) {
    const currentNode = d3.select(this);
    const isLink = d.data.name.includes("https");
    const currentContainer = isLink
      ? currentNode
          .append("a")
          .attr("href", d.data.name)
          .attr("target", "_blank")
      : currentNode;

    currentContainer
      .append("polygon")
      .attr("points", (d) =>
        getOctagonPoints(d == focusNode ? bigSize : smallSize),
      )
      .attr("stroke", "#cca646")
      .attr("stroke-width", 4)
      .attr("fill", "#68aac6");

    currentContainer
      .append("text")
      .text((d) => {
        let toReturn = d.data.name;
        if (isLink) {
          if (toReturn.includes("www")) {
            toReturn = toReturn.substring(12);
          } else {
            toReturn = toReturn.substring(8);
          }
          const endOfName = toReturn.indexOf(".");
          toReturn = toReturn.substring(0, endOfName);
        }
        return toReturn;
      })
      .attr("text-anchor", "middle")
      .attr("fill", "#031016")
      .style("font-size", (d) => {
        if (d == focusNode) {
          return bigFont;
        } else if (isLink) {
          return smallestFont;
        } else {
          return smallFont;
        }
      });
  });

  simulation.on("tick", () => {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    visNodes.attr("transform", (d) => `translate(${d.x},${d.y})`);
  });

  visNodes.on("click", onNodeClick);
}

function onNodeClick(d) {
  const targetNode = this.__data__;
  var nextFocus = targetNode;
  if (targetNode.children != null) {
    if (targetNode.childrenCollapsed) {
      //already collapsed, switching this to be focus
      targetNode.children.forEach((child) => {
        child.hidden = false;
      });
      targetNode.childrenCollapsed = false;
      //hide siblings
      if (targetNode != root) {
        targetNode.parent.children.forEach((child) => {
          if (child != targetNode) {
            child.hidden = true;
          }
        });
      }
    } else {
      //targetNode USUALLY no longer focus
      targetNode.children.forEach((child) => {
        child.hidden = true;
      });
      targetNode.childrenCollapsed = true;
      //show siblings
      if (targetNode != root) {
        nextFocus = targetNode.parent;
        targetNode.parent.children.forEach((child) => {
          if (child != targetNode) {
            child.hidden = false;
          }
        });
      }
    }
    update(nextFocus);
  } else {
    console.log("nothing to expand :(");
  }
}
