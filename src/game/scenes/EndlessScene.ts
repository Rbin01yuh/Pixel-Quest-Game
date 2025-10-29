import Phaser from 'phaser';

export class EndlessScene extends Phaser.Scene {
  private player?: Phaser.Physics.Arcade.Sprite;
  private platforms?: Phaser.Physics.Arcade.Group;
  private coins?: Phaser.Physics.Arcade.Group;
  private enemies?: Phaser.Physics.Arcade.Group;
  private powerUps?: Phaser.Physics.Arcade.Group;
  private projectiles?: Phaser.Physics.Arcade.Group;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private spaceKey?: Phaser.Input.Keyboard.Key;
  private score: number = 0;
  private lives: number = 3;
  private distance: number = 0;
  private characterType: string = 'lumo';
  private backgroundLayers: Phaser.GameObjects.TileSprite[] = [];
  private gameSpeed: number = 2;
  private platformTimer: number = 0;
  private coinTimer: number = 0;
  private enemyTimer: number = 0;
  private powerUpTimer: number = 0;
  private biomeColors: number[][] = [
    [0x240046, 0x3C096C, 0x5A189A, 0x7209B7, 0x9D4EDD],
    [0x03045E, 0x0077B6, 0x00B4D8, 0x90E0EF, 0xCAF0F8],
    [0x370617, 0x6A040F, 0x9D0208, 0xD00000, 0xDC2F02],
    [0x004B23, 0x006400, 0x007F5F, 0x2D6A4F, 0x52B788],
    [0x4A0E4E, 0x81689D, 0xC2AFF0, 0xE8D5E8, 0xFFC2E2]
  ];
  private currentBiome: number = 0;
  private invincible: boolean = false;
  private canShoot: boolean = true;
  private shootCooldown: number = 250;
  private playerTrail?: Phaser.GameObjects.Particles.ParticleEmitter;
  private comboMultiplier: number = 1;
  private comboTimer: number = 0;
  private lastPlatformY: number = 500;
  private safeRespawn: boolean = false;
  
  constructor() {
    super({ key: 'EndlessScene' });
  }
  
  init(data: any) {
    this.score = 0;
    this.lives = 3;
    this.distance = 0;
    this.characterType = data.character || 'lumo';
    this.gameSpeed = 2;
    this.invincible = false;
    this.comboMultiplier = 1;
    this.comboTimer = 0;
    this.safeRespawn = false;
  }
  
  preload() {
    this.createSprites();
  }
  
