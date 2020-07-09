const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

var toolbar = document.getElementById('toolbar');
var content = document.getElementById('content');
var schema = document.getElementById('schema');
var propertyViewer = document.getElementById('propertyViewer');
var analyserViewer = document.getElementById('analyser');
var analyserCount = 0;

var audioNodePropertyDefinitions = {
    context: {
        writable: false,
        typehint: "BaseAudioContext"
    },
    numberOfInputs: {
        writable: false,
        typehint: "int"
    },
    numberOfOutputs: {
        writable: false,
        typehint: "int"
    },
    channelCount: {
        writable: true,
        typehint: "int"
    },
    channelCountMode: {
        writable: true,
        typehint: "enum",
        enabledValues: ["max", "clamped-max", "explicit"]
    },
    channelInterpretation: {
        writable: true,
        typehint: "enum",
        enabledValues: ["speakers", "discrete"]
    }
};

var audioScheduledSourcePropertyDefinitions = Object.assign({}, audioNodePropertyDefinitions);

var audioScheduledSourceMethods = ['start', 'stop'];

const data = {
    "AnalyserNode": {
        createInstance: () => {
            analyserCount++;
            animateOnce();
            var analyser = audioContext.createAnalyser();

            analyser.destroy = () => {
                analyserCount--;
            }

            return analyser;
        },
        propertyDefinitions: Object.assign({}, audioNodePropertyDefinitions, {
            fftSize: {
                writable: true,
                typehint: "unsigned long"
            },
            frequencyBinCount: {
                writable: false,
                typehint: "unsigned long"
            },
            minDecibels: {
                writable: true,
                typehint: "double"
            },
            smoothingTimeConstant: {
                writable: true,
                typehint: "double"
            },
        })
    },
    "AudioBufferSourceNode": {
        createInstance: () => {
            return audioContext.createBufferSource();
        },
        propertyDefinitions: Object.assign({}, audioScheduledSourcePropertyDefinitions, {
            buffer: {
                writable: true,
                typehint: "AudioBuffer"
            },
            detune: {
                writable: true,
                typehint: "k-rate AudioParam"
            },
            loop: {
                writable: true,
                typehint: "boolean"
            },
            loopStart: {
                writable: true,
                typehint: "float"
            },
            loopEnd: {
                writable: true,
                typehint: "float"
            },
            playBackRate: {
                writable: true,
                typehint: "a-rate AudioParam"
            }
        }),
        methods: audioScheduledSourceMethods.concat([])
    },
    "AudioDestinationNode": {
        createInstance: () => {
            return audioContext.destination;
        },
        propertyDefinitions: Object.assign({}, audioNodePropertyDefinitions, {
            maxChannelCount: {
                writable: true,
                typehint: "unsigned long"
            }
        })
    },
    /*
    "AudioWorkletNode": {
        createInstance: () => {
            return audioContext.createScriptProcessor();
        },
        propertyDefinitions: Object.assign({}, audioNodePropertyDefinitions, {

        })
    },
    */
    "BiquadFilterNode": {
        createInstance: () => {
            return audioContext.createBiquadFilter();
        },
        propertyDefinitions: Object.assign({}, audioNodePropertyDefinitions, {
            frequency: {
                writable: false,
                typehint: "a-rate AudioParam"
            },
            detune: {
                writable: false,
                typehint: "a-rate AudioParam"
            },
            Q: {
                writable: false,
                typehint: "a-rate AudioParam"
            },
            gain: {
                writable: false,
                typehint: "a-rate AudioParam"
            },
            type: {
                writable: true,
                typehint: "enum",
                enabledValues: ["lowpass","highpass","bandpass","lowshelf","highshelf","peaking","notch","allpass"]
            }
        })
    },
    "ChannelMergerNode": {
        createInstance: () => {
            return audioContext.createChannelMerger()
        },
        propertyDefinitions: Object.assign({}, audioNodePropertyDefinitions)
    },
    "ChannelSplitterNode": {
        createInstance: () => {
            return audioContext.createChannelSplitter();
        },
        propertyDefinitions: Object.assign({}, audioNodePropertyDefinitions)
    },
    "ConstantSourceNode": {
        createInstance: () => {
            return audioContext.createConstantSource()
        },
        propertyDefinitions: Object.assign({}, audioScheduledSourcePropertyDefinitions, {
            offset: {
                writable: true,
                typehint: "a-rate AudioParam"
            },
            onended: {
                writable: true,
                typehint: "javascript function"
            }
        }),
        methods: audioScheduledSourceMethods.concat([])
    },
    "ConvolverNode": {
        createInstance: () => {
            return audioContext.createConvolver();
        },
        propertyDefinitions: Object.assign({}, audioNodePropertyDefinitions, {
            buffer: {
                writable: true,
                typehint: "AudioBuffer"
            },
            normalize: {
                writable: true,
                typehint: "boolean"
            }
        })
    },
    "DelayNode": {
        createInstance: () => {
            let maxDelayTime;

            do {
                maxDelayTime = prompt("maxDelayTime (float)");
                if (null != maxDelayTime) {
                    maxDelayTime = parseFloat(maxDelayTime);
                }
            } while (maxDelayTime != null && isNaN(maxDelayTime));

            if (maxDelayTime == null) {
                throw new Error("maxDelayTime input was canceled");
            }

            return audioContext.createDelay(maxDelayTime);
        },
        propertyDefinitions: Object.assign({}, audioNodePropertyDefinitions, {
            delayTime: {
                writable: false,
                typehint: "a-rate AudioParam"
            }
        })
    },
    "DynamicsCompressorNode": {
        createInstance: () => {
            return audioContext.createDynamicsCompressor()
        },
        propertyDefinitions: Object.assign({}, audioNodePropertyDefinitions, {
            threshold: {
                writable: false,
                typehint: "k-rate AudioParam"
            },
            knee: {
                writable: false,
                typehint: "k-rate AudioParam"
            },
            ratio: {
                writable: false,
                typehint: "k-rate AudioParam"
            },
            reduction: {
                writable: false,
                typehint: "float"
            },
            attack: {
                writable: false,
                typehint: "k-rate AudioParam"
            },
            release: {
                writable: false,
                typehint: "k-rate AudioParam"
            }
        })
    },
    "GainNode": {
        createInstance: () => {
            return audioContext.createGain();
        },
        propertyDefinitions: Object.assign({}, audioNodePropertyDefinitions, {
            gain: {
                writable: true,
                typehint: "a-rate AudioParam"
            }
        })
    },
    "IIRFilterNode": {
        createInstance: () => {
            let feedforward, feedback;

            do {
                feedforward = prompt("feedforward (20 values max array separated by commas with no space and at least one non zero value\nexample: 0.0,0.23,0.0)").split(',');
            } while (feedforward != null && (feedforward.length <= 0 || feedforward.length > 20 || feedforward.reduce((a,b) => {return a + b}) <= 0));

            if (feedforward == null) {
                throw new Error("feedforward input was canceled");
            }

            do {
                feedback = prompt("feedback (20 values max array separated by commas with no space, first value must be non-zero\nexample: 1.0,0.23,0.71)").split(',');
            } while (feedforward != null && (feedforward.length <= 0 || feedforward.length > 20 || feedforward[0] == 0));

            if (feedback == null) {
                throw new Error("feedback input was canceled");
            }

            return audioContext.createIIRFilter(feedforward, feedback);
        },
        propertyDefinitions: Object.assign({}, audioNodePropertyDefinitions)
    },
    "MediaElementAudioSourceNode": {
        createInstance: () => {
            let mediaElement, tmpDiv;

            do {
                mediaElement = prompt("mediaElement (<video> <audio> html tag)");
                if (null != mediaElement) {
                    tmpDiv = document.createElement('div');
                    tmpDiv.setAttribute('style', 'display: none');
                    document.body.append(tmpDiv);
                    tmpDiv.innerHTML = mediaElement;
                    tmpElt = tmpDiv.querySelector('video,audio');
                    mediaElement = tmpElt != null ? tmpElt : false;
                }
            } while (null != mediaElement && !mediaElement);

            if (null == mediaElement) {
                throw new Error("mediaElement input was canceled");
            }

            return audioContext.createMediaElementSource(mediaElement);
        },
        propertyDefinitions: Object.assign({}, audioNodePropertyDefinitions, {
            mediaElement: {
                writable: false,
                typehint: "HTMLMediaElement"
            }
        })
    },
    "MediaStreamAudioDestinationNode": {
        createInstance: () => {
            return audioContext.createMediaStreamDestination();
        },
        propertyDefinitions: Object.assign({}, audioNodePropertyDefinitions, {
            steam: {
                writable: true,
                typehint: "MediaStream"
            }
        })
    },
    "MediaStreamAudioSourceNode": {
        createInstance: () => {
            let stream;

            do {
                stream = prompt('stream (MediaStream not implemented yet)');
                throw new Error('MediaStream not implemented yet');
            } while(null != stream && !(stream instanceof MediaStream));

            if (stream == null) {
                throw new Error('stream input was canceled');
            }

            return audioContext.createMediaStreamSource(stream);
        },
        propertyDefinitions: Object.assign({}, audioNodePropertyDefinitions, {
            mediaStream: {
                writable: false,
                typehint: "MediaStream"
            }
        })
    },
    "OscillatorNode": {
        createInstance: () => {
            return audioContext.createOscillator();
        },
        propertyDefinitions: Object.assign({}, audioScheduledSourcePropertyDefinitions, {
            frequency: {
                writable: true,
                typehint: "a-rate AudioParam"
            },
            detune: {
                writable: true,
                typehint: "a-rate AudioParam"
            },
            type: {
                writable: true,
                typehint: "enum",
                enabledValues: ["sine","square","sawtooth","triangle","custom"]
            },
            onended: {
                writable: true,
                typehint: "javascript function"
            }
        }),
        methods: audioScheduledSourceMethods.concat([])
    },
    "PannerNode": {
        createInstance: () => {
            return audioContext.createPanner();
        },
        propertyDefinitions: Object.assign({}, audioNodePropertyDefinitions, {
            coneInnerAngle: {
                writable: true,
                typehint: "double"
            },
            coneOuterAngle: {
                writable: true,
                typehint: "double"
            },
            coneOuterGain: {
                writable: true,
                typehint: "double"
            },
            distanceModel: {
                writable: true,
                typehint: "enum",
                enabledValues: ["linear","inverse","exponential"]
            },
            maxDistance: {
                writable: true,
                typehint: "double"
            },
            orientationX: {
                writable: true,
                typehint: "AudioParam"
            },
            orientationY: {
                writable: true,
                typehint: "AudioParam"
            },
            orientationZ: {
                writable: true,
                typehint: "AudioParam"
            },
            panningModel: {
                writable: true,
                typehint: "enum",
                enabledValues: ["equalpower","HRTF"]
            },
            positionX: {
                writable: true,
                typehint: "AudioParam"
            },
            positionY: {
                writable: true,
                typehint: "AudioParam"
            },
            positionZ: {
                writable: true,
                typehint: "AudioParam"
            },
            refDistance: {
                writable: true,
                typehint: "double"
            },
            rollofFactor: {
                writable: true,
                typehint: "double"
            }
        })
    },
    "StereoPannerNode": {
        createInstance: () => {
            return audioContext.createStereoPanner()
        },
        propertyDefinitions: Object.assign({}, audioNodePropertyDefinitions, {

        })
    },
    "WaveShaperNode": {
        createInstance: () => {
            return audioContext.createWaveShaper();
        },
        propertyDefinitions: Object.assign({}, audioNodePropertyDefinitions, {

        })
    }
};

