function parseOBJ(text) {
    // because indices are base 1 let's just fill in the 0th data
    const objPositions = [[0, 0, 0]];
    const objTexcoords = [[0, 0]];
    const objNormals = [[0, 0, 0]];
    const objColors = [[0, 0, 0]];
  
    // same order as `f` indices
    const objVertexData = [
      objPositions,
      objTexcoords,
      objNormals,
      objColors,
    ];
  
    // same order as `f` indices
    let webglVertexData = [
      [],   // positions
      [],   // texcoords
      [],   // normals
      [],   // colors
    ];
  
    const materialNames = [];
    const geometries = [];
    let geometry;
    let groups = ['default'];
    let material = 'default';
    let object = 'default';
    // records the Axis Aligned Bounding Box.
    const MaxSize=200000;
    let min = [MaxSize, MaxSize, MaxSize];
    let max = [-MaxSize, -MaxSize, -MaxSize];
    /* the geometrical center of the AABB*/
    let centroid = [0,0,0];
    /* the sidelengths of bounding Box.*/
    let boundingBox = [MaxSize,MaxSize,MaxSize];
    /* the radius of the circumsphere.*/
    let radius=0;
    const noop = () => {};
  
    function newGeometry() {
      // If there is an existing geometry and it's
      // not empty then start a new one.
      if (geometry && geometry.data.vertices.length) {
        geometry = undefined;
      }
    }
  
    function setGeometry() {
      if (!geometry) {
        const vertices = [];
        const textures = [];
        const vertexNormals = [];
        const color = [];
        webglVertexData = [
          vertices,
          textures,
          vertexNormals,
          color,
        ];
        geometry = {
          // object,
          // groups,
          min,
          max,
          centroid,
          boundingBox,
          material,
          data: {
            vertices,
            textures,
            vertexNormals,
            // color,
          },
        };
        geometries.push(geometry);
        // console.log("geometry",geometry);
      }
    }
  
    function addVertex(vert) {
      const ptn = vert.split('/');
      ptn.forEach((objIndexStr, i) => {
        if (!objIndexStr) {
          return;
        }
        const objIndex = parseInt(objIndexStr);
        const index = objIndex + (objIndex >= 0 ? 0 : objVertexData[i].length);
        webglVertexData[i].push(...objVertexData[i][index]);
        // if this is the position index (index 0) and we parsed
        // vertex colors then copy the vertex colors to the webgl vertex color data
        if (i === 0 && objColors.length > 1) {
          geometry.data.color.push(...objColors[index]);
        }
      });
    }
  
    const keywords = {
      v(parts) {
        // if there are more than 3 values here they are vertex colors
        if (parts.length > 3) {
          objPositions.push(parts.slice(0, 3).map(parseFloat));
          objColors.push(parts.slice(3).map(parseFloat));
          var tempv = parts.slice(0, 3).map(parseFloat);
          if(tempv[0] < min[0])
            min[0] = tempv[0];
          if(tempv[1] < min[1])
            min[1] = tempv[1];
          if(tempv[2] < min[2])
            min[2] = tempv[2];
          if(tempv[0] > max[0])
            max[0] = tempv[0];
          if(tempv[1] > max[1])
            max[1] = tempv[1];
          if(tempv[2] > max[2])
            max[2] = tempv[2];
        } else {
          objPositions.push(parts.map(parseFloat));
          // console.log(parts.map(parseFloat));
          var tempv = parts.map(parseFloat);
          if(tempv[0] < min[0])
            min[0] = tempv[0];
          if(tempv[1] < min[1])
            min[1] = tempv[1];
          if(tempv[2] < min[2])
            min[2] = tempv[2];
          if(tempv[0] > max[0])
            max[0] = tempv[0];
          if(tempv[1] > max[1])
            max[1] = tempv[1];
          if(tempv[2] > max[2])
            max[2] = tempv[2];
        }
      },
      vn(parts) {
        objNormals.push(parts.map(parseFloat));
      },
      vt(parts) {
        // should check for missing v and extra w?
        objTexcoords.push(parts.map(parseFloat));
      },
      f(parts) {
        setGeometry();
        const numTriangles = parts.length - 2;
        for (let tri = 0; tri < numTriangles; ++tri) {
          addVertex(parts[0]);
          addVertex(parts[tri + 1]);
          addVertex(parts[tri + 2]);
        }
      },
      s: noop,    // smoothing group
      mtllib(parts, unparsedArgs) {
        // the spec says there can be multiple filenames here
        // but many exist with spaces in a single filename
        materialNames.push(unparsedArgs);
      },
      usemtl(parts, unparsedArgs) {
        material = unparsedArgs;
        newGeometry();
      },
      g(parts) {
        groups = parts;
        newGeometry();
      },
      o(parts, unparsedArgs) {
        object = unparsedArgs;
        newGeometry();
      },
    };
  
    const keywordRE = /(\w*)(?: )*(.*)/;
    const lines = text.split('\n');
    for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
      const line = lines[lineNo].trim();
      if (line === '' || line.startsWith('#')) {
        continue;
      }
      const m = keywordRE.exec(line);
      if (!m) {
        continue;
      }
      const [, keyword, unparsedArgs] = m;
      const parts = line.split(/\s+/).slice(1);
      const handler = keywords[keyword];
      if (!handler) {
        // console.warn('unhandled keyword:', keyword);  // eslint-disable-line no-console
        continue;
      }
      handler(parts, unparsedArgs);
    }
  
    // remove any arrays that have no entries.
    for (const geometry of geometries) {
      geometry.data = Object.fromEntries(
          Object.entries(geometry.data).filter(([, array]) => array.length > 0));
    }
    for (let i=0;i<3;i++){
      centroid[i]=(min[i]+max[i])/2;
      boundingBox[i]=max[i]-min[i];
      radius += (boundingBox[i] / 2) * (boundingBox[i] / 2);
    }
    radius=Math.sqrt(radius);
    // console.log("min,max,centroid,boundingBox",min,max,centroid,boundingBox);
    return {
      geometries,
      materialNames,
    };
  }
  
  function parseMapArgs(unparsedArgs) {
    // TODO: handle options
    return unparsedArgs;
  }
  
  function parseMTL(text) {
    const materialsByindex = {};
    let material;
  
    const keywords = {
      newmtl(parts, unparsedArgs) {
        material = {};
        material.name = parts[0];
        materialsByindex[unparsedArgs] = material;
      },
      /* eslint brace-style:0 */
      Ns(parts)       { material.shininess      = parseFloat(parts[0]); },
      Ka(parts)       { material.ambient        = parts.map(parseFloat); },
      Kd(parts)       { material.diffuse        = parts.map(parseFloat); },
      Ks(parts)       { material.specular       = parts.map(parseFloat); },
      Ke(parts)       { material.emissive       = parts.map(parseFloat); },
      Ni(parts)       { material.opticalDensity = parseFloat(parts[0]); },
      d(parts)        { material.opacity        = parseFloat(parts[0]); },
      illum(parts)    { material.illum          = parseInt(parts[0]); },
    };
  
    const keywordRE = /(\w*)(?: )*(.*)/;
    const lines = text.split('\n');
    for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
      const line = lines[lineNo].trim();
      if (line === '' || line.startsWith('#')) {
        continue;
      }
      const m = keywordRE.exec(line);
      if (!m) {
        continue;
      }
      const [, keyword, unparsedArgs] = m;
      const parts = line.split(/\s+/).slice(1);
      const handler = keywords[keyword];
      if (!handler) {
        // console.warn('unhandled keyword:', keyword);  // eslint-disable-line no-console
        continue;
      }
      handler(parts, unparsedArgs);
    }
  
    return materialsByindex;
  }
  
  async function parseModel(models, callBack) {
    var ret = {};
    var i = 0;
    models.forEach(async function (t) {
        const name = t.name;

        const objHref = t.obj;  /* webglfundamentals: url */
        const objresponse = await fetch(objHref);
        const objtext = await objresponse.text();
        const obj = parseOBJ(objtext);
        
        if(t.mtl)
        {
            const matHref = t.mtl;
            const matresponse = await fetch(matHref);
            const mattext = await matresponse.text();
            const mat = parseMTL(mattext);
            const mesh = {};
            mesh.name = name;
            mesh.useMTL = true;
            Object.assign(mesh, obj);
            mesh.materials = mat;
            ret[name] = mesh;
        }
        else{
            const mesh = {};
            mesh.name = name;
            mesh.useMTL = false;
            Object.assign(mesh, obj);
            ret[name] = mesh;
        }
        
        if(i >= Object.keys(models).length - 1)
        {
          window.loadingResource = false;
          document.getElementById('loading_box').style.visibility = "hidden";
          document.getElementById('c').style.visibility = "visible";
          callBack(ret);
        }
        i++;
    });
  }
  
//   async function main() {
//     const models = [
//         {
//             name: 'viking_room',
//             obj: './resource/viking_room.obj', // located in the models folder on the server
//             mtl: './resource/viking_room.mtl',
//         },
//         {
//             name: 'paper_plane',
//             obj: './resource/paper+airplane.obj',
//         },
//     ]
//     const model = parseModel(models);
//     console.log(model);
//   }

export{parseModel}