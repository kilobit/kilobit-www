// draw.js
// © 2020 Kilobit Labs Inc.

export function Drawing(el, f, w, h, cl) {

    let scale = window.devicePixelRatio;
    w = w || el.offsetWidth * scale;
    h = h || el.offsetHeight * scale;
    cl = cl || "drawing";
    
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    canvas.classList.add(cl);
    el.prepend(canvas);

    if(typeof(f) === "function") {
	const ctx = canvas.getContext("2d");
	f(ctx);
    }
    
    return canvas;
}

let Point = {
    x: 0,
    y: 0,

    string: function() {return `(${this.x}, ${this.y})`;},
}
let point = (x, y) => Object.assign({}, Point, {x:x, y:y});

let Color = {
    r: 0,
    g: 0,
    b: 0,
    a: 0,

    html: function() {

	let r = this.r.toString(16).padStart(2, '0');
	let g = this.g.toString(16).padStart(2, '0');
	let b = this.b.toString(16).padStart(2, '0');
	let a = Math.floor(this.a * 255).toString(16).padStart(2, '0');

	const str = `#${r}${g}${b}`;
	
	return (this.a == 0) ? str : `${str}${a}`; 
    },
    
    string: function() {
	return `r: ${this.r}, g: ${this.g}, b: ${this.b}, a: ${this.a}`;
    },
}
let color = (r, g, b, a) => Object.assign({}, Color, {r:r, g:g, b:b, a:a});

export function drawLine(ctx, c, start, end) {
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
}

export function drawRect(ctx, c, start, end) {

    ctx.lineWidth = 1;
    ctx.fillStyle = c.html();
    ctx.fillRect(start.x, start.y, end.x, end.y);
    
}

const width = ctx => ctx.canvas.width;
const height = ctx => ctx.canvas.height;
const fract = x => x % 1;
const clear = ctx => ctx.clearRect(0, 0, width(ctx), height(ctx));

export function drawFractal(ctx, c, count, w, h, off) {

    c = c || color(200, 200, 200, 0.0);
    count = count || 20;
    w = w || width(ctx);
    h = h || height(ctx);
    off = off || 0;
    
    const padx = Math.floor(w / count);
    const pady = Math.ceil(h / count);

    const offx = Math.floor(padx * off);
    const offy = Math.floor(pady * off);

    ctx.beginPath();
    drawLine(ctx, c, point(0, 0), point(0, h));
    drawLine(ctx, c, point(0, h), point(w, h));
    
    for(let i=0; i<count; i++) {

	let start = point(0, i * pady + offy);
	let end = point(i * padx + offx, h);

	//console.log(`${start.string()}, ${end.string()}`)
	
	drawLine(ctx, c, start, end);
    }

    ctx.lineWidth = 1;
    ctx.strokeStyle = c.html();
    ctx.stroke();
}

export function animateFractal(ctx, tf, te) {

    tf = tf || 0.2;
    te = te || -1;
    let last = 0;
    
    function draw(ts) {

	if(ts - last < 1000 / 30) {
	    window.requestAnimationFrame(draw);
	    return;
	}

	last = ts;
	
	let ms = fract(ts * tf / 1000);
	
	clear(ctx);
	drawFractal(ctx, null, null, null, null, ms);
	
	if(ts < te || te == -1) {
	    window.requestAnimationFrame(draw);
	}
	
    }

    window.requestAnimationFrame(draw);
}

