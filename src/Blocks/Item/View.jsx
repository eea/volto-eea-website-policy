import React from 'react';
import Item from './Item';

const View = (props) => {
  const { data = {} } = props;
  return <Item {...data} />;
};

export default View;
