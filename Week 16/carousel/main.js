import { createElement } from './jsx.js';
import Carousel from './Carousel';
import { Timeline, Animation } from './animation';
import List from './List';

const tl = new Timeline();
tl.add(new Animation({}, 'a', 0, 100, 1000, null));
tl.start();

const IMAGES = [
  {
    img:
      'https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg',
    url: 'https:www.baidu.com',
    title: 'title-1',
  },
  {
    img:
      'https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg',
    url: 'https:www.baidu.com',
    title: 'title-2',
  },
  {
    img:
      'https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg',
    url: 'https:www.baidu.com',
    title: 'title-3',
  },
  {
    img:
      'https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg',
    url: 'https:www.baidu.com',
    title: 'title-4',
  },
];

// const IMAGES = [1, 2, 3, 4];
// const carousel = (
//   <Carousel images={IMAGES} onChange={(e) => console.log(e.detail.position)}
//     onClick={(e) => window.open(e.detail.data.url, '__blank')}
//    />
// );
const QiButton = (
  <List data={IMAGES}>
    {(item) => (
      <div>
        <img src={item.img} />
        <a href={item.url}>{item.title}</a>
      </div>
    )}
  </List>
);
QiButton.mountTo(document.body);
