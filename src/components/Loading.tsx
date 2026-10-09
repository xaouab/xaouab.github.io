import { useProgress } from '@react-three/drei'
import { useEffect, useState } from 'react'

export default function Loading() {
  const { progress, active } = useProgress();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!active) {
      const timeout = setTimeout(() => setVisible(false), 600)
      return () => clearTimeout(timeout)
    }
  }, [active])

  if (!visible) return null

  return (
    <div className={`loading-container ${!active ? 'loading-hide' : ''}`}>
      <div className="loading-content">
        <span className="loading-label">Loading</span>

        <div className="loading-bar">
          <div
            className="loading-bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="loading-percent">
          {Math.floor(progress)}%
        </span>
      </div>
    </div>
  )
}
