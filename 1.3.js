function projectObject(src, proto) {
    parsedSrc = (typeof src === 'string') ? JSON.parse(src) : src;
    const res = intersection(parsedSrc, proto, {});
    return res;
}

function intersection(src, proto) {
    let res = {};
    for (const key in src) {
        if (proto.hasOwnProperty(key)) {
            if (src[key] instanceof Object && !Array.isArray(src[key])
                && proto[key] instanceof Object && !Array.isArray(proto[key])) {
                    res[key] = {};
                    res[key] = intersection(src[key], proto[key])
                } else {
                    res[key] = src[key];
                }
            }
        }
    return res;
}

//test values
const src = '{ "prop11": { "prop21": 21, "prop22": { "prop31": 31, "prop32": 32} }, "prop12": 12}'

const proto = {
    prop11: {
        prop22: null
    },
    prop13 : null
}

console.log(projectObject(src, proto));