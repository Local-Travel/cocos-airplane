
import { _decorator, AudioClip, AudioSource, BoxCollider, Component, instantiate, Label, macro, math, Node, Prefab, Vec3 } from 'cc';
import { Bullet } from '../bullet/Bullet';
import { Constant } from './Constant';
import { EnemyPlane } from '../plane/EnemyPlane';
import { BulletProp } from '../bullet/BulletProp';
import { SelfPlane } from '../plane/SelfPlane';
import { AudioManager } from './AudioManager';
import { PoolManager } from './PoolManager';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = GameManager
 * DateTime = Mon Mar 18 2024 10:50:44 GMT+0800 (中国标准时间)
 * Author = ctq123
 * FileBasename = GameManager.ts
 * FileBasenameNoExtension = GameManager
 * URL = db://assets/script/framework/GameManager.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

interface EnemyPlaneInstance {
    prefab: Prefab, 
    speed: number
}
// 游戏的主要逻辑
@ccclass('GameManager')
export class GameManager extends Component {
    @property(SelfPlane)
    public playerPlane: SelfPlane = null
    // bullet
    @property(Node)
    public bulletRoot:Node = null

    @property(Prefab)
    public bullet01: Prefab = null
    @property(Prefab)
    public bullet02: Prefab = null
    @property(Prefab)
    public bullet03: Prefab = null
    @property(Prefab)
    public bullet04: Prefab = null
    @property(Prefab)
    public bullet05: Prefab = null

    // enemy
    @property(Prefab)
    public enemy01: Prefab = null
    @property(Prefab)
    public enemy02: Prefab = null
    @property(Prefab)
    public enemyExplode: Prefab = null

    // bulletProp
    @property(Prefab)
    public bulletM: Prefab = null
    @property(Prefab)
    public bulletS: Prefab = null
    @property(Prefab)
    public bulletH: Prefab = null
    @property
    public bulletPropSpeed = 0.3

    // ui
    @property(Node)
    public gamePage:Node = null
    @property(Node)
    public gameOverPage:Node = null
    @property(Label)
    public gameScore:Label = null
    @property(Label)
    public gameOverScore:Label = null

    // audio
    @property(AudioManager)
    public audioManager: AudioManager = null

    @property
    public createEnemyTime = 1
    @property
    public enemy1Speed = 0.5
    @property
    public enemy2Speed = 0.7

    @property
    public bulletSpeed = 1

    @property
    public shootTime = 0.3

    @property
    public isGagmeStart = false

    private _currentShootTime = 1
    private _isShooting = false
    private _currentCreateEnemyTime = 0
    private _combinationInterval = Constant.Combination.PLAN1
    private _bulletPropType = Constant.BulletPropType.BULLET_M 
    private _score = 0

    start () {
        this._init()
    }

    update (deltaTime: number) {
        if (!this.isGagmeStart) return
        if (!this.playerPlane.isLive) {
            this.gameOver()
            return
        }

        this._currentShootTime += deltaTime
        this._currentCreateEnemyTime += deltaTime
        if (this._isShooting && this._currentShootTime > this.shootTime) {
            if (this._bulletPropType === Constant.BulletPropType.BULLET_H) {
                this.createPalyerBulletH()
                this.playAudioEffect('bullet2')
            } else if (this._bulletPropType === Constant.BulletPropType.BULLET_S) {
                this.createPalyerBulletS()
                this.playAudioEffect('bullet2')
            } else {
                this.createPalyerBulletM()
                this.playAudioEffect('bullet1')
            }
            this._currentShootTime = 0
        }

        // console.log('_combinationInterval', this._combinationInterval)
        if (this._combinationInterval === Constant.Combination.PLAN1) {
            if (this._currentCreateEnemyTime > this.createEnemyTime) {
                this.createEnemyPlane()
                this._currentCreateEnemyTime = 0
            }
        } else if (this._combinationInterval === Constant.Combination.PLAN2) {
            if (this._currentCreateEnemyTime > this.createEnemyTime * 0.9) {
                const randCombination = math.randomRangeInt(1, 3)
                if (randCombination === Constant.Combination.PLAN2) {
                    this.createCombination1()
                } else {
                    this.createEnemyPlane() 
                }
                this._currentCreateEnemyTime = 0
            }
        } else {
            if (this._currentCreateEnemyTime > this.createEnemyTime * 0.8) {
                const randCombination = math.randomRangeInt(1, 4)
                if (randCombination === Constant.Combination.PLAN2) {
                    this.createCombination1()
                } else if (randCombination === Constant.Combination.PLAN3) {
                    this.createCombination2()
                } else {
                    this.createEnemyPlane() 
                }
                this._currentCreateEnemyTime = 0
            }
        }
    }

