
const width = 1500;
const height = 3000;
const maxTextWidth = 250; // Change this value to adjust the maximum width of the text
const fontSize = 14;
const fontFamily = 'stellar-sans';


// add ready function

$(document).ready(function(){



const icon = document.createElement('img');
icon.src = 'https://cdn-icons-png.flaticon.com/512/5230/5230593.png';
icon.style.position = 'fixed';
icon.style.top = '10px';
icon.style.right = '10px';
icon.style.width = '50px';
icon.style.height = '50px';
icon.style.cursor = 'pointer';
icon.style.zIndex = 10000;
document.body.appendChild(icon);

// Function to generate the mindmap
function generateMindmap() {
  console.log("Generating MindMap");
  let codeBlocks = document.querySelectorAll('.language-vbnet, .language-css, .language-markdown, .language-sql');

  // if (!codeBlocks) {

  // }

  if (!codeBlocks) return;

  const codeBlock = codeBlocks[codeBlocks.length - 1];

  console.log("Found codeBlock", codeBlock);
  const textContent = codeBlock.textContent;

  console.log("Text Content")
  console.log(textContent);

  // Parse the code block and generate the mindmap
  const mindmapData = parseOutline(textContent);
  const mindmapDiv = createMindmapDiv(mindmapData);

  // Append the mindmap div below the code block

  console.log("Appending", mindmapDiv, codeBlock.nextElementSibling)
  codeBlock.parentElement.insertBefore(mindmapDiv, codeBlock.nextElementSibling);


  // Create the mindmap
  createMindmap(mindmapData, mindmapDiv);
}

// Trigger the mindmap generation when the icon is clicked
icon.addEventListener('click', generateMindmap);

function parseOutline(text) {
  validateInput(text);

  const lines = text.trim().split('\n');
  const rootNode = { title: null, children: [], depth: 0, parent: null, id: 0, level: 0 };
  const nodeStack = [];

  let currentParent = rootNode;
  let lastNode = rootNode;
  let indentConstant = 0;
  let indentIncrement = 0;




  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const indent = findIndent(line);
    const newText = line.trim();



    if (i == 0) {
      rootNode.title = newText;
      rootNode.width = getWrappedTextWidth(newText);
      rootNode.height = getTextHeight(newText, fontSize, fontFamily, maxTextWidth);
      nodeStack.push(rootNode);
      currentParent = rootNode;
      indentConstant = indent;

      continue;
    }

    if (i == 1) {
      indentIncrement = indent - indentConstant;
    }






    const nodeDepth = indent - indentConstant;
    console.log(nodeDepth);

    const height = getTextHeight(newText, fontSize, fontFamily, maxTextWidth);
    const width = getWrappedTextWidth(newText, maxTextWidth, fontSize, fontFamily);


    const newNode =
    {
      title: newText,
      children: [],
      depth: nodeDepth,
      parent: currentParent,
      id: i + 1,
      height: height,
      width: width
    };



    // If the depth is greater, then set the current parent to the last node

    console.log("Node Depth at", nodeDepth);
    console.log("Parent Depth at", currentParent.depth);

    if (lastNode.depth < nodeDepth) {
      currentParent = lastNode;
    }

    // if the nodedepth is less (meaning) that we are going up.
    else if (lastNode.depth == nodeDepth) {


    }

    else {
      while (currentParent.parent.depth >= nodeDepth - indentIncrement && currentParent.depth != 0) {


        currentParent = currentParent.parent;
        if (currentParent.parent == null) {
          break;
        }
      }
      console.log("Setting parent to", currentParent.title);
      console.log("Current Text Is", newText);
      console.log("Node Depth at", nodeDepth);
    }

    // when you are at the right depth



    newNode.parent = currentParent;
    newNode.level = currentParent.level + 1;


    currentParent.children.push(newNode);
    console.log("Pushing", newNode, "to", currentParent.children[0].title);

    console.log("=================");
    console.log("Printing Map @ line " + i);
    console.log(rootNode.title);
    printMap(rootNode);
    console.log("=================");
    lastNode = newNode;



  }

  return validateAndReturnOutput(rootNode);
}

function printMap(rootNode) {

  for (let i = 0; i < rootNode.children.length; i++) {
    // add spaces based on depth
    const spaces = " ".repeat(rootNode.children[i].depth * 4);
    console.log(spaces + rootNode.children[i].title);
    printMap(rootNode.children[i]);
  }
}

function validateInput(text) {
  if (!text || typeof text !== 'string') {
    throw new Error('Invalid mind map input');
  }
}

function findIndent(line) {
  return line.search(/\S/);
}

function getCurrentParent(nodeStack, indent) {
  return nodeStack[indent] || null;
}

function addChildToParent(parent, child) {
  parent.children.push(child);
}

function updateNodeStack(nodeStack, newNode, indent) {
  nodeStack[indent + 1] = newNode;
  if (nodeStack.length > indent + 2) {
    nodeStack.length = indent + 2;
  }
}

function validateAndReturnOutput(rootNode) {
  if (rootNode.children.length === 0) {
    throw new Error('Invalid mind map input');
  } else {
    return rootNode;
  }
}






// Function to create the mindmap div
function createMindmapDiv(data) {
  const mindmapDiv = document.createElement('div');
  //generate random id
  mindmapDiv.id = 'mindmap' + Math.floor(Math.random() * 1000000);
  mindmapDiv.style.width = '100%';
  mindmapDiv.style.height = '100%';
  mindmapDiv.style.marginTop = '20px';
  mindmapDiv.style.marginBottom = '20px';
  mindmapDiv.style.border = '1px solid #ccc';
  mindmapDiv.style.borderRadius = '5px';
  mindmapDiv.style.padding = '10px';
  mindmapDiv.style.boxSizing = 'border-box';



  return mindmapDiv;
}



// Function to create the mindmap
function createMindmap(data, mindmapDiv) {

console.log("Creating Mindmap", data)


const id = mindmapDiv.id;




function updateDepth(node, depth = 0) {
  node.depth = depth;
  if (node.children) {
    node.children.forEach((child) => updateDepth(child, depth + 1));
  }
}

const root = d3.hierarchy(data);
const treeLayout = d3.tree().nodeSize([60, maxTextWidth]);

updateDepth(root);





// const nodeSizes = calculateNodeSizes(root);


// treeLayout.separation(customSeparation)

// treeLayout.size([1000, 1000])


function customSeparation(a, b) {
  const aSize = a.data;
  const bSize = b.data;
  const separation = (aSize.height + bSize.height) / 2; // You can adjust the value '20' to set the desired separation
  return 63;
}


treeLayout(root);

addOffsetToNodes(root);



function addOffsetToNodes(treeData) {
  treeData.each(node => {
    node.x += 1500;
    const yOffset = (200 * (node.data.level + 1));
    node.y = node.y + yOffset > 0 ? yOffset : 0;

  });
}



const svg = d3
  .select("#" + id)
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .style('background', "#6767ae");

const linksGroup = svg.append('g');
const nodesGroup = svg.append('g');

const padding = 50;



const nodes = nodesGroup.selectAll('g').data(root.descendants()).enter().append('g');
nodes.attr('transform', (d) => `translate(${d.y},${d.x})`);




nodes
  .append('rect')
  .attr('width',
    (d, i) => {
      return d.data.width + 60
  })

  .attr('height', (d, i) => {
    return d.data.height + 10
  })
  .attr('rx', 10)
  .attr('ry', 10)
  .attr('x', 0) //(d, i) => -(getWrappedTextWidth(textElements.filter((_, j) => i === j), maxTextWidth, fontSize, fontFamily) + 30))
  .attr('y', 0)
  .attr('fill', '#fff')
  .attr('stroke', '#323335')
  .attr('stroke-width', 4);

  const newTextElements = nodes
    .append('text')
    .attr('font-family', fontFamily)
    .attr('font-size', fontSize)
    .attr('x', 0)
    .attr('y', 0)
    .attr("opacity", 1)
    .attr('text-anchor', 'start')
    .text((d) => d.data.title);


  newTextElements.each(function (d, i) {
  const textElement = d3.select(this);
  textElement
    .attr('x', 10)
    .attr('y', 30)
    .attr('dy', '0.35em')
    .attr('dx', '0.35em');

    // nodes.append(textElement);
})
.call(wrap, maxTextWidth);


const links = linksGroup.selectAll('path').data(root.links()).enter().append('path');
const maxLength = 999; // Set the maximum link length here

links
  .attr('d', (d, i) => {
    const sourceNodeWidth = d.source.data.width + 10;
    const targetNodeWidth = d.target.data.width + 10;
    const sourceNodeHeight = d.source.data.height;
    const targetNodeHeight = d.target.data.height;

    const originalLength = d.target.y - d.source.y - sourceNodeHeight;
    const limitedLength = limitLinkLength(originalLength, maxLength);

    const midY = (d.source.y + sourceNodeHeight + d.source.y + sourceNodeHeight + limitedLength) / 2;
    const sourceX = d.source.x + sourceNodeHeight / 2;
    const targetX = d.target.x + targetNodeHeight / 2;

    return `M${d.source.y + sourceNodeHeight},${sourceX} L${midY},${sourceX} L${midY},${targetX} L${d.source.y + sourceNodeHeight + limitedLength},${targetX}`;
  })
  .attr('stroke', '#323335')
  .attr('fill', 'none')
  .attr('stroke-width', 4);





function calculateNodeSizes(data) {
  const nodeSizes = [];

  function traverseNode(node) {
    const nodeWidth = getWrappedTextWidth(node.data.title, maxTextWidth, fontSize, fontFamily) + 60;
    const nodeHeight = getTextHeight(node.data.title, fontSize, fontFamily, maxTextWidth) + 10;

    nodeSizes.push({ width: nodeWidth, height: nodeHeight });

    if (node.children) {
      node.children.forEach(traverseNode);
    }
  }

  traverseNode(data);

  return nodeSizes;
}



function getTextWidth(text, fontSize, fontFamily) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context.font = `${fontSize}px ${fontFamily}`;
  const metrics = context.measureText(text);
  // if (metrics.width < 30) {
  //   return 30;
  // }
  return metrics.width + 5;
}




function wrap(text, width) {
  text.each(function () {
    let text = d3.select(this),
      words = text.text().split(/\s+/).reverse(),
      word,
      line = [],
      lineNumber = 0,
      lineHeight = 1.1, // ems
      x = text.attr("x"),
      y = text.attr("y"),
      dy = 0, // Store the initial dy value as a float
      dx = parseFloat(text.attr("dx")) || 0, // Convert the initial dx value to a float
      tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em").attr("dx", dx + "em");

    // debugger;

    while ((word = words.pop())) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        lineNumber += 1;
        tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", lineHeight * lineNumber + "em").attr("dx", dx + "em").text(word);
      }
    }
  });
}

