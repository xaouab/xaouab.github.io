import React from 'react'
import '@/styles/RichText.css'

const POINTS: Record<string, string> = {
  greenpoint: 'point-green',
  redpoint: 'point-red',
  orangepoint: 'point-orange',
  bluepoint: 'point-blue',
  yellowpoint: 'point-yellow',
  purplepoint: 'point-purple',
}

interface RichTextOptions {
  variables?: Record<string, string | number>
}

export function renderRichText(
  text: string,
  options?: RichTextOptions
): React.ReactNode[] {
  if (!text) return []

  // --- 1. Replace dynamic placeholders ---
  let processed = text
  if (options?.variables) {
    for (const key in options.variables) {
      processed = processed.replace(
        new RegExp(`\\[${key}\\]`, 'g'),
        String(options.variables[key])
      )
    }
  }

  const nodes: React.ReactNode[] = []

  // --- 2. Split text into tokens for parsing tags & line breaks ---
  const regex =
    /\[b\](.*?)\[\/b\]|\[i\](.*?)\[\/i\]|\[u\](.*?)\[\/u\]|\[color=(.*?)\](.*?)\[\/color\]|\[pulse\](.*?)\[\/pulse\]|\[blink\](.*?)\[\/blink\]|\[link=(.*?)\](.*?)\[\/link\]|\[img=(.*?)\]|(\[greenpoint\]|\[redpoint\]|\[orangepoint\]|\[bluepoint\]|\[yellowpoint\]|\[purplepoint\])|(\n)/gi

  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(processed))) {
    // --- Text before match ---
    if (match.index > lastIndex) {
      const textBefore = processed.slice(lastIndex, match.index)
      nodes.push(...textBefore.split('\n').flatMap((line, i) => (i === 0 ? [line] : [<br key={nodes.length + i} />, line])))
    }

    // --- Bold ---
    if (match[1]) nodes.push(<b key={nodes.length}>{renderRichText(match[1], options)}</b>)
    // --- Italic ---
    else if (match[2]) nodes.push(<i key={nodes.length}>{renderRichText(match[2], options)}</i>)
    // --- Underline ---
    else if (match[3]) nodes.push(<u key={nodes.length}>{renderRichText(match[3], options)}</u>)
    // --- Color: rendered as emphasis so copy never fights the planet accent ---
    else if (match[4] && match[5]) nodes.push(<span key={nodes.length} className="rt-em">{renderRichText(match[5], options)}</span>)
    // --- Pulse ---
    else if (match[6]) nodes.push(<span key={nodes.length} className="pulse-text">{renderRichText(match[6], options)}</span>)
    // --- Blink ---
    else if (match[7]) nodes.push(<span key={nodes.length} className="blink-text">{renderRichText(match[7], options)}</span>)
    // --- Link ---
    else if (match[8] && match[9]) nodes.push(<a key={nodes.length} href={match[8]} target="_blank" rel="noopener noreferrer">{renderRichText(match[9], options)}</a>)
    // --- Image ---
    else if (match[10]) nodes.push(<div className='scanlines'><img key={nodes.length} src={match[10]} alt="" className="inline-img" /></div>)
    // --- Status points ---
    else if (match[11]) {
      const pointName = match[11].replace(/\[|\]/g, '')
      nodes.push(<span key={nodes.length} className={`status-point ${POINTS[pointName]}`} />)
    }
    // --- Line break ---
    else if (match[12]) nodes.push(<br key={nodes.length} />)

    lastIndex = regex.lastIndex
  }

  // --- Remaining text ---
  if (lastIndex < processed.length) {
    const rest = processed.slice(lastIndex)
    nodes.push(...rest.split('\n').flatMap((line, i) => (i === 0 ? [line] : [<br key={nodes.length + i} />, line])))
  }

  return nodes
}
