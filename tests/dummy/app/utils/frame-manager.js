import { messagerFor } from '../utils/post-messages';

export default class FrameManager {

  constructor(srcUrl, options = {}) {
    this.postMessageUrl = options.postMessageUrl || this.srcUrl;
    this.srcUrl = srcUrl;
    this.frame = document.createElement('iframe');
    this.frame.name = options.name;
    this.frame.className = options.className;
    this.frame.src = srcUrl;
  }

  append() {
    document.body.appendChild(this.frame);
    this.postMessage = messagerFor(this.frame.contentWindow, this.postMessageUrl);
  }

  remove() {
    document.body.removeChild(this.frame);
  }

}
