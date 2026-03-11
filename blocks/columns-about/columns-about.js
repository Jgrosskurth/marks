export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // setup image columns and scroll animations
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture') || col.querySelector('img');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          picWrapper.classList.add('columns-about-img-col');
          picWrapper.classList.add('animate-slide-from-right');
        }
      } else {
        col.classList.add('animate-slide-from-left');
      }
    });
  });

  // Add decorative "m" watermark SVG to the image column
  const imgCol = block.querySelector('.columns-about-img-col');
  if (imgCol) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('letter-watermark');
    svg.setAttribute('viewBox', '0 0 690 467');
    svg.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M490.039 109.58C448.481 109.58 412.129 138.867 412.129 203.462V466.184H277.977V193.999C277.977 136.292 250.292 109.58 212.194 109.58C170.636 109.58 134.284 138.867 134.284 203.462V466.184H0.973877V13.9596H134.253V56.185C165.43 17.4344 212.163 0.184326 260.643 0.184326C320.377 0.184326 363.65 26.8971 387.874 73.404C425.972 20.0095 476.166 0.184326 535.9 0.184326C640.653 0.184326 689.974 68.2228 689.974 174.174V466.184H555.822V193.999C555.822 136.292 528.137 109.58 490.039 109.58Z');
    svg.append(path);
    imgCol.append(svg);
  }
}