var nodes = [];

function addBoxTool(name, clazz, propertyDefinitions, methods)
{
    var boxToolElt = document.createElement('button');
    boxToolElt.innerText = name.replace('Node', '');

    var propertyDefinitionsTemplate = "<table><thead><td>Key</td><td>Type</td><td>Value</td></thead><tbody>";
    var readableTpl;
    var inputTpl;

    for (var property in propertyDefinitions) {
        readableTpl = propertyDefinitions[property].writable
            ? ""
            : " readonly=\"readonly\"";

        inputTpl = "";

        switch (propertyDefinitions[property].typehint) {
            case "enum":
                inputTpl = "<select "+readableTpl+">" ;

                for (let val of propertyDefinitions[property].enabledValues) {
                    inputTpl += "<option value=\""+val+"\">"+val+"</option>";
                }

                inputTpl += "</select>"
                break;
            case "int":
            case "unsigned long":
                inputTpl = "<input "+readableTpl+" type=\"number\"/>" ;
                break;
            case "boolean":
                var rand = Math.random();
                var idTrue = property+"booltrue"+rand;
                var idFalse = property+"boolfalse"+rand;
                inputTpl =
                    "<input id=\""+idTrue+"\" name=\""+property+"bool"+rand+"\" type=\"radio\" value=\"Yes\" /><label for=\""+idTrue+"\">Yes</label>"
                    + "<input id=\""+idFalse+"\" name=\""+property+"bool"+rand+"\" type=\"radio\" value=\"No\" /><label for=\""+idFalse+"\">No</label>";
                break;
            case "float":
            case "double":
            case "AudioParam":
            case "a-rate AudioParam":
            case "k-rate AudioParam":
                inputTpl = "<input "+readableTpl+" type=\"number\" step=\"0.001\"/>" ;
                break;
            case "string":
                inputTpl = "<input "+readableTpl+" type=\"text\"/>" ;
            case "javascript":
            case "javascript function":
                inputTpl = "<textarea></textarea>";
                break;
            default:
                inputTpl = "Unhandled data type: " + propertyDefinitions[property].typehint;
                break;
        }

        propertyDefinitionsTemplate += "<tr data-property=\""+property+"\"><td>"+property+"</td><td>"+propertyDefinitions[property].typehint+"</td><td>"+inputTpl+"</td></tr>";
    }

    propertyDefinitionsTemplate += "</tbody></table>";

    methodsTemplate = '';
    if (methods != undefined) {
        methodsTemplate += '<ul class="methods">';
        for (var method of methods) {
            methodsTemplate += "<li><a href=\"#\" onclick=\"onBoxMethodClick.call(undefined, '"+method+"', arguments[0])\">"+method+"</a></li>";
        }
        methodsTemplate += '</ul>';
    }

    boxToolElt.dataset.type = name;
    boxToolElt.dataset.template =  "<div class=\"box\">";
    boxToolElt.dataset.template +=      "<div class=\"title-bar\">";
    boxToolElt.dataset.template +=          "<div class=\"title\">";
    boxToolElt.dataset.template +=              "<span class=\"type\">"+name+"</span>";
    boxToolElt.dataset.template +=          "</div>";
    boxToolElt.dataset.template +=          "<div class=\"renew\">";
    boxToolElt.dataset.template +=              "<button class=\"btn-renew\">renew</button>";
    boxToolElt.dataset.template +=          "</div>";
    boxToolElt.dataset.template +=          "<div class=\"close\">";
    boxToolElt.dataset.template +=              "<a class=\"btn-close\">X</a>";
    boxToolElt.dataset.template +=          "</div>";
    boxToolElt.dataset.template +=      "</div>";
    boxToolElt.dataset.template +=      "<div class=\"body\">";
    boxToolElt.dataset.template +=          "<div class=\"inputs\"></div>";
    boxToolElt.dataset.template +=          "<div class=\"content\">";
    boxToolElt.dataset.template +=              "<div class=\"boxHead\">";
    boxToolElt.dataset.template +=                  "<input class=\"name\" value=\"new node\" />";
    boxToolElt.dataset.template +=              "</div>";
    boxToolElt.dataset.template +=              "<div class=\"propertyDefinitions\">"+propertyDefinitionsTemplate+"</div>";
    boxToolElt.dataset.template +=              "<div class=\"methods\">";
    boxToolElt.dataset.template +=                  methodsTemplate;
    boxToolElt.dataset.template +=              "</div>";
    boxToolElt.dataset.template +=          "</div>";
    boxToolElt.dataset.template +=          "<div class=\"outputs\">AAA</div>";
    boxToolElt.dataset.template +=      "</div>";
    boxToolElt.dataset.template +=      "<div class=\"footer\">";
    boxToolElt.dataset.template +=          "<p class=\"error\"></p>";
    boxToolElt.dataset.template +=      "</div>";
    boxToolElt.dataset.template +=  "</div>";

    boxToolElt.onclick = onBoxToolClick;
    toolbar.append(boxToolElt);
}

