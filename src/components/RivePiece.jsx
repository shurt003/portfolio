import { useEffect, useRef } from 'react'
import { Rive, Layout, Fit, Alignment } from '@rive-app/webgl2'

/*
  RivePiece — renders a live, interactive Rive file with the @rive-app/webgl2
  runtime (the WebGL renderer, needed for the blend modes these files use).

  • artboard:    optional artboard name (some files have several; the default
                 isn't always the intended one — e.g. the planet uses "planet
                 remap", not the default "planet basic").
  • Pieces with built-in pointer Listeners (button, nav rail) work automatically.
  • hoverInputs: state-machine boolean inputs to toggle on hover, e.g.
                 [{ name: 'planet awake', on: true, off: false }].
  • hoverShape:  'rect' (default) or 'circle' — the hit area that triggers hover.
*/
export default function RivePiece({
  src,
  artboard,
  stateMachine = 'State Machine 1',
  hoverInputs,
  hoverShape = 'rect',
  className,
  style,
}) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rive = new Rive({
      src,
      artboard,
      canvas,
      autoplay: true,
      stateMachines: stateMachine,
      layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
      onLoad: () => {
        rive.resizeDrawingSurfaceToCanvas()
      },
    })

    const ro = new ResizeObserver(() => rive.resizeDrawingSurfaceToCanvas())
    ro.observe(canvas)

    let hovering = false
    let onMove, onLeave

    if (hoverInputs) {
      const setAwake = (awake) => {
        const inputs = rive.stateMachineInputs(stateMachine) || []
        hoverInputs.forEach(({ name, on = true, off = false }) => {
          const input = inputs.find(i => i.name === name)
          if (input) input.value = awake ? on : off
        })
      }

      const inside = (e) => {
        if (hoverShape !== 'circle') return true
        const r = canvas.getBoundingClientRect()
        const dx = e.clientX - (r.left + r.width / 2)
        const dy = e.clientY - (r.top + r.height / 2)
        const radius = Math.min(r.width, r.height) * 0.47
        return dx * dx + dy * dy <= radius * radius
      }

      onMove = (e) => {
        const isIn = inside(e)
        if (isIn && !hovering) { hovering = true; setAwake(true) }
        else if (!isIn && hovering) { hovering = false; setAwake(false) }
      }
      onLeave = () => { if (hovering) { hovering = false; setAwake(false) } }

      canvas.addEventListener('pointermove', onMove)
      canvas.addEventListener('pointerleave', onLeave)
    }

    return () => {
      ro.disconnect()
      if (onMove) canvas.removeEventListener('pointermove', onMove)
      if (onLeave) canvas.removeEventListener('pointerleave', onLeave)
      rive.cleanup()
    }
  }, [src, artboard, stateMachine, hoverInputs, hoverShape])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: '100%', height: '100%', display: 'block', ...style }}
    />
  )
}
