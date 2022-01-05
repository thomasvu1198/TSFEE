(function (factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        factory();
    }
}(function () {
    'use strict';
    var win = window;
    var doc = document;
    var random = Math.random;
    var floor = Math.floor;
    var isArray = Array.isArray;
    var canvasSupport = !!doc.createElement('canvas').getContext;
    var defaultCanvasWidth = 485;
    var defaultCanvasHeight = 300;
    var regTrimAll = /\s/g;

    function pInt(str) {
        return parseInt(str, 10);
    }

    function trimAll(str) {
        return str.replace(regTrimAll, '');
    }

    function randomColor() {
        return '#' + random().toString(16).slice(-6);
    }

    function limitRandom(max, min) {
        return max === min ? max : (random() * (max - min) + min);
    }

    function extend() {
        var arg = arguments,
            target = arg[0] || {},
            deep = false,
            length = arg.length,
            i = 1,
            value, attr;
        if (typeof target === 'boolean') {
            deep = target;
            target = arg[1] || {};
            i++;
        }
        for (; i < length; i++) {
            for (attr in arg[i]) {
                value = arg[i][attr];
                if (deep && (isPlainObject(value) || isArray(value))) {
                    target[attr] = extend(deep, isArray(value) ? [] : {}, value);
                } else {
                    target[attr] = value;
                }
            }
        }
        return target;
    }

    function typeChecking(obj, type) {
        return Object.prototype.toString.call(obj) === type;
    }

    function isFunction(obj) {
        return typeChecking(obj, '[object Function]');
    }

    function isPlainObject(obj) {
        return typeChecking(obj, '[object Object]');
    }

    function isElem(arg) {
        return !!(arg && arg.nodeType === 1);
    }

    var regGetCss = /^\d+(\.\d+)?[a-z]+$/i;

    function getCss(elem, attr) {
        var val = win.getComputedStyle(elem)[attr];
        return regGetCss.test(val) ? pInt(val) : val;
    }

    function offset(elem) {
        var left = elem.offsetLeft || 0;
        var top = elem.offsetTop || 0;
        while (elem = elem.offsetParent) {
            left += elem.offsetLeft;
            top += elem.offsetTop;
        }
        return {
            left: left,
            top: top
        };
    }

    function on(elem, evtName, handler) {
        elem.addEventListener(evtName, handler);
    }

    function off(elem, evtName, handler) {
        elem.removeEventListener(evtName, handler);
    }

    function setCanvasWH(context) {
        context.cw = context.c.width = getCss(context.container, 'width') || defaultCanvasWidth;
        context.ch = context.c.height = getCss(context.container, 'height') || defaultCanvasHeight;
        // context.cw = context.c.width = 1351;
        // context.ch = context.c.height = 637;
    }

    function createCanvas(context, constructor, selector, options) {
        if (canvasSupport && (context.container = isElem(selector) ? selector : doc.querySelector(selector))) {
            context.set = extend(true, {}, Particleground.commonConfig, constructor.defaultConfig, options);
            context.c = doc.createElement('canvas');
            context.cxt = context.c.getContext('2d');
            context.paused = false;
            setCanvasWH(context);
            context.container.innerHTML = '';
            context.container.appendChild(context.c);
            context.color = setColor(context.set.color);
            context.init();
        }
    }

    function scaleValue(val, scale) {
        return val > 0 && val < 1 ? scale * val : val;
    }

    function calcSpeed(max, min) {
        return (limitRandom(max, min) || max) * (random() > .5 ? 1 : -1);
    }

    function setColor(color) {
        var colorLength = isArray(color) ? color.length : false;
        var recolor = function () {
            return color[floor(random() * colorLength)];
        };
        return typeof color !== 'string' ? colorLength ? recolor : randomColor : function () {
            return color;
        };
    }

    function pause(context, callback) {
        if (context.set && !context.paused) {
            isFunction(callback) && callback.call(context, 'pause');
            context.paused = true;
        }
    }

    function open(context, callback) {
        if (context.set && context.paused) {
            isFunction(callback) && callback.call(context, 'open');
            context.paused = false;
            context.draw();
        }
    }

    function resize(context, callback) {
        if (context.set.resize) {
            on(win, 'resize', function () {
                var oldCW = context.cw;
                var oldCH = context.ch;
                setCanvasWH(context);
                var scaleX = context.cw / oldCW;
                var scaleY = context.ch / oldCH;
                if (isArray(context.dots)) {
                    context.dots.forEach(function (v) {
                        if (isPlainObject(v)) {
                            v.x *= scaleX;
                            v.y *= scaleY;
                        }
                    });
                }
                isFunction(callback) && callback.call(context, scaleX, scaleY);
                context.paused && context.draw();
            });
        }
    }

    function modifyPrototype(prototype, names, callback) {
        if (canvasSupport) {
            trimAll(names).split(',').forEach(function (name) {
                prototype[name] = function () {
                    util[name](this, callback);
                };
            });
        }
    }

    win.requestAnimationFrame = (function (win) {
        return win.requestAnimationFrame || win.webkitRequestAnimationFrame || win.mozRequestAnimationFrame || function (fn) {
            win.setTimeout(fn, 1000 / 60);
        };
    })(win);
    var util = {
        pInt: pInt,
        trimAll: trimAll,
        randomColor: randomColor,
        limitRandom: limitRandom,
        extend: extend,
        typeChecking: typeChecking,
        isFunction: isFunction,
        isPlainObject: isPlainObject,
        isElem: isElem,
        getCss: getCss,
        offset: offset,
        createCanvas: createCanvas,
        scaleValue: scaleValue,
        calcSpeed: calcSpeed,
        setColor: setColor,
        pause: pause,
        open: open,
        resize: resize,
        modifyPrototype: modifyPrototype
    };
    var Particleground = {
        version: '1.1.0',
        canvasSupport: canvasSupport,
        commonConfig: {
            opacity: 1,
            color: [],
            resize: true
        },
        util: util,
        inherit: {
            requestAnimationFrame: function () {
                !this.paused && win.requestAnimationFrame(this.draw.bind(this));
            },
            pause: function () {
                pause(this);
            },
            open: function () {
                open(this);
            },
            resize: function () {
                resize(this);
            }
        },
        event: {
            on: on,
            off: off
        },
        extend: function (prototype) {
            return extend(prototype, this.inherit), this;
        }
    };
    win.Particleground = Particleground;
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return Particleground;
        });
    }
    return Particleground;
})); +
function (Particleground) {
    'use strict';
    var util = Particleground.util,
        random = Math.random,
        abs = Math.abs,
        pi2 = Math.PI * 2;

    function Lowpoly(selector, options) {
        util.createCanvas(this, Lowpoly, selector, options);
    }

    Lowpoly.defaultConfig = {
        color: '#fff',
        maxSpeed: .6,
        minSpeed: 0
    };
    var fn = Lowpoly.prototype = {
        version: '1.0.0',
        init: function () {
            this.dots = [];
            this.createDots();
            this.draw();
            this.resize();
        },
        snowShape: function () {
            var set = this.set,
                calcSpeed = util.calcSpeed,
                maxSpeed = set.maxSpeed,
                minSpeed = set.minSpeed,
                r = util.limitRandom(set.maxR, set.minR);
            return {
                x: random() * this.cw,
                y: -r,
                r: r,
                vx: calcSpeed(maxSpeed, minSpeed),
                vy: abs(r * calcSpeed(maxSpeed, minSpeed)),
                color: this.color()
            };
        },
        createDots: function () {
            var count = util.pInt(random() * 6);
            var dots = this.dots;
            while (count--) {
                dots.push(this.snowShape());
            }
        },
        draw: function () {
            var self = this,
                set = self.set,
                cxt = self.cxt,
                cw = self.cw,
                ch = self.ch,
                paused = self.paused;
            cxt.clearRect(0, 0, cw, ch);
            cxt.globalAlpha = set.opacity;
            self.dots.forEach(function (v, i, array) {
                var x = v.x;
                var y = v.y;
                var r = v.r;
                cxt.save();
                cxt.beginPath();
                cxt.arc(x, y, r, 0, pi2);
                cxt.fillStyle = v.color;
                cxt.fill();
                cxt.restore();
                if (!paused) {
                    v.x += v.vx;
                    v.y += v.vy;
                    if (random() > .99 && random() > .5) {
                        v.vx *= -1;
                    }
                    if (x < 0 || x - r > cw) {
                        array.splice(i, 1, self.snowShape());
                    } else if (y - r >= ch) {
                        array.splice(i, 1);
                    }
                }
            });
            if (!paused && random() > .9) {
                self.createDots();
            }
            self.requestAnimationFrame();
        }
    };
    Particleground.extend(fn);
    Particleground.lowpoly = fn.constructor = Lowpoly;
}(Particleground); +
function (Particleground) {
    'use strict';
    var util = Particleground.util,
        event = Particleground.event,
        random = Math.random,
        abs = Math.abs,
        pi2 = Math.PI * 2;

    function checkParentsProperty(elem, property, value) {
        var getCss = util.getCss;
        while (elem = elem.offsetParent) {
            if (getCss(elem, property) === value) {
                return true;
            }
        }
        return false;
    }

    function Particle(selector, options) {
        util.createCanvas(this, Particle, selector, options);
    }

    Particle.defaultConfig = {
        num: .12,
        maxR: 2.4,
        minR: .6,
        maxSpeed: 1,
        minSpeed: 0,
        distance: 130,
        lineWidth: .2,
        range: 160,
        eventElem: null
    };
    var fn = Particle.prototype = {
        version: '1.1.0',
        init: function () {
            if (this.set.num > 0) {
                if (this.set.range > 0) {
                    if (!util.isElem(this.set.eventElem) && this.set.eventElem !== document) {
                        this.set.eventElem = this.c;
                    }
                    this.posX = random() * this.cw;
                    this.posY = random() * this.ch;
                    this.event();
                }
                this.createDots();
                this.draw();
                this.resize();
            }
        },
        createDots: function () {
            var cw = this.cw,
                ch = this.ch,
                set = this.set,
                color = this.color,
                limitRandom = util.limitRandom,
                calcSpeed = util.calcSpeed,
                maxSpeed = set.maxSpeed,
                minSpeed = set.minSpeed,
                maxR = set.maxR,
                minR = set.minR,
                num = util.pInt(util.scaleValue(set.num, cw)),
                dots = [],
                r;
            while (num--) {
                r = limitRandom(maxR, minR);
                dots.push({
                    x: limitRandom(cw - r, r),
                    y: limitRandom(ch - r, r),
                    r: r,
                    vx: calcSpeed(maxSpeed, minSpeed),
                    vy: calcSpeed(maxSpeed, minSpeed),
                    color: color()
                });
            }
            this.dots = dots;
        },
        draw: function () {
            var set = this.set;
            if (set.num <= 0) {
                return;
            }
            var cw = this.cw;
            var ch = this.ch;
            var cxt = this.cxt;
            var paused = this.paused;
            cxt.clearRect(0, 0, cw, ch);
            cxt.lineWidth = set.lineWidth;
            cxt.globalAlpha = set.opacity;
            this.dots.forEach(function (v) {
                var r = v.r;
                cxt.save();
                cxt.beginPath();
                cxt.arc(v.x, v.y, r, 0, pi2);
                cxt.fillStyle = v.color;
                cxt.fill();
                cxt.restore();
                if (!paused) {
                    v.x += v.vx;
                    v.y += v.vy;
                    var x = v.x;
                    var y = v.y;
                    if (x + r >= cw || x - r <= 0) {
                        v.vx *= -1;
                    }
                    if (y + r >= ch || y - r <= 0) {
                        v.vy *= -1;
                    }
                }
            });
            if (set.range > 0) {
                this.connectDots();
            }
            this.requestAnimationFrame();
        },
        connectDots: function () {
            var cxt = this.cxt,
                set = this.set,
                dis = set.distance,
                posX = this.posX,
                posY = this.posY,
                posR = set.range,
                dots = this.dots,
                length = dots.length;
            dots.forEach(function (v, i) {
                var vx = v.x;
                var vy = v.y;
                var color = v.color;
                while (++i < length) {
                    var sibDot = dots[i];
                    var sx = sibDot.x;
                    var sy = sibDot.y;
                    if (abs(vx - sx) <= dis && abs(vy - sy) <= dis && (abs(vx - posX) <= posR && abs(vy - posY) <= posR || abs(sx - posX) <= posR && abs(sy - posY) <= posR)) {
                        cxt.save();
                        cxt.beginPath();
                        cxt.moveTo(vx, vy);
                        cxt.lineTo(sx, sy);
                        cxt.strokeStyle = color;
                        cxt.stroke();
                        cxt.restore();
                    }
                }
            });
        },
        getElemOffset: function () {
            return (this.elemOffset = this.elemOffset ? util.offset(this.set.eventElem) : null);
        },
        event: function () {
            if (this.set.eventElem !== document) {
                this.elemOffset = true;
            }
            this.moveHandler = function (e) {
                this.posX = e.pageX;
                this.posY = e.pageY;
                if (this.getElemOffset()) {
                    if (checkParentsProperty(this.set.eventElem, 'position', 'fixed')) {
                        this.posX = e.clientX;
                        this.posY = e.clientY;
                    }
                    this.posX -= this.elemOffset.left;
                    this.posY -= this.elemOffset.top;
                }
            }.bind(this);
            eventHandler.call(this);
        }
    };
    Particleground.extend(fn);

    function eventHandler(eventType) {
        var context = this;
        var set = context.set;
        if (set.num > 0 && set.range > 0) {
            eventType = eventType === 'pause' ? 'off' : 'on';
            event[eventType](set.eventElem, 'mousemove', context.moveHandler);
            event[eventType](set.eventElem, 'touchmove', context.moveHandler);
        }
    }

    util.modifyPrototype(fn, 'pause, open', eventHandler);
    util.modifyPrototype(fn, 'resize', function (scaleX, scaleY) {
        if (this.set.num > 0 && this.set.range > 0) {
            this.posX *= scaleX;
            this.posY *= scaleY;
            this.getElemOffset();
        }
    });
    Particleground.particle = fn.constructor = Particle;
}(Particleground); +
function (Particleground) {
    'use strict';
    var util = Particleground.util,
        random = Math.random,
        abs = Math.abs,
        pi2 = Math.PI * 2;

    function Snow(selector, options) {
        util.createCanvas(this, Snow, selector, options);
    }

    Snow.defaultConfig = {
        color: '#fff',
        maxR: 6.5,
        minR: .4,
        maxSpeed: .6,
        minSpeed: 0
    };
    var fn = Snow.prototype = {
        version: '1.1.0',
        init: function () {
            this.dots = [];
            this.createDots();
            this.draw();
            this.resize();
        },
        snowShape: function () {
            var set = this.set,
                calcSpeed = util.calcSpeed,
                maxSpeed = set.maxSpeed,
                minSpeed = set.minSpeed,
                r = util.limitRandom(set.maxR, set.minR);
            return {
                x: random() * this.cw,
                y: -r,
                r: r,
                vx: calcSpeed(maxSpeed, minSpeed),
                vy: abs(r * calcSpeed(maxSpeed, minSpeed)),
                color: this.color()
            };
        },
        createDots: function () {
            var count = util.pInt(random() * 6);
            var dots = this.dots;
            while (count--) {
                dots.push(this.snowShape());
            }
        },
        draw: function () {
            var self = this,
                set = self.set,
                cxt = self.cxt,
                cw = self.cw,
                ch = self.ch,
                paused = self.paused;
            cxt.clearRect(0, 0, cw, ch);
            cxt.globalAlpha = set.opacity;
            self.dots.forEach(function (v, i, array) {
                var x = v.x;
                var y = v.y;
                var r = v.r;
                cxt.save();
                cxt.beginPath();
                cxt.arc(x, y, r, 0, pi2);
                cxt.fillStyle = v.color;
                cxt.fill();
                cxt.restore();
                if (!paused) {
                    v.x += v.vx;
                    v.y += v.vy;
                    if (random() > .99 && random() > .5) {
                        v.vx *= -1;
                    }
                    if (x < 0 || x - r > cw) {
                        array.splice(i, 1, self.snowShape());
                    } else if (y - r >= ch) {
                        array.splice(i, 1);
                    }
                }
            });
            if (!paused && random() > .9) {
                self.createDots();
            }
            self.requestAnimationFrame();
        }
    };
    Particleground.extend(fn);
    Particleground.snow = fn.constructor = Snow;
}(Particleground); +
function (Particleground) {
    'use strict';
    var util = Particleground.util,
        limitRandom = util.limitRandom,
        randomColor = util.randomColor,
        scaleValue = util.scaleValue,
        random = Math.random,
        sin = Math.sin,
        pi2 = Math.PI * 2,
        UNDEFINED = 'undefined',
        isArray = Array.isArray;

    function Wave(selector, options) {
        util.createCanvas(this, Wave, selector, options);
    }

    Wave.defaultConfig = {
        num: 3,
        fillColor: [],
        lineColor: [],
        lineWidth: [],
        offsetLeft: [],
        offsetTop: [],
        crestHeight: [],
        rippleNum: [],
        speed: [],
        fill: false,
        stroke: true
    };
    var fn = Wave.prototype = {
        version: '1.0.0',
        init: function () {
            if (this.set.num > 0) {
                this.rippleLength = [];
                this.attrNormalize();
                this.createDots();
                this.draw();
                this.resize();
            }
        },
        attrNormalize: function () {
            ['fillColor', 'lineColor', 'lineWidth', 'offsetLeft', 'offsetTop', 'crestHeight', 'rippleNum', 'speed', 'fill', 'stroke'].forEach(function (attr) {
                this.attrProcessor(attr);
            }.bind(this));
        },
        attrProcessor: function (attr) {
            var num = this.set.num;
            var attrVal = this.set[attr];
            var std = attrVal;
            var scale = attr === 'offsetLeft' ? this.cw : this.ch;
            if (!isArray(attrVal)) {
                std = this.set[attr] = [];
            }
            while (num--) {
                var val = isArray(attrVal) ? attrVal[num] : attrVal;
                std[num] = typeof val === UNDEFINED ? this.generateAttrVal(attr) : this.scaleValue(attr, val, scale);
                if (attr === 'rippleNum') {
                    this.rippleLength[num] = this.cw / std[num];
                }
            }
        },
        scaleValue: function (attr, val, scale) {
            if (attr === 'offsetTop' || attr === 'offsetLeft' || attr === 'crestHeight') {
                return scaleValue(val, scale);
            }
            return val;
        },
        generateAttrVal: function (attr) {
            var cw = this.cw;
            var ch = this.ch;
            switch (attr) {
                case 'lineColor':
                case 'fillColor':
                    attr = randomColor();
                    break;
                case 'lineWidth':
                    attr = limitRandom(2, .2);
                    break;
                case 'offsetLeft':
                    attr = random() * cw;
                    break;
                case 'offsetTop':
                case 'crestHeight':
                    attr = random() * ch;
                    break;
                case 'rippleNum':
                    attr = limitRandom(cw / 2, 1);
                    break;
                case 'speed':
                    attr = limitRandom(.4, .1);
                    break;
                case 'fill':
                    attr = false;
                    break;
                case 'stroke':
                    attr = true;
                    break;
            }
            return attr;
        },
        setOffsetTop: function (topVal) {
            if (this.set.num > 0) {
                if (!isArray(topVal) && topVal > 0 && topVal < 1) {
                    topVal *= this.ch;
                }
                this.set.offsetTop.forEach(function (v, i, array) {
                    array[i] = isArray(topVal) ? (topVal[i] || v) : topVal;
                });
            }
        },
        createDots: function () {
            var dots = this.dots = [];
            var rippleLength = this.rippleLength;
            var cw = this.cw;
            var num = this.set.num;
            while (num--) {
                var line = [];
                var step = pi2 / rippleLength[num];
                for (var j = 0; j < cw; j++) {
                    line.push({
                        x: j,
                        y: j * step
                    });
                }
                dots[num] = line;
            }
        },
        draw: function () {
            var set = this.set;
            if (set.num <= 0) {
                return;
            }
            var cxt = this.cxt,
                cw = this.cw,
                ch = this.ch,
                paused = this.paused;
            cxt.clearRect(0, 0, cw, ch);
            cxt.globalAlpha = set.opacity;
            this.dots.forEach(function (lineDots, i) {
                var crestHeight = set.crestHeight[i];
                var offsetLeft = set.offsetLeft[i];
                var offsetTop = set.offsetTop[i];
                var speed = set.speed[i];
                cxt.save();
                cxt.beginPath();
                lineDots.forEach(function (v, j) {
                    cxt[j ? 'lineTo' : 'moveTo'](v.x, crestHeight * sin(v.y + offsetLeft) + offsetTop);
                    !paused && (v.y -= speed);
                });
                if (set.fill[i]) {
                    cxt.lineTo(cw, ch);
                    cxt.lineTo(0, ch);
                    cxt.closePath();
                    cxt.fillStyle = set.fillColor[i];
                    cxt.fill();
                }
                if (set.stroke[i]) {
                    cxt.lineWidth = set.lineWidth[i];
                    cxt.strokeStyle = set.lineColor[i];
                    cxt.stroke();
                }
                cxt.restore();
            });
            this.requestAnimationFrame();
        }
    };
    Particleground.extend(fn);
    util.modifyPrototype(fn, 'resize', function (scaleX, scaleY) {
        if (this.set.num > 0) {
            this.dots.forEach(function (lineDots) {
                lineDots.forEach(function (v) {
                    v.x *= scaleX;
                    v.y *= scaleY;
                });
            });
        }
    });
    Particleground.wave = fn.constructor = Wave;
}(Particleground);