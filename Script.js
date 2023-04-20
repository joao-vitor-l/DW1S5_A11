kaboom({
    global: true,
    fullscreen: true,
    scale: 2,
    debug: true,
    clearColor: [0, 0, 0, 1]
})

// Player/Enemy speed
const MOVE_SPEED = 120;
const ENEMY_SPEED = 40;

// Sprites
loadRoot('https://i.imgur.com/');
// Map
loadSprite('bg', 'qIXIczt.png');
loadSprite('wall-steel', 'EkleLlt.png');
loadSprite('wall-gold', 'VtTXsgH.png');
loadSprite('brick-red', 'C46n8aY.png');
loadSprite('brick-wood', 'U751RRV.png');
loadSprite('door', 'Ou9w4gH.png');
// Player
loadSprite('bomberman', 'T0xbHb8.png', {
    sliceX: 7,
    sliceY: 4,
    anims: {
        // Idle
        idleLeft: {from: 21, to: 21},
        idleRight: {from: 7, to: 7},
        idleUp: {from: 0, to: 0},
        idleDown: {from: 14, to: 14},
        // Moving
        moveLeft: {from: 22, to: 27},
        moveRight: {from: 8, to: 13},
        moveUp: {from: 1, to: 6},
        moveDown: {from: 15, to: 20}
    }
})
// Bomb
loadSprite('bomb', 'etY46bP.png', {
    sliceX: 3,

    anims: {
        move: {from: 0, to: 2}
    }
})
loadSprite('kaboom', 'baBxoqs.png', {
    sliceX: 5,
    sliceY: 5
})
// Enemies
loadSprite('ghost', 'c1Vj0j1.png', { sliceX: 3});
loadSprite('slime', '6YV0Zas.png', { sliceX: 3});
loadSprite('balloon', 'z59lNU0.png', { sliceX: 3});

