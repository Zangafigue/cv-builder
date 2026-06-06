import { defineConfig } from 'vitest/config'

// Pure-logic unit tests (templateMapper, CV text parser) run in the Node
// environment — no jsdom needed, no heavy pdfjs/mammoth imports pulled in.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.{test,spec}.{js,jsx}'],
  },
})
