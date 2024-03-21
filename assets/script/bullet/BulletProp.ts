
import { _decorator, Collider, Component, ITriggerEvent, Node } from 'cc';
import { GameManager } from '../framework/GameManager';
import { Constant } from '../framework/Constant';
import { PoolManager } from '../framework/PoolManager';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = BulletProp
 * DateTime = Wed Mar 20 2024 12:27:25 GMT+0800 (中国标准时间)
 * Author = ctq123
 * FileBasename = BulletProp.ts
 * FileBasenameNoExtension = BulletProp
 * URL = db://assets/script/bullet/BulletProp.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */
 
const XRANGE = 15

@ccclass('BulletProp')
export class BulletProp extends Component {
    private _bulletSpeed = 0.3
    private _bulletXSpeed = 0.3
    private _gameManager: GameManager = null

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
        let pos = this.node.position
        if (pos.x > XRANGE) {
            this._bulletXSpeed = this._bulletSpeed
        } else if (pos.x < -XRANGE) {
            this._bulletXSpeed = -this._bulletSpeed
        }

        this.node.setPosition(pos.x + this._bulletXSpeed, pos.y, pos.z - this._bulletSpeed)

        pos = this.node.position
        if (pos.z > 50) {
            // this.node.destroy()
            PoolManager.instance().putNode(this.node)
        }
    }

    public setBulletProp(gameManager: GameManager, speed: number) {
        this._gameManager = gameManager
        this._bulletSpeed = speed
    }

    private _onTriggerEnter(event: ITriggerEvent) {
        const name = event.selfCollider.node.name
        switch(name) {
            case 'bulletH':
                this._gameManager.changeBulletType(Constant.BulletPropType.BULLET_H)
                break
            case 'bulletS':
                this._gameManager.changeBulletType(Constant.BulletPropType.BULLET_S)
                break
            default:
                this._gameManager.changeBulletType(Constant.BulletPropType.BULLET_M)
                break
        }
        // this.node.destroy()
        PoolManager.instance().putNode(this.node)
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
