import { useEffect, useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from 'ogl'

const PURPLE = '#7a1fd1'
const PURPLE_DEEP = '#4b1287'
const GOLD = '#c9962e'
const GOLD_LIGHT = '#e8c46a'
const CREAM = '#fbf5e4'
const INK = '#0c0a10'

const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=' +
  encodeURIComponent('R&R Atelier, Shop 7, The Quartz, 45 Zenith Dr, Umhlanga, Durban, 4319')

const GALLERY_FONT_URL = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@700&display=swap'

const galleryItems = [
  { image: '/atelier/nail1.png', text: 'Rubber Base Gel' },
  { image: '/atelier/nail2.png', text: 'Acrylic Overlay' },
  { image: '/atelier/nail3.png', text: 'Cat Eye' },
  { image: '/atelier/nail4.png', text: 'Chrome' },
  { image: '/atelier/nail5.png', text: 'Ombre' },
  { image: '/atelier/nail6.png', text: 'Nail Art' },
]

const nailServices = [
  { name: 'Rubber Base Gel Set', price: 'R270' },
  { name: 'Acrylic Overlay', price: 'R295' },
  { name: 'Temperature Change (Mood) Gel Set', price: 'R300' },
  { name: 'Magnetic / Cat Eye Gel Set', price: 'R300' },
  { name: 'Gel Toes', price: 'R180' },
  { name: 'Fill / Rebalance (Hands)', price: 'From R180' },
  { name: 'Tips Add-On', price: 'R50' },
  { name: 'Soak-Off (Hands)', price: 'R50' },
  { name: 'Soak-Off (Toes)', price: 'R30' },
  { name: 'Nail Repair', price: 'Complimentary' },
  { name: 'Buff & Shine', price: 'R80' },
]

const manicures = [
  { name: 'Basic Manicure', desc: 'Shape, cuticle care, buff, finished with gel polish', price: 'R150' },
  { name: 'Luxury Manicure', desc: 'Soak, scrub, massage, cuticle care, finished with gel polish', price: 'R250' },
]

const pedicures = [
  { name: 'Basic Pedicure', desc: 'Soak, nail shape, cuticle care, buff, finished with gel polish', price: 'R210' },
  { name: 'Luxury Pedicure', desc: 'Soak, scrub, massage, cuticle care, finished with gel polish', price: 'R300' },
]

const combos = [
  { name: 'Basic Manicure + Basic Pedicure', desc: 'Shape, cuticle care, buff, gel polish on hands and feet', price: 'R320' },
  { name: 'Luxury Manicure + Luxury Pedicure', desc: 'Soak, scrub, massage, cuticle care, gel polish on hands and feet', price: 'R500' },
  { name: 'Rubber Base Gel Set + Gel Toes', desc: 'Rubber base gel set on hands, gel polish on toes', price: 'R380' },
  { name: 'Acrylic Overlay + Gel Toes', desc: 'Acrylic overlay on hands, gel polish on toes', price: 'R420' },
]

const addOns = [
  { name: 'Rhinestone', price: '50c each' },
  { name: 'Chrome', price: 'R5 per nail' },
  { name: 'Foil', price: 'R5 per nail' },
  { name: 'Blooming Gel', price: 'R5 per nail' },
  { name: 'Spider Gel', price: 'R5 per nail' },
  { name: 'Ombre', price: 'R5 per nail' },
  { name: 'Marble Nail Art', price: 'R3 per nail' },
  { name: 'Intricate Design', price: 'R10 per nail' },
  { name: 'Extra Length', price: 'R50' },
]

const whyUs = [
  { title: 'Sanitised twice, every appointment', desc: 'All equipment is sanitised after the previous appointment and again before the next one begins.' },
  { title: 'Walk-ins and appointments', desc: 'Book ahead, or drop in and we will fit you in whenever there is space.' },
  { title: 'No deposit to book', desc: 'Reserve your slot without paying anything upfront.' },
  { title: 'Repairs are on us', desc: 'Nail repair is complimentary.' },
  { title: 'Hands, feet and everything in between', desc: 'Gel sets, acrylic overlays, manicures, pedicures and nail art, all from one chair.' },
]

const hours = [
  { day: 'Monday', time: '9am – 5pm' },
  { day: 'Tuesday', time: '9am – 5pm' },
  { day: 'Wednesday', time: '9am – 5pm' },
  { day: 'Thursday', time: '9am – 5pm' },
  { day: 'Friday', time: '9am – 5pm' },
  { day: 'Saturday', time: '9am – 5pm' },
]

const policies = [
  { title: 'Appointments', desc: 'Book by phone or WhatsApp.' },
  { title: 'Walk-ins', desc: 'Welcome, depending on availability.' },
  { title: 'Deposits', desc: 'None required.' },
  { title: 'Cancellations', desc: 'Please give us 24 hours notice.' },
  { title: 'Payment', desc: 'Cash or card.' },
]

function debounce(func, wait) {
  let timeout
  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}

function lerp(p1, p2, t) {
  return p1 + (p2 - p1) * t
}

function autoBind(instance) {
  const proto = Object.getPrototypeOf(instance)
  Object.getOwnPropertyNames(proto).forEach(key => {
    if (key !== 'constructor' && typeof instance[key] === 'function') {
      instance[key] = instance[key].bind(instance)
    }
  })
}

const DEFAULT_FONT = 'bold 30px Figtree'
const DEFAULT_FONT_URL = 'https://fonts.googleapis.com/css2?family=Figtree:wght@400;700&display=swap'

function deriveFontFamilyFromUrl(url) {
  const fileName = (url.split('/').pop() || 'custom-font').split('?')[0]
  const base = fileName.replace(/\.(woff2?|ttf|otf|eot)$/i, '')
  return base.replace(/[^a-zA-Z0-9-_ ]/g, '').trim() || 'CircularGalleryFont'
}

async function loadFontFromStylesheet(url) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Failed to fetch font stylesheet (${response.status})`)
  const cssText = await response.text()
  const faceBlocks = cssText.match(/@font-face\s*{[^}]*}/g) || []
  let family = null
  const fontFaces = []
  for (const block of faceBlocks) {
    const familyMatch = block.match(/font-family:\s*['"]?([^;'"]+)['"]?/)
    const urlMatch = block.match(/url\(\s*['"]?([^'")]+)['"]?\s*\)/)
    if (!familyMatch || !urlMatch) continue
    family = familyMatch[1].trim()
    const descriptors = {}
    const weightMatch = block.match(/font-weight:\s*([^;]+);/)
    const styleMatch = block.match(/font-style:\s*([^;]+);/)
    const rangeMatch = block.match(/unicode-range:\s*([^;]+);/)
    if (weightMatch) descriptors.weight = weightMatch[1].trim()
    if (styleMatch) descriptors.style = styleMatch[1].trim()
    if (rangeMatch) descriptors.unicodeRange = rangeMatch[1].trim()
    fontFaces.push(new FontFace(family, `url(${urlMatch[1]})`, descriptors))
  }
  if (!family) throw new Error('No @font-face rule found in the stylesheet')
  await Promise.allSettled(
    fontFaces.map(async face => {
      await face.load()
      document.fonts.add(face)
    })
  )
  return family
}

async function loadFontFromFile(url) {
  const family = deriveFontFamilyFromUrl(url)
  const fontFace = new FontFace(family, `url(${url})`)
  await fontFace.load()
  document.fonts.add(fontFace)
  return family
}

async function loadCustomFont(fontUrl) {
  const isStylesheet = fontUrl.includes('fonts.googleapis.com') || /\.css(\?.*)?$/i.test(fontUrl)
  return isStylesheet ? loadFontFromStylesheet(fontUrl) : loadFontFromFile(fontUrl)
}

async function resolveFont(font, fontUrl) {
  const effectiveUrl = fontUrl || (font === DEFAULT_FONT ? DEFAULT_FONT_URL : null)
  if (!effectiveUrl) {
    if (document.fonts && document.fonts.load) {
      try {
        await document.fonts.load(font)
        await document.fonts.ready
      } catch {
        return font
      }
    }
    return font
  }
  try {
    const family = await loadCustomFont(effectiveUrl)
    const sizeMatch = font.match(/^\s*(.*?\d+px)/)
    const prefix = sizeMatch ? sizeMatch[1].trim() : 'bold 30px'
    const resolved = `${prefix} "${family}"`
    if (document.fonts && document.fonts.load) {
      try {
        await document.fonts.load(resolved)
      } catch {
        return resolved
      }
    }
    return resolved
  } catch (error) {
    console.error('CircularGallery: unable to load font from', fontUrl, error)
    return font
  }
}

function getFontSize(font) {
  const match = font.match(/(\d+)px/)
  return match ? parseInt(match[1], 10) : 30
}

function createTextTexture(gl, text, font = 'bold 30px monospace', color = 'black') {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  context.font = font
  const metrics = context.measureText(text)
  const textWidth = Math.ceil(metrics.width)
  const textHeight = Math.ceil(getFontSize(font) * 1.2)
  canvas.width = textWidth + 20
  canvas.height = textHeight + 20
  context.font = font
  context.fillStyle = color
  context.textBaseline = 'middle'
  context.textAlign = 'center'
  context.clearRect(0, 0, canvas.width, canvas.height)
  context.fillText(text, canvas.width / 2, canvas.height / 2)
  const texture = new Texture(gl, { generateMipmaps: false })
  texture.image = canvas
  return { texture, width: canvas.width, height: canvas.height }
}

class Title {
  constructor({ gl, plane, renderer, text, textColor = '#545050', font = '30px sans-serif' }) {
    autoBind(this)
    this.gl = gl
    this.plane = plane
    this.renderer = renderer
    this.text = text
    this.textColor = textColor
    this.font = font
    this.createMesh()
  }
  createMesh() {
    const { texture, width, height } = createTextTexture(this.gl, this.text, this.font, this.textColor)
    const geometry = new Plane(this.gl)
    const program = new Program(this.gl, {
      vertex: `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tMap, vUv);
          if (color.a < 0.1) discard;
          gl_FragColor = color;
        }
      `,
      uniforms: { tMap: { value: texture } },
      transparent: true,
    })
    this.mesh = new Mesh(this.gl, { geometry, program })
    const aspect = width / height
    const textHeight = this.plane.scale.y * 0.15
    const textWidth = textHeight * aspect
    this.mesh.scale.set(textWidth, textHeight, 1)
    this.mesh.position.y = -this.plane.scale.y * 0.5 - textHeight * 0.5 - 0.05
    this.mesh.setParent(this.plane)
  }
}

class Media {
  constructor({ geometry, gl, image, index, length, renderer, scene, screen, text, viewport, bend, textColor, borderRadius = 0, font }) {
    this.extra = 0
    this.geometry = geometry
    this.gl = gl
    this.image = image
    this.index = index
    this.length = length
    this.renderer = renderer
    this.scene = scene
    this.screen = screen
    this.text = text
    this.viewport = viewport
    this.bend = bend
    this.textColor = textColor
    this.borderRadius = borderRadius
    this.font = font
    this.createShader()
    this.createMesh()
    this.createTitle()
    this.onResize()
  }
  createShader() {
    const texture = new Texture(this.gl, { generateMipmaps: true })
    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          p.z = (sin(p.x * 4.0 + uTime) * 1.5 + cos(p.y * 2.0 + uTime) * 1.5) * (0.1 + uSpeed * 0.5);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        varying vec2 vUv;

        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }

        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
          vec4 color = texture2D(tMap, uv);

          float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);

          float edgeSmooth = 0.002;
          float alpha = 1.0 - smoothstep(-edgeSmooth, edgeSmooth, d);

          gl_FragColor = vec4(color.rgb, alpha);
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [0, 0] },
        uSpeed: { value: 0 },
        uTime: { value: 100 * Math.random() },
        uBorderRadius: { value: this.borderRadius },
      },
      transparent: true,
    })
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = this.image
    img.onload = () => {
      texture.image = img
      this.program.uniforms.uImageSizes.value = [img.naturalWidth, img.naturalHeight]
    }
  }
  createMesh() {
    this.plane = new Mesh(this.gl, { geometry: this.geometry, program: this.program })
    this.plane.setParent(this.scene)
  }
  createTitle() {
    this.title = new Title({
      gl: this.gl,
      plane: this.plane,
      renderer: this.renderer,
      text: this.text,
      textColor: this.textColor,
      font: this.font,
    })
  }
  update(scroll, direction) {
    this.plane.position.x = this.x - scroll.current - this.extra

    const x = this.plane.position.x
    const H = this.viewport.width / 2

    if (this.bend === 0) {
      this.plane.position.y = 0
      this.plane.rotation.z = 0
    } else {
      const B_abs = Math.abs(this.bend)
      const R = (H * H + B_abs * B_abs) / (2 * B_abs)
      const effectiveX = Math.min(Math.abs(x), H)

      const arc = R - Math.sqrt(R * R - effectiveX * effectiveX)
      if (this.bend > 0) {
        this.plane.position.y = -arc
        this.plane.rotation.z = -Math.sign(x) * Math.asin(effectiveX / R)
      } else {
        this.plane.position.y = arc
        this.plane.rotation.z = Math.sign(x) * Math.asin(effectiveX / R)
      }
    }

    this.speed = scroll.current - scroll.last
    this.program.uniforms.uTime.value += 0.04
    this.program.uniforms.uSpeed.value = this.speed

    const planeOffset = this.plane.scale.x / 2
    const viewportOffset = this.viewport.width / 2
    this.isBefore = this.plane.position.x + planeOffset < -viewportOffset
    this.isAfter = this.plane.position.x - planeOffset > viewportOffset
    if (direction === 'right' && this.isBefore) {
      this.extra -= this.widthTotal
      this.isBefore = this.isAfter = false
    }
    if (direction === 'left' && this.isAfter) {
      this.extra += this.widthTotal
      this.isBefore = this.isAfter = false
    }
  }
  onResize({ screen, viewport } = {}) {
    if (screen) this.screen = screen
    if (viewport) {
      this.viewport = viewport
      if (this.plane.program.uniforms.uViewportSizes) {
        this.plane.program.uniforms.uViewportSizes.value = [this.viewport.width, this.viewport.height]
      }
    }
    this.scale = this.screen.height / 1500
    this.plane.scale.y = (this.viewport.height * (900 * this.scale)) / this.screen.height
    this.plane.scale.x = (this.viewport.width * (700 * this.scale)) / this.screen.width
    this.plane.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y]
    this.padding = 2
    this.width = this.plane.scale.x + this.padding
    this.widthTotal = this.width * this.length
    this.x = this.width * this.index
  }
}

class GalleryApp {
  constructor(container, { items, bend, textColor = '#ffffff', borderRadius = 0, font = 'bold 30px Figtree', scrollSpeed = 2, scrollEase = 0.05 } = {}) {
    document.documentElement.classList.remove('no-js')
    this.container = container
    this.scrollSpeed = scrollSpeed
    this.scroll = { ease: scrollEase, current: 0, target: 0, last: 0 }
    this.onCheckDebounce = debounce(this.onCheck, 200)
    this.createRenderer()
    this.createCamera()
    this.createScene()
    this.onResize()
    this.createGeometry()
    this.createMedias(items, bend, textColor, borderRadius, font)
    this.update()
    this.addEventListeners()
  }
  createRenderer() {
    this.renderer = new Renderer({ alpha: true, antialias: true, dpr: Math.min(window.devicePixelRatio || 1, 2) })
    this.gl = this.renderer.gl
    this.gl.clearColor(0, 0, 0, 0)
    this.container.appendChild(this.gl.canvas)
  }
  createCamera() {
    this.camera = new Camera(this.gl)
    this.camera.fov = 45
    this.camera.position.z = 20
  }
  createScene() {
    this.scene = new Transform()
  }
  createGeometry() {
    this.planeGeometry = new Plane(this.gl, { heightSegments: 50, widthSegments: 100 })
  }
  createMedias(items, bend = 1, textColor, borderRadius, font) {
    const defaultItems = [
      { image: 'https://picsum.photos/seed/1/800/600?grayscale', text: 'Bridge' },
      { image: 'https://picsum.photos/seed/2/800/600?grayscale', text: 'Desk Setup' },
      { image: 'https://picsum.photos/seed/3/800/600?grayscale', text: 'Waterfall' },
      { image: 'https://picsum.photos/seed/4/800/600?grayscale', text: 'Strawberries' },
    ]
    const list = items && items.length ? items : defaultItems
    this.mediasImages = list.concat(list)
    this.medias = this.mediasImages.map((data, index) => {
      return new Media({
        geometry: this.planeGeometry,
        gl: this.gl,
        image: data.image,
        index,
        length: this.mediasImages.length,
        renderer: this.renderer,
        scene: this.scene,
        screen: this.screen,
        text: data.text,
        viewport: this.viewport,
        bend,
        textColor,
        borderRadius,
        font,
      })
    })
  }
  onTouchDown(e) {
    this.isDown = true
    this.scroll.position = this.scroll.current
    this.start = e.touches ? e.touches[0].clientX : e.clientX
  }
  onTouchMove(e) {
    if (!this.isDown) return
    const x = e.touches ? e.touches[0].clientX : e.clientX
    const distance = (this.start - x) * (this.scrollSpeed * 0.025)
    this.scroll.target = this.scroll.position + distance
  }
  onTouchUp() {
    this.isDown = false
    this.onCheck()
  }
  onWheel(e) {
    const delta = e.deltaY || e.wheelDelta || e.detail
    this.scroll.target += (delta > 0 ? this.scrollSpeed : -this.scrollSpeed) * 0.2
    this.onCheckDebounce()
  }
  onKeyDown(e) {
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault()
        this.scroll.target += this.scrollSpeed * 5
        this.onCheckDebounce()
        break
      case 'ArrowLeft':
        e.preventDefault()
        this.scroll.target -= this.scrollSpeed * 5
        this.onCheckDebounce()
        break
      case 'Home':
        e.preventDefault()
        this.scroll.target = 0
        this.onCheckDebounce()
        break
      default:
        break
    }
  }
  onCheck() {
    if (!this.medias || !this.medias[0]) return
    const width = this.medias[0].width
    const itemIndex = Math.round(Math.abs(this.scroll.target) / width)
    const item = width * itemIndex
    this.scroll.target = this.scroll.target < 0 ? -item : item
  }
  onResize() {
    this.screen = { width: this.container.clientWidth, height: this.container.clientHeight }
    this.renderer.setSize(this.screen.width, this.screen.height)
    this.camera.perspective({ aspect: this.screen.width / this.screen.height })
    const fov = (this.camera.fov * Math.PI) / 180
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z
    const width = height * this.camera.aspect
    this.viewport = { width, height }
    if (this.medias) {
      this.medias.forEach(media => media.onResize({ screen: this.screen, viewport: this.viewport }))
    }
  }
  update() {
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease)
    const direction = this.scroll.current > this.scroll.last ? 'right' : 'left'
    if (this.medias) {
      this.medias.forEach(media => media.update(this.scroll, direction))
    }
    this.renderer.render({ scene: this.scene, camera: this.camera })
    this.scroll.last = this.scroll.current
    this.raf = window.requestAnimationFrame(this.update.bind(this))
  }
  addEventListeners() {
    this.boundOnResize = this.onResize.bind(this)
    this.boundOnWheel = this.onWheel.bind(this)
    this.boundOnTouchDown = this.onTouchDown.bind(this)
    this.boundOnTouchMove = this.onTouchMove.bind(this)
    this.boundOnTouchUp = this.onTouchUp.bind(this)
    this.boundOnKeyDown = this.onKeyDown.bind(this)

    window.addEventListener('resize', this.boundOnResize)
    window.addEventListener('mousewheel', this.boundOnWheel)
    window.addEventListener('wheel', this.boundOnWheel)
    window.addEventListener('mousedown', this.boundOnTouchDown)
    window.addEventListener('mousemove', this.boundOnTouchMove)
    window.addEventListener('mouseup', this.boundOnTouchUp)
    window.addEventListener('touchstart', this.boundOnTouchDown)
    window.addEventListener('touchmove', this.boundOnTouchMove)
    window.addEventListener('touchend', this.boundOnTouchUp)

    this.container?.addEventListener('keydown', this.boundOnKeyDown)
  }
  destroy() {
    window.cancelAnimationFrame(this.raf)
    window.removeEventListener('resize', this.boundOnResize)
    window.removeEventListener('mousewheel', this.boundOnWheel)
    window.removeEventListener('wheel', this.boundOnWheel)
    window.removeEventListener('mousedown', this.boundOnTouchDown)
    window.removeEventListener('mousemove', this.boundOnTouchMove)
    window.removeEventListener('mouseup', this.boundOnTouchUp)
    window.removeEventListener('touchstart', this.boundOnTouchDown)
    window.removeEventListener('touchmove', this.boundOnTouchMove)
    window.removeEventListener('touchend', this.boundOnTouchUp)
    if (this.renderer && this.renderer.gl && this.renderer.gl.canvas.parentNode) {
      this.renderer.gl.canvas.parentNode.removeChild(this.renderer.gl.canvas)
    }
    if (this.container) {
      this.container.removeEventListener('keydown', this.boundOnKeyDown)
    }
  }
}

function CircularGallery({
  items,
  bend = 3,
  textColor = '#ffffff',
  borderRadius = 0.05,
  font = 'bold 30px Figtree',
  fontUrl,
  scrollSpeed = 2,
  scrollEase = 0.05,
}) {
  const containerRef = useRef(null)
  useEffect(() => {
    if (!containerRef.current) return undefined
    let app
    let isMounted = true
    resolveFont(font, fontUrl).then(resolvedFont => {
      if (!isMounted || !containerRef.current) return
      app = new GalleryApp(containerRef.current, {
        items,
        bend,
        textColor,
        borderRadius,
        font: resolvedFont,
        scrollSpeed,
        scrollEase,
      })
    })
    return () => {
      isMounted = false
      if (app) app.destroy()
    }
  }, [items, bend, textColor, borderRadius, font, fontUrl, scrollSpeed, scrollEase])
  return (
    <div
      className="circular-gallery"
      ref={containerRef}
      tabIndex={0}
      role="region"
      aria-label="Circular image gallery. Use left and right arrow keys to navigate."
    />
  )
}

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Great+Vibes&family=Playfair+Display:ital,wght@0,400;0,600;0,900;1,400&family=Jost:wght@300;400;500;600&display=swap');

.at {
  --purple: ${PURPLE};
  --purple-deep: ${PURPLE_DEEP};
  --gold: ${GOLD};
  --gold-light: ${GOLD_LIGHT};
  --cream: ${CREAM};
  --ink: ${INK};
  --ink-soft: #1a1522;
  --text: #2a2130;
  --muted: rgba(42, 33, 48, 0.68);
  --muted-light: rgba(251, 245, 228, 0.72);
  background: var(--cream);
  color: var(--text);
  font-family: 'Jost', system-ui, sans-serif;
  line-height: 1.65;
  overflow-x: clip;
  min-height: 100vh;
  position: relative;
}
.at *, .at *::before, .at *::after { box-sizing: border-box; }
.at h1, .at h2, .at h3, .at p, .at ul, .at address { margin: 0; padding: 0; }
.at ul { list-style: none; }
.at address { font-style: normal; }
.at a { color: inherit; text-decoration: none; }
.at a:focus-visible, .at button:focus-visible { outline: 2px solid var(--purple); outline-offset: 4px; border-radius: 6px; }

.at-bar {
  position: fixed; top: 0; left: 0; right: 0; height: 3px; z-index: 70; transform-origin: 0 50%;
  background: linear-gradient(90deg, var(--purple), var(--gold-light));
}
.at-back {
  position: fixed; top: 18px; left: 22px; z-index: 60; font-weight: 500; font-size: 0.92rem;
  padding: 9px 18px; border-radius: 999px; background: rgba(251, 245, 228, 0.85); backdrop-filter: blur(12px);
  border: 1px solid rgba(201, 150, 46, 0.6); color: var(--ink);
  transition: transform 250ms ease, border-color 250ms ease;
}
.at-back:hover { transform: translateX(-3px); border-color: var(--purple); }

.at-hero {
  position: relative; min-height: 100vh; display: grid; place-items: center; text-align: center;
  padding: 120px 24px 100px; overflow: hidden; isolation: isolate;
  background:
    radial-gradient(ellipse 60% 50% at 50% 42%, rgba(255, 255, 255, 0.85), transparent 70%),
    var(--cream);
}
.at-ring {
  position: absolute; left: 50%; top: 50%; width: min(86vw, 760px); aspect-ratio: 1; translate: -50% -50%;
  z-index: -1; pointer-events: none;
}
.at-ring svg { width: 100%; height: 100%; overflow: visible; }
.at-ring path { fill: none; stroke-width: 2.5; stroke-linecap: round; }
.at-hero-inner { width: min(900px, 100%); display: flex; flex-direction: column; align-items: center; }
.at-crown { width: 74px; height: auto; margin-bottom: 4px; filter: drop-shadow(0 4px 8px rgba(201, 150, 46, 0.35)); }
.at-mark {
  font-family: 'Playfair Display', serif; font-weight: 900; line-height: 0.95;
  font-size: clamp(5rem, 22vw, 15rem); letter-spacing: -0.02em; color: var(--ink);
  background: linear-gradient(160deg, #3a3344 0%, #000 38%, #1c1724 62%, #000 100%);
  -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 8px 14px rgba(12, 10, 16, 0.25));
  display: flex; align-items: center; justify-content: center; gap: 0.02em;
}
.at-mark .amp { font-style: italic; font-weight: 400; font-size: 0.62em; color: var(--purple); -webkit-text-fill-color: var(--purple); }
.at-name {
  display: flex; align-items: center; gap: clamp(14px, 3vw, 34px); width: 100%; justify-content: center;
  font-family: 'Cinzel', serif; font-weight: 700; font-size: clamp(1.3rem, 4.4vw, 2.6rem);
  letter-spacing: 0.55em; margin-right: -0.55em; color: var(--ink); margin-top: -0.4rem;
}
.at-name::before, .at-name::after { content: ''; flex: 1; max-width: 190px; height: 1px; background: linear-gradient(90deg, transparent, var(--gold)); }
.at-name::after { background: linear-gradient(270deg, transparent, var(--gold)); }
.at-tagline { margin-top: 0.7rem; font-family: 'Great Vibes', cursive; font-size: clamp(2rem, 6vw, 3.6rem); color: var(--ink); line-height: 1.2; }
.at-lede { margin: 1.4rem auto 0; max-width: 34rem; font-size: clamp(1.02rem, 1.7vw, 1.2rem); color: var(--muted); font-weight: 400; }
.at-cta-row { margin-top: 2.2rem; display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
.at-btn {
  display: inline-flex; align-items: center; justify-content: center; padding: 14px 32px; border-radius: 999px;
  font-weight: 600; font-size: 1rem; cursor: pointer; border: 1px solid transparent; font-family: inherit;
  transition: transform 250ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 250ms ease, background 250ms ease;
}
.at-btn:hover { transform: translateY(-3px); }
.at-btn-purple { background: linear-gradient(120deg, var(--purple), var(--purple-deep)); color: #fff; box-shadow: 0 10px 30px rgba(122, 31, 209, 0.35); }
.at-btn-purple:hover { box-shadow: 0 16px 40px rgba(122, 31, 209, 0.5); }
.at-btn-line { background: transparent; color: var(--ink); border-color: var(--gold); }
.at-btn-line:hover { background: rgba(201, 150, 46, 0.14); }
.at-btn-gold { background: linear-gradient(120deg, var(--gold), var(--gold-light)); color: #1a1204; box-shadow: 0 10px 30px rgba(201, 150, 46, 0.3); }
.at-btn-gold:hover { box-shadow: 0 16px 40px rgba(201, 150, 46, 0.5); }
.at-btn-ghost { background: transparent; color: var(--cream); border-color: rgba(232, 196, 106, 0.6); }
.at-btn-ghost:hover { background: rgba(232, 196, 106, 0.14); }
.at-scroll { position: absolute; bottom: 26px; left: 50%; translate: -50% 0; color: var(--gold); font-weight: 500; font-size: 0.9rem; }
.at-spark { position: absolute; color: var(--gold); pointer-events: none; }

.at-section { max-width: 1240px; margin: 0 auto; padding: clamp(80px, 11vw, 140px) clamp(20px, 5vw, 64px); }
.at-h2 { font-family: 'Playfair Display', serif; font-weight: 600; font-size: clamp(2rem, 4.8vw, 3.4rem); line-height: 1.1; color: var(--ink); max-width: 18ch; }
.at-sub { margin-top: 1rem; color: var(--muted); max-width: 34rem; }
.at-rule { display: block; margin-top: 1.2rem; width: 110px; height: 2px; background: linear-gradient(90deg, var(--purple), var(--gold-light)); }

.at-about { display: grid; grid-template-columns: 1.15fr 0.85fr; gap: clamp(28px, 6vw, 90px); align-items: start; }
.at-about-copy p { margin-top: 1.2rem; font-size: 1.1rem; color: var(--muted); max-width: 36rem; }
.at-about-copy p:first-of-type { margin-top: 1.6rem; }
.at-hours {
  padding: 34px 32px; border-radius: 26px; background: var(--ink); color: var(--cream);
  border: 1px solid rgba(232, 196, 106, 0.4); box-shadow: 0 30px 60px rgba(12, 10, 16, 0.18);
}
.at-hours h3 { font-family: 'Playfair Display', serif; font-weight: 600; font-size: 1.6rem; color: var(--gold-light); margin-bottom: 1rem; }
.at-hours li { display: flex; justify-content: space-between; gap: 16px; padding: 10px 0; border-bottom: 1px solid rgba(232, 196, 106, 0.18); }
.at-hours li:last-child { border-bottom: 0; }
.at-hours li span:last-child { color: var(--muted-light); }

.at-menu-wrap { background: #fff9ea; border-top: 1px solid rgba(201, 150, 46, 0.35); border-bottom: 1px solid rgba(201, 150, 46, 0.35); }
.at-menu { display: grid; grid-template-columns: repeat(2, 1fr); gap: clamp(36px, 5vw, 72px) clamp(28px, 5vw, 80px); margin-top: 3.4rem; align-items: start; }
.at-group h3 { font-family: 'Playfair Display', serif; font-weight: 600; font-size: 1.9rem; color: var(--purple); padding-bottom: 12px; border-bottom: 2px solid var(--gold); margin-bottom: 8px; }
.at-item { display: flex; align-items: baseline; gap: 12px; padding: 13px 0; }
.at-item-main { flex: 1; min-width: 0; }
.at-item-name { display: block; font-weight: 500; font-size: 1.05rem; color: var(--ink); }
.at-item-desc { display: block; font-size: 0.92rem; color: var(--muted); margin-top: 2px; }
.at-item-price { font-family: 'Playfair Display', serif; font-weight: 600; font-size: 1.1rem; color: var(--ink); white-space: nowrap; }
.at-item + .at-item { border-top: 1px dotted rgba(201, 150, 46, 0.6); }
.at-span-2 { grid-column: 1 / -1; }
.at-span-2 .at-items { columns: 2; column-gap: clamp(28px, 5vw, 80px); }
.at-span-2 .at-item { break-inside: avoid; }

.at-why { display: grid; grid-template-columns: repeat(6, 1fr); gap: 18px; margin-top: 3.2rem; }
.at-why-card {
  grid-column: span 2; padding: 30px 28px; border-radius: 22px; background: #fff;
  border: 1px solid rgba(201, 150, 46, 0.4);
  transition: transform 300ms cubic-bezier(0.22, 1, 0.36, 1), border-color 300ms ease, box-shadow 300ms ease;
}
.at-why-card:nth-child(1) { grid-column: span 4; background: var(--ink); color: var(--cream); border-color: rgba(232, 196, 106, 0.5); }
.at-why-card:nth-child(1) h3 { color: var(--gold-light); }
.at-why-card:nth-child(1) p { color: var(--muted-light); }
.at-why-card:nth-child(4), .at-why-card:nth-child(5) { grid-column: span 3; }
.at-why-card:hover { transform: translateY(-5px); border-color: var(--purple); box-shadow: 0 20px 44px rgba(122, 31, 209, 0.14); }
.at-why-card h3 { font-family: 'Playfair Display', serif; font-weight: 600; font-size: 1.35rem; color: var(--purple); margin-bottom: 0.5rem; }
.at-why-card p { color: var(--muted); }

.at-dark { background: var(--ink); color: var(--cream); position: relative; }
.at-dark .at-h2 { color: var(--cream); }
.at-dark .at-sub { color: var(--muted-light); }
.at-gallery-box { position: relative; height: 600px; margin-top: 2.6rem; }
.at-hint { margin-top: 1.4rem; color: var(--muted-light); font-size: 0.95rem; }

.circular-gallery { width: 100%; height: 100%; overflow: hidden; cursor: grab; }
.circular-gallery:active { cursor: grabbing; }
.circular-gallery:focus-visible { outline: 2px solid var(--gold-light); outline-offset: 4px; }

.at-book-grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(28px, 6vw, 90px); margin-top: 3rem; align-items: start; }
.at-policy li { display: flex; justify-content: space-between; gap: 20px; padding: 16px 0; border-bottom: 1px solid rgba(232, 196, 106, 0.22); }
.at-policy li:first-child { border-top: 1px solid rgba(232, 196, 106, 0.22); }
.at-policy strong { font-family: 'Playfair Display', serif; font-weight: 600; font-size: 1.15rem; color: var(--gold-light); }
.at-policy span { color: var(--muted-light); text-align: right; }
.at-book-cta { display: flex; flex-direction: column; gap: 14px; padding: 34px; border-radius: 26px; border: 1px solid rgba(232, 196, 106, 0.4); background: linear-gradient(160deg, rgba(122, 31, 209, 0.28), rgba(75, 18, 135, 0.1)); }
.at-book-cta h3 { font-family: 'Great Vibes', cursive; font-weight: 400; font-size: 2.6rem; color: var(--gold-light); line-height: 1.1; }
.at-book-cta p { color: var(--muted-light); }
.at-book-cta .at-cta-row { justify-content: flex-start; margin-top: 0.6rem; }
.at-book-cta address { color: var(--cream); margin-top: 0.4rem; }
.at-book-cta address span { color: var(--muted-light); display: block; }

.at-contact-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 3rem; }
.at-contact-item {
  display: flex; flex-direction: column; gap: 6px; padding: 26px 28px; border-radius: 22px; background: #fff;
  border: 1px solid rgba(201, 150, 46, 0.4);
  transition: transform 300ms cubic-bezier(0.22, 1, 0.36, 1), border-color 300ms ease;
}
.at-contact-item:hover { transform: translateY(-4px); border-color: var(--purple); }
.at-contact-item h3 { font-family: 'Playfair Display', serif; font-weight: 600; font-size: 1.15rem; color: var(--purple); }
.at-contact-item span, .at-contact-item address { color: var(--text); font-size: 1.02rem; overflow-wrap: anywhere; }

.at-footer { border-top: 1px solid rgba(201, 150, 46, 0.5); padding: 38px clamp(20px, 5vw, 64px) 46px; background: var(--cream); }
.at-footer-in { max-width: 1240px; margin: 0 auto; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 14px 32px; color: var(--muted); font-size: 0.92rem; }
.at-footer-links { display: flex; flex-wrap: wrap; gap: 8px 24px; }
.at-footer-links a:hover { color: var(--purple); }

@media (max-width: 900px) {
  .at-about, .at-book-grid { grid-template-columns: 1fr; }
  .at-menu { grid-template-columns: 1fr; }
  .at-span-2 .at-items { columns: 1; }
  .at-why { grid-template-columns: 1fr; }
  .at-why-card, .at-why-card:nth-child(n) { grid-column: auto; }
  .at-contact-grid { grid-template-columns: 1fr; }
  .at-gallery-box { height: 480px; }
}
@media (prefers-reduced-motion: reduce) {
  .at *, .at *::before { transition-duration: 0.01ms !important; }
}
`