    private _init() {
        this._currentShootTime = this.shootTime
        this.playerPlane.init()
    }

    public returnMain() {
        this._currentShootTime = 1
        this._isShooting = false
        this._currentCreateEnemyTime = 0
        this._combinationInterval = Constant.Combination.PLAN1
        this._bulletPropType = Constant.BulletPropType.BULLET_M
        this._score = 0
        if (this.playerPlane.node) {
            this.playerPlane.node.setPosition(0, 0, 9) 
        }
    }

    public gameStart() {
        this.isGagmeStart = true
        this._score = 0
        this.gameScore.string = this._score.toString()
        this.playerPlane.init()
        this._changePlaneMode()
    }

    public gameReStart() {
        this.gameStart()
        this._currentShootTime = 0
        this._currentCreateEnemyTime = 0
        this._combinationInterval = Constant.Combination.PLAN1
        this._bulletPropType = Constant.BulletPropType.BULLET_M
        this.playerPlane.init()
        if (this.playerPlane.node) {
            this.playerPlane.node.setPosition(0, 0, 9) 
        }
    }

    public gameOver() {
        this.isGagmeStart = false
        this.gamePage.active = false
        this.gameOverPage.active = true
        this.gameOverScore.string = this._score.toString()
        this._isShooting = false
        this.unschedule(this._planeChange)
        this._destroyAll()
    }

    public playAudioEffect(name: string) {
        this.audioManager.play(name)
    }

    public addScore() {
        this._score++
        this.gameScore.string = this._score.toString()
    }

    public createPalyerBulletM() {
        this._createPlayerBullet(this.bullet01, 0)
    }

    public createPalyerBulletH() {
        // left
        this._createPlayerBullet(this.bullet03, -2.5)
        // right
        this._createPlayerBullet(this.bullet03, 2.5)
    }

    public createPalyerBulletS() {
        // left
        this._createPlayerBullet(this.bullet05, -4, Constant.Direction.LEFT)
        // middle
        this._createPlayerBullet(this.bullet05, 0, Constant.Direction.MIDDLE)
        // right
        this._createPlayerBullet(this.bullet05, 4, Constant.Direction.RIGHT)
    }

    private _createPlayerBullet(target: Prefab, x: number, direction: number = Constant.Direction.MIDDLE) {
        // const bullet = instantiate(target)
        // bullet.setParent(this.bulletRoot)
        const bullet = PoolManager.instance().getNode(target, this.bulletRoot)
        const pos = this.playerPlane.node.position
        bullet.setPosition(pos.x + x, pos.y + 1, pos.z - 7)
        const bulletComp = bullet.getComponent(Bullet)
        bulletComp.setBullet(this.bulletSpeed, false, direction)
    }

    public createEnemyBullet(targetPos: Vec3) {
        // const bullet = instantiate(this.bullet02)
        // bullet.setParent(this.bulletRoot)
        const bullet = PoolManager.instance().getNode(this.bullet02, this.bulletRoot)
        bullet.setPosition(targetPos.x, targetPos.y + 1, targetPos.z + 6)
        const bulletComp = bullet.getComponent(Bullet)
        bulletComp.setBullet(1, true, Constant.Direction.MIDDLE)

        const colliderGroup = bullet.getComponent(BoxCollider)
        colliderGroup.setGroup(Constant.CollisionType.ENEMY_BULLET)
        colliderGroup.setMask(Constant.CollisionType.SELF_PLANE)
    }