function addBox(toolElement) {
    var tmp = document.createElement('div');
    tmp.innerHTML = toolElement.dataset.template;

    console.log(toolElement, toolElement.dataset, data, data[toolElement.dataset.type].createInstance);

    var box = tmp.querySelector('.box');
    var nodeId = nodes.length;
    var node = data[toolElement.dataset.type].createInstance();
    nodes.push(node);

    box.dataset.nodeId = nodeId;

    nbBoxes = schema.querySelectorAll('.box').length;
    box.querySelector('.name').value = "new node "+(nbBoxes+1);

    schema.append(box);

    box.addEventListener('click', onBoxClick.bind(undefined, toolElement, node));

    box.querySelectorAll('.close')[0]
        .querySelectorAll('.btn-close')[0]
            .addEventListener('click', onBoxCloseClick.bind(undefined, toolElement, node));

    var inputs = box.querySelector('.inputs'),
        outputs = box.querySelector('.outputs');

    inputs.innerHTML = "";
    for (let i = 0; i < node.numberOfInputs; i++) {
        inputs.innerHTML += '<li class="input" draggable="true"></div>';
    }

    outputs.innerHTML = "";
    for (let i = 0; i < node.numberOfOutputs; i++) {
        outputs.innerHTML += '<li class="output" draggable="true"></div>';
    }

    box.addEventListener('dragstart', onBoxIODragStart.bind(undefined, toolElement, box, node));
    box.addEventListener('drag', onBoxIODrag.bind(undefined, toolElement, box, node));
    box.addEventListener('dragend', onBoxIODragEnd.bind(undefined, toolElement, box, node));
    box.addEventListener('dragenter', onBoxIODragEnter);
    box.addEventListener('dragover', onBoxIODragOver);
    box.addEventListener('dragleave', onBoxIODragLeave);
    box.addEventListener('drop', onBoxIODrop.bind(undefined, toolElement, box, node));

    tmp.remove();
}

