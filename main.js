function main() {
    // Checks if browser is supported
    if (!mxClient.isBrowserSupported())  {
        // Displays an error message if the browser is
        // not supported.
        mxUtils.error('Browser is not supported!', 200, false);
    } else {
        // Defines an icon for creating new connections in the connection handler.
        // This will automatically disable the highlighting of the source vertex.
        mxConnectionHandler.prototype.connectImage = new mxImage('mxgraph-4.0.6/javascript/src/images/connector.gif', 16, 16);

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
        graph.setMultigraph(false);

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

        addVertex('pictures1/rect.svg', 80, 50, '');
        addVertex('pictures1/round_rect.svg', 80, 50, 'shape=rounded');
        addVertex('pictures1/ellipse.svg', 80, 50, 'shape=ellipse');
        addVertex('pictures1/diamond.svg', 80, 50, 'shape=rhombus');
        addVertex('pictures1/triangle.svg', 80, 50, 'shape=triangle');
    }
}

function addToolbarItem(graph, toolbar, prototype, image)  {
    // Function that is executed when the image is dropped on
    // the graph. The cell argument points to the cell under
    // the mousepointer if there is one.
    let funct = function(graph, evt, cell, x, y) {
        graph.stopEditing(false);

        let vertex = graph.getModel().cloneCell(prototype);
        vertex.geometry.x = x;
        vertex.geometry.y = y;

        graph.addCell(vertex);
        graph.setSelectionCell(vertex);
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

/*
Нужно сделать:
1. Удаление выделенного элемента по нажатию на клавишу delete
2. Откат одной операции по нажатию на кнопку undo или по ctrl+Z
3. Нормальный drag & drop (чтобы при перенесении можно было сразу выравнивать) - сделано
4. Позиционирование начала стрелки по контуру фигуры
5. Научиться вставлять круг и квадрат
6. Вставлять стрелку (связь) из меню примитивов
 */
