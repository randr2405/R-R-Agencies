import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from 'ogl'

const ORCHID = '#a66bff'
const PURPLE = '#7a1fd1'
const PLUM = '#1a0b2e'
const PLUM_SOFT = '#2a1247'
const GOLD = '#c9962e'
const GOLD_LIGHT = '#f0d489'
const PEARL = '#fbf7fc'
const LILAC = '#f1e7fa'

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

const menuTabs = [
  { id: 'nails', label: 'Nail services', items: nailServices },
  { id: 'manicures', label: 'Manicures', items: manicures },
  { id: 'pedicures', label: 'Pedicures', items: pedicures },
  { id: 'combos', label: 'Combos', items: combos },
  { id: 'addons', label: 'Add-ons', items: addOns },
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

const swatches = [
  { cls: 'gel', label: 'Rubber base' },
  { cls: 'chrome', label: 'Chrome' },
  { cls: 'cat', label: 'Cat eye' },
  { cls: 'ombre', label: 'Ombre' },
  { cls: 'foil', label: 'Foil' },
]

const ticker = ['Rubber Base Gel', 'Acrylic Overlay', 'Cat Eye', 'Chrome', 'Ombre', 'Manicures', 'Pedicures', 'Nail Art', 'Gel Toes']

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
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,700;1,9..144,300;1,9..144,500&family=Figtree:wght@300;400;500;600;700&display=swap');

.at {
  --orchid: ${ORCHID};
  --purple: ${PURPLE};
  --plum: ${PLUM};
  --plum-soft: ${PLUM_SOFT};
  --gold: ${GOLD};
  --gold-light: ${GOLD_LIGHT};
  --pearl: ${PEARL};
  --lilac: ${LILAC};
  --text: #2b1d3d;
  --muted: rgba(43, 29, 61, 0.7);
  --muted-light: rgba(251, 247, 252, 0.74);
  background: var(--pearl);
  color: var(--text);
  font-family: 'Figtree', system-ui, sans-serif;
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
.at a:focus-visible, .at button:focus-visible { outline: 2px solid var(--orchid); outline-offset: 4px; border-radius: 8px; }

.at-bar {
  position: fixed; top: 0; left: 0; right: 0; height: 3px; z-index: 70; transform-origin: 0 50%;
  background: linear-gradient(90deg, var(--purple), var(--orchid), var(--gold-light));
  box-shadow: 0 0 14px rgba(166, 107, 255, 0.7);
}
.at-back {
  position: fixed; top: 18px; left: 22px; z-index: 60; font-weight: 500; font-size: 0.92rem;
  padding: 9px 18px; border-radius: 999px; color: #fff;
  background: rgba(26, 11, 46, 0.6); backdrop-filter: blur(14px);
  border: 1px solid rgba(240, 212, 137, 0.5);
  transition: transform 250ms ease, border-color 250ms ease;
}
.at-back:hover { transform: translateX(-3px); border-color: var(--gold-light); }

.at-hero {
  position: relative; min-height: 100vh; display: grid; place-items: center; text-align: center;
  padding: 120px 24px 110px; overflow: hidden; isolation: isolate; color: #fff;
  background: linear-gradient(180deg, #12061f 0%, var(--plum) 55%, #24103f 100%);
}
.at-orb { position: absolute; border-radius: 50%; filter: blur(70px); z-index: -1; pointer-events: none; }
.at-orb.a { width: 46vw; height: 46vw; left: -12vw; top: -10vw; background: radial-gradient(circle, rgba(122, 31, 209, 0.75), transparent 68%); }
.at-orb.b { width: 40vw; height: 40vw; right: -10vw; top: 18vh; background: radial-gradient(circle, rgba(166, 107, 255, 0.45), transparent 68%); }
.at-orb.c { width: 34vw; height: 34vw; left: 30vw; bottom: -16vw; background: radial-gradient(circle, rgba(201, 150, 46, 0.4), transparent 68%); }
.at-hero-inner { width: min(980px, 100%); display: flex; flex-direction: column; align-items: center; }

.at-wordmark { display: flex; flex-direction: column; align-items: center; line-height: 1; }
.at-wm-small {
  display: flex; align-items: center; gap: 18px; width: 100%; justify-content: center;
  font-family: 'Cinzel', serif; font-weight: 600; font-size: clamp(1.1rem, 3vw, 1.8rem);
  letter-spacing: 0.5em; margin-right: -0.5em; color: var(--gold-light);
}
.at-wm-small::before, .at-wm-small::after { content: ''; flex: 1; max-width: 140px; height: 1px; background: linear-gradient(90deg, transparent, var(--gold)); }
.at-wm-small::after { background: linear-gradient(270deg, transparent, var(--gold)); }
.at-wm-big {
  margin-top: 0.1em; padding: 0.06em 0.12em 0.14em;
  font-family: 'Fraunces', serif; font-style: italic; font-weight: 300; font-optical-sizing: auto;
  font-size: clamp(4.4rem, 17vw, 12.5rem); letter-spacing: -0.03em;
  background: linear-gradient(180deg, #fff 8%, var(--gold-light) 52%, var(--orchid) 100%);
  -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 46px rgba(166, 107, 255, 0.5));
}
.at-tagline { margin-top: 0.6rem; font-family: 'Fraunces', serif; font-style: italic; font-weight: 300; font-size: clamp(1.4rem, 3.4vw, 2.2rem); color: var(--gold-light); }
.at-lede { margin: 1.2rem auto 0; max-width: 34rem; font-size: clamp(1rem, 1.7vw, 1.2rem); color: var(--muted-light); }
.at-cta-row { margin-top: 2.2rem; display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
.at-btn {
  display: inline-flex; align-items: center; justify-content: center; padding: 14px 32px; border-radius: 999px;
  font-weight: 600; font-size: 1rem; cursor: pointer; border: 1px solid transparent; font-family: inherit;
  transition: transform 250ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 250ms ease, background 250ms ease;
}
.at-btn:hover { transform: translateY(-3px); }
.at-btn-gold { background: linear-gradient(115deg, var(--gold), var(--gold-light)); color: #1f1405; box-shadow: 0 10px 34px rgba(201, 150, 46, 0.35); }
.at-btn-gold:hover { box-shadow: 0 16px 44px rgba(201, 150, 46, 0.55); }
.at-btn-ghost { background: rgba(255, 255, 255, 0.04); color: #fff; border-color: rgba(240, 212, 137, 0.6); }
.at-btn-ghost:hover { background: rgba(240, 212, 137, 0.14); }
.at-btn-purple { background: linear-gradient(120deg, var(--purple), var(--orchid)); color: #fff; box-shadow: 0 10px 30px rgba(122, 31, 209, 0.35); }
.at-btn-purple:hover { box-shadow: 0 16px 40px rgba(122, 31, 209, 0.5); }

.at-nails { margin-top: 3.4rem; display: flex; gap: clamp(14px, 3.4vw, 34px); justify-content: center; align-items: flex-end; flex-wrap: wrap; }
.at-nail-wrap { display: flex; flex-direction: column; align-items: center; gap: 10px; }
.at-nail-wrap:nth-child(odd) { margin-bottom: 18px; }
.at-nail {
  position: relative; width: clamp(46px, 7vw, 68px); height: clamp(70px, 10.5vw, 102px);
  border-radius: 999px 999px 22px 22px / 60% 60% 22px 22px; overflow: hidden;
  box-shadow: 0 16px 34px rgba(0, 0, 0, 0.45), inset 0 -8px 14px rgba(0, 0, 0, 0.22);
}
.at-nail::after {
  content: ''; position: absolute; top: 8%; left: 18%; width: 22%; height: 46%; border-radius: 999px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0));
}
.at-nail.gel { background: linear-gradient(160deg, #c79bff, var(--purple) 60%, #4b1287); }
.at-nail.chrome { background: linear-gradient(135deg, #fafafd, #9494a6 38%, #f2f2f7 58%, #72728a); }
.at-nail.cat { background: linear-gradient(112deg, #2a0f4a 28%, #c9a0ff 47%, #2a0f4a 66%); }
.at-nail.ombre { background: linear-gradient(0deg, #ff9fd0, var(--purple)); }
.at-nail.foil { background: linear-gradient(135deg, #f7e3a1, var(--gold) 45%, #f0d489 70%, #a87517); }
.at-nail-label { font-size: 0.82rem; color: var(--muted-light); letter-spacing: 0.02em; }
.at-scroll { position: absolute; bottom: 24px; left: 50%; translate: -50% 0; color: var(--gold-light); font-weight: 500; font-size: 0.9rem; }
.at-spark { position: absolute; color: var(--gold-light); pointer-events: none; }

.at-strip { background: var(--gold); color: var(--plum); overflow: hidden; border-block: 1px solid rgba(26, 11, 46, 0.25); }
.at-strip-track { display: flex; width: max-content; animation: at-slide 38s linear infinite; }
.at-strip-item { display: flex; align-items: center; gap: 28px; padding: 13px 0 13px 28px; font-family: 'Fraunces', serif; font-style: italic; font-weight: 500; font-size: 1.25rem; white-space: nowrap; }
.at-strip-item i { font-style: normal; font-size: 0.9rem; }
@keyframes at-slide { to { transform: translateX(-50%); } }

.at-section { max-width: 1240px; margin: 0 auto; padding: clamp(80px, 11vw, 140px) clamp(20px, 5vw, 64px); }
.at-h2 { font-family: 'Fraunces', serif; font-weight: 500; font-size: clamp(2.1rem, 5vw, 3.6rem); line-height: 1.08; letter-spacing: -0.015em; color: var(--plum); max-width: 17ch; }
.at-sub { margin-top: 1rem; color: var(--muted); max-width: 34rem; }
.at-rule { display: block; margin-top: 1.2rem; width: 96px; height: 3px; border-radius: 3px; background: linear-gradient(90deg, var(--purple), var(--gold-light)); }

.at-about-wrap { background: var(--lilac); }
.at-about { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: clamp(28px, 6vw, 90px); align-items: center; }
.at-about-copy p { margin-top: 1.2rem; font-size: 1.12rem; color: var(--muted); max-width: 36rem; }
.at-about-copy p:first-of-type { margin-top: 1.8rem; }
.at-hours {
  position: relative; padding: 36px 34px; border-radius: 30px 30px 30px 90px; color: #fff; overflow: hidden;
  background: linear-gradient(155deg, var(--plum-soft), var(--plum));
  box-shadow: 0 34px 70px rgba(26, 11, 46, 0.28);
}
.at-hours::before { content: ''; position: absolute; right: -60px; top: -60px; width: 190px; height: 190px; border-radius: 50%; background: radial-gradient(circle, rgba(201, 150, 46, 0.5), transparent 70%); }
.at-hours h3 { position: relative; font-family: 'Fraunces', serif; font-weight: 500; font-size: 1.7rem; color: var(--gold-light); margin-bottom: 0.8rem; }
.at-hours li { position: relative; display: flex; justify-content: space-between; gap: 16px; padding: 10px 0; border-bottom: 1px solid rgba(240, 212, 137, 0.18); }
.at-hours li:last-child { border-bottom: 0; }
.at-hours li span:last-child { color: var(--muted-light); }

.at-menu-head { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-end; gap: 24px; }
.at-tabs { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 2.8rem; }
.at-tab {
  cursor: pointer; font-family: inherit; font-weight: 600; font-size: 0.98rem; padding: 12px 22px; border-radius: 999px;
  color: var(--plum); background: transparent; border: 1px solid rgba(122, 31, 209, 0.3);
  transition: background 250ms ease, color 250ms ease, border-color 250ms ease, transform 250ms ease;
}
.at-tab:hover { border-color: var(--purple); transform: translateY(-2px); }
.at-tab[aria-selected='true'] { background: linear-gradient(120deg, var(--purple), var(--orchid)); color: #fff; border-color: transparent; box-shadow: 0 10px 26px rgba(122, 31, 209, 0.32); }
.at-menu-panel {
  margin-top: 1.6rem; padding: clamp(24px, 4vw, 52px); border-radius: 34px; background: #fff;
  border: 1px solid rgba(122, 31, 209, 0.16); box-shadow: 0 30px 70px rgba(122, 31, 209, 0.1);
}
.at-items.two { columns: 2; column-gap: clamp(32px, 6vw, 88px); }
.at-item { display: flex; align-items: baseline; gap: 12px; padding: 15px 0; break-inside: avoid; }
.at-item-main { min-width: 0; }
.at-item-name { display: block; font-weight: 600; font-size: 1.05rem; color: var(--plum); }
.at-item-desc { display: block; font-size: 0.92rem; color: var(--muted); margin-top: 2px; max-width: 34rem; }
.at-item-dots { flex: 1; min-width: 20px; border-bottom: 2px dotted rgba(201, 150, 46, 0.7); transform: translateY(-4px); }
.at-item-price { font-family: 'Fraunces', serif; font-weight: 700; font-size: 1.15rem; color: var(--purple); white-space: nowrap; }

.at-why-wrap { background: linear-gradient(180deg, var(--plum), #12061f); color: #fff; position: relative; overflow: hidden; }
.at-why-wrap .at-h2 { color: #fff; }
.at-why { display: grid; grid-template-columns: 0.85fr 1.15fr; gap: clamp(28px, 6vw, 90px); align-items: start; }
.at-why-head { position: sticky; top: 110px; }
.at-why-list { display: flex; flex-direction: column; }
.at-why-row { display: grid; grid-template-columns: 34px 1fr; gap: 20px; padding: 30px 0; border-top: 1px solid rgba(240, 212, 137, 0.28); transition: padding-left 300ms ease; }
.at-why-row:last-child { border-bottom: 1px solid rgba(240, 212, 137, 0.28); }
.at-why-row:hover { padding-left: 12px; }
.at-why-row svg { width: 28px; height: 28px; color: var(--gold-light); margin-top: 6px; }
.at-why-row h3 { font-family: 'Fraunces', serif; font-weight: 500; font-size: clamp(1.4rem, 2.6vw, 1.9rem); line-height: 1.2; color: #fff; }
.at-why-row p { margin-top: 0.4rem; color: var(--muted-light); max-width: 32rem; }

.at-dark { background: #12061f; color: #fff; position: relative; }
.at-dark .at-h2 { color: #fff; }
.at-dark .at-sub { color: var(--muted-light); }
.at-gallery-box { position: relative; height: 600px; margin-top: 2.6rem; }
.circular-gallery { width: 100%; height: 100%; overflow: hidden; cursor: grab; }
.circular-gallery:active { cursor: grabbing; }
.circular-gallery:focus-visible { outline: 2px solid var(--gold-light); outline-offset: 4px; }

.at-book-wrap { background: linear-gradient(135deg, var(--purple), #4b1287 60%, var(--plum)); color: #fff; }
.at-book-wrap .at-h2 { color: #fff; }
.at-book-grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(28px, 6vw, 90px); margin-top: 3rem; align-items: start; }
.at-policy li { display: flex; justify-content: space-between; gap: 20px; padding: 18px 0; border-bottom: 1px solid rgba(240, 212, 137, 0.3); }
.at-policy li:first-child { border-top: 1px solid rgba(240, 212, 137, 0.3); }
.at-policy strong { font-family: 'Fraunces', serif; font-weight: 500; font-size: 1.2rem; color: var(--gold-light); }
.at-policy span { color: var(--muted-light); text-align: right; }
.at-book-cta { display: flex; flex-direction: column; gap: 12px; padding: 38px; border-radius: 34px; background: var(--pearl); color: var(--text); box-shadow: 0 34px 70px rgba(12, 4, 24, 0.4); }
.at-book-cta h3 { font-family: 'Fraunces', serif; font-style: italic; font-weight: 500; font-size: 2.4rem; line-height: 1.1; color: var(--purple); }
.at-book-cta p { color: var(--muted); }
.at-book-cta address { margin-top: 0.2rem; color: var(--plum); font-weight: 500; }
.at-book-cta address span { display: block; color: var(--muted); font-weight: 400; }
.at-book-cta .at-cta-row { justify-content: flex-start; margin-top: 0.8rem; }
.at-book-cta .at-btn-ghost { color: var(--plum); border-color: rgba(122, 31, 209, 0.4); background: transparent; }
.at-book-cta .at-btn-ghost:hover { background: rgba(122, 31, 209, 0.08); }

.at-contact-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 3rem; }
.at-contact-item {
  display: flex; flex-direction: column; gap: 6px; padding: 28px; border-radius: 26px; background: var(--lilac);
  border: 1px solid rgba(122, 31, 209, 0.14);
  transition: transform 300ms cubic-bezier(0.22, 1, 0.36, 1), background 300ms ease, border-color 300ms ease;
}
.at-contact-item:nth-child(3n + 2) { border-radius: 26px 26px 26px 70px; }
.at-contact-item:hover { transform: translateY(-5px); background: #fff; border-color: var(--purple); }
.at-contact-item h3 { font-family: 'Fraunces', serif; font-weight: 500; font-size: 1.25rem; color: var(--purple); }
.at-contact-item span, .at-contact-item address { color: var(--text); font-size: 1.02rem; overflow-wrap: anywhere; }

.at-footer { background: var(--plum); color: var(--muted-light); padding: 40px clamp(20px, 5vw, 64px) 48px; }
.at-footer-in { max-width: 1240px; margin: 0 auto; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 14px 32px; font-size: 0.92rem; }
.at-footer-links { display: flex; flex-wrap: wrap; gap: 8px 24px; }
.at-footer-links a:hover { color: var(--gold-light); }

@media (max-width: 900px) {
  .at-about, .at-book-grid, .at-why { grid-template-columns: 1fr; }
  .at-why-head { position: static; }
  .at-items.two { columns: 1; }
  .at-contact-grid { grid-template-columns: 1fr; }
  .at-contact-item:nth-child(n) { border-radius: 26px; }
  .at-gallery-box { height: 480px; }
}
@media (prefers-reduced-motion: reduce) {
  .at *, .at *::before { transition-duration: 0.01ms !important; }
  .at-strip-track { animation: none; }
}
`

function Sparkle({ style, size = 26, delay = 0 }) {
  return (
    <motion.svg
      className="at-spark"
      style={{ ...style, width: size, height: size }}
      viewBox="0 0 24 24"
      aria-hidden="true"
      animate={{ opacity: [0.2, 1, 0.2], scale: [0.85, 1.1, 0.85] }}
      transition={{ duration: 3.2, repeat: Infinity, delay, ease: 'easeInOut' }}
    >
      <path d="M12 0 L14.4 9.6 L24 12 L14.4 14.4 L12 24 L9.6 14.4 L0 12 L9.6 9.6 Z" fill="currentColor" />
    </motion.svg>
  )
}

function Hero() {
  const { scrollY } = useScroll()
  const orbY = useTransform(scrollY, [0, 800], [0, 160])
  return (
    <section className="at-hero">
      <motion.div className="at-orb a" style={{ y: orbY }} aria-hidden="true" />
      <motion.div className="at-orb b" style={{ y: orbY }} aria-hidden="true" />
      <div className="at-orb c" aria-hidden="true" />
      <Sparkle style={{ top: '24%', right: '13%' }} size={30} />
      <Sparkle style={{ top: '44%', right: '8%' }} size={20} delay={1} />
      <Sparkle style={{ top: '58%', left: '9%' }} size={26} delay={2} />
      <Sparkle style={{ top: '30%', left: '11%' }} size={22} delay={1.5} />

      <div className="at-hero-inner">
        <h1 className="at-wordmark" aria-label="R&R Atelier">
          <motion.span className="at-wm-small" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            R&amp;R
          </motion.span>
          <motion.span
            className="at-wm-big"
            initial={{ opacity: 0, y: 34, filter: 'blur(14px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.3, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            Atelier
          </motion.span>
        </h1>
        <motion.p className="at-tagline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.8 }}>
          Your Beauty, Our Craft.
        </motion.p>
        <motion.p className="at-lede" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, duration: 0.8 }}>
          A nail studio in uMhlanga offering gel sets, acrylic overlays, manicures, pedicures and nail art.
        </motion.p>
        <motion.div className="at-cta-row" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 0.8 }}>
          <a href="#book" className="at-btn at-btn-gold">Book an appointment</a>
          <a href="#menu" className="at-btn at-btn-ghost">View the menu</a>
        </motion.div>
        <div className="at-nails" aria-hidden="true">
          {swatches.map((s, i) => (
            <motion.div
              className="at-nail-wrap"
              key={s.cls}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: [0, -10, 0] }}
              transition={{
                opacity: { delay: 1.7 + i * 0.1, duration: 0.6 },
                y: { delay: 1.7 + i * 0.1, duration: 4 + i * 0.4, repeat: Infinity, ease: 'easeInOut' },
              }}
            >
              <div className={`at-nail ${s.cls}`} />
              <span className="at-nail-label">{s.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
      <motion.div className="at-scroll" animate={{ y: [0, 10, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
        scroll ↓
      </motion.div>
    </section>
  )
}

function Strip() {
  const row = [...ticker, ...ticker]
  return (
    <div className="at-strip" aria-hidden="true">
      <div className="at-strip-track">
        {[0, 1].map(k => (
          <div className="at-strip-item" key={k}>
            {row.map((t, i) => (
              <span key={`${k}-${i}`} style={{ display: 'contents' }}>
                <span>{t}</span>
                <i>✦</i>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function About() {
  return (
    <div className="at-about-wrap">
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
    </div>
  )
}

function Menu() {
  const [active, setActive] = useState(0)
  const tab = menuTabs[active]
  return (
    <section className="at-section" id="menu">
      <div className="at-menu-head">
        <div>
          <h2 className="at-h2">The menu</h2>
          <span className="at-rule" />
        </div>
      </div>
      <div className="at-tabs" role="tablist">
        {menuTabs.map((t, i) => (
          <button key={t.id} role="tab" aria-selected={i === active} className="at-tab" onClick={() => setActive(i)}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="at-menu-panel">
        <AnimatePresence mode="wait">
          <motion.ul
            key={tab.id}
            className={tab.items.length > 6 ? 'at-items two' : 'at-items'}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {tab.items.map(item => (
              <li className="at-item" key={item.name}>
                <div className="at-item-main">
                  <span className="at-item-name">{item.name}</span>
                  {item.desc && <span className="at-item-desc">{item.desc}</span>}
                </div>
                <span className="at-item-dots" />
                <span className="at-item-price">{item.price}</span>
              </li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>
    </section>
  )
}

function WhyUs() {
  return (
    <div className="at-why-wrap">
      <section className="at-section">
        <div className="at-why">
          <div className="at-why-head">
            <h2 className="at-h2">Why choose R&amp;R Atelier</h2>
            <span className="at-rule" />
          </div>
          <div className="at-why-list">
            {whyUs.map(w => (
              <div className="at-why-row" key={w.title}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 0 L14.4 9.6 L24 12 L14.4 14.4 L12 24 L9.6 14.4 L0 12 L9.6 9.6 Z" fill="currentColor" />
                </svg>
                <div>
                  <h3>{w.title}</h3>
                  <p>{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
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
    <div className="at-book-wrap" id="book">
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
              <a href="tel:0813365266" className="at-btn at-btn-purple">Call 081 336 5266</a>
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
        <Strip />
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