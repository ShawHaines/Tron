import {Perlin} from '../src/perlin.js'
class terrain {
    constructor(num) {
        this.node = num;
        this.poly = num-1;
        this.position = [];
        this.normal = [];
        this.texcoord = [];
        this.indices = [];
    }
    createTerrain() {
        this.height = new Array();
        for(var i=0; i<this.node; i++) {
            this.height[i] = new Array();
            for(var j=0; j<this.node; j++) {
                this.height[i][j] = "";
            }
				}
				var pn = new Perlin('terrain');
        for(var i=0; i<this.node; i++) {
            for(var j=0; j<this.node; j++) {
								// var ran = Math.random();
								var value = 20 * pn.noise(i/this.node, j/this.node, 0) - 15
                // if(ran > 0.5) {
                //     this.position.push.apply(this.position, [i, 1.3, j]);
                //     this.height[i][j] = 1.3;
                // }
                // else {
                //     this.position.push.apply(this.position, [i, 0.7, j]);
                //     this.height[i][j] = 0.7;
                // }
								// this.normal.push.apply(this.normal, [0, 1, 0]);
								this.position.push.apply(this.position, [i, value+1, j]);
								this.height[i][j] = value+1;
            }
        }
        for(var i=0; i<this.poly; i++) {
            for(var j=0; j<this.poly; j++) {
                this.indices.push.apply(this.indices, [i*this.node+j+1, (i+1)*this.node+j+1, (i+1)*this.node+j]);
                this.indices.push.apply(this.indices, [i*this.node+j+1, (i+1)*this.node+j, i*this.node+j]);
                this.texcoord.push.apply(this.texcoord, [1, 0, 0, 0, 0, 1, 1, 1])
            }
        }
    }
		getHeight(x, z) {
			// Left corner
			var lx = Math.floor(x);
			var lz = Math.floor(z);
			if(lx>=this.node || lz>=this.node)
				console.log("(x,z) dose not exists!");
			else {
				if(lx==x && lz==z) {
					return this.height[lx][lz];
				}
				else if(lx==x && lz<=z) {// point on z axis
					var h1 = this.height[lx][lz];
					var h2 = this.height[lx][lz+1];
					return (lz+1-z)*h1+(z-lz)*h2;
				}
				else if(lx<=x && lz==z) {// point on x axis
					var h1 = this.height[lx][lz];
					var h2 = this.height[lx+1][lz];
					return (lx+1-x)*h1+(x-lx)*h2;
				}
				else {// point in a triangle
					// Left triangle
					if(x+z-lx-lz<1) {
						var h1 = this.height[lx][lz];
						var h2 = this.height[lx+1][lz];
						var h3 = this.height[lx][lz+1];
						var ratio = (x-lx)/(lz+1-z);
						var h4 = (1-ratio)*h1+ratio*h2;
						return (z-lz)*h3+(lz+1-z)*h4;
					}
					// Right triangle
					else {
						var h1 = this.height[lx+1][lz+1];
						var h2 = this.height[lx][lz+1];
						var h3 = this.height[lx+1][lz];
						var ratio = (lx+1-x)/(z-lz);
						var h4 = (1-ratio)*h1+ratio*h2;
						return (lz+1-z)*h3+(z-lz)*h4;
					}
				}		
			}
		}
		computefaceNormal() {
			this.facenormald = new Array();
			for(var i=0; i<this.poly; i++) {
				this.facenormald[i] = new Array();
			}
			this.facenormalu = new Array();
			for(var i=0; i<this.poly; i++) {
				this.facenormalu[i] = new Array();
			}
			for(var i=0; i<this.poly; i++) {
				for(var j=0; j<this.poly; j++) {
					var h1 = this.getHeight(i, j);
					var h2 = this.getHeight(i+1, j);
					var h3 = this.getHeight(i, j+1);
					var x1 = 0; var y1 = h3-h1; var z1 = 1;
					var x2 = 1; var y2 = h2-h1; var z2 = 0;
					var x3 = y1*z2-z1*y2; var y3 = z1*x2-x1*z2; var z3 = x1*y2-y1*x2;
					var ratio = Math.sqrt(x3*x3+y3*y3+z3*z3);
					this.facenormald[i][j] = [x3/ratio, y3/ratio, z3/ratio];
				}
			}
			for(var i=0; i<this.poly; i++) {
				for(var j=0; j<this.poly; j++) {
					var h1 = this.getHeight(i+1, j+1);
					var h2 = this.getHeight(i+1, j);
					var h3 = this.getHeight(i, j+1);
					var x1 = 0; var y1 = h2-h1; var z1 = -1;
					var x2 = -1; var y2 = h3-h1; var z2 = 0;
					var x3 = y1*z2-z1*y2; var y3 = z1*x2-x1*z2; var z3 = x1*y2-y1*x2;
					var ratio = Math.sqrt(x3*x3+y3*y3+z3*z3);
					this.facenormalu[i][j] = [x3/ratio, y3/ratio, z3/ratio];
				}
			}
		}
		computevertexNormal() {
			for(var i=0; i<this.node; i++) {
				for(var j=0; j<this.node; j++) {
					if((i==0&&j==0) || (i==this.poly&&j==this.poly) ||(i==0&&j==this.poly) || (i==this.poly&&j==0)) {
						this.normal.push.apply(this.normal, this.getNormal(i,j));
					}
					else if(i==0) {
						var x = (this.getNormal(i+1/3, j-2/3)[0]+this.getNormal(i+2/3, j-1/3)[0]+this.getNormal(i+1/3, j+1/3)[0]+this.getNormal(i+2/3, j+2/3)[0])/4;
						var y = (this.getNormal(i+1/3, j-2/3)[1]+this.getNormal(i+2/3, j-1/3)[1]+this.getNormal(i+1/3, j+1/3)[1]+this.getNormal(i+2/3, j+2/3)[1])/4;
						var z = (this.getNormal(i+1/3, j-2/3)[2]+this.getNormal(i+2/3, j-1/3)[2]+this.getNormal(i+1/3, j+1/3)[2]+this.getNormal(i+2/3, j+2/3)[2])/4;
						this.normal.push.apply(this.normal, [x, y, z]);
					}
					else if(i==this.poly) {
						var x = (this.getNormal(i-1/3, j+2/3)[0]+this.getNormal(i-2/3, j+1/3)[0]+this.getNormal(i-1/3, j-1/3)[0]+this.getNormal(i-2/3, j-2/3)[0])/4;
						var y = (this.getNormal(i-1/3, j+2/3)[1]+this.getNormal(i-2/3, j+1/3)[1]+this.getNormal(i-1/3, j-1/3)[1]+this.getNormal(i-2/3, j-2/3)[1])/4;
						var z = (this.getNormal(i-1/3, j+2/3)[2]+this.getNormal(i-2/3, j+1/3)[2]+this.getNormal(i-1/3, j-1/3)[2]+this.getNormal(i-2/3, j-2/3)[2])/4;
						this.normal.push.apply(this.normal, [x, y, z]);
					}
					else if(j==0) {
						var x = (this.getNormal(i-2/3, j+1/3)[0]+this.getNormal(i-1/3, j+2/3)[0]+this.getNormal(i+1/3, j+1/3)[0]+this.getNormal(i+2/3, j+2/3)[0])/4;
						var y = (this.getNormal(i-2/3, j+1/3)[1]+this.getNormal(i-1/3, j+2/3)[1]+this.getNormal(i+1/3, j+1/3)[1]+this.getNormal(i+2/3, j+2/3)[1])/4;
						var z = (this.getNormal(i-2/3, j+1/3)[2]+this.getNormal(i-1/3, j+2/3)[2]+this.getNormal(i+1/3, j+1/3)[2]+this.getNormal(i+2/3, j+2/3)[2])/4;
						this.normal.push.apply(this.normal, [x, y, z]);
					}
					else if(j==this.poly) {
						var x = (this.getNormal(i+2/3, j-1/3)[0]+this.getNormal(i+1/3, j-2/3)[0]+this.getNormal(i-1/3, j-1/3)[0]+this.getNormal(i-2/3, j-2/3)[0])/4;
						var y = (this.getNormal(i+2/3, j-1/3)[1]+this.getNormal(i+1/3, j-2/3)[1]+this.getNormal(i-1/3, j-1/3)[1]+this.getNormal(i-2/3, j-2/3)[1])/4;
						var z = (this.getNormal(i+2/3, j-1/3)[2]+this.getNormal(i+1/3, j-2/3)[2]+this.getNormal(i-1/3, j-1/3)[2]+this.getNormal(i-2/3, j-2/3)[2])/4;
						this.normal.push.apply(this.normal, [x, y, z]);
					}
					else {
						var x = (this.getNormal(i+1/3, j-2/3)[0]+this.getNormal(i+2/3, j-1/3)[0]+this.getNormal(i+1/3, j+1/3)[0]+this.getNormal(i-1/3, j+2/3)[0]+this.getNormal(i-2/3, j+1/3)[0]+this.getNormal(i-1/3, j-1/3)[0])/6;
						var y = (this.getNormal(i+1/3, j-2/3)[1]+this.getNormal(i+2/3, j-1/3)[1]+this.getNormal(i+1/3, j+1/3)[1]+this.getNormal(i-1/3, j+2/3)[1]+this.getNormal(i-2/3, j+1/3)[1]+this.getNormal(i-1/3, j-1/3)[1])/6;
						var z = (this.getNormal(i+1/3, j-2/3)[2]+this.getNormal(i+2/3, j-1/3)[2]+this.getNormal(i+1/3, j+1/3)[2]+this.getNormal(i-1/3, j+2/3)[2]+this.getNormal(i-2/3, j+1/3)[2]+this.getNormal(i-1/3, j-1/3)[2])/6;
						this.normal.push.apply(this.normal, [x, y, z]);
					}
				}
			}
		}
    getNormal(x,z) {
			// Left corner
			var lx = Math.floor(x);
			var lz = Math.floor(z);
			if(lx>=this.node || lz>=this.node)
				console.log("(x,z) dose not exists!");
			else if(lx==this.poly&&lz==this.poly) {
				return this.facenormalu[lx-1][lx-1]
			}
			else if(lx==this.poly) {
				return this.facenormalu[lx-1][lz];
			}
			else if(lz==this.poly) {
				return this.facenormalu[lx][lz-1];
			}
			else {
				if(lx==x || lz==z) {
					return this.facenormald[lx][lz];
				}
				else {// point in a triangle
					// Left triangle
					if(x+z-lx-lz<1) {
						return this.facenormald[lx][lz];
					}
					// Right triangle
					else {
						return this.facenormalu[lx][lz];
					}
				}		
			}
		}
}
export {terrain};