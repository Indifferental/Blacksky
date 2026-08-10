let a = document.createElement('div');

a.id = 'holder'

document.body.appendChild(a);

(function () {

        var pi = Math.PI

        var pi2 = 2 * Math.PI

        this.Waves = function (holder, options) {

        var Waves = this

        Waves.options = extend(options || {}, {
                resize: false,
                rotation: 30,
                waves: 3,
                width: 200,
                hue: [0, 0],
                amplitude: 0.4,
                background: true,
                preload: true,
                speed: [0.002, 0.004],
                debug: false,
        });

        if (localStorage.getItem('BlackskyValue-canvas-linesRotation')) {

                Waves.options.rotation = localStorage.getItem('BlackskyValue-canvas-linesRotation');

        };

        if (localStorage.getItem('BlackskyValue-canvas-linesAmplitude')) {

                Waves.options.amplitude = localStorage.getItem('BlackskyValue-canvas-linesAmplitude');

        };

        Waves.waves = [];

        Waves.holder = document.querySelector(holder);

        Waves.canvas = document.createElement('canvas');

        Waves.ctx = Waves.canvas.getContext('2d');

        Waves.holder.appendChild(Waves.canvas);

        Waves.hue = Waves.options.hue[0];

        Waves.hueFw = true

        Waves.stats = new Stats();

        Waves.resize();

        Waves.init(Waves.options.preload);

        if (Waves.options.resize)

                window.addEventListener('resize', function () {

                        Waves.resize();

                }, false);

        };

        Waves.prototype.init = function (preload) {

                var Waves = this

                var options = Waves.options

                for (var i = 0; i < options.waves; i++)

                        Waves.waves[i] = new Wave(Waves)

                if (preload) Waves.preload();

        };

        Waves.prototype.preload = function () {

                var Waves = this

                var options = Waves.options

                for (var i = 0; i < options.waves; i++) {

                        Waves.updateColor();

                        for (var j = 0; j < options.width; j++) {

                                Waves.waves[i].update();

                        };

                };

        };

        Waves.prototype.render = function () {

                var Waves = this

                var ctx = Waves.ctx

                var options = Waves.options

                Waves.updateColor();

                Waves.clear();

                if (Waves.options.debug) {

                        ctx.beginPath();

                        ctx.strokeStyle = '#f00'

                        ctx.arc(Waves.centerX, Waves.centerY, Waves.radius, 0, pi2);

                        ctx.stroke();

                };

                if (Waves.options.background) {

                        Waves.background();

                };

                each(Waves.waves, function (wave, i) {

                        wave.update();

                        wave.draw();

                });

        };

        Waves.prototype.animate = function () {

                var Waves = this

                Waves.render();

                window.requestAnimationFrame(Waves.animate.bind(Waves));

        };

        Waves.prototype.clear = function () {

                var Waves = this

                Waves.ctx.clearRect(0, 0, Waves.width, Waves.height);

        };

        Waves.prototype.background = function () {

                var Waves = this

                var ctx = Waves.ctx

                var gradient = Waves.ctx.createLinearGradient(0, 0, 0, Waves.height);

                // потолок отображения

                gradient.addColorStop(0, 'rgb(255 255 255 / 5%)');

                // низ отображения

                gradient.addColorStop(1, 'rgb(255 255 255 / 0%)');

                ctx.fillStyle = gradient

                ctx.fillRect(0, 0, Waves.width, Waves.height);

        };

        Waves.prototype.resize = function () {

                var Waves = this

                var width = Waves.holder.offsetWidth

                var height = Waves.holder.offsetHeight

                Waves.scale = window.devicePixelRatio || 1

                Waves.width = width * Waves.scale

                Waves.height = height * Waves.scale

                Waves.canvas.width = Waves.width

                Waves.canvas.height = Waves.height

                Waves.canvas.style.width = width + 'px'

                Waves.canvas.style.height = height + 'px'

                Waves.radius = Math.sqrt(Math.pow(Waves.width, 2) + Math.pow(Waves.height, 2)) / 2

                Waves.centerX = Waves.width / 2

                Waves.centerY = Waves.height / 2

        };

        Waves.prototype.updateColor = function () {

                var Waves = this

                Waves.color = 'rgb(255 255 255 / 2.5%)'

                if (localStorage.getItem('BlackskyValue-canvas-linesColor')) {

                        Waves.color = `rgb(${localStorage.getItem('BlackskyValue-canvas-linesColor')} / 2.5%)`

                };

                if (document.getElementsByClassName('BattleComponentStyle-canvasContainer')[0]) {

                        Waves.options.debug = true

                } else {

                        Waves.options.debug = false

                };

        };

        function Wave(Waves) {

                var Wave = this

                var speed = Waves.options.speed

                Wave.Waves = Waves

                Wave.Lines = [];

                Wave.angle = [

                        rnd(pi2),

                        rnd(pi2),

                        rnd(pi2),

                        rnd(pi2)

                ];

                Wave.speed = [

                        rnd(speed[0], speed[1]) * rnd_sign(),

                        rnd(speed[0], speed[1]) * rnd_sign(),

                        rnd(speed[0], speed[1]) * rnd_sign(),

                        rnd(speed[0], speed[1]) * rnd_sign(),

                ];

                return Wave

        };

        Wave.prototype.update = function () {

                var Wave = this

                var Lines = Wave.Lines

                var color = Wave.Waves.color

                Lines.push(new Line(Wave, color));

                if (Lines.length > Wave.Waves.options.width) {

                        Lines.shift();

                };

        };

        Wave.prototype.draw = function () {

                var Wave = this

                var Waves = Wave.Waves

                var ctx = Waves.ctx

                var radius = Waves.radius

                var radius3 = radius / 3

                var x = Waves.centerX

                var y = Waves.centerY

                var rotation = dtr(Waves.options.rotation);

                var amplitude = Waves.options.amplitude

                var debug = Waves.options.debug

                var Lines = Wave.Lines

                each(Lines, function (line, i) {

                        if (debug && i > 0) return

                        var angle = line.angle

                        var x1 = x - radius * Math.cos(angle[0] * amplitude + rotation);

                        var y1 = y - radius * Math.sin(angle[0] * amplitude + rotation);

                        var x2 = x + radius * Math.cos(angle[3] * amplitude + rotation);

                        var y2 = y + radius * Math.sin(angle[3] * amplitude + rotation);

                        var cpx1 = x - radius3 * Math.cos(angle[1] * amplitude * 2);

                        var cpy1 = y - radius3 * Math.sin(angle[1] * amplitude * 2);

                        var cpx2 = x + radius3 * Math.cos(angle[2] * amplitude * 2);

                        var cpy2 = y + radius3 * Math.sin(angle[2] * amplitude * 2);

                        ctx.strokeStyle = (debug) ? '#fff' : line.color

                        ctx.beginPath();

                        ctx.moveTo(x1, y1);

                        ctx.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, x2, y2);

                        ctx.stroke();

                        if (debug) {

                                ctx.strokeStyle = '#fff'

                                ctx.beginPath();

                                ctx.moveTo(x1, y1);

                                ctx.lineTo(cpx1, cpy1);

                                ctx.stroke();

                                ctx.beginPath();

                                ctx.moveTo(x2, y2);

                                ctx.lineTo(cpx2, cpy2);

                                ctx.stroke();

                                ctx.globalAlpha = 1

                        };

                });

        };

        function Line(Wave, color) {

                var Line = this

                var angle = Wave.angle

                var speed = Wave.speed

                Line.angle = [

                        Math.sin(angle[0] += speed[0]),

                        Math.sin(angle[1] += speed[1]),

                        Math.sin(angle[2] += speed[2]),

                        Math.sin(angle[3] += speed[3])

                ];

                Line.color = color

        };

        function Stats() {

                this.data = [];

        };

        Stats.prototype.time = function () {

                return (performance || Date).now();

        };

        Stats.prototype.log = function () {

                if (!this.last) {

                this.last = this.time();

                return 0

        };

        this.new = this.time();

        this.delta = this.new - this.last

        this.last = this.new

        this.data.push(this.delta);

        if (this.data.length > 10)

                this.data.shift();

        };

        function each(items, callback) {

                for (var i = 0; i < items.length; i++) {

                        callback(items[i], i);

                };

        };

        function extend(options, defaults) {

                for (var key in options)

                        if (defaults.hasOwnProperty(key))

                                defaults[key] = options[key];

                                return defaults

        };

        function dtr(deg) {

                return deg * pi / 180

        };

        function rtd(rad) {

                return rad * 180 / pi

        };

        function diagonal_angle(w, h) {

                var a = Math.atan2(h, w) * 1.27325

                return a

        };

        function rnd(a, b) {

                if (arguments.length == 1)

                        return Math.random() * a

                        return a + Math.random() * (b - a);

        };

        function rnd_sign() {

                return (Math.random() > 0.5) ? 1 : -1

        };

})();

const wavesCountStr = localStorage.getItem('BlackskyValue-canvas-linesCount');

const wavesWidthStr = localStorage.getItem('BlackskyValue-canvas-linesWidth');

let wavesCount = 3

let wavesWidth = 200

if (wavesCountStr !== null) {

        wavesCount = parseInt(wavesCountStr, 10);

};

if (wavesWidthStr !== null) {

        wavesWidth = parseInt(wavesWidthStr, 10);

};

const waves = new Waves('#holder', {

        waves: wavesCount,

        width: wavesWidth

});

waves.animate();