function onBoxToolClick(event) {
    console.log('box click', event);

    addBox(event.target);
}

function onBoxClick(toolElement, node, event) {
    console.log("onBoxClick", node);

    if (event.target.classList.contains('close')
        || event.target.classList.contains('btn-close')
    ) {
        event.stopPropagation();
        return false;
    }
    if (event.target.classList.contains('btn-renew')) {
        onBoxRenewClick(toolElement, event.currentTarget, node, event);
    }

    event.currentTarget.getElementsByClassName('error')[0].innerText = "";

    console.log("onBoxClick 1", node, event);

    var active = event.currentTarget.classList.contains('active');

    schema.querySelectorAll('.box').forEach((elt) => {
        elt.classList.remove('active');
    });

    if (active) {
        propertyViewer.innerHTML = "";
        return;
    }

    event.currentTarget.classList.add('active');

    propertyViewer.innerHTML = event.currentTarget.querySelector('.propertyDefinitions').innerHTML;

    var inputs = propertyViewer.querySelectorAll('table input, table select, table textarea');

    for (var input of inputs) {
        let property = input.closest('tr').dataset.property;
        if (input.getAttribute('type') != "radio" && input.getAttribute('type') != "checkbox") {
            console.log(property, node, node[property]);
            switch (data[toolElement.dataset.type].propertyDefinitions[property].typehint) {
                case "AudioParam":
                case "a-rate AudioParam":
                case "k-rate AudioParam":
                    input.value = node[property].value;
                    break;
                case "enum":
                    let options = input.querySelectorAll('option');
                    for (let o of options) {
                        o.removeAttribute('selected');
                    }

                    let option = input.querySelector('option[value=\"'+node[property]+'\"]');
                    option.setAttribute('selected', 'selected');
                    break;
                default:
                    input.value = node[property];
                    break;
            }
        }
        input.addEventListener('change', onBoxInputChange.bind(undefined, toolElement, node, propertyViewer));
    }
}

