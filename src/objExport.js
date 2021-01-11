import {nodes} from './main.js'
/**
 * 
 * @param {myNode} base_node 
 * @param {meshes} meshes 
 */
var bindOBJExportInfo2Nodes = function(curNode, meshes)
{
    if(curNode.type == "OBJECT" && meshes[curNode.bindObjectName])
    {
        curNode.objExportFlag = true;
        curNode.objExportInfo = meshes[curNode.bindObjectName];
        console.log("OBJ export info bound successfully!", curNode);
    }
    
    curNode.children.forEach(child => {
        bindOBJExportInfo2Nodes(child, meshes);
    });
}

document.getElementById("OBJButton").onclick = function()
{
    window.exportOBJCond = true;
    var item = document.getElementById('OBJButton');
    if(exportOBJCond)
    {
        item.innerHTML = "Exporting...";
        exportOBJ(nodes.base_node);
    }
    else
    {
        item.innerHTML = "Export OBJ";
    }
}

var exportOBJ = function(curNode)
{
    /**
     * Add your code here
     * After you successfully export the OBJ,
     * remember to set `window.exportOBJCond = false`!!!
     * do it in **async** way
     */
    console.log("Exporting OBJ...");
}

export {bindOBJExportInfo2Nodes}