  createSprites() {
    // Player sprites
    const graphics = this.add.graphics();
    if (this.characterType === 'lumo') {
      graphics.fillStyle(0x00FFFF, 0.5);
      graphics.fillCircle(16, 16, 14);
      graphics.fillStyle(0x00FFFF, 1);
      graphics.fillCircle(16, 16, 12);
      graphics.fillStyle(0xFFFFFF, 1);
      graphics.fillCircle(12, 12, 3);
      graphics.fillCircle(20, 12, 3);
      graphics.fillStyle(0xFF69B4, 1);
      graphics.fillEllipse(16, 20, 6, 3);
    } else if (this.characterType === 'pixy') {
      graphics.fillStyle(0xFFB347, 0.5);
      graphics.fillCircle(16, 16, 12);
      graphics.fillStyle(0xFFB347, 1);
      graphics.fillCircle(16, 16, 10);
      graphics.fillStyle(0xFFFFFF, 1);
      graphics.fillCircle(12, 14, 2);
      graphics.fillCircle(20, 14, 2);
      graphics.fillStyle(0xFFB347, 1);
      graphics.fillTriangle(8, 16, 4, 12, 8, 12);
      graphics.fillTriangle(24, 16, 28, 12, 24, 12);
    } else {
      graphics.fillStyle(0x90EE90, 0.3);
      graphics.fillEllipse(16, 18, 20, 14);
      graphics.fillStyle(0x90EE90, 1);
      graphics.fillEllipse(16, 18, 18, 12);
      graphics.fillStyle(0x228B22, 1);
      graphics.fillEllipse(16, 14, 14, 10);
      graphics.fillStyle(0xFFFFFF, 1);
      graphics.fillCircle(12, 14, 2);
      graphics.fillCircle(20, 14, 2);
    }
    graphics.generateTexture('player', 32, 32);
    graphics.destroy();
    
    // Platform with gradient
    const gfx2 = this.add.graphics();
    gfx2.fillGradientStyle(0x9D4EDD, 0x9D4EDD, 0x7B2CBF, 0x7B2CBF, 1);
    gfx2.fillRect(0, 0, 64, 16);
    gfx2.fillStyle(0xC77DFF, 1);
    for (let i = 0; i < 64; i += 8) {
      gfx2.fillRect(i, 0, 4, 2);
    }
    gfx2.generateTexture('platform', 64, 16);
    gfx2.destroy();
    
    // Coin with shine
    const gfx3 = this.add.graphics();
    gfx3.fillStyle(0xFFD700, 1);
    gfx3.fillCircle(8, 8, 7);
    gfx3.fillStyle(0xFFA500, 1);
    gfx3.fillCircle(8, 8, 5);
    gfx3.fillStyle(0xFFFFFF, 0.8);
    gfx3.fillCircle(6, 6, 2);
    gfx3.generateTexture('coin', 16, 16);
    gfx3.destroy();
    
    // Enemies
    const enemyTypes = ['slime', 'robofrog', 'bat'];
    const enemyColors = [0xFF0000, 0xFF6B00, 0xFF00FF];
    
    enemyTypes.forEach((type, idx) => {
      const gfx = this.add.graphics();
      gfx.fillStyle(enemyColors[idx], 0.3);
      gfx.fillCircle(16, 16, 18);
      gfx.fillStyle(enemyColors[idx], 1);
      gfx.fillRect(6, 6, 20, 20);
      gfx.fillStyle(0xFFFFFF, 1);
      gfx.fillCircle(12, 12, 3);
      gfx.fillCircle(20, 12, 3);
      gfx.fillStyle(0x000000, 1);
      gfx.fillCircle(12, 12, 1.5);
      gfx.fillCircle(20, 12, 1.5);
      gfx.generateTexture(type, 32, 32);
      gfx.destroy();
    });
    
    // Projectile with glow
    const gfx5 = this.add.graphics();
    gfx5.fillStyle(0x00FFFF, 0.5);
    gfx5.fillCircle(6, 6, 6);
    gfx5.fillStyle(0x00FFFF, 1);
    gfx5.fillCircle(6, 6, 4);
    gfx5.fillStyle(0xFFFFFF, 1);
    gfx5.fillCircle(6, 6, 2);
    gfx5.generateTexture('projectile', 12, 12);
    gfx5.destroy();
    
    // Particle
    const gfx6 = this.add.graphics();
    gfx6.fillStyle(0xFFFFFF, 1);
    gfx6.fillCircle(4, 4, 3);
    gfx6.generateTexture('particle', 8, 8);
    gfx6.destroy();
    
    // Power-ups
    const gfx7 = this.add.graphics();
    gfx7.fillStyle(0xFF0000, 1);
    gfx7.fillCircle(8, 8, 7);
    gfx7.fillStyle(0xFFFFFF, 1);
    gfx7.fillRect(6, 8, 4, 1);
    gfx7.fillRect(7.5, 6.5, 1, 4);
    gfx7.generateTexture('powerup_health', 16, 16);
    gfx7.destroy();
    
    const gfx8 = this.add.graphics();
    gfx8.fillStyle(0x00CED1, 1);
    gfx8.fillCircle(8, 8, 7);
    gfx8.fillStyle(0xFFFFFF, 1);
    gfx8.fillCircle(8, 8, 5);
    gfx8.generateTexture('powerup_shield', 16, 16);
    gfx8.destroy();
  }
  