function Crown() {
  return (
    <svg className="at-crown" viewBox="0 0 120 80" aria-hidden="true">
      <defs>
        <linearGradient id="at-crown-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={GOLD_LIGHT} />
          <stop offset="100%" stopColor={GOLD} />
        </linearGradient>
      </defs>
      <path d="M12 62 L6 18 L38 42 L60 8 L82 42 L114 18 L108 62 Z" fill="none" stroke="url(#at-crown-grad)" strokeWidth="4" strokeLinejoin="round" />
      <rect x="12" y="62" width="96" height="10" rx="3" fill="url(#at-crown-grad)" />
    </svg>
  )
}

function Sparkle({ style, size = 26, delay = 0 }) {
  return (
    <motion.svg
      className="at-spark"
      style={{ ...style, width: size, height: size }}
      viewBox="0 0 24 24"
      aria-hidden="true"
      animate={{ opacity: [0.25, 1, 0.25], scale: [0.85, 1.1, 0.85] }}
      transition={{ duration: 3.2, repeat: Infinity, delay, ease: 'easeInOut' }}
    >
      <path d="M12 0 L14.4 9.6 L24 12 L14.4 14.4 L12 24 L9.6 14.4 L0 12 L9.6 9.6 Z" fill="currentColor" />
    </motion.svg>
  )
}

