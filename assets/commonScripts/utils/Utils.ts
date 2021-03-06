import PromiseUtil from "./PromiseUtil";
import Toast from "../Toast";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass("Utils")
export default class Utils extends cc.Component {
  static matNormal: cc.Material = null
  @property(cc.Material)
  matNormal: cc.Material = null;
  static matGrey: cc.Material = null
  @property(cc.Material)
  matGrey: cc.Material = null;
  start(): void {
    Utils.matNormal = this.matNormal;
    Utils.matGrey = this.matGrey;
  }
  static setGrey(flag, obj: cc.Sprite) {
    obj.setMaterial(0, flag ? this.matGrey : this.matNormal)
  }
  static debounce(func, wait, immediate) {
    let timer;
    return function () {
      let context = this,
        args = arguments;

      if (timer) clearTimeout(timer);
      if (immediate) {
        let callNow = !timer;
        timer = setTimeout(() => {
          timer = null;
        }, wait);
        if (callNow) func.apply(context, args);
      } else {
        timer = setTimeout(() => {
          func.apply(context, args);
        }, wait);
      }
    };
  }
  static subString(str, len) {
    if (!str) {
      str = "";
    }
    var newLength = 0;
    var newStr = "";
    var chineseRegex = /[^\x00-\xff]/g;
    var singleChar = "";
    var strLength = str.replace(chineseRegex, "**").length;
    if (strLength > len) {
      for (var i = 0; i < strLength; i++) {
        singleChar = str.charAt(i).toString();
        if (singleChar.match(chineseRegex) != null) {
          newLength += 2;
        } else {
          newLength++;
        }
        if (newLength > len) {
          break;
        }
        newStr += singleChar;
      }

      if (strLength > len) {
        newStr += "...";
      }
    } else {
      newStr = str;
    }
    return newStr;
  }
  static tweenAnimate(obj, duration: number, to: Object) {
    return new Promise(rsv => {
      cc.tween(obj)
        .to(duration, to)
        .call(e => {
          rsv(null);
        })
        .start();
    });
  }
  static loadingToast = false;
  static prefabToast = null;
  static async showToast(txt) {
    if (this.loadingToast) {
      PromiseUtil.wait(0.2).then(e => {
        this.showToast(txt);
      });
      return;
    }
    if (!this.prefabToast) {
      this.loadingToast = true;
      this.prefabToast = await Utils.load("prefab/Toast", cc.Prefab);
      this.loadingToast = false;
    }
    let toast = cc.instantiate(this.prefabToast) as cc.Node;
    let ctr = toast.getComponent(Toast);
    ctr.setData(txt);
    cc.director
      .getScene()
      .getChildByName("Canvas")
      .addChild(toast);
    cc.tween(toast)
      .set({
        y: -200,
        opacity: 0
      })
      .to(0.2, { y: -150, opacity: 255 })
      .delay(1)
      .to(0.2, {
        y: -200,
        opacity: 0
      })
      .start();
  }

  // static show

