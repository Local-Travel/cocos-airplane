
import { _decorator, Collider, Component, ITriggerEvent, Node } from 'cc';
import { Constant } from '../framework/Constant';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = Bullet
 * DateTime = Mon Mar 18 2024 10:24:12 GMT+0800 (中国标准时间)
 * Author = ctq123
 * FileBasename = Bullet.ts
 * FileBasenameNoExtension = Bullet
 * URL = db://assets/script/bullet/Bullet.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */
 
@ccclass('Bullet')
export class Bullet extends Component {

    private _bulletSpeed = 0

    private _isEnemyBullet = false

    private _direction = Constant.Direction.MIDDLE

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
        let moveLength = pos.z - this._bulletSpeed
        let moveX = pos.x 
        if (this._isEnemyBullet) {
            moveLength = pos.z + this._bulletSpeed
        } else {
            if (this._direction === Constant.Direction.LEFT) {
                moveX = pos.x - this._bulletSpeed * 0.2
            }
            if (this._direction === Constant.Direction.RIGHT) {
                moveX = pos.x + this._bulletSpeed * 0.2
            }
        }

        this.node.setPosition(moveX, pos.y, moveLength)
        
        if (moveLength > 90 || moveLength < -270) {
            this.node.destroy()
        }
    }

    setBullet(speed: number, isEnemyBullet: boolean, direction: number = Constant.Direction.MIDDLE) {
        this._bulletSpeed = speed
        this._isEnemyBullet = isEnemyBullet
        this._direction = direction
    }

    private _onTriggerEnter(event: ITriggerEvent) {
        // console.log('bullet destroy')
        this.node.destroy()
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
