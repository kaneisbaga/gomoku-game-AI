const Board = {
    canvas: document.getElementById('chessBoard'),
    ctx: document.getElementById('chessBoard').getContext('2d'),
    padding: 45, size: 15, step: 31,

    init() {
        this.canvas.width = 520; this.canvas.height = 520;
        this.render();
    },
    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawCoordinates();
        this.drawGrid();
        this.drawStars();
    },
    drawCoordinates() {
        this.ctx.fillStyle = "#333"; this.ctx.font = "12px Arial";
        this.ctx.textAlign = "center"; this.ctx.textBaseline = "middle";
        const labels = "ABCDEFGHIJKLMNO".split("");
        for (let i = 0; i < this.size; i++) {
            this.ctx.fillText(labels[i], this.padding + i * this.step, this.padding - 20);
            this.ctx.fillText(labels[i], this.padding + i * this.step, this.padding + (this.size - 1) * this.step + 20);
            this.ctx.fillText(15 - i, this.padding - 20, this.padding + i * this.step);
            this.ctx.fillText(15 - i, this.padding + (this.size - 1) * this.step + 20, this.padding + i * this.step);
        }
    },
    drawGrid() {
        this.ctx.strokeStyle = "#000";
        for (let i = 0; i < this.size; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.padding, this.padding + i * this.step);
            this.ctx.lineTo(this.padding + (this.size - 1) * this.step, this.padding + i * this.step);
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.moveTo(this.padding + i * this.step, this.padding);
            this.ctx.lineTo(this.padding + i * this.step, this.padding + (this.size - 1) * this.step);
            this.ctx.stroke();
        }
    },
    drawStars() {
        const stars = [[3,3], [11,3], [7,7], [3,11], [11,11]];
        this.ctx.fillStyle = "#000";
        stars.forEach(pos => {
            this.ctx.beginPath();
            this.ctx.arc(this.padding + pos[0] * this.step, this.padding + pos[1] * this.step, 4, 0, 2*Math.PI);
            this.ctx.fill();
        });
    },
    drawPiece(i, j, isBlack) {
        const x = this.padding + i * this.step;
        const y = this.padding + j * this.step;
        this.ctx.beginPath();
        this.ctx.arc(x, y, 13, 0, 2 * Math.PI);
        const grad = this.ctx.createRadialGradient(x+2, y-2, 13, x+2, y-2, 0);
        if (isBlack) { grad.addColorStop(0, "#0a0a0a"); grad.addColorStop(1, "#636766"); }
        else { grad.addColorStop(0, "#d1d1d1"); grad.addColorStop(1, "#f9f9f9"); }
        this.ctx.fillStyle = grad; this.ctx.fill();
        this.ctx.strokeStyle = isBlack ? "#000" : "#ccc"; this.ctx.stroke();
    }
};