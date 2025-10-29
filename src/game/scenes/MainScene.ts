import Phaser from 'phaser';

export class MainScene extends Phaser.Scene {
  private player?: Phaser.Physics.Arcade.Sprite;
  private platforms?: Phaser.Physics.Arcade.StaticGroup;
  private coins?: Phaser.Physics.Arcade.Group;
  private enemies?: Phaser.Physics.Arcade.Group;
  private powerUps?: Phaser.Physics.Arcade.Group;
  private projectiles?: Phaser.Physics.Arcade.Group;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private spaceKey?: Phaser.Input.Keyboard.Key;
  private score: number = 0;
  private lives: number = 3;
  private level: number = 1;
  private coinsCollected: number = 0;
  private totalCoins: number = 0;
  private enemiesDefeated: number = 0;
  private totalEnemies: number = 0;
  private particleEmitter?: Phaser.GameObjects.Particles.ParticleEmitter;
  private backgroundLayers: Phaser.GameObjects.TileSprite[] = [];
  private playerIdleTimer: number = 0;
  private characterType: string = 'lumo';
  private invincible: boolean = false;
  private canShoot: boolean = true;
  private shootCooldown: number = 300;
  private playerTrail?: Phaser.GameObjects.Particles.ParticleEmitter;
  private comboMultiplier: number = 1;
  private comboTimer: number = 0;
  private touchLeft: boolean = false;
  private touchRight: boolean = false;
  private requestedJump: boolean = false;
  private lastTap: number = 0;
  
  constructor() {
    super({ key: 'MainScene' });
  }
  
  init(data: any) {
    this.score = data.score || 0;
    this.lives = data.lives || 3;
    this.level = data.level || 1;
    this.characterType = data.character || 'lumo';
    this.coinsCollected = 0;
    this.enemiesDefeated = 0;
    this.invincible = false;
    this.comboMultiplier = 1;
    this.comboTimer = 0;
  }
  
  preload() {
    this.createPlayerSprite();
    this.createPlatformSprite();
    this.createCoinSprite();
    this.createEnemySprites();
    this.createProjectileSprite();
    this.createParticleSprite();
    this.createPowerUpSprites();
  }
  
  createPlayerSprite() {
    const graphics = this.add.graphics();
    
    if (this.characterType === 'lumo') {
      graphics.fillStyle(0x00FFFF, 1);
      graphics.fillCircle(16, 16, 12);
      graphics.fillStyle(0xFFFFFF, 1);
      graphics.fillCircle(12, 12, 3);
      graphics.fillCircle(20, 12, 3);
      graphics.fillStyle(0xFF69B4, 1);
      graphics.fillEllipse(16, 20, 6, 3);
      graphics.fillStyle(0x00FFFF, 0.5);
      graphics.fillCircle(16, 16, 14);
    } else if (this.characterType === 'pixy') {
      graphics.fillStyle(0xFFB347, 1);
      graphics.fillCircle(16, 16, 10);
      graphics.fillStyle(0xFFFFFF, 1);
      graphics.fillCircle(12, 14, 2);
      graphics.fillCircle(20, 14, 2);
      graphics.fillStyle(0xFFB347, 1);
      graphics.fillTriangle(8, 16, 4, 12, 8, 12);
      graphics.fillTriangle(24, 16, 28, 12, 24, 12);
      graphics.fillStyle(0xFFD700, 0.5);
      graphics.fillCircle(16, 16, 12);
    } else {
      graphics.fillStyle(0x90EE90, 1);
      graphics.fillEllipse(16, 18, 18, 12);
      graphics.fillStyle(0x228B22, 1);
      graphics.fillEllipse(16, 14, 14, 10);
      graphics.fillStyle(0xFFFFFF, 1);
      graphics.fillCircle(12, 14, 2);
      graphics.fillCircle(20, 14, 2);
      graphics.fillStyle(0x90EE90, 0.3);
      graphics.fillEllipse(16, 18, 20, 14);
    }
    
    graphics.generateTexture('player', 32, 32);
    graphics.destroy();
  }
  
