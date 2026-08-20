import assert from 'node:assert/strict';
import test from 'node:test';
import rehypeCleanGuideEditorialCopy from '../scripts/rehype-clean-guide-editorial-copy.mjs';

function text(value) {
  return { type: 'text', value };
}

test('guide editorial cleaner removes only recognised internal copy', () => {
  const tree = {
    type: 'root',
    children: [
      { type: 'element', tagName: 'h1', children: [text('Guide title')] },
      {
        type: 'element',
        tagName: 'blockquote',
        children: [{ type: 'element', tagName: 'p', children: [text('Editorial status: do not publish')] }],
      },
      { type: 'element', tagName: 'p', children: [text('This draft prioritizes evidence.')] },
      { type: 'raw', value: '<!-- EDITORIAL IMPLEMENTATION NOTES — DO NOT DISPLAY AS CLINICAL CONTENT -->' },
      { type: 'raw', value: '<!-- visible only to template maintainers -->' },
      {
        type: 'element',
        tagName: 'p',
        children: [text('A systematic review may inform care, and AI can draft a clinician summary.')],
      },
    ],
  };

  rehypeCleanGuideEditorialCopy()(tree);

  assert.equal(tree.children.length, 4);
  assert.equal(tree.children[1].children[0].value, 'This article prioritizes evidence.');
  assert.equal(tree.children[2].value, '<!-- visible only to template maintainers -->');
  assert.equal(tree.children[3].children[0].value, 'A systematic review may inform care, and AI can draft a clinician summary.');
});
