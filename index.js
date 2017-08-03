/**
 * Created by zhangyou04 on 2017/8/3.
 */
// Create a new directed graph
var g = new dagre.graphlib.Graph();

// Set an object for the graph label
g.setGraph({});

// Default to assigning a new object as a label for each new edge.
g.setDefaultEdgeLabel(function() { return {}; });

// Add nodes to the graph. The first argument is the node id. The second is
// metadata about the node. In this case we're going to add labels to each of
// our nodes.

g.setNode("start", { name: "start",  width: 144, height: 100 });
g.setNode("end", { name: "end",  width: 144, height: 100 });

g.setNode("kspacey",    { name: "kspacey",  width: 144, height: 100 });
g.setNode("swilliams",  { name: "swilliams", width: 160, height: 100 });
g.setNode("bpitt",      { name: "bpitt",     width: 108, height: 100 });
g.setNode("hford",      { name: "hford", width: 168, height: 100 });
g.setNode("lwilson",    { name: "lwilson",   width: 144, height: 100 });
g.setNode("kbacon",     { name: "kbacon",   width: 121, height: 100 });
g.setNode("kspacey1",    { name: "kspacey1",  width: 144, height: 100 });
g.setNode("swilliams1",  { name: "swilliams1", width: 160, height: 100 });
g.setNode("bpitt1",      { name: "bpitt1",     width: 108, height: 100 });
g.setNode("hford1",      { name: "hford1", width: 168, height: 100 });
g.setNode("lwilson1",    { name: "lwilson1",   width: 144, height: 100 });
g.setNode("kbacon1",     { name: "kbacon1",   width: 121, height: 100 });

// Add edges to the graph.
g.setEdge("kspacey",   "swilliams");
g.setEdge("swilliams", "kbacon");
g.setEdge("bpitt",     "kbacon");
g.setEdge("hford",     "lwilson");
g.setEdge("lwilson",   "kbacon");
g.setEdge("kspacey1",   "swilliams1");
g.setEdge("swilliams1", "kbacon1");
g.setEdge("bpitt1",     "kbacon1");
g.setEdge("hford1",     "lwilson1");
g.setEdge("lwilson1",   "kbacon1");

g.setEdge("kspacey1",   "swilliams");
g.setEdge("swilliams1", "kbacon");
g.setEdge("bpitt1",     "kbacon");
g.setEdge("hford1",     "lwilson");
g.setEdge("lwilson1",   "kbacon");

g.setEdge("swilliams", "kspacey1");
g.setEdge("kbacon", "swilliams1");
g.setEdge("kbacon", "bpitt1");
g.setEdge("lwilson", "hford1");
g.setEdge("kbacon", "lwilson1");

g.setEdge("start", "kspacey");
g.setEdge("hford1", "end");



var width = window.innerWidth / 2 - 10;
var height = window.innerHeight;
dagre.layout(g, {
    height: height,
    width: width
});

var graphData = {
    nodes: [],
    edges: []
};

g.nodes().forEach(function(v) {
    console.log("Node " + v + ": " + JSON.stringify(g.node(v)));
    graphData.nodes.push(g.node(v));
});
g.edges().forEach(function(e) {
    //(p1[0] + p2[0]) / 2 - (p1[1] - p2[1]) * curveness,
    //(p1[1] + p2[1]) / 2 - (p2[0] - p1[0]) * curveness

    console.log("Edge " + e.v + " -> " + e.w + ": " + JSON.stringify(g.edge(e)));
    var points = g.edge(e).points;
    var curveness = 0.3 || ((points[0].x + points[1].x) / 2 - points[2].x) / (points[0].x - points[1].x);

    //poits[2].x = (poits[0].x + poits[1].x) / 2 - (poits[0].x - poits[1].x) * curveness
    //graphData.edges.push(g.edge(e));
    graphData.edges.push({
        source: e.v,
        target: e.w,
        lineStyle: {
            normal: {
                curveness: curveness
            }
        }
    });
});

var chartEl = document.getElementById('directed-graph');
chartEl.style.height = height + 'px';
chartEl.style.width = width + 'px';
var option = {
    title: {
        text: 'Graph 简单示例'
    },
    tooltip: {},
    animationDurationUpdate: 1500,
    animationEasingUpdate: 'quinticInOut',
    series: [
        {
            type: 'graph',
            layout: 'none',
            symbolSize: 50,
            roam: true,
            label: {
                normal: {
                    show: true
                },
            },
            edgeSymbol: ['circle', 'arrow'],
            edgeSymbolSize: [4, 10],
            edgeLabel: {
                normal: {
                    textStyle: {
                        fontSize: 20
                    }
                }
            },
            data: graphData.nodes,
            links: graphData.edges
        }
    ]
};

echarts.init(chartEl).setOption(option);

var chartEl = document.getElementById('directed-graph2');
chartEl.style.height = height + 'px';
chartEl.style.width = width + 'px';
echarts.init(chartEl).setOption(option);
//document.getElementById('data').innerHTML = JSON.stringify(graphData, null, 4);