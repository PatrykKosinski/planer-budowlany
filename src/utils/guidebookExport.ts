import { marked } from 'marked'
import type { Stage } from '../types'

type GlobFn = (pattern: string, opts: object) => Record<string, () => Promise<unknown>>
const contentModules = (import.meta as unknown as { glob: GlobFn }).glob('../content/tasks/*.md', {
  query: '?raw',
  import: 'default',
})

async function loadMarkdown(taskId: string): Promise<string> {
  const key = `../content/tasks/${taskId}.md`
  const loader = contentModules[key]
  if (!loader) return ''
  return loader() as Promise<string>
}

function buildStyles(): string {
  return `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 10.5pt;
      line-height: 1.65;
      color: #2c2c2c;
      background: white;
    }

    /* ── Cover page ────────────────────── */
    .cover {
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-height: 100vh;
      padding: 80px 60px;
      border-bottom: 3px solid #9b8b6e;
    }
    .cover-label {
      font-size: 9pt;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #9b8b6e;
      margin-bottom: 24px;
    }
    .cover-title {
      font-family: 'Lora', Georgia, serif;
      font-size: 36pt;
      font-weight: 600;
      color: #2c2c2c;
      line-height: 1.15;
      margin-bottom: 16px;
    }
    .cover-subtitle {
      font-size: 13pt;
      color: #6b6258;
      margin-bottom: 48px;
    }
    .cover-meta {
      font-size: 9pt;
      color: #9b8b6e;
    }

    /* ── Table of contents ─────────────── */
    .toc {
      padding: 60px 60px 40px;
      page-break-after: always;
    }
    .toc-heading {
      font-family: 'Lora', Georgia, serif;
      font-size: 20pt;
      font-weight: 600;
      color: #2c2c2c;
      margin-bottom: 32px;
      padding-bottom: 12px;
      border-bottom: 1px solid #e8e0d5;
    }
    .toc-list {
      list-style: none;
    }
    .toc-stage-item {
      margin-top: 20px;
    }
    .toc-stage-label {
      font-size: 10.5pt;
      font-weight: 600;
      color: #2c2c2c;
      padding: 6px 0;
      border-bottom: 1px solid #f0ece6;
      display: flex;
      justify-content: space-between;
      gap: 12px;
    }
    .toc-task-list {
      list-style: none;
      padding-left: 16px;
    }
    .toc-task-item {
      padding: 3px 0;
      font-size: 9.5pt;
      color: #6b6258;
      display: flex;
      justify-content: space-between;
      gap: 12px;
    }
    .toc-dots {
      flex: 1;
      border-bottom: 1px dotted #c8b89a;
      margin: 0 8px;
      align-self: flex-end;
      margin-bottom: 4px;
    }
    .toc-num {
      color: #9b8b6e;
      font-size: 9pt;
      white-space: nowrap;
    }

    /* ── Stage chapter ─────────────────── */
    .stage-chapter {
      page-break-before: always;
      padding: 60px 60px 0;
    }
    .stage-chapter:first-of-type {
      page-break-before: always;
    }
    .stage-number {
      font-size: 9pt;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #9b8b6e;
      margin-bottom: 8px;
    }
    .stage-title {
      font-family: 'Lora', Georgia, serif;
      font-size: 22pt;
      font-weight: 600;
      color: #2c2c2c;
      line-height: 1.2;
      margin-bottom: 40px;
      padding-bottom: 16px;
      border-bottom: 2px solid #9b8b6e;
    }

    /* ── Task article ──────────────────── */
    .task-article {
      margin-bottom: 48px;
      padding-bottom: 40px;
      border-bottom: 1px solid #e8e0d5;
    }
    .task-article:last-child {
      border-bottom: none;
    }
    .task-type-badge {
      display: inline-block;
      font-size: 8pt;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #9b8b6e;
      border: 1px solid #c8b89a;
      border-radius: 3px;
      padding: 2px 8px;
      margin-bottom: 10px;
    }
    .task-fallback-title {
      font-family: 'Lora', Georgia, serif;
      font-size: 14pt;
      font-weight: 600;
      color: #2c2c2c;
      margin-bottom: 10px;
    }
    .task-tip-fallback {
      color: #6b6258;
      font-size: 10pt;
      background: #f7f5f2;
      padding: 12px 16px;
      border-left: 3px solid #c8b89a;
      border-radius: 0 4px 4px 0;
    }

    /* ── Markdown typography ───────────── */
    .md-content h1 {
      font-family: 'Lora', Georgia, serif;
      font-size: 16pt;
      font-weight: 600;
      color: #2c2c2c;
      margin-bottom: 16px;
      margin-top: 0;
      line-height: 1.25;
    }
    .md-content h2 {
      font-family: 'Inter', sans-serif;
      font-size: 10.5pt;
      font-weight: 600;
      color: #2c2c2c;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-top: 24px;
      margin-bottom: 10px;
      padding-bottom: 4px;
      border-bottom: 1px solid #e8e0d5;
    }
    .md-content h3 {
      font-family: 'Inter', sans-serif;
      font-size: 10.5pt;
      font-weight: 600;
      color: #4a4038;
      margin-top: 18px;
      margin-bottom: 8px;
    }
    .md-content p {
      margin-bottom: 10px;
      color: #2c2c2c;
    }
    .md-content ul, .md-content ol {
      padding-left: 20px;
      margin-bottom: 12px;
    }
    .md-content li {
      margin-bottom: 4px;
    }
    .md-content strong {
      font-weight: 600;
      color: #2c2c2c;
    }
    .md-content em {
      font-style: italic;
    }
    .md-content blockquote {
      margin: 16px 0;
      padding: 10px 16px;
      background: #f7f5f2;
      border-left: 3px solid #9b8b6e;
      border-radius: 0 4px 4px 0;
      color: #4a4038;
      font-size: 10pt;
    }
    .md-content blockquote p { margin-bottom: 0; }
    .md-content table {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;
      font-size: 9.5pt;
    }
    .md-content th {
      background: #f0ece6;
      text-align: left;
      padding: 7px 10px;
      font-weight: 600;
      color: #2c2c2c;
      border: 1px solid #e8e0d5;
    }
    .md-content td {
      padding: 6px 10px;
      border: 1px solid #e8e0d5;
      color: #4a4038;
    }
    .md-content tr:nth-child(even) td {
      background: #faf9f7;
    }
    .md-content code {
      background: #f0ece6;
      padding: 1px 5px;
      border-radius: 3px;
      font-size: 9pt;
      font-family: 'Courier New', monospace;
    }
    .md-content pre {
      background: #f7f5f2;
      border: 1px solid #e8e0d5;
      border-radius: 4px;
      padding: 12px 16px;
      margin: 12px 0;
      overflow: auto;
      font-size: 9pt;
      line-height: 1.5;
    }

    /* ── Print tweaks ──────────────────── */
    @media print {
      body { font-size: 10pt; }
      .cover { min-height: 100vh; page-break-after: always; }
      .toc { page-break-after: always; }
      .stage-chapter { page-break-before: always; }
      .task-article { page-break-inside: avoid; }
      .md-content table { page-break-inside: avoid; }
      .md-content blockquote { page-break-inside: avoid; }
      a { text-decoration: none; color: inherit; }
    }
  `
}

