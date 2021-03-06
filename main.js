function main() {
    // Checks if browser is supported
    if (!mxClient.isBrowserSupported())  {
        // Displays an error message if the browser is
        // not supported.
        mxUtils.error('Browser is not supported!', 200, false);
    } else {
        mxVertexHandler.prototype.rotationEnabled = true;

        let tbContainer = document.getElementById('palette-zone');

        // Creates new toolbar without event processing
        let toolbar = new mxToolbar(tbContainer);
        toolbar.enabled = false;

        let container = document.getElementById('myDiagramDiv');

        // Workaround for Internet Explorer ignoring certain styles
        if (mxClient.IS_QUIRKS)  {
            document.body.style.overflow = 'hidden';
            new mxDivResizer(tbContainer);
            new mxDivResizer(container);
        }

        // Creates the model and the graph inside the container
        // using the fastest rendering available on the browser
        let model = new mxGraphModel();
        let graph = new mxGraph(container, model);

        // Enables new connections in the graph
        graph.setConnectable(true);
        graph.setMultigraph(true);

        // Stops editing on enter or escape keypress
        let keyHandler = new mxKeyHandler(graph);
        let rubberband = new mxRubberband(graph);

        // Setting the default style of vertexes
        let style = graph.getStylesheet().getDefaultVertexStyle();
        style[mxConstants.STYLE_SHAPE] = 'label';
        style[mxConstants.STYLE_FILLCOLOR] = 'white';
        style[mxConstants.STYLE_STROKECOLOR] = 'black';
        style[mxConstants.STYLE_STROKEWIDTH] = 1;
        style[mxConstants.STYLE_FONTCOLOR] = 'black';
        style[mxConstants.STYLE_FONTFAMILY] = 'arial';
        style[mxConstants.STYLE_FONTSIZE] = 20;

        // Setting the default style of edges
        let style1 = graph.getStylesheet().getDefaultEdgeStyle();
        style1[mxConstants.STYLE_FILLCOLOR] = 'black';
        style1[mxConstants.STYLE_STROKECOLOR] = 'black';
        style1[mxConstants.STYLE_STROKEWIDTH] = 5;

        // Enabling alignment relating to another primitives
        mxGraphHandler.prototype.guidesEnabled = true;

        let addVertex = function(icon, w, h, style)  {
            let vertex = new mxCell(null, new mxGeometry(0, 0, w, h), style);
            vertex.setVertex(true);

            let img = addToolbarItem(graph, toolbar, vertex, icon);
            img.enabled = true;

            graph.getSelectionModel().addListener(mxEvent.CHANGE, function() {
                let tmp = graph.isSelectionEmpty();
                mxUtils.setOpacity(img, (tmp) ? 100 : 20);
                img.enabled = tmp;
            });
        };

        let addEdge = function(icon, w, h, style)  {
            let edge = new mxCell(null, new mxGeometry(0, 0, w, h), style);
            edge.setEdge(true);
            edge.setStyle(style);

            let img1 = addToolbarItem(graph, toolbar, edge, icon);
            img1.enabled = true;

            graph.getSelectionModel().addListener(mxEvent.CHANGE, function() {
                let tmp = graph.isSelectionEmpty();
                mxUtils.setOpacity(img1, (tmp) ? 100 : 20);
                img1.enabled = tmp;
            });
        };

        addVertex('pictures1/rect.svg', 80, 50, '');
        addVertex('pictures1/text.svg', 80, 50, 'text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;');
        addVertex('pictures1/square.svg', 50, 50, 'whiteSpace=wrap;html=1;aspect=fixed;');
        addVertex('pictures1/circ.svg', 50, 50, 'shape=ellipse;whiteSpace=wrap;html=1;aspect=fixed;perimeter=ellipsePerimeter');
        addVertex('pictures1/round_rect.svg', 80, 50, 'rounded=1;whiteSpace=wrap;html=1;');
        addVertex('pictures1/ellipse.svg', 80, 50, 'shape=ellipse;perimeter=ellipsePerimeter');
        addVertex('pictures1/parell.svg', 80, 50, 'shape=hexagon;perimeter=hexagonPerimeter2;whiteSpace=wrap;html=1;');
        addVertex('pictures1/diamond.svg', 80, 50, 'shape=rhombus;perimeter=rhombusPerimeter');
        addVertex('pictures1/triangle.svg', 80, 50, 'shape=triangle;perimeter=trianglePerimeter');

        addEdge('pictures1/line.svg', 80, 50, 'curved=1;endArrow=none;html=1;strokeWidth=2');
        addEdge('pictures1/right_arrow.svg', 80, 50, 'curved=1;endArrow=classic;html=1;');
        addEdge('pictures1/bi_arrow.svg', 80, 50, 'curved=1;endArrow=classic;startArrow=classic;html=1;');

        // Setting undo and redo functions
        let undoManager = new mxUndoManager();
        let listener = function(sender, event) {
            undoManager.undoableEditHappened(event.getProperty('edit'));
        };
        graph.getModel().addListener(mxEvent.UNDO, listener);
        graph.getView().addListener(mxEvent.UNDO, listener);
        tbContainer.appendChild(mxUtils.button('Undo', function() {
            undoManager.undo();
        }));
        tbContainer.appendChild(mxUtils.button('Redo', function() {
            undoManager.redo();
        }));

        window.onkeyup = function(event) {
            if (event.keyCode === 90) { // Checking that pressing ctrl+z has happened indeed
                undoManager.undo(); // Undo an operation
            }
            event = event || window.event;
            let key = event.which || event.keyCode; // keyCode detection
            let ctrl = event.ctrlKey ? event.ctrlKey : ((key === 17) ? true : false); // ctrl detection

            if (key == 86 && ctrl) {
                mxClipboard.paste(graph);
            } else if (key == 67 && ctrl) {
                mxClipboard.copy(graph);
            }
        }

        // Setting the functions for deleting elements
        keyHandler.bindKey(46, function(evt) {
            if (graph.isEnabled()) {
                graph.removeCells();
            }
        });
        tbContainer.appendChild(mxUtils.button('Delete node', function(event) {
            if (graph.isEnabled()) {
                graph.removeCells();
            }
        }));

        // Setting functions for saving elements
        let encoder = new mxCodec();
        tbContainer.appendChild(mxUtils.button('Save', function() {
            let result = encoder.encode(graph.getModel());
            let xml = mxUtils.getXml(result);
            console.log(xml);
        }));

        tbContainer.appendChild(mxUtils.button('Read', function() {
            let xmlString = '<mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/><mxCell id="2" style="" vertex="1" parent="1"><mxGeometry x="430" y="200" width="80" height="50" as="geometry"/></mxCell><mxCell id="3" style="whiteSpace=wrap;html=1;aspect=fixed;" vertex="1" parent="1"><mxGeometry x="440" y="350" width="50" height="50" as="geometry"/></mxCell><mxCell id="4" edge="1" parent="1" source="2" target="3"><mxGeometry relative="1" as="geometry"/></mxCell></root></mxGraphModel>\n';
            let doc = mxUtils.parseXml(xmlString);
            let codec = new mxCodec(doc);
            codec.decode(doc.documentElement, graph.getModel());
        }));
    }
}