  create() {
    this.createParallaxBackground();
    
    // Ambient particles
    const ambientParticles = this.add.particles(0, 0, 'particle', {
      speed: { min: 30, max: 60 },
      scale: { start: 0.4, end: 0 },
      alpha: { start: 0.7, end: 0 },
      lifespan: 3000,
      frequency: 200,
      emitting: true,
      blendMode: 'ADD',
      tint: [0x00FFFF, 0xFF69B4, 0xFFD700, 0x9D4EDD]
    });
    
    ambientParticles.setScrollFactor(0.5);
    ambientParticles.setEmitZone({
      source: new Phaser.Geom.Rectangle(0, 0, 800, 600),
      type: 'random'
    });
    
    // Create groups
    this.platforms = this.physics.add.group({
      immovable: true,
      allowGravity: false
    });
    
    this.coins = this.physics.add.group();
    this.enemies = this.physics.add.group();
    this.powerUps = this.physics.add.group();
    this.projectiles = this.physics.add.group();
    
    // Create initial platforms - more platforms for safety
    for (let i = 0; i < 20; i++) {
      const x = i * 80 + 50;
      const y = 500 - Math.random() * 100;
      this.createPlatform(x, y);
    }
    
    // Create player
    this.player = this.physics.add.sprite(150, 300, 'player');
    this.player.setBounce(0.15);
    this.player.setCollideWorldBounds(true);
    this.player.setScale(1.3);
    this.player.setMaxVelocity(350, 1000);
    
    // Player trail
    this.playerTrail = this.add.particles(0, 0, 'particle', {
      speed: 30,
      scale: { start: 0.5, end: 0 },
      alpha: { start: 0.7, end: 0 },
      lifespan: 400,
      blendMode: 'ADD',
      follow: this.player,
      tint: this.characterType === 'lumo' ? 0x00FFFF : this.characterType === 'pixy' ? 0xFFB347 : 0x90EE90,
      frequency: 40
    });
    
    // Physics
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.enemies, this.platforms);
    
    this.physics.add.overlap(this.player, this.coins, this.collectCoin as any, undefined, this);
    this.physics.add.overlap(this.player, this.enemies, this.hitEnemy as any, undefined, this);
    this.physics.add.overlap(this.player, this.powerUps, this.collectPowerUp as any, undefined, this);
    this.physics.add.overlap(this.projectiles, this.enemies, this.projectileHitEnemy as any, undefined, this);
    
    // Input
    this.cursors = this.input.keyboard?.createCursorKeys();
    this.spaceKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    
    // Camera
    this.cameras.main.setBounds(0, 0, Number.MAX_SAFE_INTEGER, 600);
    this.cameras.main.startFollow(this.player, true, 0.15, 0.15);
    
