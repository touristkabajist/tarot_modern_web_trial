import { useEffect, useRef, useState } from 'react'
import { cardName, drawCards, type PlayingCard } from './data/deck'

const generatedLogoUrl = '/manus-storage/async-images/UtJtCRCSnt7U42GBXCTDuB/image-1.webp'

type SpreadSize = 1 | 3 | 5 | 10
type DrawStatus = 'idle' | 'drawing' | 'revealed'

type SpreadOption = {
  size: SpreadSize
  title: string
  caption: string
  shortLabel: string
  positions: string[]
}

const spreadOptions: SpreadOption[] = [
  { size: 1, title: '单张牌', caption: '此刻最需要留意的线索', shortLabel: '此刻', positions: ['此刻'] },
  { size: 3, title: '三张牌', caption: '过去、当下与下一步的指引', shortLabel: '三张', positions: ['过去', '当下', '指引'] },
  { size: 5, title: '二选一决策阵', caption: '比较两个选择，各自的走向', shortLabel: '决策', positions: ['现状', '选择 A', 'A 的走向', '选择 B', 'B 的走向'] },
  { size: 10, title: '十字圣杯阵', caption: '经典十字牌阵，展开完整脉络', shortLabel: '十字', positions: ['现状', '阻碍', '根基', '过去', '近未来', '自我', '环境', '希望', '提醒', '结果'] },
]

function PlayingCardView({ card, index }: { card: PlayingCard; index: number }) {
  const isRed = card.color === 'red'

  return (
    <article
      className={`playing-card ${isRed ? 'card-red' : 'card-black'}`}
      style={{ '--card-delay': `${index * 75}ms` } as React.CSSProperties}
      aria-label={`${cardName(card)}：${card.reading}`}
    >
      <div className="card-corner corner-top"><strong>{card.rank}</strong><span>{card.symbol}</span></div>
      <div className="card-pip" aria-hidden="true">{card.symbol}</div>
      <div className="card-wordmark">ONE HAND</div>
      <div className="card-corner corner-bottom" aria-hidden="true"><strong>{card.rank}</strong><span>{card.symbol}</span></div>
    </article>
  )
}

function CardBack({ index }: { index: number }) {
  return (
    <div className="card-back" style={{ '--card-delay': `${index * 65}ms` } as React.CSSProperties} aria-hidden="true">
      <div className="card-back-inner"><span>♠</span><span>♥</span><span>♣</span><span>♦</span></div>
    </div>
  )
}

export default function App() {
  const [spread, setSpread] = useState<SpreadSize>(1)
  const [cards, setCards] = useState<PlayingCard[]>([])
  const [status, setStatus] = useState<DrawStatus>('idle')
  const timeoutRef = useRef<number | null>(null)
  const activeOption = spreadOptions.find((option) => option.size === spread)!

  useEffect(() => () => {
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current)
  }, [])

  const chooseSpread = (size: SpreadSize) => {
    if (status === 'drawing') return
    setSpread(size)
    setCards([])
    setStatus('idle')
  }

  const startDraw = () => {
    if (status === 'drawing') return
    setStatus('drawing')
    setCards([])
    timeoutRef.current = window.setTimeout(() => {
      setCards(drawCards(spread))
      setStatus('revealed')
      timeoutRef.current = null
    }, 540)
  }

  const reset = () => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setCards([])
    setStatus('idle')
  }

  const resultTitle = spread === 1 ? '此刻的一张牌' : `你的${activeOption.title}`
  const isLargeSpread = spread >= 5

  return (
    <main className="app-shell">
      <div className="ambient-orb orb-one" /><div className="ambient-orb orb-two" />
      <header className="topbar">
        <a className="brand" href="/" aria-label="一手牌局首页">
          <span className="brand-mark"><img src={generatedLogoUrl} alt="" onError={(event) => { event.currentTarget.src = '/logo.svg' }} /></span>
          <span><strong>一手牌局</strong><small>MODERN CARD READING</small></span>
        </a>
        <span className="status-pill"><i /> 今日牌局</span>
      </header>

      <section className="intro" aria-labelledby="page-title">
        <p className="eyebrow">以扑克牌，读此刻</p>
        <h1 id="page-title">让一手牌，<em>打开一个角度。</em></h1>
        <p className="intro-copy">不用预言未来。只需抽一张现代扑克牌，给当下一个安静、清晰的提问。</p>
      </section>

      <section className="game-grid" aria-label="抽牌游戏">
        <aside className="control-panel">
          <div className="panel-kicker"><span>01</span> 选择牌阵</div>
          <h2>今天想怎么问？</h2>
          <p className="muted">每次抽取都从完整的 52 张牌中洗牌，同一次结果不会重复。</p>
          <div className="spread-options" role="radiogroup" aria-label="选择牌阵">
            {spreadOptions.map((option) => (
              <button className={`spread-option ${spread === option.size ? 'is-selected' : ''}`} key={option.size} type="button" role="radio" aria-checked={spread === option.size} onClick={() => chooseSpread(option.size)}>
                <span className="spread-icon" aria-hidden="true">{Array.from({ length: option.size > 5 ? 4 : option.size }).map((_, index) => <i key={index} />)}</span>
                <span><strong>{option.title}</strong><small>{option.caption}</small></span>
                <b aria-hidden="true">{spread === option.size ? '✓' : ''}</b>
              </button>
            ))}
          </div>
          <div className="question-note"><span>小提示</span><p>先在心里放下一个简单的问题，再按下开始。</p></div>
          <button className="draw-button" type="button" onClick={startDraw} disabled={status === 'drawing'}>
            <span>{status === 'drawing' ? '正在洗牌…' : status === 'revealed' ? '再抽一次' : '开始抽牌'}</span><b aria-hidden="true">→</b>
          </button>
        </aside>

        <section className="table-panel" aria-live="polite" aria-label="牌阵结果">
          <div className="table-heading">
            <div><p className="eyebrow">{status === 'revealed' ? '牌已揭开' : '你的桌面'}</p><h2>{status === 'revealed' ? resultTitle : activeOption.title}</h2></div>
            {status === 'revealed' && <button className="reset-button" type="button" onClick={reset}>重新开始</button>}
          </div>
          <div className={`card-stage count-${spread} ${isLargeSpread ? 'large-spread' : ''} status-${status}`}>
            {status === 'idle' && activeOption.positions.map((position) => <div className="card-slot" key={position}><span>{spread === 1 ? '点击开始抽牌' : position}</span></div>)}
            {status === 'drawing' && activeOption.positions.map((_, index) => <CardBack key={index} index={index} />)}
            {status === 'revealed' && cards.map((card, index) => (
              <div className="revealed-card" key={card.id}>
                <span className="position-label">{activeOption.positions[index]}</span>
                <PlayingCardView card={card} index={index} />
                <p className="card-name">{cardName(card)}</p>
              </div>
            ))}
          </div>
          <div className={`reading-area ${status === 'revealed' ? 'is-visible' : ''}`}>
            {status === 'revealed' ? <><p className="reading-label">牌面提示</p><div className="readings">{cards.map((card, index) => <p key={card.id}><strong>{activeOption.positions[index]} · {cardName(card)}</strong>{card.reading}</p>)}</div></> : <p>牌面会在这里落定。深呼吸，然后开始。</p>}
          </div>
        </section>
      </section>
      <footer>一手牌局 · 现代扑克牌抽牌体验</footer>
    </main>
  )
}