function onBoxCloseClick(toolElement, node, event) {
    event.preventDefault();
    console.log("onBoxCloseClick", node);

    if (node.hasOwnProperty('destroy')) {
        node.destroy();
    }

    delete node;
    var box = event.currentTarget.closest('.box');

    if (box.classList.contains('active')) {
        propertyViewer.innerHTML = "";
    }

    box.remove();
}

function onBoxRenewClick(toolElement, box, node, event) {
    console.log('onBoxRenewClick', arguments);
    event.stopPropagation();
    var nodeId = box.dataset.nodeId;
    var node = nodes[nodeId];
    node.id = Math.random();
    console.log('n1', node.id);

    var node2 = data[node.constructor.name].createInstance();

    node2.id = Math.random();
    console.log('n2', node2.id);

    for (var prop in data[node.constructor.name].propertyDefinitions) {
        node2[prop] = node[prop];
    }

    if (node.hasOwnProperty('connexions')) {
        for (let conn of node.connexions) {
            console.log('connect', node2, conn, nodes[conn[0]]);
            node2.connect(nodes[conn[0]], conn[1], conn[2]);
        }
        node2.connexions = node.connexions;
    }


    if (node.hasOwnProperty('reversedConnexions')) {
        for (let conn of node.reversedConnexions) {
            nodes[conn[0]].connect(node, conn[1], conn[2]);
        }
        node2.reversedConnexions = node.reversedConnexions.concat([]);
    }


    nodes[nodeId] = node2;

    if (node.hasOwnProperty('destroy')) {
        node.destroy();
    }

    delete node;

    return false;
}