    this.emitScoreUpdate();
  }
  
  createParallaxBackground() {
    const colors = this.biomeColors[this.currentBiome];
    
    for (let i = 0; i < 5; i++) {
      const graphics = this.add.graphics();
      graphics.fillStyle(colors[i], 0.4);
      graphics.fillRect(0, i * 120, 1600, 120);
      
      for (let j = 0; j < 50; j++) {
        const x = Math.random() * 1600;
        const y = i * 120 + Math.random() * 120;
        const size = Math.random() * 2.5 + 0.5;
        graphics.fillStyle(0xFFFFFF, Math.random() * 0.9 + 0.1);
        graphics.fillCircle(x, y, size);
      }
      
      graphics.generateTexture(`bg${i}`, 1600, 120);
      graphics.destroy();
      
      const layer = this.add.tileSprite(0, i * 120, 1600, 120, `bg${i}`);
      layer.setOrigin(0, 0);
      layer.setScrollFactor((i + 1) * 0.15);
      this.backgroundLayers.push(layer);
    }
  }
  
  createPlatform(x: number, y: number) {
    if (!this.platforms) return;
    
    const platform = this.platforms.create(x, y, 'platform');
    platform.body.immovable = true;
    platform.body.allowGravity = false;
    platform.setVelocityX(-this.gameSpeed * 50);
    
    this.tweens.add({
      targets: platform,
      alpha: { from: 0.9, to: 1 },
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    this.lastPlatformY = y;
  }
  
  createCoin(x: number, y: number) {
    if (!this.coins) return;
    
    const coin = this.coins.create(x, y, 'coin');
    coin.setVelocityX(-this.gameSpeed * 50);
    coin.setScale(1.2);
    
    this.tweens.add({
      targets: coin,
      angle: 360,
      duration: 2000,
      repeat: -1
    });
    
    this.tweens.add({
      targets: coin,
      y: y - 10,
      scale: { from: 1.2, to: 1.4 },
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }
  
  createEnemy(x: number, y: number) {
    if (!this.enemies) return;
    
    const types = ['slime', 'robofrog', 'bat'];
    const maxTypes = Math.min(1 + Math.floor(this.distance / 500), 3);
    const type = types[Math.floor(Math.random() * maxTypes)];
    
    const enemy = this.enemies.create(x, y, type);
    enemy.setVelocityX(-this.gameSpeed * 70);
    enemy.setBounce(1);
    enemy.setData('type', type);
    enemy.setData('health', Math.ceil(1 + this.distance / 1000));
    
    const scale = 1 + (this.distance / 2000);
    enemy.setScale(Math.min(scale, 1.8));
    
    if (type === 'bat') {
      enemy.body.allowGravity = false;
      enemy.setVelocityY(Phaser.Math.Between(-50, 50));
    }
    
    this.tweens.add({
      targets: enemy,
      scaleX: enemy.scale + 0.1,
      scaleY: enemy.scale - 0.1,
      duration: 400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }
  
  createPowerUp(x: number, y: number) {
    if (!this.powerUps) return;
    
    const type = Math.random() < 0.5 ? 'powerup_health' : 'powerup_shield';
    const powerUp = this.powerUps.create(x, y, type);
    powerUp.setVelocityX(-this.gameSpeed * 50);
    powerUp.setData('type', type);
    
    this.tweens.add({
      targets: powerUp,
      y: y - 20,
      angle: 360,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }
  
  collectCoin(player: any, coin: any) {
    coin.disableBody(true, true);
    
    const particles = this.add.particles(coin.x, coin.y, 'particle', {
      speed: { min: 100, max: 200 },
      scale: { start: 0.8, end: 0 },
      lifespan: 600,
      quantity: 12,
      blendMode: 'ADD',
      tint: 0xFFD700
    });
    particles.explode();
    
    this.comboTimer = 2000;
    const points = Math.floor(100 * this.comboMultiplier);
    this.score += points;
    
    this.showFloatingText(`+${points}`, coin.x, coin.y, 0xFFD700);
    this.emitScoreUpdate();
    this.emitSoundEvent('coin');
  }
  
  collectPowerUp(player: any, powerUp: any) {
    powerUp.disableBody(true, true);
    
    const type = powerUp.getData('type');
    const particles = this.add.particles(powerUp.x, powerUp.y, 'particle', {
      speed: { min: 100, max: 200 },
      scale: { start: 1, end: 0 },
      lifespan: 800,
      quantity: 20,
      blendMode: 'ADD',
      tint: type === 'powerup_health' ? 0xFF0000 : 0x00CED1
    });
    particles.explode();
    
    if (type === 'powerup_health') {
      this.lives = Math.min(this.lives + 1, 5);
      this.showFloatingText('+1 Life', powerUp.x, powerUp.y, 0xFF0000);
      this.emitLifeUpdate();
    } else {
      this.activateShield();
      this.showFloatingText('Shield!', powerUp.x, powerUp.y, 0x00CED1);
    }
    
    this.emitSoundEvent('powerup');
  }
  
  activateShield() {
    this.invincible = true;
    
    const shield = this.add.circle(0, 0, 25, 0x00CED1, 0.3);
    shield.setStrokeStyle(3, 0x00CED1);
    
    this.tweens.add({
      targets: shield,
      alpha: { from: 0.5, to: 0.2 },
      scale: { from: 1, to: 1.3 },
      duration: 500,
      yoyo: true,
      repeat: 9,
      onUpdate: () => {
        if (this.player) {
          shield.setPosition(this.player.x, this.player.y);
        }
      },
      onComplete: () => {
        this.invincible = false;
        shield.destroy();
      }
    });
  }
  
  hitEnemy(player: any, enemy: any) {
    if (this.invincible) {
      enemy.setVelocityX(-enemy.body.velocity.x * 2);
      return;
    }
    
    const particles = this.add.particles(player.x, player.y, 'particle', {
      speed: { min: 150, max: 250 },
      scale: { start: 1.2, end: 0 },
      lifespan: 400,
      quantity: 20,
      blendMode: 'ADD',
      tint: 0xFF0000
    });
    particles.explode();
    
    this.cameras.main.shake(300, 0.015);
    this.cameras.main.flash(200, 255, 0, 0, false);
    
    this.lives--;
    this.comboMultiplier = 1;
    this.emitLifeUpdate();
    this.emitSoundEvent('hit');
    
    if (this.lives <= 0) {
      this.gameOver();
    } else {
      this.activateShield();
      this.respawnPlayer();
    }
  }
  
  respawnPlayer() {
    if (!this.player) return;
    
    // Find a safe platform to respawn on
    const safePlatforms = this.platforms?.children.entries.filter((p: any) => {
      return p.active && p.x > this.cameras.main.scrollX + 100 && p.x < this.cameras.main.scrollX + 400;
    });
    
    if (safePlatforms && safePlatforms.length > 0) {
      const platform = safePlatforms[0] as any;
      this.player.setPosition(platform.x, platform.y - 50);
    } else {
      this.player.setPosition(this.cameras.main.scrollX + 200, 300);
    }
    
    this.player.setVelocity(0, 0);
    
    const respawnParticles = this.add.particles(this.player.x, this.player.y, 'particle', {
      speed: { min: 100, max: 200 },
      scale: { start: 1, end: 0 },
      alpha: { start: 1, end: 0 },
      lifespan: 500,
      quantity: 30,
      blendMode: 'ADD',
      tint: 0x00FFFF
    });
    respawnParticles.explode();
  }
  
  projectileHitEnemy(projectile: any, enemy: any) {
    projectile.destroy();
    
    let health = enemy.getData('health') || 1;
    health--;
    
    if (health <= 0) {
      const particles = this.add.particles(enemy.x, enemy.y, 'particle', {
        speed: { min: 150, max: 300 },
        scale: { start: 1.2, end: 0 },
        lifespan: 600,
        quantity: 25,
        blendMode: 'ADD',
        tint: 0x00FF00
      });
      particles.explode();
      
      enemy.disableBody(true, true);
      
      this.comboMultiplier = Math.min(this.comboMultiplier + 0.5, 10);
      this.comboTimer = 2000;
      
      const points = Math.floor(200 * this.comboMultiplier);
      this.score += points;
      
      this.showFloatingText(`+${points}`, enemy.x, enemy.y, 0x00FF00);
      
      if (this.comboMultiplier > 1) {
        this.showFloatingText(`x${this.comboMultiplier.toFixed(1)}`, enemy.x, enemy.y - 30, 0xFF69B4);
      }
      
      this.emitScoreUpdate();
      this.emitSoundEvent('hit');
    } else {
      enemy.setData('health', health);
      enemy.setTint(0xFF0000);
      this.time.delayedCall(100, () => {
        if (enemy.active) enemy.clearTint();
      });
      
      const hitParticles = this.add.particles(enemy.x, enemy.y, 'particle', {
        speed: { min: 50, max: 100 },
        scale: { start: 0.6, end: 0 },
        lifespan: 300,
        quantity: 8,
        blendMode: 'ADD',
        tint: 0xFFFFFF
      });
      hitParticles.explode();
    }
  }
  
  shootProjectile() {
    if (!this.player || !this.projectiles || !this.canShoot) return;
    
    this.canShoot = false;
    
    const direction = this.player.flipX ? -1 : 1;
    const projectile = this.projectiles.create(
      this.player.x + (direction * 20),
      this.player.y,
      'projectile'
    );
    
    projectile.setVelocityX(500 * direction);
    projectile.setCollideWorldBounds(false);
    projectile.setScale(1.2);
    
    const trail = this.add.particles(0, 0, 'particle', {
      speed: 30,
      scale: { start: 0.5, end: 0 },
      alpha: { start: 0.8, end: 0 },
      lifespan: 200,
      blendMode: 'ADD',
      follow: projectile,
      tint: 0x00FFFF,
      frequency: 30
    });
    
    this.tweens.add({
      targets: projectile,
      alpha: { from: 1, to: 0.7 },
      scale: { from: 1.2, to: 1.5 },
      duration: 100,
      yoyo: true,
      repeat: -1
    });
    
    this.time.delayedCall(2000, () => {
      if (projectile.active) {
        trail.destroy();
        projectile.destroy();
      }
    });
    
    this.time.delayedCall(this.shootCooldown, () => {
      this.canShoot = true;
    });
    
    this.emitSoundEvent('shoot');
  }
  
  showFloatingText(text: string, x: number, y: number, color: number) {
    const textObj = this.add.text(x, y, text, {
      fontSize: '20px',
      color: `#${color.toString(16).padStart(6, '0')}`,
      fontFamily: 'Arial',
      stroke: '#000000',
      strokeThickness: 4
    });
    textObj.setOrigin(0.5);
    
    this.tweens.add({
      targets: textObj,
      y: y - 50,
      alpha: { from: 1, to: 0 },
      scale: { from: 1, to: 1.5 },
      duration: 1000,
      ease: 'Power2',
      onComplete: () => textObj.destroy()
    });
  }
  
  gameOver() {
    this.cameras.main.fade(1000, 128, 0, 128);
    this.time.delayedCall(1000, () => {
      this.emitGameEnd(false);
    });
  }
  
  emitScoreUpdate() {
    const event = new CustomEvent('pixelquest-score', {
      detail: { score: this.score, distance: Math.floor(this.distance) }
    });
    window.dispatchEvent(event);
  }
  
  emitLifeUpdate() {
    const event = new CustomEvent('pixelquest-lives', {
      detail: { lives: this.lives }
    });
    window.dispatchEvent(event);
  }
  
  emitGameEnd(victory: boolean) {
    const event = new CustomEvent('pixelquest-gameover', {
      detail: { victory, score: this.score }
    });
    window.dispatchEvent(event);
  }
  
  emitSoundEvent(soundType: string) {
    const event = new CustomEvent('pixelquest-sound', {
      detail: { type: soundType }
    });
    window.dispatchEvent(event);
  }
  
  update(time: number, delta: number) {
    if (!this.player || !this.cursors) return;
    
    // Update distance and speed
    this.distance += delta * this.gameSpeed / 1000;
    this.gameSpeed = Math.min(6, 2 + this.distance / 800);
    
    // Change biome
    const newBiome = Math.floor(this.distance / 600) % this.biomeColors.length;
    if (newBiome !== this.currentBiome) {
      this.currentBiome = newBiome;
      this.transitionBiome();
    }
    
    // Update parallax
    this.backgroundLayers.forEach((layer, index) => {
      layer.tilePositionX += (index + 1) * this.gameSpeed * 0.4;
    });
    
    // Combo timer
    if (this.comboTimer > 0) {
      this.comboTimer -= delta;
      if (this.comboTimer <= 0) {
        this.comboMultiplier = 1;
      }
    }
    
    // Player movement with smooth acceleration
    const speed = this.characterType === 'pixy' ? 240 : this.characterType === 'koza' ? 160 : 200;
    const acceleration = 700;
    
    if (this.cursors.left.isDown) {
      this.player.setAccelerationX(-acceleration);
      this.player.setFlipX(true);
    } else if (this.cursors.right.isDown) {
      this.player.setAccelerationX(acceleration);
      this.player.setFlipX(false);
    } else {
      this.player.setAccelerationX(0);
      this.player.setVelocityX(this.player.body!.velocity.x * 0.92);
    }
    
    // Jump
    const jumpPower = this.characterType === 'pixy' ? -420 : this.characterType === 'koza' ? -340 : -390;
    if (this.cursors.up.isDown && this.player.body?.touching.down) {
      this.player.setVelocityY(jumpPower);
      
      const jumpParticles = this.add.particles(this.player.x, this.player.y + 16, 'particle', {
        speed: { min: 50, max: 120 },
        angle: { min: 60, max: 120 },
        scale: { start: 0.7, end: 0 },
        lifespan: 500,
        quantity: 10,
        blendMode: 'ADD',
        tint: 0x9D4EDD
      });
      jumpParticles.explode();
      
      this.emitSoundEvent('jump');
    }
    
    // Shoot
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey!)) {
      this.shootProjectile();
    }
    
    // Check if player fell - respawn instead of game over
    if (this.player.y > 650) {
      if (!this.safeRespawn) {
        this.safeRespawn = true;
        this.lives--;
        this.emitLifeUpdate();
        this.emitSoundEvent('hit');
        
        if (this.lives <= 0) {
          this.gameOver();
        } else {
          this.cameras.main.flash(200, 255, 100, 0, false);
          this.respawnPlayer();
          this.activateShield();
          
          this.time.delayedCall(500, () => {
            this.safeRespawn = false;
          });
        }
      }
    }
    
    // Spawn platforms with better spacing
    this.platformTimer += delta;
    const platformSpawnInterval = Math.max(400, 1000 / this.gameSpeed);
    
    if (this.platformTimer > platformSpawnInterval) {
      const x = this.cameras.main.scrollX + 900;
      const yVariation = Math.random() * 120 - 60;
      const y = Phaser.Math.Clamp(this.lastPlatformY + yVariation, 350, 550);
      this.createPlatform(x, y);
      this.platformTimer = 0;
    }
    
    // Spawn coins
    this.coinTimer += delta;
    if (this.coinTimer > 1200 / this.gameSpeed) {
      const x = this.cameras.main.scrollX + 900;
      const y = 300 - Math.random() * 150;
      this.createCoin(x, y);
      this.coinTimer = 0;
    }
    
    // Spawn enemies
    this.enemyTimer += delta;
    if (this.enemyTimer > 2500 / this.gameSpeed) {
      const x = this.cameras.main.scrollX + 900;
      const y = 350 - Math.random() * 100;
      this.createEnemy(x, y);
      this.enemyTimer = 0;
    }
    
    // Spawn power-ups
    this.powerUpTimer += delta;
    if (this.powerUpTimer > 8000) {
      if (Math.random() < 0.4) {
        const x = this.cameras.main.scrollX + 900;
        const y = 300 - Math.random() * 150;
        this.createPowerUp(x, y);
      }
      this.powerUpTimer = 0;
    }
    
    // Remove off-screen objects
    const removeX = this.cameras.main.scrollX - 150;
    
    this.platforms?.children.entries.forEach((platform: any) => {
      if (platform.x < removeX) {
        platform.destroy();
      }
    });
    
    this.coins?.children.entries.forEach((coin: any) => {
      if (coin.x < removeX) {
        coin.destroy();
      }
    });
    
    this.enemies?.children.entries.forEach((enemy: any) => {
      if (enemy.x < removeX) {
        enemy.destroy();
      }
      
      // Bat AI
      if (enemy.active && enemy.getData('type') === 'bat') {
        const dx = this.player!.x - enemy.x;
        const dy = this.player!.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 250) {
          const currentVelX = enemy.body.velocity.x;
          enemy.setVelocityX(currentVelX + dx * 0.3);
          enemy.setVelocityY(dy * 0.4);
        }
      }
    });
    
    this.powerUps?.children.entries.forEach((powerUp: any) => {
      if (powerUp.x < removeX) {
        powerUp.destroy();
      }
    });
    
    // Clamp player velocity
    if (Math.abs(this.player.body!.velocity.x) > speed) {
      this.player.setVelocityX(Math.sign(this.player.body!.velocity.x) * speed);
    }
    
    // Update platforms velocity
    this.platforms?.children.entries.forEach((platform: any) => {
      if (platform.active) {
        platform.setVelocityX(-this.gameSpeed * 50);
      }
    });
    
    this.coins?.children.entries.forEach((coin: any) => {
      if (coin.active) {
        coin.setVelocityX(-this.gameSpeed * 50);
      }
    });
    
    this.enemies?.children.entries.forEach((enemy: any) => {
      if (enemy.active) {
        const baseVel = enemy.getData('type') === 'bat' ? -this.gameSpeed * 60 : -this.gameSpeed * 70;
        enemy.body.velocity.x = Math.min(enemy.body.velocity.x, baseVel);
      }
    });
    
    this.powerUps?.children.entries.forEach((powerUp: any) => {
      if (powerUp.active) {
        powerUp.setVelocityX(-this.gameSpeed * 50);
      }
    });
  }
  
  transitionBiome() {
    this.cameras.main.flash(1200, 100, 100, 100, false, (camera: any, progress: number) => {
      if (progress === 1) {
        this.backgroundLayers.forEach(layer => layer.destroy());
        this.backgroundLayers = [];
        this.createParallaxBackground();
      }
    });
  }
}
