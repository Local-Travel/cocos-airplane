
import { _decorator, Component, Node } from 'cc';
import { PoolManager } from './framework/PoolManager';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = Explode
 * DateTime = Thu Mar 21 2024 19:55:01 GMT+0800 (中国标准时间)
 * Author = ctq123
 * FileBasename = Explode.ts
 * FileBasenameNoExtension = Explode
 * URL = db://assets/script/Explode.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */
 
// 敌家飞机爆炸的回收
@ccclass('Explode')
export class Explode extends Component {
    
    protected onEnable(): void {
        this.scheduleOnce(this._putBack, 1)
    }

    private _putBack() {
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
