class BattleScene extends Phaser.Scene {
    constructor() { super('BattleScene'); }

    init(data) {
        this.enemyData  = data.enemy;
        this.areaIdx    = data.areaIdx;
        this.encounter  = data.encounter;
    }

    create() {
        const W = this.scale.width, H = this.scale.height;
        this.W = W; this.H = H;

        this.player   = { ...this.registry.get('player') };
        this.enemy    = { ...this.enemyData, curHp: this.enemyData.hp };
        this.busy     = false;
        this.log      = [];

        this.add.rectangle(W/2, H/2, W, H, 0x000011);
        this.buildBackground();
        this.buildCombatants();
        this.buildBars();
        this.buildLog();
        this.buildSkillButtons();
        this.buildHeaderBar();

        this.pushLog(`⚡ ${this.enemy.name} aparece!`);
    }

    buildBackground() {
        const W = this.W, H = this.H;
        const g = this.add.graphics();
        // Grid
        g.lineStyle(1, 0x002244, 0.2);
        for (let x = 0; x < W; x += 40) g.lineBetween(x, 0, x, H);
        for (let y = 0; y < H; y += 40) g.lineBetween(0, y, W, y);

        // Ground line
        g.lineStyle(2, 0x00ffff, 0.4);
        g.lineBetween(0, 340, W, 340);

        // Neon floor glow
        const glow = this.add.graphics();
        glow.fillStyle(0x00ffff, 0.04);
        glow.fillRect(0, 340, W, 12);

        // Scanline
        const scan = this.add.rectangle(0, 0, W, 2, 0x00ffff, 0.08).setOrigin(0,0);
        this.tweens.add({ targets: scan, y: H*0.85, duration: 4000, repeat:-1 });
    }

    buildHeaderBar() {
        const W = this.W;
        this.add.rectangle(W/2, 24, W, 48, 0x000022).setStrokeStyle(1, 0x00ffff, 0.3);

        const area = GameData.areas[this.areaIdx];
        this.add.text(14, 10, area.name.toUpperCase(), {
            fontSize:'12px', fontFamily:'monospace', color:'#' + area.color.toString(16).padStart(6,'0')
        });
        const totalEnc = area.enemies.length + 1;
        const encLabel = this.enemy.isBoss ? 'BOSS' : `${this.encounter+1}/${area.enemies.length}`;
        this.add.text(W - 14, 10, encLabel, {
            fontSize:'12px', fontFamily:'monospace', color: this.enemy.isBoss ? '#ff0000' : '#ffff00'
        }).setOrigin(1, 0);

        // Player level
        const p = this.player;
        this.add.text(W/2, 10, `LV ${p.level}  ₵${p.credits}`, {
            fontSize:'11px', fontFamily:'monospace', color:'#aabbcc'
        }).setOrigin(0.5, 0);
    }

    buildCombatants() {
        const W = this.W;
        // Player sprite
        const playerSpr = this.add.image(W * 0.22, 295, 'player').setScale(2.8);
        this.playerSpr = playerSpr;

        // Idle bob
        this.tweens.add({ targets: playerSpr, y: 292, duration: 900, yoyo:true, repeat:-1, ease:'Sine.easeInOut' });

        // Enemy sprite
        const key = this.enemy.isBoss ? 'boss' : 'enemy';
        const scale = this.enemy.isBoss ? 2.6 : 2.2;
        const enemySpr = this.add.image(W * 0.75, this.enemy.isBoss ? 282 : 290, key)
            .setScale(scale).setTint(this.enemy.color);
        this.enemySpr = enemySpr;
        this.tweens.add({ targets: enemySpr, y: enemySpr.y - 4, duration: 700, yoyo:true, repeat:-1, ease:'Sine.easeInOut' });

        // Name labels
        this.add.text(W * 0.22, 220, 'VOCÊ', {
            fontSize:'11px', fontFamily:'monospace', color:'#00ffff'
        }).setOrigin(0.5);

        this.enemyNameTxt = this.add.text(W * 0.75, 210, this.enemy.name.toUpperCase(), {
            fontSize:'11px', fontFamily:'monospace',
            color: '#' + this.enemy.color.toString(16).padStart(6,'0')
        }).setOrigin(0.5);

        // Boss indicator
        if (this.enemy.isBoss) {
            const flash = this.add.text(W * 0.75, 198, '⚠ BOSS', {
                fontSize:'10px', fontFamily:'monospace', color:'#ff0000'
            }).setOrigin(0.5);
            this.tweens.add({ targets: flash, alpha:0, duration:600, yoyo:true, repeat:-1 });
        }

        // Damage text pool
        this.dmgTexts = [];
    }

