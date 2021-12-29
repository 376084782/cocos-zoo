import PopupManager from "../../commonScripts/core/PopupManager";
import MathUtil from "../../commonScripts/utils/MathUtil";
import Utils from "../../commonScripts/utils/Utils";

export default class GameManager {
  static posAvatarSelf: cc.Vec3;
  static async showAniCoin(posFrom?, posEnd?) {
    let prefabCoin = await Utils.load('prefab/金币', cc.Prefab);
    let wrap = cc.Canvas.instance.node;
    wrap.convertToNodeSpaceAR(posFrom, posFrom);
    let p3 = wrap.convertToNodeSpaceAR(posEnd);
    for (let i = 0; i < 20; i++) {
      let sp = cc.instantiate(prefabCoin) as cc.Node;
      wrap.addChild(sp);
      sp.x = posFrom.x + MathUtil.getRandomInt(-120, 120);
      let y = posFrom.y + Math.random() * 20;
      sp.y = y - 70;
      sp.scale = 0;
      cc.tween(sp)
        .set({ scale: 0 })
        .to(.1, { scale: 1, y: y })
        .delay(.1 * Math.random())
        .to(.2, {
          x: p3.x, y: p3.y, scale: .2
        }).call(() => { sp.destroy() }).start()
    }
  }

  static async showTxtAdded(num: number, posStart,) {
    let prefab = await Utils.load('prefab/txtCoin', cc.Prefab);
    let sp = cc.instantiate(prefab) as cc.Node;
    let wrap = cc.Canvas.instance.node;
    let p = wrap.convertToNodeSpaceAR(posStart);
    wrap.addChild(sp);
    sp.opacity = 0;
    sp.x = p.x;
    sp.y = p.y;
    let txt = sp.getComponent(cc.Label);
    txt.string = '+' + num;
    cc.tween(sp)
      .to(.2, { x: p.x, y: p.y + 50, opacity: 255 })
      .delay(1)
      .to(.2, { x: p.x, y: p.y, opacity: 0 })
      .call(() => { sp.destroy() })
      .start()
  }
}