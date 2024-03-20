
import { _decorator, Collider, Component, ITriggerEvent, Node } from 'cc';
import { Constant } from '../framework/Constant';
import { GameManager } from '../framework/GameManager';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = EnemyPlane
 * DateTime = Mon Mar 18 2024 17:21:14 GMT+0800 (中国标准时间)
 * Author = ctq123
 * FileBasename = EnemyPlane.ts
 * FileBasenameNoExtension = EnemyPlane
 * URL = db://assets/script/plane/EnemyPlane.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */
const OUTOFBOUND = 90
 
@ccclass('EnemyPlane')
export class EnemyPlane extends Component {
    @property
    public createBulletTime = 1

    private _enemySpeed = 0
    private _currentBulletTime = 0.5
    private _needBullet = false
    private _gameManager: GameManager = null

    // const enemyType = Constant.EnemyType.TYPE1

    start () {
        // [3]
    }

    onEnable() {
        const collider = this.getComponent(Collider)
        if (collider) {
            collider.on('onTriggerEnter', this._onTriggerEnter, this)
        }
    }

    onDisable() {
        const collider = this.getComponent(Collider)
        if (collider) {
            collider.on('onTriggerEnter', this._onTriggerEnter, this)
        }
    }

    update (deltaTime: number) {
        const pos = this.node.position
        const moveLength = pos.z + this._enemySpeed
        this.node.setPosition(pos.x, pos.y, moveLength)
        // console.log("move",pos.y, OUTOFBOUND, moveLength)

        if (this._needBullet) {
            this._currentBulletTime += deltaTime
            if (this._currentBulletTime > this.createBulletTime) {
                this._gameManager.createEnemyBullet(this.node.position)
                this._currentBulletTime = 0
            }
        }

        if (moveLength > OUTOFBOUND) {
            console.log('EnemyPlane destroy')
            this.node.destroy()
        }
    }

    public setEnemySpeed(gameManager: GameManager, speed: number, needBullet: boolean) {
        this._gameManager = gameManager
        this._enemySpeed = speed
        this._needBullet = needBullet
    }

    private _onTriggerEnter(event: ITriggerEvent) {
        const collisionGroup = event.otherCollider.getGroup()
        if (collisionGroup === Constant.CollisionType.SELF_BULLET || collisionGroup === Constant.CollisionType.SELF_PLANE) {
            console.log('enemyplane destroy')
            this.node.destroy()
            this._gameManager.addScore()
        }
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