function limitLinkLength(length, maxLength) {
  return length > maxLength ? maxLength : length;
}


// function wrap(text, width) {
//   text.each(function () {
//     let text = d3.select(this),
//       words = text.text().split(/\s+/).reverse(),
//       word,
//       line = [],
//       lineNumber = 0,
//       lineHeight = 1.1, // ems
//       x = text.attr("x"),
//       y = text.attr("y"),
//       dy = 0, // Set the initial dy value to 0
//       tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "px"); // Set the initial dy value to 0 pixels

//     let i = 0;
//     while ((word = words.pop())) {
//       line.push(word);
//       tspan.text(line.join(" "));
//       if (tspan.node().getComputedTextLength() > width) {
//         line.pop();
//         tspan.text(line.join(" "));
//         line = [word];
//         const tspan_dy = i == 0 ? 0 : ++lineNumber * lineHeight + "em";
//         tspan = text.append("tspan").attr("x", text.attr("x")).attr("y", text.attr("y")).attr("dy", tspan_dy).text(word);
//         i++;
//       }
//     }
//     // Adjust the dy attribute of the tspan to align the text vertically in the middle
//     const textHeight = getTextHeight(text.text(), parseInt(text.attr("font-size")), text.attr("font-family"), width);
//     const fontSize = parseInt(text.attr("font-size")); // Get the font size of the text element
//     dy = (textHeight / 2) - (lineNumber * lineHeight * 16) / 2; // Convert the dy value from ems to pixels
//     text.selectAll("tspan").attr("dy", "" + dy + "px"); // Set the dy value in pixels
//   });
// }




}







