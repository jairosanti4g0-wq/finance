class WorldScene extends Phaser.Scene {
    constructor() { super('WorldScene'); }

    create() {
        const W = this.scale.width, H = this.scale.height;
        this.player = this.registry.get('player');
        this.worldState = this.registry.get('world');

        this.add.rectangle(W/2, H/2, W, H, 0x000011);

        // Grid
        const grid = this.add.graphics();
        grid.lineStyle(1, 0x002244, 0.3);
        for (let x = 0; x < W; x += 40) grid.lineBetween(x, 0, x, H);
        for (let y = 0; y < H; y += 40) grid.lineBetween(0, y, W, y);

        // Title bar
        this.add.rectangle(W/2, 28, W, 56, 0x000022).setStrokeStyle(1, 0x00ffff, 0.4);
        this.add.text(16, 14, 'NEON RIFT', { fontSize:'14px', fontFamily:'monospace', color:'#00ffff' });
        this.add.text(W-12, 14, 'MAPA', { fontSize:'14px', fontFamily:'monospace', color:'#334455' }).setOrigin(1,0);

        // Player stats strip
        this.drawStatsStrip(W, H);

        // Map title
        this.add.text(W/2, 76, 'SELECIONE UMA ZONA', {
            fontSize:'11px', fontFamily:'monospace', color:'#334455', letterSpacing:3
        }).setOrigin(0.5, 0);

        // Area nodes
        const nodeX = W / 2;
        const startY = 130;
        const stepY = 128;

        GameData.areas.forEach((area, i) => {
            const ny = startY + i * stepY;
            const unlocked = i <= this.worldState.areaIdx;
            const completed = i < this.worldState.areaIdx;
            this.drawAreaNode(nodeX, ny, area, i, unlocked, completed, W);

            // Connector line
            if (i < GameData.areas.length - 1) {
                const lineColor = completed ? 0x00ffff : 0x112233;
                const lineGfx = this.add.graphics();
                lineGfx.lineStyle(2, lineColor, unlocked ? 0.6 : 0.2);
                lineGfx.lineBetween(nodeX, ny + 50, nodeX, ny + stepY - 50);
            }
        });
    }

    drawStatsStrip(W, H) {
        const p = this.player;
        const sy = H - 100;
        this.add.rectangle(W/2, H - 52, W, 104, 0x000022).setStrokeStyle(1, 0x00ffff, 0.3);

        this.add.text(14, sy - 14, `LV ${p.level}`, { fontSize:'12px', fontFamily:'monospace', color:'#ffff00' });
        this.add.text(14, sy + 4,  `HP ${p.hp}/${p.maxHp}`, { fontSize:'11px', fontFamily:'monospace', color:'#00ff44' });
        this.add.text(14, sy + 20, `EN ${p.energy}/${p.maxEnergy}`, { fontSize:'11px', fontFamily:'monospace', color:'#00ccff' });

        // HP bar
        this.add.rectangle(W/2, sy - 4, W - 28, 10, 0x111122).setOrigin(0.5, 0.5);
        const hpW = Math.floor(((W - 28) * p.hp) / p.maxHp);
        this.add.rectangle(14 + hpW/2, sy - 4, hpW, 10, 0x00ff44).setOrigin(0.5, 0.5);

        // XP bar
        this.add.rectangle(W/2, sy + 34, W - 28, 8, 0x111122).setOrigin(0.5, 0.5);
        const xpW = Math.floor(((W - 28) * p.xp) / p.xpNext);
        this.add.rectangle(14 + xpW/2, sy + 34, xpW, 8, 0xff00ff).setOrigin(0.5, 0.5);
        this.add.text(W - 14, sy + 34, `XP ${p.xp}/${p.xpNext}`, {
            fontSize:'9px', fontFamily:'monospace', color:'#884488'
        }).setOrigin(1, 0.5);

        this.add.text(W - 14, sy + 4, `₵ ${p.credits}`, {
            fontSize:'12px', fontFamily:'monospace', color:'#ffff00'
        }).setOrigin(1, 0);
    }

    drawAreaNode(x, y, area, idx, unlocked, completed, W) {
        const alpha = unlocked ? 1 : 0.3;
        const bw = W - 40, bh = 90;
        const bg = this.add.rectangle(x, y, bw, bh, completed ? 0x001122 : 0x000a1a, alpha);
        bg.setStrokeStyle(completed ? 2 : 1, completed ? 0x00ff44 : (unlocked ? area.color : 0x223355));

        // Area name
        this.add.text(x - bw/2 + 16, y - 28, area.name.toUpperCase(), {
            fontSize:'15px', fontFamily:'monospace',
            color: completed ? '#00ff44' : (unlocked ? '#' + area.color.toString(16).padStart(6,'0') : '#223355'),
            fontStyle:'bold'
        });

        // Status badge
        const statusTxt = completed ? '✓ CONCLUÍDA' : (unlocked ? '► DISPONÍVEL' : '🔒 BLOQUEADA');
        const statusClr = completed ? '#00ff44' : (unlocked ? '#ffff00' : '#223355');
        this.add.text(x + bw/2 - 16, y - 28, statusTxt, {
            fontSize:'10px', fontFamily:'monospace', color: statusClr
        }).setOrigin(1, 0);

        // Encounter dots
        const totalEncounters = GameData.areas[idx].enemies.length + 1; // +1 boss
        const doneEncounters = completed ? totalEncounters :
            (idx === this.worldState.areaIdx ? this.worldState.encounter : 0);
        for (let d = 0; d < totalEncounters; d++) {
            const dotX = x - bw/2 + 16 + d * 22;
            const isDone = d < doneEncounters;
            const isBoss = d === totalEncounters - 1;
            const dotClr = isBoss ? 0xff0000 : 0x00ffff;
            this.add.circle(dotX, y + 10, isBoss ? 6 : 4, isDone ? dotClr : 0x112233, alpha);
        }

        // Enemies preview
        const previewEnemies = [GameData.areas[idx].enemies[0], '...', 'BOSS: ' + GameData.areas[idx].boss];
        this.add.text(x - bw/2 + 16, y + 22, `Inimigos: ${GameData.areas[idx].enemies.length}  +  BOSS`, {
            fontSize:'10px', fontFamily:'monospace', color: unlocked ? '#445566' : '#223344'
        });

        // Enter button (only for current unlocked area)
        if (unlocked && !completed) {
            const btnX = x + bw/2 - 80, btnY = y + 2;
            const btn = this.add.rectangle(btnX, btnY, 130, 36, 0x001133)
                .setStrokeStyle(2, area.color).setInteractive({ useHandCursor: true });
            const btnLabel = this.worldState.encounter === 0 ? 'ENTRAR' : 'CONTINUAR';
            const bt = this.add.text(btnX, btnY, btnLabel, {
                fontSize:'13px', fontFamily:'monospace',
                color:'#' + area.color.toString(16).padStart(6,'0'), fontStyle:'bold'
            }).setOrigin(0.5);

            btn.on('pointerover', () => { btn.setFillColor(0x001a33); bt.setColor('#ffffff'); });
            btn.on('pointerout',  () => { btn.setFillColor(0x001133); bt.setColor('#' + area.color.toString(16).padStart(6,'0')); });
            btn.on('pointerdown', () => this.enterArea(idx));
        }
    }

    enterArea(areaIdx) {
        const area = GameData.areas[areaIdx];
        const w = this.worldState;
        const isBoss = w.encounter >= area.enemies.length;
        const enemyId = isBoss ? area.boss : area.enemies[w.encounter];
        const enemyData = GameData.enemies.find(e => e.id === enemyId);

        this.scene.start('BattleScene', {
            enemy: { ...enemyData, isBoss },
            areaIdx,
            encounter: w.encounter
        });
    }
}
