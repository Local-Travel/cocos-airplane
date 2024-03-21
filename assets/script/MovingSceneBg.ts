
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = MovingSceneBg
 * DateTime = Sun Mar 17 2024 09:30:30 GMT+0800 (中国标准时间)
 * Author = ctq123
 * FileBasename = MovingSceneBg.ts
 * FileBasenameNoExtension = MovingSceneBg
 * URL = db://assets/script/MovingSceneBg.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */
 
// 游戏背景管理
@ccclass('MovingSceneBg')
export class MovingSceneBg extends Component {
    // [1]
    // dummy = '';

    @property(Node)
    bg01: Node = null;

    @property(Node)
    bg02: Node = null;

    private _bgSpeed = 10;
    private _bgMovingRange = 90;
    private _bgMovingRange2 = -30;

    start () {
        this._init()
    }

    update (deltaTime: number) {
        this._movingBackGround(deltaTime)
    }

    private _init() {
        this.bg01.setPosition(0, 0, 0)
        this.bg02.setPosition(0, 0, -this._bgMovingRange)
    }

    private _movingBackGround(deltaTime: number) {
        this.bg01.setPosition(0, 0, this.bg01.position.z + deltaTime * this._bgSpeed)
        this.bg02.setPosition(0, 0, this.bg02.position.z + deltaTime * this._bgSpeed)
        
        if (this.bg01.position.z > this._bgMovingRange) {
            this.bg01.setPosition(0, 0, this.bg02.position.z - this._bgMovingRange)
        } else if (this.bg02.position.z > this._bgMovingRange) {
            this.bg02.setPosition(0, 0, this.bg01.position.z - this._bgMovingRange)
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