function getWrappedTextWidth(text, width, fontSize, fontFamily) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context.font = `${fontSize}px ${fontFamily}`;

  const words = text.split(/\s+/);
  let line = [];
  let maxWidth = 0;

  for (const word of words) {
    line.push(word);
    const lineWidth = context.measureText(line.join(' ')).width;
    const prevLineWidth = context.measureText(line.join(' ')).width;
    maxWidth = Math.max(maxWidth, prevLineWidth);

    if (lineWidth >= width) {
      return width
      // line.pop();

      // line = [word];
    }
  }

  // const lastLineWidth = context.measureText(line.join(' ')).width;
  // maxWidth = Math.max(maxWidth, lastLineWidth);


  return maxWidth;
}


function getTextHeight(text, fontSize, fontFamily, maxWidth) {
  const container = document.createElement('div');
  // container.style.position = 'absolute';
  // container.style.top = '-1000px';
  // container.style.left = '-1000px';
  container.style.width = `${maxWidth}px`;
  container.style.fontSize = `${fontSize}px`;
  container.style.fontFamily = fontFamily;
  container.style.lineHeight = '1.2';
  container.style.padding = '0';
  container.style.margin = '0';
  container.innerHTML = text;
  document.body.appendChild(container);
  const height = container.getBoundingClientRect().height + 20;
  document.body.removeChild(container);
  return height;
}







});