  createPlatformSprite() {
    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0x9D4EDD, 0x9D4EDD, 0x7B2CBF, 0x7B2CBF, 1);
    graphics.fillRect(0, 0, 64, 16);
    graphics.fillStyle(0xC77DFF, 1);
    for (let i = 0; i < 64; i += 8) {
      graphics.fillRect(i, 0, 4, 2);
      graphics.fillRect(i + 4, 14, 4, 2);
    }
    graphics.generateTexture('platform', 64, 16);
    graphics.destroy();
  }
  
  createCoinSprite() {
    const graphics = this.add.graphics();
    graphics.fillStyle(0xFFD700, 1);
    graphics.fillCircle(8, 8, 7);
    graphics.fillStyle(0xFFA500, 1);
    graphics.fillCircle(8, 8, 5);
    graphics.fillStyle(0xFFD700, 1);
    graphics.fillCircle(8, 8, 3);
    graphics.fillStyle(0xFFFFFF, 0.8);
    graphics.fillCircle(6, 6, 2);
    graphics.generateTexture('coin', 16, 16);
    graphics.destroy();
  }
  
  createEnemySprites() {
    // Slime enemy with glow
    const graphics = this.add.graphics();
    graphics.fillStyle(0x00FF00, 0.3);
    graphics.fillEllipse(16, 20, 28, 20);
    graphics.fillStyle(0x00FF00, 1);
    graphics.fillEllipse(16, 20, 24, 16);
    graphics.fillStyle(0xFFFFFF, 1);
    graphics.fillCircle(12, 16, 4);
    graphics.fillCircle(20, 16, 4);
    graphics.fillStyle(0x000000, 1);
    graphics.fillCircle(12, 16, 2);
    graphics.fillCircle(20, 16, 2);
    graphics.fillStyle(0x00FF00, 0.5);
    graphics.fillRect(12, 24, 8, 2);
    graphics.generateTexture('slime', 32, 32);
    graphics.destroy();
    
    // Robo-frog enemy with mechanical details
    const graphics2 = this.add.graphics();
    graphics2.fillStyle(0x7FB3D5, 0.3);
    graphics2.fillEllipse(16, 20, 32, 22);
    graphics2.fillStyle(0x7FB3D5, 1);
    graphics2.fillEllipse(16, 20, 28, 18);
    graphics2.fillStyle(0xFF0000, 1);
    graphics2.fillCircle(12, 16, 4);
    graphics2.fillCircle(20, 16, 4);
    graphics2.fillStyle(0x34495E, 1);
    graphics2.fillRect(10, 24, 4, 6);
    graphics2.fillRect(18, 24, 4, 6);
    graphics2.fillStyle(0xFFFFFF, 0.5);
    graphics2.fillRect(8, 18, 16, 2);
    graphics2.generateTexture('robofrog', 32, 32);
    graphics2.destroy();
    
    // Flying bat enemy
    const graphics3 = this.add.graphics();
    graphics3.fillStyle(0x8B008B, 0.3);
    graphics3.fillCircle(16, 16, 18);
    graphics3.fillStyle(0x8B008B, 1);
    graphics3.fillCircle(16, 16, 12);
    graphics3.fillStyle(0xFF1493, 1);
    graphics3.fillCircle(12, 14, 3);
    graphics3.fillCircle(20, 14, 3);
    graphics3.fillTriangle(6, 16, 2, 20, 10, 18);
    graphics3.fillTriangle(26, 16, 30, 20, 22, 18);
    graphics3.generateTexture('bat', 32, 32);
    graphics3.destroy();
  }
  
  createProjectileSprite() {
    const graphics = this.add.graphics();
    graphics.fillStyle(0x00FFFF, 0.5);
    graphics.fillCircle(6, 6, 6);
    graphics.fillStyle(0x00FFFF, 1);
    graphics.fillCircle(6, 6, 4);
    graphics.fillStyle(0xFFFFFF, 1);
    graphics.fillCircle(6, 6, 2);
    graphics.generateTexture('projectile', 12, 12);
    graphics.destroy();
  }
  
  createParticleSprite() {
    const graphics = this.add.graphics();
    graphics.fillStyle(0xFFFFFF, 1);
    graphics.fillCircle(4, 4, 3);
    graphics.generateTexture('particle', 8, 8);
    graphics.destroy();
  }
  
  createPowerUpSprites() {
    // Health power-up
    const graphics = this.add.graphics();
    graphics.fillStyle(0xFF0000, 1);
    graphics.fillCircle(8, 8, 6);
    graphics.fillStyle(0xFFFFFF, 1);
    graphics.fillRect(6, 8, 4, 1);
    graphics.fillRect(7.5, 6.5, 1, 4);
    graphics.generateTexture('powerup_health', 16, 16);
    graphics.destroy();
    
    // Shield power-up
    const graphics2 = this.add.graphics();
    graphics2.fillStyle(0x00CED1, 1);
    graphics2.fillCircle(8, 8, 6);
    graphics2.fillStyle(0xFFFFFF, 1);
    graphics2.fillCircle(8, 8, 4);
    graphics2.generateTexture('powerup_shield', 16, 16);
    graphics2.destroy();
  }
  
  create() {
    this.createParallaxBackground();
    const reduceMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = this.scale.width <= 768;
    
    // Ambient particles
    const ambientParticles = this.add.particles(0, 0, 'particle', {
      speed: { min: 20, max: 40 },
      scale: { start: 0.25, end: 0 },
      alpha: { start: 0.5, end: 0 },
      lifespan: 2500,
      frequency: (reduceMotion || isMobile) ? 800 : 300,
      emitting: true,
      blendMode: 'ADD',
      tint: [0x00FFFF, 0xFF69B4, 0xFFD700, 0x9D4EDD]
    });
    
    ambientParticles.setPosition(400, 0);
    ambientParticles.setEmitZone({
      source: new Phaser.Geom.Rectangle(0, 0, 800, 600),
      type: 'random'
    });
    
    // Create platforms
    this.platforms = this.physics.add.staticGroup();
    
    // Ground with multiple segments
    for (let i = 0; i < 13; i++) {
      this.platforms.create(i * 64, 584, 'platform').refreshBody();
    }
    
    this.createLevelPlatforms();
    this.coins = this.physics.add.group();
    this.createCoins();
    this.enemies = this.physics.add.group();
    this.createEnemies();
    this.powerUps = this.physics.add.group();
    this.createPowerUps();
    this.projectiles = this.physics.add.group();
    
    // Create player with trail effect
    this.player = this.physics.add.sprite(100, 450, 'player');
    this.player.setBounce(0.15);
    this.player.setCollideWorldBounds(true);
    this.player.setScale(1.3);
    this.player.setMaxVelocity(300, 1000);
    
    // Player trail particles
    this.playerTrail = this.add.particles(0, 0, 'particle', {
      speed: 20,
      scale: { start: 0.35, end: 0 },
      alpha: { start: 0.5, end: 0 },
      lifespan: 280,
      blendMode: 'ADD',
      follow: this.player,
      tint: this.characterType === 'lumo' ? 0x00FFFF : this.characterType === 'pixy' ? 0xFFB347 : 0x90EE90,
      frequency: (reduceMotion || isMobile) ? 120 : 50
    });
    
    // Physics collisions
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.enemies, this.platforms);
    this.physics.add.collider(this.coins, this.platforms);
    this.physics.add.collider(this.powerUps, this.platforms);
    
    this.physics.add.overlap(this.player, this.coins, this.collectCoin as any, undefined, this);
    this.physics.add.overlap(this.player, this.enemies, this.hitEnemy as any, undefined, this);
    this.physics.add.overlap(this.player, this.powerUps, this.collectPowerUp as any, undefined, this);
    this.physics.add.overlap(this.projectiles, this.enemies, this.projectileHitEnemy as any, undefined, this);
    
    // Input
    this.cursors = this.input.keyboard?.createCursorKeys();
    this.spaceKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    
    // Camera with smooth follow
    this.cameras.main.setBounds(0, 0, 800, 600);
    this.cameras.main.startFollow(this.player, true, 0.15, 0.15);
    
    this.emitScoreUpdate();
    
    // Show level start notification
    this.showLevelStart();

    // Touch controls for mobile
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      const now = this.time.now;
      if (now - this.lastTap < 300) {
        // Double tap -> shoot
        this.shootProjectile();
      } else {
        // Single tap -> jump when grounded
        this.requestedJump = true;
      }
      this.lastTap = now;
      if (pointer.x < this.scale.width / 2) {
        this.touchLeft = true;
        this.touchRight = false;
      } else {
        this.touchRight = true;
        this.touchLeft = false;
      }
    });
    this.input.on('pointerup', () => {
      this.touchLeft = false;
      this.touchRight = false;
    });
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (pointer.isDown) {
        if (pointer.x < this.scale.width / 2) {
          this.touchLeft = true;
          this.touchRight = false;
        } else {
          this.touchRight = true;
          this.touchLeft = false;
        }
      }
    });
  }
  
  showLevelStart() {
    const text = this.add.text(400, 200, `Level ${this.level}`, {
      fontSize: '48px',
      color: '#ffffff',
      fontFamily: 'Arial',
      stroke: '#9D4EDD',
      strokeThickness: 6
    });
    text.setOrigin(0.5);
    text.setScrollFactor(0);
    text.setDepth(1000);
    
    this.tweens.add({
      targets: text,
      scale: { from: 0, to: 1.5 },
      alpha: { from: 1, to: 0 },
      duration: 2000,
      ease: 'Power2',
      onComplete: () => text.destroy()
    });
  }
  
  createParallaxBackground() {
    const colors = [0x240046, 0x3C096C, 0x5A189A, 0x7209B7, 0x9D4EDD];
    
    for (let i = 0; i < 5; i++) {
      const graphics = this.add.graphics();
      graphics.fillStyle(colors[i], 0.4);
      graphics.fillRect(0, i * 120, 800, 120);
      
      for (let j = 0; j < 30; j++) {
        const x = Math.random() * 800;
        const y = i * 120 + Math.random() * 120;
        const size = Math.random() * 2 + 0.5;
        graphics.fillStyle(0xFFFFFF, Math.random() * 0.9 + 0.1);
        graphics.fillCircle(x, y, size);
      }
      
      const texture = graphics.generateTexture(`bg${i}`, 800, 120);
      graphics.destroy();
      
      const layer = this.add.tileSprite(0, i * 120, 800, 120, `bg${i}`);
      layer.setOrigin(0, 0);
      this.backgroundLayers.push(layer);
    }
  }
  
  createLevelPlatforms() {
    if (!this.platforms) return;
    
    const platformCount = Math.min(6 + Math.floor(this.level / 10), 12);
    const positions: { x: number; y: number }[] = [];
    
    for (let i = 0; i < platformCount; i++) {
      const x = 100 + (i * (600 / platformCount)) + Math.random() * 50;
      const y = 500 - (i % 3) * 100 - Math.random() * 80;
      positions.push({ x, y });
    }
    
    positions.forEach(pos => {
      const platform = this.platforms!.create(pos.x, pos.y, 'platform');
      platform.refreshBody();
      
      // Add platform glow animation (reduced on mobile/reduced-motion)
      const reduceMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const isMobile = this.scale.width <= 768;
      if (!(reduceMotion || isMobile)) {
        this.tweens.add({
          targets: platform,
          alpha: { from: 0.85, to: 1 },
          duration: 1200 + Math.random() * 800,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });
      } else {
        platform.setAlpha(0.95);
      }
    });
  }
  
  createCoins() {
    if (!this.coins) return;
    
    const coinCount = Math.min(8 + Math.floor(this.level / 5), 15);
    
    for (let i = 0; i < coinCount; i++) {
      const x = 100 + Math.random() * 600;
      const y = 150 + Math.random() * 300;
      
      const coin = this.coins.create(x, y, 'coin');
      coin.setBounceY(0.5);
      coin.setScale(1.2);
      
      // Reduced motion on mobile/reduced-motion devices
      const reduceMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const isMobile = this.scale.width <= 768;
      this.tweens.add({
        targets: coin,
        y: y - 15,
        duration: 1000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
      if (!(reduceMotion || isMobile)) {
        this.tweens.add({
          targets: coin,
          angle: 360,
          duration: 2000,
          repeat: -1,
          ease: 'Linear'
        });
        this.tweens.add({
          targets: coin,
          scale: { from: 1.2, to: 1.4 },
          duration: 800,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });
      }
    }
    
    this.totalCoins = coinCount;
  }
  
  createEnemies() {
    if (!this.enemies) return;
    
    const enemyCount = Math.min(3 + Math.floor(this.level / 3), 10);
    const enemyTypes = ['slime', 'robofrog', 'bat'];
    
    for (let i = 0; i < enemyCount; i++) {
      const x = 200 + Math.random() * 400;
      const y = 300 + Math.random() * 100;
      const type = enemyTypes[Math.floor(Math.random() * (Math.min(1 + Math.floor(this.level / 10), 3)))];
      
      const enemy = this.enemies.create(x, y, type);
      enemy.setBounce(1);
      enemy.setCollideWorldBounds(true);
      
      const speedMultiplier = 1 + (this.level / 20);
      const baseSpeed = type === 'bat' ? 120 : type === 'robofrog' ? 100 : 80;
      enemy.setVelocity(
        Phaser.Math.Between(-baseSpeed, baseSpeed) * speedMultiplier,
        type === 'bat' ? Phaser.Math.Between(-50, 50) : 0
      );
      
      enemy.setData('type', type);
      enemy.setData('health', Math.ceil(1 + this.level / 10));
      enemy.setScale(1 + (this.level / 50));
      
      this.tweens.add({
        targets: enemy,
        scaleX: enemy.scale + 0.1,
        scaleY: enemy.scale - 0.1,
        duration: 500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
      
      if (type === 'bat') {
        enemy.body.allowGravity = false;
      }
    }
    
    this.totalEnemies = enemyCount;
  }
  
  createPowerUps() {
    if (!this.powerUps || this.level < 3) return;
    
    if (Math.random() < 0.3) {
      const x = 200 + Math.random() * 400;
      const y = 200 + Math.random() * 200;
      const type = Math.random() < 0.5 ? 'powerup_health' : 'powerup_shield';
      
      const powerUp = this.powerUps.create(x, y, type);
      powerUp.setData('type', type);
      
      this.tweens.add({
        targets: powerUp,
        y: y - 20,
        duration: 1500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
      
      this.tweens.add({
        targets: powerUp,
        angle: 360,
        duration: 3000,
        repeat: -1,
        ease: 'Linear'
      });
    }
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
    this.coinsCollected++;
    
    this.showFloatingText(`+${points}`, coin.x, coin.y, 0xFFD700);
    this.emitSoundEvent('coin');
    this.emitScoreUpdate();
    
    this.checkLevelComplete();
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
    } else if (type === 'powerup_shield') {
      this.activateShield();
      this.showFloatingText('Shield!', powerUp.x, powerUp.y, 0x00CED1);
    }
    
    this.emitSoundEvent('powerup');
  }
  
  activateShield() {
    this.invincible = true;
    
    const shield = this.add.circle(this.player!.x, this.player!.y, 25, 0x00CED1, 0.3);
    shield.setStrokeStyle(2, 0x00CED1);
    
    this.tweens.add({
      targets: shield,
      alpha: { from: 0.5, to: 0.2 },
      scale: { from: 1, to: 1.2 },
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
      player.setPosition(100, 450);
      player.setVelocity(0, 0);
    }
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
      
      this.comboMultiplier = Math.min(this.comboMultiplier + 0.5, 5);
      this.comboTimer = 2000;
      
      const points = Math.floor(200 * this.comboMultiplier);
      this.score += points;
      this.enemiesDefeated++;
      
      this.showFloatingText(`+${points}`, enemy.x, enemy.y, 0x00FF00);
      
      if (this.comboMultiplier > 1) {
        this.showFloatingText(`x${this.comboMultiplier.toFixed(1)} Combo!`, enemy.x, enemy.y - 30, 0xFF69B4);
      }
      
      this.emitScoreUpdate();
      this.emitSoundEvent('hit');
      
      this.checkLevelComplete();
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
  
  checkLevelComplete() {
    const allCoinsCollected = this.coinsCollected >= this.totalCoins;
    const allEnemiesDefeated = this.enemiesDefeated >= this.totalEnemies;
    
    if (allEnemiesDefeated && allCoinsCollected) {
      this.completeLevel();
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
      alpha: { from: 1, to: 0.6 },
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
      strokeThickness: 3
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
  
  completeLevel() {
    this.cameras.main.flash(800, 255, 215, 0);
    
    const bonus = this.level * 500;
    this.score += bonus;
    
    this.showFloatingText(`Level Complete! +${bonus}`, 400, 250, 0xFFD700);
    
    this.time.delayedCall(1500, () => {
      if (this.level >= 100) {
        this.gameWin();
      } else {
        this.level++;
        this.scene.restart({
          score: this.score,
          lives: this.lives,
          level: this.level,
          character: this.characterType
        });
      }
    });
  }
  
  gameWin() {
    this.cameras.main.flash(1000, 255, 255, 255);
    this.emitGameEnd(true);
  }
  
  gameOver() {
    this.cameras.main.fade(1000, 128, 0, 128);
    this.time.delayedCall(1000, () => {
      this.emitGameEnd(false);
    });
  }
  
  emitScoreUpdate() {
    const event = new CustomEvent('pixelquest-score', {
      detail: { score: this.score, level: this.level }
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
    
    // Update parallax background
    this.backgroundLayers.forEach((layer, index) => {
      layer.tilePositionX += (index + 1) * 0.3;
    });
    
    // Combo timer
    if (this.comboTimer > 0) {
      this.comboTimer -= delta;
      if (this.comboTimer <= 0) {
        this.comboMultiplier = 1;
      }
    }
    
    // Player movement with acceleration
    const speed = this.characterType === 'pixy' ? 220 : this.characterType === 'koza' ? 150 : 180;
    const acceleration = 600;
    
    if (this.cursors.left.isDown || this.touchLeft) {
      this.player.setAccelerationX(-acceleration);
      this.player.setFlipX(true);
      this.playerIdleTimer = 0;
    } else if (this.cursors.right.isDown || this.touchRight) {
      this.player.setAccelerationX(acceleration);
      this.player.setFlipX(false);
      this.playerIdleTimer = 0;
    } else {
      this.player.setAccelerationX(0);
      this.player.setVelocityX(this.player.body!.velocity.x * 0.9);
      this.playerIdleTimer += delta;
      
      if (this.playerIdleTimer > 4000) {
        this.tweens.add({
          targets: this.player,
          angle: [-3, 3, -3, 3, 0],
          duration: 400,
          ease: 'Sine.easeInOut'
        });
        this.playerIdleTimer = 0;
      }
    }
    
    // Jump with variable height
    const jumpPower = this.characterType === 'pixy' ? -400 : this.characterType === 'koza' ? -320 : -370;
    if ((this.cursors.up.isDown || this.requestedJump) && this.player.body?.touching.down) {
      this.player.setVelocityY(jumpPower);
      this.requestedJump = false;
      
      const jumpParticles = this.add.particles(this.player.x, this.player.y + 16, 'particle', {
        speed: { min: 50, max: 100 },
        angle: { min: 60, max: 120 },
        scale: { start: 0.6, end: 0 },
        lifespan: 400,
        quantity: 8,
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
    
    // Enemy AI - improved
    this.enemies?.children.entries.forEach((enemy: any) => {
      if (!enemy.active) return;
      
      const type = enemy.getData('type');
      
      if (enemy.body.blocked.left || enemy.body.blocked.right) {
        enemy.setVelocityX(-enemy.body.velocity.x);
      }
      
      if (type === 'bat' && this.player) {
        const dx = this.player.x - enemy.x;
        const dy = this.player.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 200) {
          enemy.setVelocityX(dx * 0.5);
          enemy.setVelocityY(dy * 0.3);
        }
      }
      
      if (type === 'robofrog' && enemy.body.touching.down && Math.random() < 0.01) {
        enemy.setVelocityY(-250);
      }
    });
    
    // Clamp player velocity
    if (Math.abs(this.player.body!.velocity.x) > speed) {
      this.player.setVelocityX(Math.sign(this.player.body!.velocity.x) * speed);
    }
  }
}
