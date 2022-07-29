#define AA 1
#define RNG_A 0.59340
#define RNG_B 0.98493

float rsin_a(float val) {
    return sin(val * RNG_A);
}

float rsin_b(float val) {
    return sin(val * RNG_B);
}

float rcos_a(float val) {
    return cos(val * RNG_A);
}

// --- clay

float sdRoundBox(vec3 p, vec3 b, float r) {
    vec3 q = abs(p) - b;
    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0) - r;
}

float sdSphere(vec3 p, float s) {
    return length(p) - s;
}

// --- d2207

float shape_a(float time, vec3 pos, float d) {
    vec3 q = pos - vec3(0.0, rsin_b(time + 3.14) * 0.5, 0.0);
    return sdSphere(q, 0.4);
}

float shape_b(float time, vec3 pos, float d) {
    vec3 q = pos - vec3(0.0, 0.0, 0.0);
    return max(d, sdRoundBox(q, vec3(0.1, 0.1, 0.1), 0.3));
}

float shape_c(float time, vec3 pos, float d) {
    vec3 q = pos - vec3(0.0, sin(time) * 1.0, 0.0);
    return mod(d * 0.0005, sdSphere(q, 0.5));
}

float shape_f(float time, vec3 pos, float d) {
    vec3 q = pos - vec3(0.0, 0.0, 0.0);
    return smoothstep(0.001, sdSphere(q, 0.2), d / 10.0);
    //return mod(sdSphere(q, 0.1), d);
}

float map(float time, vec3 pos, float d) {
    d = shape_a(time, pos, d);
    d = shape_b(time, pos, d);
    //d = shape_f(time, pos, d);
    //d = shape_f(time, pos, d);

    return d;
}

// --- lib

// https://iquilezles.org/articles/normalsSDF
vec3 calcNormal(float time, in vec3 pos, float d) {
    vec2 e = vec2(1.0, -1.0) * 0.5773;
    const float eps = 0.0005;
    return normalize(e.xyy * map(time, pos + e.xyy * eps, d) +
        e.yyx * map(time, pos + e.yyx * eps, d) +
        e.yxy * map(time, pos + e.yxy * eps, time) +
        e.xxx * map(time, pos + e.xxx * eps, d));
}

// --- dust

void mainImage(out vec4 fragColor, in vec2 fragCoord, in vec2 resolution, in float time) {
     // camera movement	
    float an = 0.5 * (time - 10.0);
    vec3 ro = vec3(1.0 * rcos_a(an), 0.0, 1.0 * rsin_a(an));
    vec3 ta = vec3(0.0, 0.0, 0.0);
    // camera matrix
    vec3 ww = normalize(ta - ro);
    vec3 uu = normalize(cross(ww, vec3(0.0, 1.0, 0.0)));
    vec3 vv = normalize(cross(uu, ww));

    vec3 tot = vec3(0.0);

    vec2 p = (-resolution.xy + 2.0 * fragCoord) / resolution.y;

	    // create view ray
    vec3 rd = normalize(p.x * uu + p.y * vv + 1.5 * ww);

        // raymarch
    const float tmax = 3.0;
    float t = 0.0;
    float d = 1e10;

    for(int i = 0; i < 256; i++) {
        vec3 pos = ro + t * rd;

        d = map(time, pos, d);
        float h = d;

        if(h < 0.0001 || t > tmax)
            break;
        t += h;
    }

       // shading/lighting	
    vec3 col_a = vec3(0, 0, 0);
    vec3 col_b = vec3(0.0, 1.0, 0.3);
    if(t < tmax) {
        vec3 pos = ro + t * rd;
        vec3 nor = calcNormal(time, pos, d);
                //vec3 nor = pos;
        float dif = clamp(dot(nor, vec3(1.0, 1.0, 1.0)), 0.0, 0.0);
        float amb = 1.0 + 0.5 * dot(nor, vec3(1.0, 0.0, 1.0));
        col_a = mix(col_a, col_b, 1.0 - smoothstep(-0.1, 0.1, d));
        col_a = col_b / amb * 1.5 + col_b * dif * 0.1;
    }

        // gamma        
    col_a = sqrt(col_a);
    tot += col_a;

    fragColor = vec4(tot, 1.0);
}

#pragma glslify: export(mainImage)