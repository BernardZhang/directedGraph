/**
 * Created by zhangyou04 on 2017/8/8.
 */



var nodes = window.clustersData.nodes;
var edges = window.clustersData.edges;

var nodes = window.ANodeData.nodes;
var edges = window.ANodeData.edges;


draw(nodes, edges);




function draw(nodes, edges) {
    // Create the input graph
    var g = new dagreD3.graphlib.Graph({compound:true}).setGraph({
        nodesep: 60,
        ranksep: 50,
        rankdir: "TB",
        //      align: "UL",
        ranker: 'network-simplex',
        //      acyclicer: 'greedy',
        marginx: 0,
        marginy: 0
    })
        .setDefaultEdgeLabel(function() { return {}; });

    var groupMap = {};
    // Here we're setting the nodes
    for (var i = 0; i < nodes.length; i++) {
        g.setNode(nodes[i].id, {label: nodes[i].name, weight: nodes[i].weight});
        if (nodes[i].group) {
            if (!groupMap[nodes[i].group]) {
                groupMap[nodes[i].group] = {
                    id: nodes[i].group,
                    label: nodes[i].group,
                    clusterLabelPos: 'top',
                    style: 'fill: yellow'
                };
                g.setNode(nodes[i].group, groupMap[nodes[i].group]);
            }
            g.setParent(nodes[i].id, nodes[i].group);
        }
    }

    // Set up edges, no special attributes.
    for (var i = 0; i < edges.length; i++) {
        g.setEdge(
            edges[i].source,
            edges[i].target,
            {
                label: edges[i].source + ' -> ' + edges[i].target + ':' + (edges[i].weight || 1),
                weight: edges[i].weight || 1
            }
        );
    }

    g.nodes().forEach(function(v) {
        var node = g.node(v);
        // Round the corners of the nodes
        node.rx = node.ry = 5;
    });


    // Create the renderer
    var render = new dagreD3.render();

    // Set up an SVG group so that we can translate the final graph.
    var svg = d3.select('svg');
    svg.empty();
    var svgGroup = svg.append('g');

    // Run the renderer. This is what draws the final graph.
    render(d3.select('svg g'), g);


    // Simple function to style the tooltip for the given node.
    var styleTooltip = function(name, description) {
        return "<p class='name'>" + name + "</p><p class='description'>" + description + "</p>";
    };


    // events handle
    svgGroup.selectAll('g.node')
        .attr("title", function(v) { return styleTooltip(v, g.node(v).label) })
        .each(function(v) { $(this).tipsy({ gravity: "w", opacity: 1, html: true }); });

    svgGroup.selectAll('g.node').on('mouseover', function (nodeId, param1, param2, param3) {
        var node = g.node(nodeId);
        $(node.elem).attr('class', 'node node-hover');
        var edgeEl;
        edges.forEach(function (edge) {
            if (edge.source === nodeId) {
                edgeEl = g.edge(edge.source, edge.target).elem;
            }
            if (edge.target === nodeId) {
                edgeEl = g.edge(edge.source, edge.target).elem;
            }
            if (edgeEl) {
                $(edgeEl).attr('class', 'edgePath edge-active');
            }
        });
    })
        .on('mouseout', function (nodeId) {
            var node = g.node(nodeId);
            $(node.elem).attr('class', 'node');
            var edgeEl;
            edges.forEach(function (edge) {
                if (edge.source === nodeId) {
                    edgeEl = g.edge(edge.source, edge.target).elem;
                }
                if (edge.target === nodeId) {
                    edgeEl = g.edge(edge.source, edge.target).elem;
                }
                if (edgeEl) {
                    $(edgeEl).attr('class', 'edgePath');
                }
            });
        })
        .on('click', function (nodeId) {
            var graphData = window[nodeId + 'NodeData'] || window.ANodeData;
            debugger;
            draw(graphData.nodes, graphData.edges);
        });

    //alert(g.width());



    // Center the graph

    svg.attr("height", g.graph().height + 40);
    svg.attr('width', g.graph().width + 40);

    var xCenterOffset = (svg.attr("width") - g.graph().width) / 2;
    svgGroup.attr("transform", "translate(" + xCenterOffset + ", 20)");
}
