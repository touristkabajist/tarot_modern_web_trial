export type SuitKey = 'spades' | 'hearts' | 'clubs' | 'diamonds'
export type CardColor = 'red' | 'black'

export interface PlayingCard {
  id: string
  rank: string
  suit: SuitKey
  symbol: string
  suitName: string
  color: CardColor
  reading: string
}

const suits: Array<Omit<PlayingCard, 'id' | 'rank' | 'reading'>> = [
  { suit: 'spades', symbol: '♠', suitName: '黑桃', color: 'black' },
  { suit: 'hearts', symbol: '♥', suitName: '红心', color: 'red' },
  { suit: 'clubs', symbol: '♣', suitName: '梅花', color: 'black' },
  { suit: 'diamonds', symbol: '♦', suitName: '方块', color: 'red' },
]

const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

const rankReadings: Record<string, string> = {
  A: '新的可能性已经出现，先相信你的第一步。',
  '2': '两种选择都值得倾听，答案藏在平衡之中。',
  '3': '把想法分享出去，协作会让它更完整。',
  '4': '给自己一点稳定感，再决定下一步方向。',
  '5': '变化正在校准节奏，松开不再适合的部分。',
  '6': '回望曾经的善意，从熟悉之处获得力量。',
  '7': '放慢判断速度，观察比立刻行动更有价值。',
  '8': '专注于手边的练习，积累会带来突破。',
  '9': '你已经靠近答案，留意真正想守护的愿望。',
  '10': '一个阶段正在收束，为新的空间腾出余地。',
  J: '保持好奇和行动力，用轻盈的心态试一次。',
  Q: '以清晰与同理心照看局面，相信自己的判断。',
  K: '承担主导权，用沉稳的方式作出决定。',
}

export const createDeck = (): PlayingCard[] =>
  suits.flatMap((suit) =>
    ranks.map((rank) => ({
      ...suit,
      id: `${suit.suit}-${rank}`,
      rank,
      reading: rankReadings[rank],
    })),
  )

export const drawCards = (count: number, random: () => number = Math.random): PlayingCard[] => {
  const shuffled = [...createDeck()]

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const selectedIndex = Math.floor(random() * (index + 1))
    ;[shuffled[index], shuffled[selectedIndex]] = [shuffled[selectedIndex], shuffled[index]]
  }

  return shuffled.slice(0, Math.min(count, shuffled.length))
}

export const cardName = (card: PlayingCard): string => `${card.suitName}${card.rank}`
