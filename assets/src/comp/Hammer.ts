import Utils from "../../commonScripts/utils/Utils";
import GameManager from "../manager/GameManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Hammer extends cc.Component {

  @property(cc.Label)
  label: cc.Label = null;


  // LIFE-CYCLE CALLBACKS:

  // onLoad () {}

  start() {

  }

  doAni() {
    cc.tween(this.node).to(.14, { angle: 30 }).call(e => {
      this.scheduleOnce(e => {
        this.node.removeFromParent()
      }, .3)
    }).start();

  }

  // update (dt) {}
}