  static playSound(url) {
    return new Promise(rsv => {
      cc.resources.load(url, cc.AudioClip, (err, res: cc.AudioClip) => {
        let audio = cc.audioEngine.play(res, false, 1);
        rsv(audio);
      });
    });
  }
  static async asyncByTime(time) {
    return new Promise(rsv => {
      setTimeout(() => {
        rsv(null);
      }, time);
    });
  }
  static throttle(func, delay) {
    var prev = Date.now();
    return function () {
      var context = this;
      var args = arguments;
      var now = Date.now();
      if (now - prev >= delay) {
        func.apply(context, args);
        prev = Date.now();
      }
    };
  }
  static getQueryVariable(variable, query?) {
    query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (pair[0] == variable) {
        return pair[1];
      }
    }
    return null;
  }
  static goScene(url) {
    return new Promise(rsv => {
      cc.director.loadScene(url, (err, scene) => {
        rsv(null);
      });
    });
    // cc.tween(self)
    //   .to(0.2, { opacity: 0 })
    //   .start();
  }
  static getPrefab(addres: string) {
    return new Promise(rsv => {
      cc.resources.load(addres, cc.Prefab, (err, res) => {
        rsv(res);
      });
    });
  }
  static setSpFont(container: cc.Label, addres: string) {
    return new Promise((rsv, rej) => {
      cc.resources.load(addres, cc.BitmapFont, (err, spFrame) => {
        container.font = spFrame as cc.BitmapFont | null;
        rsv(null);
      });
    });
  }
  static canvas;
  static getBase64Image(img) {
    if (!this.canvas) {
      this.canvas = document.createElement("canvas");
    }
    this.canvas.width = img.width;
    this.canvas.height = img.height;
    var ctx = this.canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);
    var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
    var dataURL = this.canvas.toDataURL("image/" + ext);
    return dataURL;
  }
  static listImg = [];
  static flagLoadingImg = false;
  static setSpImgFromNet(container: cc.Sprite, addres: string) {
    return new Promise(async (rsv, rej) => {
      if (this.flagLoadingImg) {
        // await PromiseUtil.wait(0.1);
        // return this.setSpImgFromNet(container, addres);
      }
      this.flagLoadingImg = true;
      // addres =
      //   "http://ll-res.ll18.cn/gift/image/platform/bc1579d8-50d0-11eb-8915-0242ac120004.png!default.png";

      addres = addres.replace("!default.png", "");
      addres = addres.replace(
        "http://paopao-files.xwab.cn/",
        "http://ll-res.ll18.cn/"
      );
      if (addres) {
        if (this.listImg[addres]) {
          container.spriteFrame = this.listImg[addres];
          this.flagLoadingImg = false;
          rsv(null);
        } else {
          let img = new Image();
          img.setAttribute("crossOrigin", "anonymous");
          img.src = addres;

          img.addEventListener("load", e => {
            this.flagLoadingImg = false;
            let img2 = new Image();
            img2.src = this.getBase64Image(img);
            let texture = new cc.Texture2D();
            texture.initWithElement(img);
            let frame = new cc.SpriteFrame(texture);
            container.spriteFrame = frame as cc.SpriteFrame | null;
            this.listImg[addres] = frame;

            rsv(null);
          });
        }
      } else {
        this.flagLoadingImg = false;
        console.log("?????????");
        rej(null);
      }
    });
  }
  static async load(addres, type) {
    return new Promise(rsv => {
      let res = cc.assetManager.getBundle("resources").get(addres, type);
      if (res) {
        rsv(res);
      } else {
        cc.resources.load(addres, type, (err, res) => {
          rsv(res);
        });
      }
    });
  }
  static setSpImg(container: cc.Sprite, addres: string) {
    return new Promise((rsv, rej) => {
      if (!addres) {
        container.spriteFrame = null;
        rsv(null);
      } else {
        let spFrame = cc.assetManager
          .getBundle("resources")
          .get(addres, cc.SpriteFrame);
        if (spFrame) {
          if (container && container.isValid && spFrame) {
            container.spriteFrame = spFrame as cc.SpriteFrame | null;
          }
          rsv(null);
        } else {
          cc.resources.load(addres, cc.SpriteFrame, (err, spFrame) => {
            if (container && container.isValid && spFrame) {
              container.spriteFrame = spFrame as cc.SpriteFrame | null;
            }
            rsv(null);
          });
        }
      }
    });
  }

  static timeFormat(fmt, surtime) {
    var d = Math.floor(surtime / (24 * 3600));
    var leave1 = surtime % (24 * 3600);
    var h = Math.floor(leave1 / 3600); //?????????????????????
    var leave2 = leave1 % 3600; //????????????????????????????????????
    var m = Math.floor(leave2 / 60); //??????????????????
    var leave3 = leave2 % 60; //????????????????????????????????????
    var s = Math.round(leave3);

    let ret;
    let opt = {
      "d+": d.toString(), // ???
      "H+": h.toString(), // ???
      "M+": m.toString(), // ???
      "S+": s.toString() // ???
      // ???????????????????????????????????????????????????????????????????????????
    };
    for (let k in opt) {
      ret = new RegExp("(" + k + ")").exec(fmt);
      if (ret) {
        fmt = fmt.replace(
          ret[1],
          ret[1].length == 1
            ? opt[k]
            : ("0000000" + opt[k]).slice(-ret[1].length)
        );
      }
    }
    return fmt;
  }
  static dateFormat(fmt, date) {
    let ret;
    let opt = {
      "Y+": date.getFullYear().toString(), // ???
      "m+": (date.getMonth() + 1).toString(), // ???
      "d+": date.getDate().toString(), // ???
      "H+": date.getHours().toString(), // ???
      "M+": date.getMinutes().toString(), // ???
      "S+": date.getSeconds().toString() // ???
      // ???????????????????????????????????????????????????????????????????????????
    };
    for (let k in opt) {
      ret = new RegExp("(" + k + ")").exec(fmt);
      if (ret) {
        fmt = fmt.replace(
          ret[1],
          ret[1].length == 1
            ? opt[k]
            : ("000000" + opt[k]).slice(-ret[1].length)
        );
      }
    }
    return fmt;
  }
  static flagAjaxing = false;
  static doAjax({ url = "", data = {}, method = "get", noPop = false }) {
    method = method.toLowerCase();
    // ????????????
    // let host = "http://jiutousang.cn.utools.club";
    // let host = "http://39.101.162.107:8091";
    // let host = "http://39.105.44.205:7001";
    let host = "https://ll-api.ll18.cn";
    if (!!Utils.getQueryVariable("test")) {
      host = "http://39.105.149.236:5084";
    }
    if (url.indexOf("http") == -1) {
      url = host + url;
    }
    return new Promise(async (rsv, rej) => {
      while (this.flagAjaxing) {
        await PromiseUtil.wait(0.1);
      }
      this.flagAjaxing = true;
      data["user_id"] = Utils.getQueryVariable("user_id") || 453116;
      if (!Utils.getQueryVariable("test")) {
        if (method == "post") {
          kk.post(url, data, e => {
            this.flagAjaxing = false;
            e = kk.parseBase64(e);
            console.log(e, url, "?????????????????? post");
            if (e.code == 0) {
              rsv(e.data);
            } else {
              if (e.msg) {
                Utils.showToast(e.msg);
              } else {
                Utils.showToast("???????????????~?????????????????????");
              }
              console.warn(url, data, e);
              rej(e);
            }
          });
        } else {
          kk.get(url, data, e => {
            this.flagAjaxing = false;
            e = kk.parseBase64(e);
            console.log(e, url, "?????????????????? get");
            if (e.code == 0) {
              rsv(e.data);
            } else {
              if (e.msg) {
                Utils.showToast(e.msg);
              } else {
                Utils.showToast("???????????????~?????????????????????");
              }
              console.warn(url, data, e);
              rej(e);
            }
          });
        }
      } else {
        let request = new XMLHttpRequest();
        request.timeout = 20000;
        request.onreadystatechange = e => {
          if (
            request.readyState == 4 &&
            request.status >= 200 &&
            request.status < 400
          ) {
            this.flagAjaxing = false;
            var response = request.responseText;
            let res: any = {};
            if (response.indexOf("{") > -1) {
              res = JSON.parse(response);
            } else {
              res = response;
            }
            if (res.code == 0) {
              rsv(res.data);
            } else {
              if (!noPop) {
                Utils.showToast(res.msg);
              }
              rej(res.msg);
            }
          }
        };
        request.onerror = e => {
          this.flagAjaxing = false;
          console.error("????????????", e);
          rej(null);
        };
        let dataNew = Object.assign({}, data);
        let dataStr = "";
        for (let key in dataNew) {
          dataStr += `${key}=${dataNew[key]}&`;
        }

        request.open(method, method == "post" ? url : url + "?" + dataStr);
        request.setRequestHeader("Content-Type", "application/json");
        request.send(method == "post" ? JSON.stringify(dataNew) : null);
      }
    });
  }
}

