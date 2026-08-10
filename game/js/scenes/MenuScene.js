class MenuScene extends Phaser.Scene {
    constructor() { super('MenuScene'); }

    create() {
        const W = this.scale.width, H = this.scale.height;

        // Background
        this.add.rectangle(W/2, H/2, W, H, 0x000011);

        // Grid lines
        const grid = this.add.graphics();
        grid.lineStyle(1, 0x0033aa, 0.25);
        for (let x = 0; x < W; x += 40) grid.lineBetween(x, 0, x, H);
        for (let y = 0; y < H; y += 40) grid.lineBetween(0, y, W, y);

        // Animated scanline
        const scanline = this.add.rectangle(0, 0, W, 2, 0x00ffff, 0.12).setOrigin(0,0);
        this.tweens.add({ targets: scanline, y: H, duration: 3000, repeat:-1 });

        // Logo glow bg
        this.add.rectangle(W/2, H*0.28, 340, 110, 0x001133, 0.9)
            .setStrokeStyle(1, 0x00ffff, 0.5);

        // Title
        const title = this.add.text(W/2, H*0.22, 'NEON RIFT', {
            fontSize: '52px', fontFamily: 'monospace', color: '#00ffff',
            stroke: '#0044aa', strokeThickness: 4
        }).setOrigin(0.5);

        // Glitch effect
        this.time.addEvent({ delay: 2500, loop: true, callback: () => {
            const ox = Phaser.Math.Between(-3, 3);
            title.setX(W/2 + ox);
            title.setStyle({ color: ox !== 0 ? '#ff00ff' : '#00ffff' });
            this.time.delayedCall(80, () => { title.setX(W/2); title.setStyle({ color: '#00ffff' }); });
        }});

        this.add.text(W/2, H*0.32, 'C Y B E R P U N K · R P G', {
            fontSize: '14px', fontFamily: 'monospace', color: '#0088aa', letterSpacing: 4
        }).setOrigin(0.5);

        // Story blurb
        this.add.text(W/2, H*0.44,
            'O ano é 2077.\nA megacorp NEXUS domina a cidade.\nVocê é o último hacker livre.\nDerrube o sistema.',
            { fontSize: '13px', fontFamily: 'monospace', color: '#6699aa', align: 'center', lineSpacing: 6 }
        ).setOrigin(0.5);

        // Start button
        const btnBg = this.add.rectangle(W/2, H*0.60, 220, 54, 0x001122)
            .setStrokeStyle(2, 0x00ffff).setInteractive({ useHandCursor: true });
        const btnTxt = this.add.text(W/2, H*0.60, '▶  INICIAR', {
            fontSize: '18px', fontFamily: 'monospace', color: '#00ffff', fontStyle: 'bold'
        }).setOrigin(0.5);

        btnBg.on('pointerover', () => { btnBg.setFillColor(0x002244); btnTxt.setColor('#ffffff'); });
        btnBg.on('pointerout',  () => { btnBg.setFillColor(0x001122); btnTxt.setColor('#00ffff'); });
        btnBg.on('pointerdown', () => this.scene.start('WorldScene'));

        // Pulse on button
        this.tweens.add({ targets:[btnBg,btnTxt], alpha:{ from:0.7, to:1 }, duration:900, yoyo:true, repeat:-1 });

        // Credits
        this.add.text(W/2, H*0.90, 'USE OS BOTÕES DE HABILIDADE PARA COMBATER', {
            fontSize: '10px', fontFamily: 'monospace', color: '#334455'
        }).setOrigin(0.5);

        // Version
        this.add.text(W - 10, H - 10, 'v1.0', {
            fontSize: '10px', fontFamily: 'monospace', color: '#222233'
        }).setOrigin(1, 1);

        // Neon particles
        for (let i = 0; i < 18; i++) {
            const px = Phaser.Math.Between(20, W-20);
            const py = Phaser.Math.Between(20, H-20);
            const clr = [0x00ffff, 0xff00ff, 0xffff00][i % 3];
            const dot = this.add.rectangle(px, py, 3, 3, clr, 0.6);
            this.tweens.add({
                targets: dot, alpha: 0, y: py - Phaser.Math.Between(20,60),
                duration: Phaser.Math.Between(1500,3500), delay: Phaser.Math.Between(0,2000),
                repeat: -1, yoyo: true
            });
        }
    }
}
