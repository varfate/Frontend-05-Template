import { Component, STATE, ATTRIBUTE } from './jsx';
import enableGesture from '../gesture/index';
import { Timeline, Animation } from './animation';
import { ease } from './ease';

export { STATE, ATTRIBUTE };

export default class Carousel extends Component {
  constructor() {
    super();
    this.WIDTH = 500;
  }
  render() {
    this.root = document.createElement('div');
    this.root.classList.add('carousel');
    for (let image of this[ATTRIBUTE].images) {
      let child = document.createElement('div');
      child.style.backgroundImage = `url(${image.img})`;
      this.root.appendChild(child);
    }

    const timeLine = new Timeline();
    timeLine.start();

    let children = this.root.children;

    this[STATE].position = 0;

    let t = 0;
    // animate x
    let ax = 0;
    let timer = null;

    const nextPic = () => {
      const nextIndex = (this[STATE].position + 1) % children.length;
      const current = children[this[STATE].position];
      const next = children[nextIndex];
      t = Date.now();
      timeLine.add(
        new Animation(
          current.style,
          'transform',
          -this[STATE].position * this.WIDTH,
          -(1 + this[STATE].position) * this.WIDTH,
          500,
          0,
          ease,
          (v) => `translateX(${v}px)`
        )
      );
      timeLine.add(
        new Animation(
          next.style,
          'transform',
          (1 - nextIndex) * this.WIDTH,
          -nextIndex * this.WIDTH,
          500,
          0,
          ease,
          (v) => `translateX(${v}px)`
        )
      );
      this.triggerEvent('change', { position: this[STATE].position });
      this[STATE].position = nextIndex;
    };
    clearInterval(timer);
    timer = setInterval(nextPic, 3000);

    // 监听手势
    enableGesture(this.root);

    this.root.addEventListener('start', () => {
      timeLine.pause();
      clearInterval(timer);
      // 动画时间进度
      let progress = (Date.now() - t) / 500;
      ax = ease(progress) * this.WIDTH - this.WIDTH;
    });

    this.root.addEventListener('tap', (event) => {
      this.triggerEvent('click', {
        data: this[ATTRIBUTE].images[this[STATE].position],
        position: this[STATE].position,
      });
    });

    this.root.addEventListener('pan', (event) => {
      const x = event.clientX - event.startX - ax;
      // 当前在屏幕的中心元素
      let current = this[STATE].position - (x - (x % this.WIDTH)) / this.WIDTH;
      console.log(
        this[STATE].position,
        current,
        x,
        event.clientX,
        event.startX,
        ax
      );

      for (let offset of [-1, 0, 1]) {
        let pos = current + offset;
        pos = ((pos % children.length) + children.length) % children.length;
        children[pos].style.transform = `translate(${
          -pos * this.WIDTH + offset * this.WIDTH + (x % this.WIDTH)
        }px)`;
      }
    });

    this.root.addEventListener('end', (event) => {
      // 重新开始时间线
      timeLine.reset();
      timeLine.start();
      clearInterval(timer);
      timer = setInterval(nextPic, 3000);

      const x = event.clientX - event.startX - ax;
      const current =
        this[STATE].position - ((x - (x % this.WIDTH)) % this.WIDTH);
      let direction = (x % this.WIDTH) / this.WIDTH;

      if (event.isFlick) {
        if (event.velocity > 0) {
          direction = Math.ceil(direction);
        } else {
          direction = Math.floor(direction);
        }
      } else {
        direction = Math.round(direction);
      }
      for (let offset of [0, Math.sign(x - 250 * Math.sign(x))]) {
        let pos = current + offset;
        pos = ((pos % children.length) + children.length) % children.length;

        timeLine.add(
          new Animation(
            children[pos].style,
            'transform',
            -pos * this.WIDTH + offset * this.WIDTH + (x % this.WIDTH),
            -pos * this.WIDTH + offset * this.WIDTH + direction * this.WIDTH,
            500,
            0,
            ease,
            (v) => `translateX(${v}px)`
          )
        );
        this[STATE].position =
          this[STATE].position -
          (x - (x % this.WIDTH)) / this.WIDTH -
          direction;
        this[STATE].position =
          ((this[STATE].position % children.length) + children.length) %
          children.length;
      }
    });

    return this.root;
  }
}
