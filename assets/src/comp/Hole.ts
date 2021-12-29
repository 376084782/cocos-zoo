import Utils from "../../commonScripts/utils/Utils";
import GameManager from "../manager/GameManager";
import Hammer from "./Hammer";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Hole extends cc.Component {


    @property(cc.Prefab)
    prefabHammer: cc.Prefab = null;

    @property(cc.Sprite)
    imgAnimal: cc.Sprite = null;

    canClick = false;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        this.imgAnimal.node.y = -170;

        this.node.on(cc.Node.EventType.TOUCH_END, e => {
            this.aniHit()
        })
    }
    duration = .6
    showBird(type) {
        this.imgAnimal.node.stopAllActions();
        Utils.setSpImg(this.imgAnimal, `切图/动物/鸟${type}`);
        cc.tween(this.imgAnimal.node).set({ y: -170 }).to(this.duration, { y: 0 }).call(e => {
            this.canClick = true;
        }).start();
    }
    hideBird() {
        this.imgAnimal.node.stopAllActions();
        cc.tween(this.imgAnimal.node).to(this.duration, { y: -170 }).call(e => {
            this.canClick = false;
        }).start();
    }
    aniHit() {
        let hammer = cc.instantiate(this.prefabHammer);
        let ctr = hammer.getComponent(Hammer);
        ctr.doAni();
        hammer.x = 120;
        hammer.y = 101;
        this.node.addChild(hammer);

        let pos = new cc.Vec3(0, 170);
        this.node.convertToWorldSpaceAR(pos, pos)
        GameManager.showAniCoin(pos, GameManager.posAvatarSelf);

        GameManager.showTxtAdded(1000, GameManager.posAvatarSelf);
    }

    // update (dt) {}
}
