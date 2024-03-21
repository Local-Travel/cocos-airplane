
import { _decorator, AudioSource, Collider, Component, EventTouch, ICollisionEvent, ITriggerEvent, Node, SystemEvent, systemEvent, Touch } from 'cc';
import { Constant } from '../framework/Constant';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = SelfPlane
 * DateTime = Sun Mar 17 2024 12:20:50 GMT+0800 (中国标准时间)
 * Author = ctq123
 * FileBasename = SelfPlane.ts
 * FileBasenameNoExtension = SelfPlane
 * URL = db://assets/script/SelfPlane.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */
 
@ccclass('SelfPlane')
export class SelfPlane extends Component {

    public lifeValue = 5
    public isLive = true

    private _curLife = 0
    private _audioSource: AudioSource = null

    start() {
        this._audioSource = this.getComponent(AudioSource)
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

    // update (deltaTime: number) {
    //     // [4]
    // }

    public init() {
        this._curLife = this.lifeValue
        this.isLive = true
    }

    private _onTriggerEnter(event: ITriggerEvent) {
        const collisionGroup = event.otherCollider.getGroup()
        if (collisionGroup === Constant.CollisionType.ENEMY_BULLET || collisionGroup === Constant.CollisionType.ENEMY_PLANE) {
            this._curLife--
            if (this._curLife <= 0) {
                console.log('plane die')
                this.isLive = false
                this._audioSource.play()
            }
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
