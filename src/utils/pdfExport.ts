import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import type { Stage, ProgressMap } from '../types'

/** Transliterate Polish diacritics to ASCII so WinAnsi standard fonts don't throw. */
function sanitize(text: string): string {
  return text
    .replace(/ą/g, 'a').replace(/Ą/g, 'A')
    .replace(/ć/g, 'c').replace(/Ć/g, 'C')
    .replace(/ę/g, 'e').replace(/Ę/g, 'E')
    .replace(/ł/g, 'l').replace(/Ł/g, 'L')
    .replace(/ń/g, 'n').replace(/Ń/g, 'N')
    .replace(/ó/g, 'o').replace(/Ó/g, 'O')
    .replace(/ś/g, 's').replace(/Ś/g, 'S')
    .replace(/ź/g, 'z').replace(/Ź/g, 'Z')
    .replace(/ż/g, 'z').replace(/Ż/g, 'Z')
}

const COLORS = {
  gold:    rgb(0.608, 0.545, 0.431), // #9b8b6e
  dark:    rgb(0.173, 0.173, 0.173), // #2c2c2c
  gray:    rgb(0.420, 0.384, 0.345), // #6b6258
  light:   rgb(0.906, 0.878, 0.835), // #e8e0d5
}

const PAGE_MARGIN = 50
const PAGE_WIDTH  = 595  // A4
const PAGE_HEIGHT = 842  // A4
const LINE_HEIGHT = 18
const TASK_HEIGHT = 22

export async function generatePdf(
  stages: Stage[],
  progress: ProgressMap,
): Promise<Uint8Array> {
  const doc = await PDFDocument.create()
  const fontRegular = await doc.embedFont(StandardFonts.Helvetica)
  const fontBold    = await doc.embedFont(StandardFonts.HelveticaBold)

  let page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT])
  let y = PAGE_HEIGHT - PAGE_MARGIN

  const ensureSpace = (needed: number) => {
    if (y - needed < PAGE_MARGIN) {
      page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT])
      y = PAGE_HEIGHT - PAGE_MARGIN
    }
  }

  // Title
  page.drawText('Planer Budowlany', {
    x: PAGE_MARGIN, y,
    size: 20, font: fontBold, color: COLORS.dark,
  })
  y -= LINE_HEIGHT * 1.5

  // Date
  const dateStr = new Date().toLocaleDateString('pl-PL', {
    day: '2-digit', month: 'long', year: 'numeric',
  })
  page.drawText(sanitize(`Wygenerowano: ${dateStr}`), {
    x: PAGE_MARGIN, y,
    size: 9, font: fontRegular, color: COLORS.gray,
  })
  y -= LINE_HEIGHT * 2

  for (const stage of stages) {
    ensureSpace(LINE_HEIGHT * 3)

    // Stage title
    page.drawText(sanitize(stage.title), {
      x: PAGE_MARGIN, y,
      size: 13, font: fontBold, color: COLORS.gold,
    })
    y -= LINE_HEIGHT * 0.4

    // Divider
    page.drawLine({
      start: { x: PAGE_MARGIN, y },
      end:   { x: PAGE_WIDTH - PAGE_MARGIN, y },
      thickness: 0.5, color: COLORS.light,
    })
    y -= LINE_HEIGHT

    for (const task of stage.tasks) {
      ensureSpace(TASK_HEIGHT + 4)

      const isDone = !!progress[task.id]
      const checkboxSize = 10
      const checkboxX = PAGE_MARGIN
      const checkboxY = y - checkboxSize + 2

      // Checkbox border
      page.drawRectangle({
        x: checkboxX, y: checkboxY,
        width: checkboxSize, height: checkboxSize,
        borderColor: COLORS.gold, borderWidth: 1,
        color: isDone ? COLORS.gold : undefined,
      })

      // Checkbox check mark
      if (isDone) {
        page.drawText('v', {
          x: checkboxX + 2, y: checkboxY + 2,
          size: 7, font: fontBold, color: rgb(1, 1, 1),
        })
      }

      // Task label — wrap long titles
      const maxTitleWidth = PAGE_WIDTH - PAGE_MARGIN * 2 - checkboxSize - 8
      const titleFontSize = 10
      const words = sanitize(task.title).split(' ')
      const lines: string[] = []
      let current = ''
      for (const word of words) {
        const candidate = current ? `${current} ${word}` : word
        if (fontRegular.widthOfTextAtSize(candidate, titleFontSize) > maxTitleWidth) {
          if (current) lines.push(current)
          current = word
        } else {
          current = candidate
        }
      }
      if (current) lines.push(current)

      let lineY = y
      for (const line of lines) {
        page.drawText(line, {
          x: PAGE_MARGIN + checkboxSize + 8, y: lineY,
          size: titleFontSize,
          font: isDone ? fontBold : fontRegular,
          color: isDone ? COLORS.gray : COLORS.dark,
        })
        lineY -= LINE_HEIGHT
      }

      y -= Math.max(TASK_HEIGHT, lines.length * LINE_HEIGHT) + 2
    }

    y -= LINE_HEIGHT * 0.8
  }

  return doc.save()
}
