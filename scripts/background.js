(function () {
    'use strict';

    console.log('[Blacksky Background] Инициализация...');

    var pi = Math.PI;
    var pi2 = 2 * Math.PI;

    function dtr(deg) { return deg * pi / 180; }
    function rtd(rad) { return rad * 180 / pi; }
    function rnd(a, b) { return arguments.length === 1 ? Math.random() * a : a + Math.random() * (b - a); }
    function rnd_sign() { return Math.random() > 0.5 ? 1 : -1; }
    function each(items, callback) { for (var i = 0; i < items.length; i++) callback(items[i], i); }
    function extend(options, defaults) { for (var key in options) if (defaults.hasOwnProperty(key)) defaults[key] = options[key]; return defaults; }

    function setupContainer() {
        let holder = document.getElementById('holder');
        if (!holder) {
            holder = document.createElement('div');
            holder.id = 'holder';
            document.body.appendChild(holder);
        }
        return holder;
    }

    function cleanup() {
        const oldCanvas = document.querySelector('#holder > canvas');
        if (oldCanvas) oldCanvas.remove();
    }

    function Waves(holder, options) {
        this.options = extend(options || {}, {
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

        const rotation = localStorage.getItem('BlackskyValue-canvas-linesRotation');
        if (rotation) this.options.rotation = parseFloat(rotation);

        const amplitude = localStorage.getItem('BlackskyValue-canvas-linesAmplitude');
        if (amplitude) this.options.amplitude = parseFloat(amplitude);

        this.waves = [];
        this.holder = typeof holder === 'string' ? document.querySelector(holder) : holder;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.holder.appendChild(this.canvas);
        this.hue = this.options.hue[0];
        this.hueFw = true;
        this.resize();
        this.init(this.options.preload);
        if (this.options.resize) {
            window.addEventListener('resize', () => this.resize(), false);
        }
    }

    Waves.prototype.init = function (preload) {
        for (let i = 0; i < this.options.waves; i++) {
            this.waves[i] = new Wave(this);
        }
        if (preload) this.preload();
    };

    Waves.prototype.preload = function () {
        for (let i = 0; i < this.options.waves; i++) {
            this.updateColor();
            for (let j = 0; j < this.options.width; j++) {
                this.waves[i].update();
            }
        }
    };

    Waves.prototype.render = function () {
        this.updateColor();
        this.clear();
        if (this.options.debug) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = '#f00';
            this.ctx.arc(this.centerX, this.centerY, this.radius, 0, pi2);
            this.ctx.stroke();
        }
        if (this.options.background) {
            this.background();
        }
        each(this.waves, (wave) => {
            wave.update();
            wave.draw();
        });
    };

    Waves.prototype.animate = function () {
        this.render();
        this.raf = requestAnimationFrame(() => this.animate());
    };

    Waves.prototype.clear = function () {
        this.ctx.clearRect(0, 0, this.width, this.height);
    };

    Waves.prototype.background = function () {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, 'rgb(255 255 255 / 5%)');
        gradient.addColorStop(1, 'rgb(255 255 255 / 0%)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);
    };

    Waves.prototype.resize = function () {
        const width = this.holder.offsetWidth;
        const height = this.holder.offsetHeight;
        this.scale = window.devicePixelRatio || 1;
        this.width = width * this.scale;
        this.height = height * this.scale;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';
        this.radius = Math.sqrt(Math.pow(this.width, 2) + Math.pow(this.height, 2)) / 2;
        this.centerX = this.width / 2;
        this.centerY = this.height / 2;
    };

    Waves.prototype.updateColor = function () {
        this.color = 'rgb(255 255 255 / 2.5%)';
        const color = localStorage.getItem('BlackskyValue-canvas-linesColor');
        if (color) this.color = `rgb(${color} / 2.5%)`;
        this.options.debug = !!document.getElementsByClassName('BattleComponentStyle-canvasContainer')[0];
    };

    function Wave(Waves) {
        this.Waves = Waves;
        this.Lines = [];
        this.angle = [rnd(pi2), rnd(pi2), rnd(pi2), rnd(pi2)];
        this.speed = [
            rnd(this.Waves.options.speed[0], this.Waves.options.speed[1]) * rnd_sign(),
            rnd(this.Waves.options.speed[0], this.Waves.options.speed[1]) * rnd_sign(),
            rnd(this.Waves.options.speed[0], this.Waves.options.speed[1]) * rnd_sign(),
            rnd(this.Waves.options.speed[0], this.Waves.options.speed[1]) * rnd_sign(),
        ];
    }

    Wave.prototype.update = function () {
        this.Lines.push(new Line(this, this.Waves.color));
        if (this.Lines.length > this.Waves.options.width) {
            this.Lines.shift();
        }
    };

    Wave.prototype.draw = function () {
        const ctx = this.Waves.ctx;
        const radius = this.Waves.radius;
        const radius3 = radius / 3;
        const x = this.Waves.centerX;
        const y = this.Waves.centerY;
        const rotation = dtr(this.Waves.options.rotation);
        const amplitude = this.Waves.options.amplitude;
        const debug = this.Waves.options.debug;

        each(this.Lines, (line, i) => {
            if (debug && i > 0) return;
            const angle = line.angle;
            const x1 = x - radius * Math.cos(angle[0] * amplitude + rotation);
            const y1 = y - radius * Math.sin(angle[0] * amplitude + rotation);
            const x2 = x + radius * Math.cos(angle[3] * amplitude + rotation);
            const y2 = y + radius * Math.sin(angle[3] * amplitude + rotation);
            const cpx1 = x - radius3 * Math.cos(angle[1] * amplitude * 2);
            const cpy1 = y - radius3 * Math.sin(angle[1] * amplitude * 2);
            const cpx2 = x + radius3 * Math.cos(angle[2] * amplitude * 2);
            const cpy2 = y + radius3 * Math.sin(angle[2] * amplitude * 2);

            ctx.strokeStyle = debug ? '#fff' : line.color;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, x2, y2);
            ctx.stroke();

            if (debug) {
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(cpx1, cpy1);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(cpx2, cpy2);
                ctx.stroke();
            }
        });
    };

    function Line(Wave, color) {
        this.angle = [
            Math.sin(Wave.angle[0] += Wave.speed[0]),
            Math.sin(Wave.angle[1] += Wave.speed[1]),
            Math.sin(Wave.angle[2] += Wave.speed[2]),
            Math.sin(Wave.angle[3] += Wave.speed[3])
        ];
        this.color = color;
    }

    window.initWaves = function () {

        cleanup();

        const wavesCount = parseInt(localStorage.getItem('BlackskyValue-canvas-linesCount') || '3', 10);
        const wavesWidth = parseInt(localStorage.getItem('BlackskyValue-canvas-linesWidth') || '200', 10);

        const holder = setupContainer();

        const waves = new Waves(holder, {
            waves: wavesCount,
            width: wavesWidth
        });

        window.BlackskyWaves = waves;
        waves.animate();

        console.log('[Blacksky Background] Анимация запущена');
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', window.initWaves);
    } else {
        window.initWaves();
    }

})();
