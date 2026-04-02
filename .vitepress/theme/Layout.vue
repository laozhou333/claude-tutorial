<script setup>
import DefaultTheme from 'vitepress/theme'
import { onMounted } from 'vue'

const { Layout } = DefaultTheme

onMounted(() => {
  // Create particle canvas
  const canvas = document.createElement('canvas')
  canvas.id = 'techParticles'
  canvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:0;opacity:0.4'
  document.body.prepend(canvas)

  const ctx = canvas.getContext('2d')
  let particles = []
  let mouse = { x: -1000, y: -1000 }

  function resize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  resize()
  window.addEventListener('resize', resize)

  // Track mouse for interaction
  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX
    mouse.y = e.clientY
  })

  // Create particles
  for (let i = 0; i < 60; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2 + 0.5,
    })
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    particles.forEach((p, i) => {
      // Move
      p.x += p.vx
      p.y += p.vy
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1

      // Draw particle
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(124, 58, 237, 0.5)'
      ctx.fill()

      // Connect nearby particles
      particles.forEach((p2, j) => {
        if (j <= i) return
        const dx = p.x - p2.x
        const dy = p.y - p2.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 150) {
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(p2.x, p2.y)
          ctx.strokeStyle = `rgba(124, 58, 237, ${0.12 * (1 - dist / 150)})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      })

      // Mouse repel
      const mdx = p.x - mouse.x
      const mdy = p.y - mouse.y
      const mdist = Math.sqrt(mdx * mdx + mdy * mdy)
      if (mdist < 120) {
        ctx.beginPath()
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(mouse.x, mouse.y)
        ctx.strokeStyle = `rgba(6, 182, 212, ${0.3 * (1 - mdist / 120)})`
        ctx.lineWidth = 0.8
        ctx.stroke()
        // Glow on nearby particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size + 2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(6, 182, 212, ${0.3 * (1 - mdist / 120)})`
        ctx.fill()
      }
    })

    requestAnimationFrame(animate)
  }
  animate()
})
</script>

<template>
  <Layout />
</template>
