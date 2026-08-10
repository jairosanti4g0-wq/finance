class BootScene extends Phaser.Scene {
    constructor() { super('BootScene'); }

    create() {
        const g = this.make.graphics({ x:0, y:0, add:false });

        // Player sprite (32x48)
        g.clear();
        g.fillStyle(0x00ffff); g.fillRect(10,0,12,12);   // head
        g.fillStyle(0x0088aa); g.fillRect(6,12,20,20);   // body
        g.fillStyle(0x006688); g.fillRect(4,10,4,18);    // left arm
        g.fillStyle(0x006688); g.fillRect(24,10,4,18);   // right arm
        g.fillStyle(0x004466); g.fillRect(8,32,8,16);    // left leg
        g.fillStyle(0x004466); g.fillRect(18,32,8,16);   // right leg
        g.fillStyle(0x00ffff, 0.8); g.fillRect(12,3,8,6);// visor
        g.fillStyle(0xff00ff); g.fillRect(14,14,4,4);    // chest light
        g.generateTexture('player', 32, 48);

        // Generic enemy base (40x56) - will be tinted
        g.clear();
        g.fillStyle(0xaaaaaa); g.fillRect(12,0,16,14);   // head
        g.fillStyle(0x888888); g.fillRect(6,14,28,22);   // body
        g.fillStyle(0x666666); g.fillRect(2,12,6,20);    // left arm
        g.fillStyle(0x666666); g.fillRect(32,12,6,20);   // right arm
        g.fillStyle(0x555555); g.fillRect(8,36,12,20);   // left leg
        g.fillStyle(0x555555); g.fillRect(22,36,12,20);  // right leg
        g.fillStyle(0xff0000, 0.9); g.fillRect(15,3,10,8);// visor
        g.generateTexture('enemy', 40, 56);

        // Boss sprite (56x72)
        g.clear();
        g.fillStyle(0x00ffff); g.fillRect(16,0,24,18);   // head
        g.fillStyle(0x0066aa); g.fillRect(8,18,40,26);   // body
        g.fillStyle(0x004488); g.fillRect(0,14,10,30);   // left arm
        g.fillStyle(0x004488); g.fillRect(46,14,10,30);  // right arm
        g.fillStyle(0x003366); g.fillRect(10,44,16,28);  // left leg
        g.fillStyle(0x003366); g.fillRect(30,44,16,28);  // right leg
        g.fillStyle(0xff00ff,0.9); g.fillRect(20,4,16,10);// visor
        g.fillStyle(0x00ffff); g.fillTriangle(8,18,0,0,16,0); // left horn
        g.fillStyle(0x00ffff); g.fillTriangle(48,18,40,0,56,0);// right horn
        g.generateTexture('boss', 56, 72);

        // HP bar fill
        g.clear(); g.fillStyle(0x00ff44); g.fillRect(0,0,200,14);
        g.generateTexture('bar_hp', 200, 14);

        // Energy bar fill
        g.clear(); g.fillStyle(0x00ccff); g.fillRect(0,0,200,10);
        g.generateTexture('bar_en', 200, 10);

        // XP bar fill
        g.clear(); g.fillStyle(0xff00ff); g.fillRect(0,0,200,8);
        g.generateTexture('bar_xp', 200, 8);

        // Bar background
        g.clear(); g.fillStyle(0x111122); g.fillRect(0,0,200,14);
        g.generateTexture('bar_bg', 200, 14);

        // Skill button
        g.clear();
        g.fillStyle(0x0a0a1a); g.fillRect(0,0,170,58);
        g.lineStyle(1, 0x00ffff); g.strokeRect(0,0,170,58);
        g.generateTexture('btn_skill', 170, 58);

        // Skill button hover
        g.clear();
        g.fillStyle(0x001122); g.fillRect(0,0,170,58);
        g.lineStyle(2, 0x00ffff); g.strokeRect(0,0,170,58);
        g.generateTexture('btn_skill_hl', 170, 58);

        g.destroy();

        // Init registry (global game state)
        this.registry.set('player', {
            hp: 100, maxHp: 100,
            energy: 60, maxEnergy: 60,
            atk: 14, def: 3,
            level: 1, xp: 0, xpNext: 50,
            credits: 0
        });
        this.registry.set('world', { areaIdx: 0, encounter: 0 });

        this.scene.start('MenuScene');
    }
}
