#define AA 3

float sdRoundBox( vec3 p, vec3 b, float r )
{
  vec3 q = abs(p) - b;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0) - r;
}

float sdSphere( vec3 p, float s )
{
  return length(p)-s;
}

void mainImage( 
    out vec4 fragColor, 
    in vec2 fragCoord, 
    in vec2 resolution, 
    in vec2 pointer )
{
     // camera movement	
	//float an = 0.5*(time-10.0);
    //float an = sin(1.0);
    float an = (pointer.x - 0.5) * 2.0;
	vec3 ro = vec3( 1.0*cos(an), 0.0, 1.0*sin(an) );
    vec3 ta = vec3( 0.0, 0.0, 0.0 );
    // camera matrix
    vec3 ww = normalize( ta - ro );
    vec3 uu = normalize( cross(ww,vec3(0.0,1.0,0.0) ) );
    vec3 vv = normalize( cross(uu,ww));

        
    vec3 tot = vec3(0.0);
    
    #if AA>1
    for( int m=0; m<AA; m++ )
    for( int n=0; n<AA; n++ )
    {
        // pixel coordinates
        vec2 o = vec2(float(m),float(n)) / float(AA) - 0.5;
        vec2 p = (-resolution.xy + 2.0*(fragCoord+o))/resolution.y;
        #else    
        vec2 p = (-resolution.xy + 2.0*fragCoord)/resolution.y;
        #endif

	    // create view ray
        vec3 rd = normalize( p.x*uu + p.y*vv + 1.5*ww );

        // raymarch
        const float tmax = 3.0;
        float t = 0.0;
        for( int i=0; i<256; i++ )
        {
            vec3 pos = ro + t*rd;

            float d = 1e10;

            {
                vec3 q = pos - vec3( 0.0, 0.0, 0.0 );
                d = min( d, sdRoundBox(q, vec3(0.1, 0.1, 0.1), 0.1 ) );
            }

            {
                vec3 q = pos - vec3( 0.0, (pointer.y - 0.5) * 1.3, 0.0 );
                d = max( d, sdSphere(q,  0.2 ) );
            }

            float h = d;

            if( h<0.0001 || t>tmax ) break;
            t += h;
        }
        
    
       // shading/lighting	
        vec3 col =  vec3( 1, 1, 0.92 );
        if( t<tmax )
        {
			/*
            vec3 pos = ro + t*rd;
            vec3 nor = calcNormal(pos);
            float dif = clamp( dot(nor,vec3(0.57703)), 0.0, 1.0 );
            float amb = 0.5 + 0.5*dot(nor,vec3(0.0,1.0,0.0));
            col = vec3(0.2,0.3,0.4)*amb + vec3(0.8,0.7,0.5)*dif;
			*/
			col = vec3(  0.851, 0.141, 0.235 );
        }

        // gamma        
        //col = sqrt( col );
	    tot += col;
    #if AA>1
    }
    tot /= float(AA*AA);
    #endif

	fragColor = vec4( tot, 1.0 );
}

#pragma glslify: export(mainImage)