function onBoxInputChange(toolElement, node, propertyViewer, event) {
    console.log('bic', arguments);
    var property = event.currentTarget.closest('tr').dataset.property;

    console.log(property, data[toolElement.dataset.type].propertyDefinitions[property].typehint, node[property], event.currentTarget.value);

    switch (data[toolElement.dataset.type].propertyDefinitions[property].typehint) {
        case "AudioParam":
        case "a-rate AudioParam":
        case "k-rate AudioParam":
            node[property].value = parseFloat(event.currentTarget.value);
            break;
        case "boolean":
            node[property] = event.currentTarget.value != "No";
            break;
        case "int":
        case "unsigned long":
            node[property] = parseInt(event.currentTarget.value);
            break;
        case "float":
        case "double":
            node[property] = parseFloat(event.currentTarget.value);
            break;
        case "string":
        case "javascript":
        case "enum":
            node[property] = event.currentTarget.value;
            break;
        case "javascript function":
        default:
            console.error("[onBoxInputChange] Unhandled type: " + data[toolElement.dataset.type].propertyDefinitions[property].typehint);
            break;
    }

    console.log(node);
}

let dragIOCanvas, dragIOCanvasCtxt;
function onBoxIODragStart(toolElement, box, node, event) {
    console.log('onBoxIODragStart', arguments);
    dragIOCanvas = document.createElement('canvas');
    dragIOCanvas.classList.add('drag-io');
    dragIOCanvas.width = 0;
    dragIOCanvas.height = 0;
    document.body.append(dragIOCanvas);
    dragIOCanvasCtxt = dragIOCanvas.getContext("2d");

    if (event.target.id == undefined || event.target.id.length <= 0) {
        event.target.id = "draggedinput" + node.constructor.name + Math.round(Math.random() * 1000000);
    }

    event.dataTransfer.setData('nodeId', box.dataset.nodeId);
    event.dataTransfer.setData('draggedElt', event.target.id);
}

function onBoxIODrag(toolElement, box, node, event) {
    // console.log('onBoxIODrag', arguments);
    dragIOCanvas.width = Math.abs(event.offsetX);
    dragIOCanvas.height = Math.abs(event.offsetY);

    var padding = 8;

    if (event.offsetX >= 0) {
        dragIOCanvas.style.left = "" + (event.srcElement.offsetLeft + padding) + "px";
    } else {
        dragIOCanvas.style.left = "" + (event.srcElement.offsetLeft + event.offsetX + padding) + "px";
    }

    if (event.offsetY >= 0) {
        dragIOCanvas.style.top = "" + (event.srcElement.offsetTop + padding) + "px";
    } else {
        dragIOCanvas.style.top = "" + (event.srcElement.offsetTop + event.offsetY + padding) + "px";
    }

    // console.log(dragIOCanvas.style.left, event.offsetX, (event.srcElement.offsetLeft + event.offsetX), "" + (event.srcElement.offsetLeft + event.offsetX) + "px", dragIOCanvas.style.left);

    var startX, startY, endX, endY;

    if (event.offsetX > 0) {
        startX = 0;
        endX = dragIOCanvas.width;
    } else {
        startX = dragIOCanvas.width;
        endX = 0;
    }

    if (event.offsetY > 0) {
        startY = 0;
        endY = dragIOCanvas.height;
    } else {
        startY = dragIOCanvas.height;
        endY = 0;
    }

    dragIOCanvasCtxt.strokeStyle = "red";
    dragIOCanvasCtxt.lineWidth = "3";
    dragIOCanvasCtxt.beginPath();
    dragIOCanvasCtxt.moveTo(startX,startY);
    dragIOCanvasCtxt.lineTo(endX,endY);
    dragIOCanvasCtxt.stroke();
}

