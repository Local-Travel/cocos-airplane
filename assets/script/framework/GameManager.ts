
import { _decorator, BoxCollider, Component, instantiate, math, Node, Prefab, Vec3 } from 'cc';
import { Bullet } from '../bullet/Bullet';
import { Constant } from './Constant';
import { EnemyPlane } from '../plane/EnemyPlane';
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
 
@ccclass('GameManager')
export class GameManager extends Component {
    @property(Node)
    public playerPlane: Node = null
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

    private _currentShootTime = 1
    private _isShooting = false
    private _currentCreateEnemyTime = 0
    private _combinationInterval = Constant.Combination.PLAN1

    start () {
        this._init()
    }

    update (deltaTime: number) {
        this._currentShootTime += deltaTime
        this._currentCreateEnemyTime += deltaTime
        if (this._isShooting && this._currentShootTime > this.shootTime) {
            this.createPalyerBullet()
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
        this._changePlaneMode()
    }

    public addScore() {

    }

    public createPalyerBullet() {
        const bullet = instantiate(this.bullet01)
        bullet.setParent(this.bulletRoot)
        const pos = this.playerPlane.position
        bullet.setPosition(pos.x, pos.y + 1, pos.z - 7)
        const bulletComp = bullet.getComponent(Bullet)
        bulletComp.setBullet(this.bulletSpeed, false)
    }

    public createEnemyBullet(targetPos: Vec3) {
        const bullet = instantiate(this.bullet02)
        bullet.setParent(this.bulletRoot)
        bullet.setPosition(targetPos.x, targetPos.y + 1, targetPos.z + 6)
        const bulletComp = bullet.getComponent(Bullet)
        bulletComp.setBullet(1, true)

        const colliderGroup = bullet.getComponent(BoxCollider)
        colliderGroup.setGroup(Constant.CollisionType.ENEMY_BULLET)
        colliderGroup.setMask(Constant.CollisionType.SELF_PLANE)
    }

    public isShooting(val: boolean) {
        this._isShooting = val
    }

    public createEnemyPlane() {
        const { prefab, speed }: EnemyPlaneInstance = this._getRandType()
        const enemy = instantiate(prefab)
        enemy.setParent(this.node)
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
            eles[i] = instantiate(prefab)
            const ele = eles[i]
            ele.setParent(this.node)
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
            eles[i] = instantiate(prefab)
            const index = i * 3
            const ele = eles[i]
            ele.setParent(this.node)
            ele.setPosition(combinationPos[index], combinationPos[index + 1], combinationPos[index + 2])

            const enemyComp = ele.getComponent(EnemyPlane)
            enemyComp.setEnemySpeed(this, speed, false)
        }
    }

    private _changePlaneMode() {
        this.schedule(this._planeChange, 10, 3)
    }

    private _planeChange() {
        this._combinationInterval++
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
