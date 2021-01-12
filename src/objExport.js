import {nodes} from './main.js'
/**
 * 
 * @param {myNode} base_node 
 * @param {meshes} meshes 
 */
async function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
      
    element.style.display = 'none';
    document.body.appendChild(element);
      
    element.click();
      
    document.body.removeChild(element);
}

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
    exportOBJ(nodes.base_node);
    download('out.obj', objdata);
}

var objdata = '';
var numnodes = 0;
var exportOBJ = function(curNode)
{
    /**
     * Add your code here
     * After you successfully export the OBJ,
     * remember to set `window.exportOBJCond = false`!!!
     * do it in **async** way
     */
    if(curNode.type == "OBJECT" && curNode.objExportFlag) {
        var numgeometries = curNode.objExportInfo.geometries.length;
        for(var i=0; i<numgeometries; i++) {
            var positions = [];
            var texcoords = [];
            var normals = [];
            positions.push.apply(positions, curNode.objExportInfo.geometries[i].data.vertices);
            texcoords.push.apply(texcoords, curNode.objExportInfo.geometries[i].data.textures);
            normals.push.apply(normals, curNode.objExportInfo.geometries[i].data.vertexNormals);
            var vertexnum = positions.length/3;
            for(var i=0; i<vertexnum; i++) {
                objdata += 'v ';
                objdata += (positions[i*3]*curNode.worldMatrix[0]+positions[i*3+1]*curNode.worldMatrix[4]+positions[i*3+2]*curNode.worldMatrix[8]+curNode.worldMatrix[12]).toString();
                objdata += ' ';
                objdata += (positions[i*3]*curNode.worldMatrix[1]+positions[i*3+1]*curNode.worldMatrix[5]+positions[i*3+2]*curNode.worldMatrix[9]+curNode.worldMatrix[13]).toString();
                objdata += ' ';
                objdata += (positions[i*3]*curNode.worldMatrix[2]+positions[i*3+1]*curNode.worldMatrix[6]+positions[i*3+2]*curNode.worldMatrix[10]+curNode.worldMatrix[14]).toString();
                objdata += ' \n';
            }
            if(curNode.objExportInfo.geometries[0].texcoords) {
                for(var i=0; i<vertexnum; i++) {
                    objdata += 'vt ';
                    objdata += texcoords[i*2].toString();
                    objdata += ' ';
                    objdata += texcoords[i*2+1].toString();
                    objdata += ' \n';
                }
            }
            else {
                for(var i=0; i<vertexnum; i++) {
                    objdata += 'vt ';
                    objdata += '0';
                    objdata += ' ';
                    objdata += '0';
                    objdata += ' \n';
                }
            }
            
            for(var i=0; i<vertexnum; i++) {
                objdata += 'vn ';
                objdata += (normals[i*3]*curNode.worldMatrix[0]+normals[i*3+1]*curNode.worldMatrix[4]+normals[i*3+2]*curNode.worldMatrix[8]).toString();
                objdata += ' ';
                objdata += (normals[i*3]*curNode.worldMatrix[1]+normals[i*3+1]*curNode.worldMatrix[5]+normals[i*3+2]*curNode.worldMatrix[9]).toString();
                objdata += ' ';
                objdata += (normals[i*3]*curNode.worldMatrix[2]+normals[i*3+1]*curNode.worldMatrix[6]+normals[i*3+2]*curNode.worldMatrix[10]).toString();
                objdata += ' \n';
            }
            for(var i=numnodes/3; i<(vertexnum+numnodes)/3; i++) {
                objdata += 'f ';
                objdata += (i*3+1).toString(); objdata += '/'; objdata += (i*3+1).toString(); objdata += '/'; objdata += (i*3+1).toString(); objdata += ' ';
                objdata += (i*3+2).toString(); objdata += '/'; objdata += (i*3+2).toString(); objdata += '/'; objdata += (i*3+2).toString(); objdata += ' ';
                objdata += (i*3+3).toString(); objdata += '/'; objdata += (i*3+3).toString(); objdata += '/'; objdata += (i*3+3).toString(); objdata += '\n';
            }
            numnodes += vertexnum;
        }
        console.log(curNode);
    }
    curNode.children.forEach(child => {
        exportOBJ(child);
    });
    
    // download('out.obj', objdata);
    // console.log(curNode);
    console.log("Exporting OBJ...");
    
}

export {bindOBJExportInfo2Nodes}