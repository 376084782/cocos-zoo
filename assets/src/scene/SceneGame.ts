import MathUtil from "../../commonScripts/utils/MathUtil";
import Hole from "../comp/Hole";
import ConfigCustom from "../config/ConfigCustom";
import GameManager from "../manager/GameManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SceneGame extends cc.Component {

  listHole: Hole[] = [];

  @property(cc.Prefab)
  prefabHole: cc.Prefab = null;

  @property(cc.Node)
  wrapHole: cc.Node = null;

  @property(cc.Node)
  wrapAvatarSelf: cc.Node = null;


  start() {
    GameManager.posAvatarSelf = this.wrapAvatarSelf.convertToWorldSpaceAR(cc.v3(-6, -17));

    this.wrapHole.removeAllChildren()
    this.listHole = []
    ConfigCustom.posHole.forEach(([x, y]) => {
      let sp = cc.instantiate(this.prefabHole);
      this.wrapHole.addChild(sp);
      let ctr = sp.getComponent(Hole);
      this.listHole.push(ctr)
      sp.x = x;
      sp.y = y;
    })

    this.scheduleOnce(e => {
      this.listHole.forEach((ctr: Hole) => {
        ctr.showBird(MathUtil.getRandomInt(1, 5));
      })
    }, 2)
  }

  // update (dt) {}
}