function buildCover(): string {
  const date = new Date().toLocaleDateString('pl-PL', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
  return `
    <div class="cover">
      <div class="cover-label">Poradnik inwestora</div>
      <h1 class="cover-title">Planer<br>Budowlany</h1>
      <p class="cover-subtitle">Budowa domu jednorodzinnego — formalności i wymagania techniczne</p>
      <div class="cover-meta">Wygenerowano: ${date}</div>
    </div>
  `
}

function buildToc(stages: Stage[]): string {
  let items = ''
  stages.forEach((stage) => {
    items += `
      <li class="toc-stage-item">
        <div class="toc-stage-label">
          <span>${stage.title}</span>
        </div>
        <ul class="toc-task-list">
          ${stage.tasks.map(task => `
            <li class="toc-task-item">
              <span>${task.title}</span>
              <span class="toc-dots"></span>
            </li>
          `).join('')}
        </ul>
      </li>
    `
  })
  return `
    <div class="toc">
      <h2 class="toc-heading">Spis treści</h2>
      <ul class="toc-list">${items}</ul>
    </div>
  `
}

function buildChapters(
  stages: Stage[],
  contents: Record<string, string>,
): string {
  return stages.map((stage, si) => {
    const articles = stage.tasks.map(task => {
      const md = contents[task.id]
      const badge = `<span class="task-type-badge">${task.type === 'formal' ? 'Formalność' : 'Wymaganie techniczne'}</span>`

      if (md) {
        const html = marked(md) as string
        return `
          <article class="task-article">
            ${badge}
            <div class="md-content">${html}</div>
          </article>
        `
      } else {
        // Fallback: title + tip
        const tip = (task as any).tip ?? ''
        return `
          <article class="task-article">
            ${badge}
            <h2 class="task-fallback-title">${task.title}</h2>
            ${tip ? `<p class="task-tip-fallback">${tip}</p>` : ''}
          </article>
        `
      }
    }).join('')

    return `
      <section class="stage-chapter">
        <div class="stage-number">Etap ${si + 1}</div>
        <h1 class="stage-title">${stage.title}</h1>
        ${articles}
      </section>
    `
  }).join('')
}

export async function generateGuidebook(stages: Stage[]): Promise<void> {
  // Load all markdown files in parallel
  const entries = await Promise.all(
    stages.flatMap(stage =>
      stage.tasks.map(async task => {
        const md = await loadMarkdown(task.id)
        return [task.id, md] as const
      })
    )
  )
  const contents = Object.fromEntries(entries.filter(([, md]) => md !== ''))

  const html = `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Planer Budowlany — Poradnik</title>
  <style>${buildStyles()}</style>
</head>
<body>
  ${buildCover()}
  ${buildToc(stages)}
  ${buildChapters(stages, contents)}
</body>
</html>`

  const win = window.open('', '_blank', 'width=900,height=700')
  if (!win) {
    alert('Zezwól na otwieranie nowych okien w tej przeglądarce, aby wygenerować PDF.')
    return
  }
  win.document.open()
  win.document.write(html)
  win.document.close()

  // Wait for fonts to load before printing
  win.addEventListener('load', () => {
    setTimeout(() => win.print(), 500)
  })
}
