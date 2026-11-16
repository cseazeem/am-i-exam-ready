import { passages } from '../data/questions'

export function PassageCard({ id }: { id: string }) {
  const passage = passages[id]
  if (!passage) return null
  return (
    <aside className={`passage passage--${passage.kind}`} aria-label={passage.label}>
      <div className="passage-meta">{passage.label}{passage.sender && <span>{passage.sender}</span>}</div>
      <div lang="de">
        <h2>{passage.title}</h2>
        {passage.text && <p className="passage-text">{passage.text}</p>}
        {passage.ads && <div className="passage-ads">{passage.ads.map((ad) => (
          <div key={ad.label}><span className="eyebrow">{ad.label}</span><h3>{ad.title}</h3><p className="passage-text">{ad.text}</p></div>
        ))}</div>}
      </div>
    </aside>
  )
}
