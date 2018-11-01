/**
 * @filter           White balance
 * @description      Provides white balancing using kelvin
 * @param kelvin 1000 to 10000 (1000 is hot, 6500 is neutral, and 10000 is cold)
 */
function whiteBalance(kelvin) {

    var temp = kelvin;
    var m = Math;
    temp /= 100;
    var r, g, b;

    if (temp <= 66) {
        r = 255;
        g = m.min(m.max(99.4708025861 * m.log(temp) - 161.1195681661, 0), 255);
    } else {
        r = m.min(m.max(329.698727446 * m.pow(temp - 60, -0.1332047592), 0), 255);
        g = m.min(m.max(288.1221695283 * m.pow(temp - 60, -0.0755148492), 0), 255);
    }

    if (temp >= 66) {
        b = 255;
    } else if (temp <= 19) {
        b = 0;
    } else {
        b = temp - 10;
        b = m.min(m.max(138.5177312231 * m.log(b) - 305.0447927307, 0), 255);
    }

    var rgb_from_kel = {
        r: r/255,
        g: g/255,
        b: b/255
    };

    gl.kelvin = gl.kelvin || new Shader(null, '\
        uniform sampler2D texture;\
        uniform vec3 whitebal;\
        varying vec2 texCoord;\
        void main() {\
            vec4 color = texture2D(texture, texCoord);\
            color.rgb *= whitebal.rgb;\
            gl_FragColor = color;\
        }\
    ');

    console.log("HELLO FROM GL");

    simpleShader.call(this, gl.kelvin, {
        whitebal: [rgb_from_kel.r,rgb_from_kel.g,rgb_from_kel.b]
    });

    return this;
}