    public changeBulletType(type: number) {
        this._bulletPropType = type
    }

    public isShooting(val: boolean) {
        this._isShooting = val
    }

    public createEnemyEffect(pos: Vec3) {
        const enemy = PoolManager.instance().getNode(this.enemyExplode, this.node)
        enemy.setPosition(pos)
    }

    public createEnemyPlane() {
        const { prefab, speed }: EnemyPlaneInstance = this._getRandType()
        // const enemy = instantiate(prefab)
        // enemy.setParent(this.node)
        const enemy = PoolManager.instance().getNode(prefab, this.bulletRoot)
        const randX = math.randomRangeInt(-23, 23)
        enemy.setPosition(randX, 0, -50)
        const enemyComp = enemy.getComponent(EnemyPlane)
        enemyComp.setEnemySpeed(this, speed, true)
    }

    public createCombination1() {
        // console.log('createCombination1')
        const { prefab, speed }: EnemyPlaneInstance = this._getRandType()
        const eles = new Array<Node>(5)
        for (let i = 0; i < eles.length; i++) {
            // eles[i] = instantiate(prefab)
            // const ele = eles[i]
            // ele.setParent(this.node)
            const ele = PoolManager.instance().getNode(prefab, this.node)
            ele.setPosition(-20 + i * 10, 0, -50)

            const enemyComp = ele.getComponent(EnemyPlane)
            enemyComp.setEnemySpeed(this, speed, false)
        }
    }

    public createCombination2() {
        // console.log('createCombination2')
        const { prefab, speed }: EnemyPlaneInstance = this._getRandType()
        const combinationPos = [
            -21, 0, -60,
            -14, 0, -55,
            -7, 0, -50,
            0, 0, -45,
            7, 0, -50,
            14, 0, -55,
            21, 0, -60,
        ]
        const eles = new Array<Node>(7)
        for (let i = 0; i < eles.length; i++) {
            // eles[i] = instantiate(prefab)
            const index = i * 3
            // const ele = eles[i]
            // ele.setParent(this.node)
            const ele = PoolManager.instance().getNode(prefab, this.node)
            ele.setPosition(combinationPos[index], combinationPos[index + 1], combinationPos[index + 2])

            const enemyComp = ele.getComponent(EnemyPlane)
            enemyComp.setEnemySpeed(this, speed, false)
        }
    }

    public createBulletProp() {
        const bulletPropType = math.randomRangeInt(1, 4)
        let prefab: Prefab = null
        if (bulletPropType === Constant.BulletPropType.BULLET_H) {
            prefab = this.bulletH
        } else if (bulletPropType === Constant.BulletPropType.BULLET_S) {
            prefab = this.bulletS
        } else {
            prefab = this.bulletM
        }

        // const bulletProp = instantiate(prefab)
        // bulletProp.setParent(this.node)
        const bulletProp = PoolManager.instance().getNode(prefab, this.node)
        const randX = math.randomRangeInt(-15, 15)
        bulletProp.setPosition(randX, 0, -50)
        const propComp = bulletProp.getComponent(BulletProp)
        propComp.setBulletProp(this, -this.bulletPropSpeed)
    }

    private _changePlaneMode() {
        this.schedule(this._planeChange, 10, macro.REPEAT_FOREVER)
    }

    private _planeChange() {
        this._combinationInterval++
        this.createBulletProp()
    }

    private _getRandType(): EnemyPlaneInstance {
        const planeType = math.randomRangeInt(1, 3)
        let prefab: Prefab = null
        let speed = 0
        if (planeType === Constant.EnemyType.TYPE1) {
            prefab = this.enemy01
            speed = this.enemy1Speed
        } else {
            prefab = this.enemy02
            speed = this.enemy2Speed
        }
        return { prefab, speed }
    }

    private _destroyAll() {
        this.node.destroyAllChildren()
        this.bulletRoot.destroyAllChildren()
    }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.3/manual/zh/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.3/manual/zh/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.3/manual/zh/scripting/life-cycle-callbacks.html
 */