    buildBars() {
        const W = this.W, p = this.player;
        const barW = W * 0.42;

        // Player HP
        this.add.text(14, 358, 'HP', { fontSize:'10px', fontFamily:'monospace', color:'#00ff44' });
        this.pHpBg = this.add.rectangle(14 + barW/2, 373, barW, 12, 0x111122).setOrigin(0.5);
        this.pHpBar = this.add.rectangle(14, 373, barW * (p.hp/p.maxHp), 12, 0x00ff44).setOrigin(0,0.5);
        this.pHpTxt = this.add.text(14 + barW + 4, 368, `${p.hp}/${p.maxHp}`, {
            fontSize:'9px', fontFamily:'monospace', color:'#00ff44'
        });

        // Player Energy
        this.add.text(14, 389, 'EN', { fontSize:'10px', fontFamily:'monospace', color:'#00ccff' });
        this.pEnBg = this.add.rectangle(14 + barW/2, 403, barW, 9, 0x111122).setOrigin(0.5);
        this.pEnBar = this.add.rectangle(14, 403, barW * (p.energy/p.maxEnergy), 9, 0x00ccff).setOrigin(0,0.5);
        this.pEnTxt = this.add.text(14 + barW + 4, 398, `${p.energy}/${p.maxEnergy}`, {
            fontSize:'9px', fontFamily:'monospace', color:'#00ccff'
        });

        // Enemy HP
        const ex = W - 14 - barW;
        this.add.text(ex, 358, 'HP', { fontSize:'10px', fontFamily:'monospace', color:'#ff4444' });
        this.eHpBg = this.add.rectangle(ex + barW/2, 373, barW, 12, 0x111122).setOrigin(0.5);
        this.eHpBar = this.add.rectangle(ex, 373, barW, 12, 0xff2222).setOrigin(0,0.5);
        this.eHpTxt = this.add.text(ex, 386, `${this.enemy.hp}/${this.enemy.hp}`, {
            fontSize:'9px', fontFamily:'monospace', color:'#ff4444'
        });
    }

    buildLog() {
        const W = this.W;
        this.add.rectangle(W/2, 443, W - 20, 68, 0x050510).setStrokeStyle(1, 0x112233);
        this.logLines = [];
        for (let i = 0; i < 3; i++) {
            this.logLines.push(this.add.text(20, 418 + i * 20, '', {
                fontSize:'11px', fontFamily:'monospace', color:'#4488aa', wordWrap:{width:W-40}
            }));
        }
    }

