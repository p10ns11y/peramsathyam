import React from 'react';

type Props = {
  children: React.ReactNode;
};

function PoemSegment(props: Props) {
  if (typeof props.children !== 'string') {
    return null;
  }

  return (
    <p>
      {props.children.split('\n').map((line, index) => (
        <React.Fragment key={index}>
          <span>{line.trim()}</span>
          <br />
        </React.Fragment>
      ))}
    </p>
  );
}

// Not letting the minifier mangle the component name
// since it is used in poem writter
PoemSegment.displayName = 'PoemSegment';

export default PoemSegment;
