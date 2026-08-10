class GameOverScene extends Phaser.Scene {
    constructor() { super('GameOverScene'); }

    create() {
        const W = this.scale.width, H = this.scale.height;
        this.add.rectangle(W/2, H/2, W, H, 0x000000);

        // Glitchy lines
        const g = this.add.graphics();
        for (let i = 0; i < 8; i++) {
            const y = Phaser.Math.Between(0, H);
            g.lineStyle(1, 0xff0000, 0.15);
            g.lineBetween(0, y, W, y);
        }

        // Scanline
        const scan = this.add.rectangle(0, 0, W, 3, 0xff0000, 0.12).setOrigin(0,0);
        this.tweens.add({ targets: scan, y: H, duration: 2500, repeat:-1 });

        this.add.text(W/2, H*0.30, 'GAME OVER', {
            fontSize:'48px', fontFamily:'monospace', color:'#ff0000',
            stroke:'#660000', strokeThickness:4
        }).setOrigin(0.5);

        this.add.text(W/2, H*0.42, 'VOCÊ FOI ELIMINADO', {
            fontSize:'14px', fontFamily:'monospace', color:'#660000', letterSpacing:4
        }).setOrigin(0.5);

        const p = this.registry.get('player');
        this.add.text(W/2, H*0.54,
            `Nível alcançado: ${p.level}\nCredits ganhos: ₵${p.credits}`,
            { fontSize:'13px', fontFamily:'monospace', color:'#445566', align:'center', lineSpacing:8 }
        ).setOrigin(0.5);

        // Retry button
        const btn = this.add.rectangle(W/2, H*0.70, 200, 50, 0x110000)
            .setStrokeStyle(2, 0xff0000).setInteractive({ useHandCursor: true });
        const bt = this.add.text(W/2, H*0.70, '↺  REINICIAR', {
            fontSize:'16px', fontFamily:'monospace', color:'#ff0000', fontStyle:'bold'
        }).setOrigin(0.5);

        btn.on('pointerover', () => { btn.setFillColor(0x220000); bt.setColor('#ffffff'); });
        btn.on('pointerout',  () => { btn.setFillColor(0x110000); bt.setColor('#ff0000'); });
        btn.on('pointerdown', () => {
            // Reset everything
            this.registry.set('player', {
                hp:100, maxHp:100, energy:60, maxEnergy:60,
                atk:14, def:3, level:1, xp:0, xpNext:50, credits:0
            });
            this.registry.set('world', { areaIdx:0, encounter:0 });
            this.scene.start('MenuScene');
        });

        this.tweens.add({ targets:[btn,bt], alpha:{from:0.6,to:1}, duration:700, yoyo:true, repeat:-1 });
    }
}

class VictoryScene extends Phaser.Scene {
    constructor() { super('VictoryScene'); }

    create() {
        const W = this.scale.width, H = this.scale.height;
        this.add.rectangle(W/2, H/2, W, H, 0x000022);

        // Particles
        for (let i = 0; i < 24; i++) {
            const px = Phaser.Math.Between(0, W);
            const py = Phaser.Math.Between(0, H);
            const clr = [0x00ffff, 0xff00ff, 0xffff00, 0x00ff88][i%4];
            const dot = this.add.circle(px, py, Phaser.Math.Between(2,5), clr, 0.8);
            this.tweens.add({ targets:dot, y:py-Phaser.Math.Between(40,120), alpha:0,
                duration:Phaser.Math.Between(1200,3000), delay:Phaser.Math.Between(0,2000),
                repeat:-1, yoyo:true });
        }

        this.add.text(W/2, H*0.20, '✨ VITÓRIA ✨', {
            fontSize:'40px', fontFamily:'monospace', color:'#ffff00',
            stroke:'#886600', strokeThickness:4
        }).setOrigin(0.5);

        this.add.text(W/2, H*0.32, 'A IA NEXUS FOI DESTRUÍDA', {
            fontSize:'14px', fontFamily:'monospace', color:'#00ffff', letterSpacing:2
        }).setOrigin(0.5);

        this.add.text(W/2, H*0.40, 'A cidade está livre.\nVocê é a lenda do cyberespaço.',
            { fontSize:'13px', fontFamily:'monospace', color:'#4488aa', align:'center', lineSpacing:8 }
        ).setOrigin(0.5);

        const p = this.registry.get('player');
        this.add.text(W/2, H*0.54,
            `Nível final: ${p.level}\nCredits: ₵${p.credits}\nXP: ${p.xp}`,
            { fontSize:'13px', fontFamily:'monospace', color:'#336655', align:'center', lineSpacing:8 }
        ).setOrigin(0.5);

        const btn = this.add.rectangle(W/2, H*0.72, 220, 52, 0x001122)
            .setStrokeStyle(2, 0x00ffff).setInteractive({ useHandCursor: true });
        const bt = this.add.text(W/2, H*0.72, '▶  JOGAR NOVAMENTE', {
            fontSize:'14px', fontFamily:'monospace', color:'#00ffff', fontStyle:'bold'
        }).setOrigin(0.5);

        btn.on('pointerover', () => { btn.setFillColor(0x002244); bt.setColor('#ffffff'); });
        btn.on('pointerout',  () => { btn.setFillColor(0x001122); bt.setColor('#00ffff'); });
        btn.on('pointerdown', () => {
            this.registry.set('player', {
                hp:100, maxHp:100, energy:60, maxEnergy:60,
                atk:14, def:3, level:1, xp:0, xpNext:50, credits:0
            });
            this.registry.set('world', { areaIdx:0, encounter:0 });
            this.scene.start('MenuScene');
        });

        this.tweens.add({ targets:[btn,bt], alpha:{from:0.7,to:1}, duration:900, yoyo:true, repeat:-1 });
    }
}
