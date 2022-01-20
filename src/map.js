import { useState } from "react"
import { useCallback } from "react"
import { useEffect } from "react"

export function DisplayPosition({ map }, center, zoom) {
  const [position, setPosition] = useState(map.getCenter())

  const onClick = useCallback(() => {
    map.setView(center, zoom)
  }, [map, center, zoom])

  const onMove = useCallback(() => {
    setPosition(map.getCenter())
  }, [map])

  useEffect(() => {
    map.on('move', onMove)
    return () => {
      map.off('move', onMove)
    }
  }, [map, onMove])
}