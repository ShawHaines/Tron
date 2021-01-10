const vs =`
    attribute vec3 a_position;
    varying vec4 v_position;
    uniform mat4 u_worldViewProjectionInverse; //redundant for efficiency
    void main() {
        gl_Position = vec4(a_position, 1.0);
        v_position = u_worldViewProjectionInverse * vec4(a_position, 1.0);
    }
`

const fs=`
    precision mediump float;
    uniform float u_time;
    varying vec4 v_position;
    uniform vec3 u_cursor;

    // Noise
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    vec3 fade(vec3 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }
    float noise(vec3 P) {
        vec3 i0 = mod289(floor(P)), i1 = mod289(i0 + vec3(1.0));
        vec3 f0 = fract(P), f1 = f0 - vec3(1.0), f = fade(f0);
        vec4 ix = vec4(i0.x, i1.x, i0.x, i1.x), iy = vec4(i0.yy, i1.yy);
        vec4 iz0 = i0.zzzz, iz1 = i1.zzzz;
        vec4 ixy = permute(permute(ix) + iy), ixy0 = permute(ixy + iz0), ixy1 = permute(ixy + iz1);
        vec4 gx0 = ixy0 * (1.0 / 7.0), gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
        vec4 gx1 = ixy1 * (1.0 / 7.0), gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
        gx0 = fract(gx0); gx1 = fract(gx1);
        vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0), sz0 = step(gz0, vec4(0.0));
        vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1), sz1 = step(gz1, vec4(0.0));
        gx0 -= sz0 * (step(0.0, gx0) - 0.5); gy0 -= sz0 * (step(0.0, gy0) - 0.5);
        gx1 -= sz1 * (step(0.0, gx1) - 0.5); gy1 -= sz1 * (step(0.0, gy1) - 0.5);
        vec3 g0 = vec3(gx0.x,gy0.x,gz0.x), g1 = vec3(gx0.y,gy0.y,gz0.y),
            g2 = vec3(gx0.z,gy0.z,gz0.z), g3 = vec3(gx0.w,gy0.w,gz0.w),
            g4 = vec3(gx1.x,gy1.x,gz1.x), g5 = vec3(gx1.y,gy1.y,gz1.y),
            g6 = vec3(gx1.z,gy1.z,gz1.z), g7 = vec3(gx1.w,gy1.w,gz1.w);
        vec4 norm0 = taylorInvSqrt(vec4(dot(g0,g0), dot(g2,g2), dot(g1,g1), dot(g3,g3)));
        vec4 norm1 = taylorInvSqrt(vec4(dot(g4,g4), dot(g6,g6), dot(g5,g5), dot(g7,g7)));
        g0 *= norm0.x; g2 *= norm0.y; g1 *= norm0.z; g3 *= norm0.w;
        g4 *= norm1.x; g6 *= norm1.y; g5 *= norm1.z; g7 *= norm1.w;
        vec4 nz = mix(vec4(dot(g0, vec3(f0.x, f0.y, f0.z)), dot(g1, vec3(f1.x, f0.y, f0.z)),
            dot(g2, vec3(f0.x, f1.y, f0.z)), dot(g3, vec3(f1.x, f1.y, f0.z))),
            vec4(dot(g4, vec3(f0.x, f0.y, f1.z)), dot(g5, vec3(f1.x, f0.y, f1.z)),
                dot(g6, vec3(f0.x, f1.y, f1.z)), dot(g7, vec3(f1.x, f1.y, f1.z))), f.z);
        return 2.2 * mix(mix(nz.x,nz.z,f.y), mix(nz.y,nz.w,f.y), f.x);
    }
    float noise(vec2 P) { return noise(vec3(P, 0.0)); }
    float fractal(vec3 P) {
        float f = 0., s = 1.;
        for (int i = 0 ; i < 9 ; i++) {
            f += noise(s * P) / s;
            s *= 2.;
            P = vec3(.866 * P.x + .5 * P.z, P.y + 100., -.5 * P.x + .866 * P.z);
        }
        return f;
    }
    float turbulence(vec3 P) {
        float f = 0., s = 1.;
        for (int i = 0 ; i < 9 ; i++) {
            f += abs(noise(s * P)) / s;
            s *= 2.;
            P = vec3(.866 * P.x - .5 * P.z + .3 * P.y, -.866 * P.x - .5 * P.z + .3 * P.y, .866 * P.x -.5 * P.z - .3 * P.y);
            // P = vec3(.866 * P.x + .5 * P.z, P.y + 100., -.5 * P.x + .866 * P.z);
        }
        return f;
    }

    vec3 clouds(float x, float y) {
        float L = turbulence(vec3(x, y, u_time * .1));
        return vec3(noise(vec3(.5, .5, L) * .7));
    }

    void main() {
        vec3 color;
        float x = v_position.x;
        float y = v_position.y;
        vec3 cloudEffect = clouds(v_position.x, v_position.y);
        color = -0.4 * cloudEffect + vec3(106.0/255.0, 198.0/255.0, 211.0/255.0);
        gl_FragColor = vec4(color, 1.);
   }
`
export {vs, fs};