function addToolbarItem(graph, toolbar, prototype, image)  {
    // Function that is executed when the image is dropped on
    // the graph. The cell argument points to the cell under
    // the mousepointer if there is one.
    let funct = function(graph, evt, cell, x, y) {
        graph.stopEditing(false);

        let curCell = graph.getModel().cloneCell(prototype);
        if(prototype.isVertex()) {
            curCell.geometry.x = x;
            curCell.geometry.y = y;
        }
        else {
            curCell.geometry.setTerminalPoint(new mxPoint(x, y), true);
            curCell.geometry.setTerminalPoint(new mxPoint(x+80, y), false);
        }

        graph.addCell(curCell);
        graph.setSelectionCell(curCell);
    }

    // Creates the image which is used as the drag icon (preview)
    let img = toolbar.addMode(null, image, function(evt, cell)  {
        let pt = this.graph.getPointForEvent(evt);
        funct(graph, evt, cell, pt.x, pt.y);
    });

    // Disables dragging if element is disabled. This is a workaround
    // for wrong event order in IE. Following is a dummy listener that
    // is invoked as the last listener in IE.
    mxEvent.addListener(img, 'mousedown', function(evt) {
        // do nothing
    });

    // This listener is always called first before any other listener
    // in all browsers.
    mxEvent.addListener(img, 'mousedown', function(evt) {
        if (img.enabled == false) {
            mxEvent.consume(evt);
        }
    });

    // Creating the element which is going to be showed while dragging
    let dragElt = document.createElement('div');
    dragElt.style.border = 'dashed black 1px';
    dragElt.style.width = '80px';
    dragElt.style.height = '50px';

    mxUtils.makeDraggable(img, graph, funct, dragElt, null, null, graph.autoscroll, true);

    return img;
}