scene('game', ({score, level}) => {
    layers(['bg', 'obj', 'ui'], 'obj');

    add([sprite('bg'), layer('bg')]);

    // Score
    const scoreLabel = add([ 
        text('Score: ' + score),
        pos(470, 90),
        layer('ui'),
        {
            value: score
        },
        scale(1)
    ])
    // Level
    add([text('Level: ' + parseInt(level + 1)), pos(470, 125)], scale(1));

    const maps = [
        [
            'xxxxxxxxxxxxxxx',
            'xaaaa  *aaaaaax',
            'xaxaxaxaxaxaxwx',
            'xaaaaaaaaaaaaax',
            'xaxaxaxaxaxax x',
            'xaaaa* aaaaaa}x',
            'xaxaxaxaxaxax x',
            'x aaaaaaaaaaa x',
            'x xaxaxaxaxaxax',
            'x  aaaaaaaaaaax',
            'x xaxaxaxaxaxax',
            'xaaaaaaaaaaaaax',
            'xaxaxaxaxwxaxax',
            'xaaaaa   &   ax',
            'xxxxxxxxxxxxxxx'
        ],
        [
            'yyyyyyyyyyyyyyy',
            'ybbbb  *bbbbzby',
            'ybybybybybybyby',
            'y      *      y',
            'ybybybybybyby y',
            'ybbbb* bbbbbbby',
            'ybybybyby yby y',
            'y bbbbbbb}bbb y',
            'y ybybyby ybyby',
            'y  bbbbbbbbbbby',
            'y ybybybybybyby',
            'ybbb  &   bbbby',
            'ybybybybybybyby',
            'ybbbbb   &   by',
            'yyyyyyyyyyyyyyy'
        ]
    ]

    const levelCfg = {
        width: 26,
        height: 26,
        x: [sprite('wall-steel'), 'wall-steel', solid(), 'wall'],
        y: [sprite('wall-gold'), 'wall-gold', solid(), 'wall'],
        a: [sprite('brick-red'), 'wall-brick', solid(), 'wall'],
        w: [sprite('brick-red'), 'wall-brick-door', solid(), 'wall'],
        b: [sprite('brick-wood'), 'wall-brick', solid(), 'wall'],
        z: [sprite('brick-wood'), 'wall-brick-door', solid(), 'wall'],
        d: [sprite('door'), 'door', 'wall'],
        '}': [sprite('ghost'), 'dangerous', 'ghost', {dir: -1, time: 0}],
        '&': [sprite('slime'), 'dangerous', 'slime', {dir: -1, time: 0}],
        '*': [sprite('balloon'), 'dangerous', 'balloon', {dir: -1, time: 0}]
    }

    const gameLevel = addLevel(maps[level], levelCfg);

    const player = add([
        sprite('bomberman', {
            animeSpeed: 0.1,
            frame: 14,
        }),
        pos(20, 190),
        {dir: vec2(1, 0)}
    ])

    // Actions (player)
    player.action(() => {
        player.pushOutAll();
    })

    // Key bindings
    keyDown('left', () => {
        player.move(-MOVE_SPEED, 0);
        player.dir = vec2(-1, 0);
    })
    keyDown('right', () => {
        player.move(MOVE_SPEED, 0);
        player.dir = vec2(1, 0);
    })
    keyDown('up', () => {
        player.move(0, -MOVE_SPEED);
        player.dir = vec2(0, -1);
    })
    keyDown('down', () => {
        player.move(0, MOVE_SPEED);
        player.dir = vec2(0, 1);
    })
    keyPress('space', () => {
        spawnBomb(player.pos.add(player.dir.scale(0)));
    })

    // Player animations (moving)
    keyPress('left', () => {
        player.play('moveLeft');
    })
    keyPress('right', () => {
        player.play('moveRight');
    })
    keyPress('up', () => {
        player.play('moveUp');
    })
    keyPress('down', () => {
        player.play('moveDown');
    })
    // Player animations (idle)
    keyRelease('left', () => {
        player.play('idleLeft');
    })
    keyRelease('right', () => {
        player.play('idleRight');
    })
    keyRelease('up', () => {
        player.play('idleUp');
    })
    keyRelease('down', () => {
        player.play('idleDown');
    })

    // Actions (enemies)
    action('ghost', (s) => {
        s.pushOutAll();
        s.move(0, s.dir * ENEMY_SPEED);
        s.time -= dt();
        if(s.time <= 0 ){
            s.dir *= -1;
            s.time = rand(5);
        }
    })
    action('slime', (s) => {
        s.pushOutAll();
        s.move(s.dir * ENEMY_SPEED, 0);
        s.time -= dt();
        if(s.time <= 0 ){
            s.dir *= -1;
            s.time = rand(5);
        }
    })
    action('balloon', (s) => {
        s.pushOutAll();
        s.move(s.dir * ENEMY_SPEED, 0);
        s.time -= dt();
        if(s.time <= 0 ){
            s.dir *= -1;
            s.time = rand(5);
        }
    })

    // Functions
    function spawnBomb(p){
        const obj = add([sprite('bomb'), ('move'), pos(p), scale(1.5), 'bomb']);
        obj.pushOutAll();
        obj.play('move');

        wait(2.5, () => {
            destroy(obj);

            obj.dir = vec2(1, 0);
            spawnKaboom(obj.pos.add(obj.dir.scale(0)), 12); // Center

            obj.dir = vec2(0, -1);
            spawnKaboom(obj.pos.add(obj.dir.scale(20)), 2); // Up

            obj.dir = vec2(0, 1);
            spawnKaboom(obj.pos.add(obj.dir.scale(20)), 22); // Down

            obj.dir = vec2(-1, 0);
            spawnKaboom(obj.pos.add(obj.dir.scale(20)), 10); // Left

            obj.dir = vec2(1, 0);
            spawnKaboom(obj.pos.add(obj.dir.scale(20)), 14); // Right
        })
    }
    function spawnKaboom(p, frame){
        const obj = add([
            sprite('kaboom', {
                animeSpeed: 0.1,
                frame: frame
            }),
            pos(p),
            scale(1.5),
            'kaboom'
        ])

        obj.pushOutAll();
        wait(0.5, () => {
            destroy(obj);
        })
    }

    // Collisions
    player.collides('door', (d) => { // Player -> door (WIN)
        if(level >= maps.length - 1){
            go('game_won', {score: scoreLabel.value});
        }else{
            go('game', {
                level: (level + 1) % maps.length,
                score: scoreLabel.value
            })
        }
    })
    player.collides('dangerous', () => { // Player -> enemy (GAME OVER)
        go('game_over', {score: scoreLabel.value});
    })
    player.collides('kaboom', () => { // Player -> kaboom (GAME OVER)
        wait(0.25, () => {
            go('game_over', {score: scoreLabel.value});
        })
    })
    collides('kaboom', 'ghost', (k, s) => { // Explosion -> enemy (ghost)
        camShake(17);
        wait(1, () => {
            destroy(k);
        })
        destroy(s);
        scoreLabel.value += 3500;
        scoreLabel.text = 'Score: ' + scoreLabel.value;
    })
    collides('kaboom', 'slime', (k, s) => { // Explosion -> enemy (slime)
        camShake(10);
        wait(1, () => {
            destroy(k);
        })
        destroy(s);
        scoreLabel.value += 1250;
        scoreLabel.text = 'Score: ' + scoreLabel.value;
    })
    collides('kaboom', 'balloon', (k, s) => { // Explosion -> enemy (balloon)
        camShake(10);
        wait(1, () => {
            destroy(k);
        })
        destroy(s);
        scoreLabel.value += 600;
        scoreLabel.text = 'Score: ' + scoreLabel.value;
    })
    collides('kaboom', 'wall-brick', (k, s) => { // Explosion -> brick wall
        camShake(4);
        wait(1, () => {
            destroy(k);
        })
        destroy(s);
        scoreLabel.value += 10;
        scoreLabel.text = 'Score: ' + scoreLabel.value;
    })
    collides('kaboom', 'wall-brick-door', (k, s) => { // Explosion -> brick wall w/ door
        camShake(8);
        wait(1, () => {
            destroy(k);
        })
        destroy(s);
        gameLevel.spawn('d', s.gridPos.sub(0, 0));
    })
    collides('dangerous', 'wall', (s) => { // Enemy -> wall
        s.dir = -s.dir;
    })
})

