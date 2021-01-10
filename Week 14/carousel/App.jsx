import React from 'react';
import Carousel from './components/Carousel';

import styles from './app.less';

const App = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        height: '100vh',
        alignItems: 'center',
      }}
    >
      <Carousel className={styles.wrapper}>
        {['red', 'black', 'green', 'yellow'].map((color, index) => (
          <div
            key={color}
            style={{ backgroundColor: color }}
            className={styles.item}
          >
            <h1>{index + 1}</h1>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default App;
