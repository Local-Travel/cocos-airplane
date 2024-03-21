import { _decorator, instantiate, Node, NodePool, Prefab } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = PoolManager
 * DateTime = Thu Mar 21 2024 12:26:18 GMT+0800 (中国标准时间)
 * Author = ctq123
 * FileBasename = PoolManager.ts
 * FileBasenameNoExtension = PoolManager
 * URL = db://assets/script/framework/PoolManager.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

interface IDictPool {
    [name: string]: NodePool
}

interface IDictPrefab {
    [name: string]: Prefab
}

// 节点池管理，用于存储已创建的节点，减少创建和销毁的过程，优化性能
@ccclass('PoolManager')
export class PoolManager {
    private _dictPool: IDictPool = {}
    private _dictPrefab: IDictPrefab = {}
    private static _instance: PoolManager = null

    public static instance() {
        if (!this._instance) {
            this._instance = new PoolManager()
        }
        return this._instance
    }

    public getNode(prefab: Prefab, parent: Node) {
        const { name } = prefab.data
        // console.log('getNode ', name)
        let node: Node = null
        this._dictPrefab[name] = prefab
        const pool = this._dictPool[name] 
        if (pool) {
            if (pool.size()) {
                node = pool.get()
            } else {
                node = instantiate(prefab)
            }
        } else {
            this._dictPool[name] = new NodePool()
            node = instantiate(prefab)
        }
        node.parent = parent
        node.active = true
        return node
    }

    public putNode(node: Node) {
        const { name } = node
        // console.log('putNode ', name)
        if (!this._dictPool[name]) {
            this._dictPool[name] = new NodePool()
        }
        this._dictPool[name].put(node)
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