// Game Start
scene('game_start', () => {
    add([text('Game Start?'), origin('center'), pos(width() / 2, height() / 2)]);

    // Start
    keyPress('space', () => {
        go('game', {score: 0, level: 0});
    })
})

// Game Over
scene('game_over', ({score}) => {
    add([text('GAME OVER - Score: ' + score, 32), origin('center'), pos(width() / 2, height() / 2)]);

    // Restart
    keyPress('space', () => {
        go('game', {score: 0, level: 0});
    })
})

// Game Won
scene('game_won', ({score}) => {
    layers(['bg', 'obj', 'ui'], 'obj');

    add([text('YOU WON! - Score: ' + score, 32), origin('center'), pos(width() / 2, height() / 2)]);

    const maps = [
        [   '',
            '',
            '',
            '',
            '',
            '',
            '   xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            '   x                            dx',
            '   x                             x',
            '   x                             x',
            '   x                             x',
            '   xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
        ]
    ]

    const levelCfg = {
        width: 26,
        height: 26,
        x: [sprite('wall-steel'), 'wall-steel', solid(), 'wall'],
        d: [sprite('door'), 'door', 'wall']
    }

    const gameLevel = addLevel(maps[0], levelCfg);

    const player = add([
        sprite('bomberman', {
            animeSpeed: 0.1,
            frame: 14,
        }),
        pos(100, 230),
        {dir: vec2(1, 0)}
    ])

    // Actions (player)
    player.action(() => {
        player.pushOutAll();
    })

    // Key bindings
    keyDown('left', () => {
        player.move(-MOVE_SPEED, 0);
        player.dir = vec2(-1, 0);
    })
    keyDown('right', () => {
        player.move(MOVE_SPEED, 0);
        player.dir = vec2(1, 0);
    })
    keyDown('up', () => {
        player.move(0, -MOVE_SPEED);
        player.dir = vec2(0, -1);
    })
    keyDown('down', () => {
        player.move(0, MOVE_SPEED);
        player.dir = vec2(0, 1);
    })

    // Player animations (moving)
    keyPress('left', () => {
        player.play('moveLeft');
    })
    keyPress('right', () => {
        player.play('moveRight');
    })
    keyPress('up', () => {
        player.play('moveUp');
    })
    keyPress('down', () => {
        player.play('moveDown');
    })
    // Player animations (idle)
    keyRelease('left', () => {
        player.play('idleLeft');
    })
    keyRelease('right', () => {
        player.play('idleRight');
    })
    keyRelease('up', () => {
        player.play('idleUp');
    })
    keyRelease('down', () => {
        player.play('idleDown');
    })

    // Restart
    player.collides('door', (d) => {
        go('game', {score: 0, level: 0});
    })
})

go('game_start', {score: 0, level: 0});