function onBoxIODragEnd(toolElement, box, node, event) {
    console.log('onBoxIODragEnd', arguments);
}

function onBoxIODragEnter(event) {
    event.preventDefault();

    // console.log('onBoxIODragEnter', event);
}

function onBoxIODragOver(event) {
    event.preventDefault();

    event.srcElement.style.border = "1px solid red";

    // console.log('onBoxIODragOver', event);
}

function onBoxIODragLeave(event) {
    event.preventDefault();

    // console.log('onBoxIODragLeave', event);

    event.srcElement.style.border = "";
}

function onBoxIODrop(toolElement, box, node, event) {
    event.preventDefault();

    console.log('onBoxIODrop', event, event.dataTransfer.getData('draggedElt'));

    var elt = document.getElementById(event.dataTransfer.getData('draggedElt'));
    if (elt.classList.contains('input') && event.srcElement.classList.contains('output')) {
        // dragged input into output
        let inputNodeId = 1*event.dataTransfer.getData('nodeId');
        let outputOffset = Array.prototype.indexOf.call(event.srcElement.parentNode.children, event.srcElement);
        let inputOffset = Array.prototype.indexOf.call(elt.parentNode.children, elt);

        node.connect(nodes[inputNodeId], outputOffset, inputOffset);

        if (!node.hasOwnProperty('connexions')) {
            node.connexions = [];
        }
        if (!nodes[inputNodeId].hasOwnProperty('reversedConnexions')) {
            nodes[inputNodeId].reversedConnexions = [];
        }

        node.connexions.push([inputNodeId, outputOffset, inputOffset]);
        nodes[inputNodeId].reversedConnexions.push([box.dataset.nodeId, outputOffset, inputOffset]);

        console.log('save connexions', node);
    } else if(elt.classList.contains('output') && event.srcElement.classList.contains('input')) {
        // dragged output into input
        let outputNodeId = 1*event.dataTransfer.getData('nodeId');
        let outputOffset = Array.prototype.indexOf.call(elt.parentNode.children, elt);
        let inputOffset = Array.prototype.indexOf.call(event.srcElement.parentNode.children, event.srcElement);

        nodes[outputNodeId].connect(node, outputOffset, inputOffset);


        if (!nodes[outputNodeId].hasOwnProperty('connexions')) {
            nodes[outputNodeId].connexions = [];
        }
        if (!node.hasOwnProperty('reversedConnexions')) {
            node.reversedConnexions = [];
        }

        nodes[outputNodeId].connexions.push([box.dataset.nodeId, outputOffset, inputOffset]);
        node.reversedConnexions.push([outputNodeId, outputOffset, inputOffset]);

        console.log('save connexions', node);
    } else {
        dragIOCanvas.style.display = "none";
        dragIOCanvasCtxt = undefined;
        dragIOCanvas.remove();
    }

    event.srcElement.style.border = "";
}

function onBoxMethodClick(method, event) {
    console.log('onBoxMethodClick', arguments, event.target, event.target.closest('div[class="box"]'));
    event.preventDefault();
    event.stopPropagation();

    var box = event.target.closest('div[class="box"],div[class="box active"]');
    var nodeId = box.dataset.nodeId;

    console.log('starting', nodes[nodeId].id);

    try {
        nodes[nodeId][method].call(nodes[nodeId]);
    } catch (e) {
        box.getElementsByClassName('error')[0].innerText = e;
    }
}

for (var clazz in data) {
    addBoxTool(clazz, window[clazz], data[clazz].propertyDefinitions, data[clazz].methods);
}

var animated = false;
function animateOnce(t, dt) {
    if (animated) {
        return;
    }

    animate(t, dt);
}

function animate(t, dt) {
    let t2 = new Date();
    dt = 0;
    if (t instanceof Date) {
        dt = t2.getTime() - t.getTime();
    }
    t = t2;

    update(t, dt);

    if (analyserCount <= 0) {
        return;
    }

    requestAnimationFrame(animate.bind(undefined, t, dt));
}

function update(t, dt) {
    console.log('update', t, dt);
}