function MenuGroup({ title, items, wide }) {
  return (
    <div className={wide ? 'at-group at-span-2' : 'at-group'}>
      <h3>{title}</h3>
      <ul className="at-items">
        {items.map(item => (
          <li className="at-item" key={item.name}>
            <div className="at-item-main">
              <span className="at-item-name">{item.name}</span>
              {item.desc && <span className="at-item-desc">{item.desc}</span>}
            </div>
            <span className="at-item-price">{item.price}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Hero() {
  return (
    <section className="at-hero">
      <div className="at-ring" aria-hidden="true">
        <svg viewBox="0 0 400 400">
          <defs>
            <linearGradient id="at-ring-top" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={PURPLE} />
              <stop offset="70%" stopColor={PURPLE} />
              <stop offset="100%" stopColor={GOLD_LIGHT} />
            </linearGradient>
            <linearGradient id="at-ring-bottom" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0%" stopColor={PURPLE} />
              <stop offset="70%" stopColor={PURPLE} />
              <stop offset="100%" stopColor={GOLD_LIGHT} />
            </linearGradient>
          </defs>
          <motion.path
            d="M 60 130 A 190 190 0 0 1 340 110"
            stroke="url(#at-ring-top)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.path
            d="M 340 290 A 190 190 0 0 1 60 270"
            stroke="url(#at-ring-bottom)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
      </div>
      <Sparkle style={{ top: '26%', right: '14%' }} size={30} />
      <Sparkle style={{ top: '46%', right: '9%' }} size={20} delay={1} />
      <Sparkle style={{ top: '62%', right: '16%' }} size={26} delay={2} />
      <Sparkle style={{ top: '34%', left: '12%' }} size={22} delay={1.5} />

      <div className="at-hero-inner">
        <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}>
          <Crown />
        </motion.div>
        <motion.h1
          className="at-mark"
          aria-label="R&R Atelier"
          initial={{ opacity: 0, y: 34, filter: 'blur(12px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <span>R</span>
          <span className="amp">&amp;</span>
          <span>R</span>
        </motion.h1>
        <motion.div className="at-name" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.8 }}>
          ATELIER
        </motion.div>
        <motion.p className="at-tagline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.8 }}>
          Your Beauty, Our Craft.
        </motion.p>
        <motion.p className="at-lede" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, duration: 0.8 }}>
          A nail studio in uMhlanga offering gel sets, acrylic overlays, manicures, pedicures and nail art.
        </motion.p>
        <motion.div className="at-cta-row" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6, duration: 0.8 }}>
          <a href="#book" className="at-btn at-btn-purple">Book an appointment</a>
          <a href="#menu" className="at-btn at-btn-line">View the menu</a>
        </motion.div>
      </div>
      <motion.div className="at-scroll" animate={{ y: [0, 10, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
        scroll ↓
      </motion.div>
    </section>
  )
}

function About() {
  return (
    <section className="at-section">
      <div className="at-about">
        <div className="at-about-copy">
          <h2 className="at-h2">Nails done with care, in the heart of uMhlanga</h2>
          <span className="at-rule" />
          <p>
            R&amp;R Atelier is the nail studio from R&amp;R Agencies. You will find us at Shop 7, The Quartz, inside Bivash Hair and Beauty.
          </p>
          <p>
            Choose from gel sets, acrylic overlays, manicures, pedicures and nail art. Every appointment starts with freshly sanitised equipment.
          </p>
        </div>
        <div className="at-hours">
          <h3>Trading hours</h3>
          <ul>
            {hours.map(h => (
              <li key={h.day}>
                <span>{h.day}</span>
                <span>{h.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function Menu() {
  return (
    <div className="at-menu-wrap" id="menu">
      <section className="at-section">
        <h2 className="at-h2">The menu</h2>
        <span className="at-rule" />
        <div className="at-menu">
          <MenuGroup title="Nail Services" items={nailServices} wide />
          <MenuGroup title="Manicures" items={manicures} />
          <MenuGroup title="Pedicures" items={pedicures} />
          <MenuGroup title="Combos" items={combos} />
          <MenuGroup title="Add-Ons" items={addOns} />
        </div>
      </section>
    </div>
  )
}

function WhyUs() {
  return (
    <section className="at-section">
      <h2 className="at-h2">Why choose R&amp;R Atelier</h2>
      <span className="at-rule" />
      <div className="at-why">
        {whyUs.map(w => (
          <div className="at-why-card" key={w.title}>
            <h3>{w.title}</h3>
            <p>{w.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function Gallery() {
  return (
    <div className="at-dark">
      <section className="at-section">
        <h2 className="at-h2">Our work</h2>
        <span className="at-rule" />
        <p className="at-sub">Drag or use the arrow keys to browse the latest sets.</p>
        <div className="at-gallery-box">
          <CircularGallery
            items={galleryItems}
            bend={1}
            textColor="#ffffff"
            borderRadius={0.05}
            scrollEase={0.05}
            fontUrl={GALLERY_FONT_URL}
            font="bold 30px Cinzel"
            scrollSpeed={2}
          />
        </div>
      </section>
    </div>
  )
}

function Book() {
  return (
    <div className="at-dark" id="book" style={{ borderTop: '1px solid rgba(232, 196, 106, 0.25)' }}>
      <section className="at-section">
        <h2 className="at-h2">Book your appointment</h2>
        <span className="at-rule" />
        <div className="at-book-grid">
          <ul className="at-policy">
            {policies.map(p => (
              <li key={p.title}>
                <strong>{p.title}</strong>
                <span>{p.desc}</span>
              </li>
            ))}
          </ul>
          <div className="at-book-cta">
            <h3>See you soon</h3>
            <p>Monday to Saturday, 9am – 5pm.</p>
            <address>
              Shop 7, The Quartz, 45 Zenith Dr
              <span>Umhlanga, Durban, 4319</span>
              <span>Inside Bivash Hair and Beauty</span>
            </address>
            <div className="at-cta-row">
              <a href="tel:0813365266" className="at-btn at-btn-gold">Call 081 336 5266</a>
              <a href="https://wa.me/27813365266" target="_blank" rel="noreferrer" className="at-btn at-btn-ghost">WhatsApp us</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function Contact() {
  return (
    <section className="at-section" id="contact">
      <h2 className="at-h2">Get in touch</h2>
      <span className="at-rule" />
      <div className="at-contact-grid">
        <a href="tel:0813365266" className="at-contact-item">
          <h3>Phone</h3>
          <span>081 336 5266</span>
        </a>
        <a href="mailto:info@rragencies.co.za" className="at-contact-item">
          <h3>Email</h3>
          <span>info@rragencies.co.za</span>
        </a>
        <a href="https://www.instagram.com/randragencies" target="_blank" rel="noreferrer" className="at-contact-item">
          <h3>Instagram</h3>
          <span>@randragencies</span>
        </a>
        <a href="https://www.tiktok.com/@randragencies" target="_blank" rel="noreferrer" className="at-contact-item">
          <h3>TikTok</h3>
          <span>@randragencies</span>
        </a>
        <a href="https://wa.me/27813365266" target="_blank" rel="noreferrer" className="at-contact-item">
          <h3>WhatsApp</h3>
          <span>Message us on 081 336 5266</span>
        </a>
        <a href={MAPS_URL} target="_blank" rel="noreferrer" className="at-contact-item">
          <h3>Visit</h3>
          <address>
            Shop 7, The Quartz, 45 Zenith Dr<br />
            Umhlanga, Durban, 4319<br />
            Inside Bivash Hair and Beauty
          </address>
        </a>
      </div>
    </section>
  )
}

export default function Atelier() {
  const { scrollYProgress } = useScroll()
  const bar = useSpring(scrollYProgress, { stiffness: 100, damping: 26, mass: 0.4 })

  return (
    <div className="at">
      <style>{STYLES}</style>
      <motion.div className="at-bar" style={{ scaleX: bar }} />
      <Link to="/" className="at-back">← Back to hub</Link>

      <main>
        <Hero />
        <About />
        <Menu />
        <WhyUs />
        <Gallery />
        <Book />
        <Contact />
      </main>

      <footer className="at-footer">
        <div className="at-footer-in">
          <span>© 2026 R&amp;R Atelier, a brand of R&amp;R Agencies. All rights reserved.</span>
          <div className="at-footer-links">
            <a href="mailto:info@rragencies.co.za">info@rragencies.co.za</a>
            <Link to="/">R&amp;R Agencies</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}