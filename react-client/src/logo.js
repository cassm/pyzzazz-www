import React from 'react';

const Logo = props => {
  const logoColour = "#750027";
  const fifthCircle = 360 / 5;
  const radiusToEdge = 1.1756;

  const innerPentRadius = 0.3;
  const outerPentRadius = 0.55;

  const strokeWidth = props.size / 25;
  const lines = [];
  if (!Logo.idIndex) {
    Logo.idIndex = 0;
  }

  lines.push(<circle cx="50%" cy="50%" r="50%" fill="white" key={`logoMaskLine${Logo.idIndex++}`}/>);

  for (let i = 0; i < 5; i++) {
    lines.push(<line x1="50%" y1="50%" x2="50%" y2="100%" stroke="black" strokeWidth={strokeWidth}
                     transform={`rotate(${i * fifthCircle} ${props.size * 0.5} ${props.size * 0.5})`}
                     key={`logoMaskLine${Logo.idIndex++}`}/>);

    const innerPentIntersections = [[50 - 50 * innerPentRadius * radiusToEdge * 0.6, 50 * (1 - innerPentRadius)],
      [50 + 50 * innerPentRadius * radiusToEdge * 0.6, 50 * (1 - innerPentRadius)]];

    const outerPentIntersections = [[50 - 50 * outerPentRadius * radiusToEdge * 0.6, 50 * (1 - outerPentRadius)],
      [50 + 50 * outerPentRadius * radiusToEdge * 0.6, 50 * (1 - outerPentRadius)]];

    const outestPentIntersections = [[50 - 50 * outerPentRadius * radiusToEdge * 0.39, 50 * (1 - outerPentRadius * 1.36)],
      [50 + 50 * outerPentRadius * radiusToEdge * 0.39, 50 * (1 - outerPentRadius * 1.36)]];

    lines.push(<line x1={`${innerPentIntersections[0][0]}%`} y1={`${innerPentIntersections[0][1]}%`}
                     x2="50%" y2="0"
                     stroke="black" strokeWidth={strokeWidth}
                     transform={`rotate(${i * fifthCircle} ${props.size * 0.5} ${props.size * 0.5})`}
                     key={`logoMaskLine${Logo.idIndex++}`}/>);

    lines.push(<line x1="50%" y1="0"
                     x2={`${innerPentIntersections[1][0]}%`} y2={`${innerPentIntersections[1][1]}%`}
                     stroke="black" strokeWidth={strokeWidth}
                     transform={`rotate(${i * fifthCircle} ${props.size * 0.5} ${props.size * 0.5})`}
                     key={`logoMaskLine${Logo.idIndex++}`}/>);

    lines.push(<line x1={`${outerPentIntersections[0][0]}%`} y1={`${outerPentIntersections[0][1]}%`}
                     x2="50%" y2="0"
                     stroke="black" strokeWidth={strokeWidth}
                     transform={`rotate(${i * fifthCircle} ${props.size * 0.5} ${props.size * 0.5})`}
                     key={`logoMaskLine${Logo.idIndex++}`}/>);

    lines.push(<line x1="50%" y1="0"
                     x2={`${outerPentIntersections[1][0]}%`} y2={`${outerPentIntersections[1][1]}%`}
                     stroke="black" strokeWidth={strokeWidth}
                     transform={`rotate(${i * fifthCircle} ${props.size * 0.5} ${props.size * 0.5})`}
                     key={`logoMaskLine${Logo.idIndex++}`}/>);

    lines.push(<line x1={`${outestPentIntersections[0][0]}%`} y1={`${outestPentIntersections[0][1]}%`}
                     x2="50%" y2="0"
                     stroke="black" strokeWidth={strokeWidth}
                     transform={`rotate(${i * fifthCircle + fifthCircle / 2} ${props.size * 0.5} ${props.size * 0.5})`}
                     key={`logoMaskLine${Logo.idIndex++}`}/>);

    lines.push(<line x1="50%" y1="0"
                     x2={`${outestPentIntersections[1][0]}%`} y2={`${outestPentIntersections[1][1]}%`}
                     stroke="black" strokeWidth={strokeWidth}
                     transform={`rotate(${i * fifthCircle + fifthCircle / 2} ${props.size * 0.5} ${props.size * 0.5})`}
                     key={`logoMaskLine${Logo.idIndex++}`}/>);


    lines.push(<line x1={`${innerPentIntersections[0][0]}%`} y1={`${innerPentIntersections[0][1]}%`}
                     x2={`${innerPentIntersections[1][0]}%`} y2={`${innerPentIntersections[1][1]}%`}
                     stroke="black" strokeWidth={strokeWidth}
                     transform={`rotate(${i * fifthCircle} ${props.size * 0.5} ${props.size * 0.5})`}
                     key={`logoMaskLine${Logo.idIndex++}`}/>);
  }

  const radialGradientName = `logoRadialGradient${Logo.idIndex++}`
  const maskName = `logoMask${Logo.idIndex++}`
  return (
    <svg
      width={props.size} height={props.size}
      xmlns="http://www.w3.org/2000/svg"
      className="Logo"
      key={`logoSvg${Logo.idIndex++}`}
    >
      <title>Pyzzazz Logo</title>
      <desc>An isometric view of a stellated icosahedron, rendered in white line-art over a radial gradient</desc>
      <defs>
        <radialGradient id={radialGradientName}>
          <stop offset="0%" stopColor={props.darkMode ? logoColour : "white"}/>
          <stop offset="30%" stopColor="#FFCBD9FF"/>
          <stop offset="100%" stopColor={props.darkMode ? "white" : logoColour}/>
        </radialGradient>
        <mask id={maskName} maskUnits="userSpaceOnUse">
          {lines}
        </mask>
        mask>
      </defs>
      <circle cx="50%" cy="50%" r="50%" fill={`url(#${radialGradientName})`} mask={`url(#${maskName})`} key={`logoGradientCircle${Logo.idIndex++}`}/>
    </svg>
  )
}

export default Logo;
