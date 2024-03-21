
import { _decorator, Component, EventTouch, Node, SystemEvent, systemEvent, Touch } from 'cc';
import { GameManager } from '../framework/GameManager';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = UIMain
 * DateTime = Mon Mar 18 2024 10:14:43 GMT+0800 (中国标准时间)
 * Author = ctq123
 * FileBasename = UIMain.ts
 * FileBasenameNoExtension = UIMain
 * URL = db://assets/script/ui/UIMain.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */
 
@ccclass('UIMain')
export class UIMain extends Component {
    // [1]
    // dummy = '';

    @property
    public planeSpeed = 1

    @property(Node)
    public playerPlane: Node = null;
    @property(Node)
    public gameStart: Node = null;
    @property(Node)
    public game: Node = null;
    @property(Node)
    public gameOver: Node = null;

    @property(GameManager)
    public gameManager: GameManager = null;

    start () {
        this.node.on(SystemEvent.EventType.TOUCH_START, this._touchStart, this)
        this.node.on(SystemEvent.EventType.TOUCH_MOVE, this._touchMove, this)
        this.node.on(SystemEvent.EventType.TOUCH_END, this._touchEnd, this)

        this.gameStart.active = true
        this.gameOver.active = false
        this.game.active = false
    }

    // update (deltaTime: number) {
    //     // [4]
    // }

    public reStart() {
        this.gameOver.active = false
        this.game.active = true
        this.gameManager.gameReStart()
    }
    
    public returnMain() {
        this.gameOver.active = false
        this.gameStart.active = true
        this.gameManager.returnMain()
    }

    _touchStart(touch: Touch, event: EventTouch) {
        if (this.gameManager.isGagmeStart) {
            this.gameManager.isShooting(true)
        } else {
            if (!this.gameOver.active) {
                this.gameStart.active = false
                this.game.active = true
                this.gameManager.gameStart()
            }
        }
    }

    _touchMove(touch: Touch, event: EventTouch) {
        if (!this.gameManager.isGagmeStart) {
            return
        }
        const delta = touch.getDelta()
        let pos = this.playerPlane.position;
        this.playerPlane.setPosition(pos.x + 0.01 * this.planeSpeed * delta.x, pos.y, pos.z - 0.01 * this.planeSpeed * delta.y)
    }

    _touchEnd(touch: Touch, event: EventTouch) {
        if (!this.gameManager.isGagmeStart) {
            return
        }
        this.gameManager.isShooting(false)
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