    buildSkillButtons() {
        const W = this.W, H = this.H;
        const cols = 2, rows = 2;
        const bw = (W - 30) / 2, bh = 66;
        const startX = 10, startY = H - 148;

        this.skillBtns = [];
        GameData.skills.forEach((skill, i) => {
            const col = i % cols, row = Math.floor(i / cols);
            const bx = startX + col * (bw + 10);
            const by = startY + row * (bh + 8);
            const btn = this.add.rectangle(bx + bw/2, by + bh/2, bw, bh, 0x060614)
                .setStrokeStyle(1, 0x223355).setInteractive({ useHandCursor: true });

            const hexColor = '#' + skill.color.toString(16).padStart(6,'0');
            const nameTxt = this.add.text(bx + 10, by + 8, skill.name, {
                fontSize:'14px', fontFamily:'monospace', color: hexColor, fontStyle:'bold'
            });
            const costTxt = this.add.text(bx + bw - 8, by + 8, skill.cost > 0 ? `⚡${skill.cost}EN` : 'GRÁTIS', {
                fontSize:'9px', fontFamily:'monospace', color:'#445566'
            }).setOrigin(1, 0);
            const descTxt = this.add.text(bx + 10, by + 30, skill.desc, {
                fontSize:'9px', fontFamily:'monospace', color:'#334455'
            });

            btn.on('pointerover', () => {
                btn.setFillColor(0x0a0a22).setStrokeStyle(2, skill.color);
                nameTxt.setColor('#ffffff');
            });
            btn.on('pointerout', () => {
                btn.setFillColor(0x060614).setStrokeStyle(1, 0x223355);
                nameTxt.setColor(hexColor);
            });
            btn.on('pointerdown', () => this.useSkill(skill));

            this.skillBtns.push({ btn, nameTxt, costTxt, descTxt, skill });
        });
    }

    useSkill(skill) {
        if (this.busy) return;
        const p = this.player;

        if (p.energy < skill.cost) {
            this.pushLog('⚠ Energia insuficiente!');
            return;
        }

        this.busy = true;
        this.setButtonsEnabled(false);
        p.energy -= skill.cost;

        if (skill.heal > 0) {
            p.hp = Math.min(p.maxHp, p.hp + skill.heal);
            this.pushLog(`💊 Você usa ${skill.name} → cura ${skill.heal} HP`);
            this.flashSprite(this.playerSpr, 0x00ff88);
            this.showDmgText(this.playerSpr.x, this.playerSpr.y - 40, `+${skill.heal}`, '#00ff88');
            this.updatePlayerBars();
            this.time.delayedCall(700, () => this.enemyTurn());
        } else {
            const rawDmg = Math.max(1, Math.floor((p.atk * skill.dmgMul) - this.enemy.def * 0.5));
            this.enemy.curHp = Math.max(0, this.enemy.curHp - rawDmg);
            this.pushLog(`${this.skillIcon(skill)} Você usa ${skill.name} → ${rawDmg} de dano`);
            this.flashSprite(this.enemySpr, skill.color);
            this.showDmgText(this.enemySpr.x, this.enemySpr.y - 50, `-${rawDmg}`, '#ff4444');
            this.shakeSprite(this.enemySpr);
            this.updateEnemyBar();

            if (this.enemy.curHp <= 0) {
                this.time.delayedCall(700, () => this.onEnemyDead());
            } else {
                this.time.delayedCall(700, () => this.enemyTurn());
            }
        }
    }

    enemyTurn() {
        const p = this.player;
        const rawDmg = Math.max(1, this.enemy.atk - p.def);
        const variance = Phaser.Math.Between(-3, 3);
        const dmg = Math.max(1, rawDmg + variance);
        p.hp = Math.max(0, p.hp - dmg);

        this.pushLog(`💀 ${this.enemy.name} ataca → ${dmg} de dano`);
        this.flashSprite(this.playerSpr, 0xff0000);
        this.showDmgText(this.playerSpr.x, this.playerSpr.y - 50, `-${dmg}`, '#ff2222');
        this.shakeSprite(this.playerSpr);
        this.updatePlayerBars();

        if (p.hp <= 0) {
            this.time.delayedCall(700, () => this.onPlayerDead());
        } else {
            // Regen a little energy
            p.energy = Math.min(p.maxEnergy, p.energy + 5);
            this.updatePlayerBars();
            this.time.delayedCall(300, () => { this.busy = false; this.setButtonsEnabled(true); });
        }
    }

