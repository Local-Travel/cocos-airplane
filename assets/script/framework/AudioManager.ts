
import { _decorator, AudioClip, AudioSource, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = AudioManager
 * DateTime = Thu Mar 21 2024 11:20:54 GMT+0800 (中国标准时间)
 * Author = ctq123
 * FileBasename = AudioManager.ts
 * FileBasenameNoExtension = AudioManager
 * URL = db://assets/script/framework/AudioManager.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

interface IAudioMap {
    [name: string]: AudioClip
}
 
@ccclass('AudioManager')
export class AudioManager extends Component {
    @property([AudioClip])
    public audioList: AudioClip[] = []

    private _audioDict: IAudioMap = {}
    private _audioSource: AudioSource = null

    start () {
        for (let index = 0; index < this.audioList.length; index++) {
            const element = this.audioList[index];
            this._audioDict[element.name] = element
        }
        this._audioSource = this.getComponent(AudioSource)
    }

    // update (deltaTime: number) {
    //     // [4]
    // }

    public play(name: string) {
        const audio = this._audioDict[name]
        if (audio) {
            this._audioSource.playOneShot(audio)
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
