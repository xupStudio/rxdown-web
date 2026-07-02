// Wrap every markdown <table> in <div class="table-scroll"> so wide comparison
// tables scroll inside their own box instead of forcing the whole page to
// overflow horizontally on narrow screens. Hand-rolled hast walk keeps this a
// zero-dependency plugin (no unist-util-visit). See global.css .table-scroll.
export default function rehypeWrapTables() {
  return (tree) => {
    const walk = (node) => {
      const kids = node.children;
      if (!kids) return;
      for (let i = 0; i < kids.length; i++) {
        const child = kids[i];
        if (child.type === 'element' && child.tagName === 'table') {
          // overflow-x:auto (.table-scroll in global.css) satisfies WCAG 1.4.10
          // Reflow. Only `class` survives Astro's rehype-raw round-trip on
          // synthetic nodes, so tabindex=0 (WCAG 2.1.1, keyboard scroll) is set
          // client-side in Base.astro. Pattern: adrianroselli.com/2020/11/
          // under-engineered-responsive-tables.html
          kids[i] = {
            type: 'element',
            tagName: 'div',
            properties: { className: ['table-scroll'] },
            children: [child],
          };
        } else {
          walk(child);
        }
      }
    };
    walk(tree);
  };
}