    onEnemyDead() {
        this.pushLog(`✨ ${this.enemy.name} derrotado!`);
        this.tweens.add({ targets: this.enemySpr, alpha:0, y: this.enemySpr.y+30, duration:600 });
        this.enemyNameTxt.setColor('#333333');

        const xpGain = this.enemy.xp;
        const crGain = this.enemy.cr;
        const p = this.player;
        p.credits += crGain;
        p.xp += xpGain;
        this.pushLog(`+${xpGain} XP  +₵${crGain}`);

        // Level up
        if (p.xp >= p.xpNext) {
            p.xp -= p.xpNext;
            p.level++;
            p.xpNext = Math.floor(p.xpNext * 1.5);
            p.maxHp  += 12;
            p.maxEnergy += 8;
            p.atk   += 3;
            p.def   += 1;
            p.hp     = p.maxHp;
            p.energy = p.maxEnergy;
            this.pushLog(`🔺 LEVEL UP! Nível ${p.level}!`);
        }

        this.registry.set('player', p);

        // Advance world state
        const w = this.registry.get('world');
        const area = GameData.areas[this.areaIdx];
        const totalEncounters = area.enemies.length + 1;
        w.encounter++;

        if (w.encounter >= totalEncounters) {
            // Area complete
            w.areaIdx = Math.min(this.areaIdx + 1, GameData.areas.length - 1);
            w.encounter = 0;
            this.registry.set('world', w);

            if (this.areaIdx === GameData.areas.length - 1) {
                this.time.delayedCall(1000, () => this.scene.start('VictoryScene'));
            } else {
                this.pushLog(`🏆 Zona concluída!`);
                this.time.delayedCall(1200, () => this.scene.start('WorldScene'));
            }
        } else {
            this.registry.set('world', w);
            this.time.delayedCall(1200, () => this.scene.start('WorldScene'));
        }
    }

    onPlayerDead() {
        this.registry.set('player', this.player);
        this.pushLog('💀 Você foi derrotado...');
        this.tweens.add({ targets: this.playerSpr, alpha:0, angle:-90, y:330, duration:700 });
        this.time.delayedCall(1200, () => this.scene.start('GameOverScene'));
    }

    // ── Helpers ────────────────────────────────────────────────────
    updatePlayerBars() {
        const p = this.player, W = this.W;
        const barW = W * 0.42;
        this.pHpBar.width  = barW * Math.max(0, p.hp / p.maxHp);
        this.pEnBar.width  = barW * Math.max(0, p.energy / p.maxEnergy);
        this.pHpTxt.setText(`${p.hp}/${p.maxHp}`);
        this.pEnTxt.setText(`${p.energy}/${p.maxEnergy}`);
    }

    updateEnemyBar() {
        const W = this.W, barW = W * 0.42;
        const ex = W - 14 - barW;
        this.eHpBar.width = barW * Math.max(0, this.enemy.curHp / this.enemy.hp);
        this.eHpTxt.setText(`${Math.max(0,this.enemy.curHp)}/${this.enemy.hp}`);
    }

    pushLog(msg) {
        this.log.push(msg);
        if (this.log.length > 3) this.log.shift();
        this.logLines.forEach((line, i) => {
            line.setText(this.log[i] || '');
            line.setAlpha(i === this.log.length - 1 ? 1 : 0.5);
        });
    }

    flashSprite(spr, color) {
        spr.setTint(color);
        this.time.delayedCall(200, () => spr.clearTint());
    }

    shakeSprite(spr) {
        const ox = spr.x;
        this.tweens.add({ targets: spr, x: ox + 8, duration:60, yoyo:true, repeat:3,
            onComplete: () => spr.setX(ox) });
    }

    showDmgText(x, y, msg, color) {
        const t = this.add.text(x, y, msg, {
            fontSize:'22px', fontFamily:'monospace', color, fontStyle:'bold',
            stroke:'#000000', strokeThickness:3
        }).setOrigin(0.5);
        this.tweens.add({ targets:t, y:y-40, alpha:0, duration:900,
            onComplete: () => t.destroy() });
    }

    setButtonsEnabled(enabled) {
        this.skillBtns.forEach(({btn}) => {
            btn.setInteractive(enabled);
            if (!enabled) btn.removeInteractive();
            else btn.setInteractive({ useHandCursor: true });
        });
    }

    skillIcon(skill) {
        const icons = { strike:'⚔', hack:'💻', emp:'⚡', heal:'💊' };
        return icons[skill.id] || '•';
    }
}
