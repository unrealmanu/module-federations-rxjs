import React from "react";

interface BlockComponentsInterface {
  test?: string;
}

export const Block: React.FC<BlockComponentsInterface> = ({ test }) => {
  return <>my block... {test}</>;
};
export default Block;
