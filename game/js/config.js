const config = {
    type: Phaser.AUTO,
    width: 390,
    height: 844,
    backgroundColor: '#000011',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [BootScene, MenuScene, WorldScene, BattleScene, GameOverScene, VictoryScene]
};

const game = new Phaser.Game(config);
