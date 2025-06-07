import { describe, it, expect } from 'vitest'
import { parseMarkdownToItems } from '../src/lib/markdown'

describe('parseMarkdownToItems', () => {
  it('parses indentation levels correctly', () => {
    const md = `\n- [ ] root\n  - [ ] child1\n    - [ ] grandchild\n  - [ ] child2\n`
    const items = parseMarkdownToItems(md)
    expect(items.map(i => i.content)).toEqual(['root', 'child1', 'grandchild', 'child2'])
    expect(items.map(i => i.indentLevel)).toEqual([0,1,2,1])
    expect(items.map(i => i.index)).toEqual([0,1,2,3])
  })

  it('skips non-item and header lines', () => {
    const md = `# Title\n\nNot a todo line\n- [ ] first\n\n- [x] second\n`
    const items = parseMarkdownToItems(md)
    expect(items.map(i => i.content)).toEqual(['first','second'])
    expect(items.map(i => i.index)).toEqual([0,1])
  })
})
