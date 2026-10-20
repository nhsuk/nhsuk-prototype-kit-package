const DEFAULT_WIDTH = 393
const DEFAULT_HEIGHT = 852
const MIN_WIDTH = 320
// iPhone SE (1st generation), the smallest phone viewport in common use
const MIN_HEIGHT = 568
// Keeps resize handles clear of the viewport edge
const VIEWPORT_MARGIN = 32

/**
 * @param {string | null} value - Size from the URL
 * @param {number} min - Minimum size
 */
function parseSize(value, min) {
  if (value === null) return null
  const size = parseInt(value, 10)
  return Number.isNaN(size) ? null : Math.max(min, size)
}

/**
 * Resizable device frame
 */
export class Frame {
  constructor() {
    const root = document.querySelector('div.app-frame')
    if (!root) throw new Error('Frame: root element not found')

    const container = root.querySelector('div.app-frame__container')
    const iframe = root.querySelector('iframe.app-frame__iframe')
    if (!container || !iframe) {
      throw new Error('Frame: container or iframe not found')
    }

    this.root = root
    this.container = container
    this.iframe = iframe

    // Only one pointer may resize at a time, so extra fingers are ignored
    /** @type {number | null} */
    this.activePointerId = null

    // Size from the URL is kept unclamped so the frame regrows with the window,
    // and null means "use the default size"
    const params = new URLSearchParams(window.location.search)
    this.width = parseSize(params.get('width'), MIN_WIDTH)
    this.height = parseSize(params.get('height'), MIN_HEIGHT)
    this.renderSize()

    window.addEventListener('resize', () => {
      this.renderSize()
    })

    root.querySelectorAll('div.app-frame__handle').forEach((handle) => {
      this.initHandle(handle)
    })

    iframe.addEventListener('load', () => {
      this.syncFromIframe()
    })

    // The iframe may have loaded before this module ran
    this.syncFromIframe()
  }

  // The border sits outside the content box, so leave room for it too
  getMaxSize() {
    const { container } = this
    const { clientWidth, clientHeight } = document.documentElement
    return {
      width:
        clientWidth -
        VIEWPORT_MARGIN * 2 -
        (container.offsetWidth - container.clientWidth),
      height:
        clientHeight -
        VIEWPORT_MARGIN * 2 -
        (container.offsetHeight - container.clientHeight)
    }
  }

  renderSize() {
    let width = DEFAULT_WIDTH
    let height = DEFAULT_HEIGHT
    if (this.width !== null) width = this.width
    if (this.height !== null) height = this.height

    const maxHeight = this.getMaxSize().height
    height = Math.max(MIN_HEIGHT, Math.min(height, maxHeight))
    this.container.style.height = `${String(height)}px`
    document.body.classList.toggle(
      'app-frame-scrollable',
      maxHeight < MIN_HEIGHT
    )

    // Measure after the scrollbar (if any) has appeared, as it takes up width
    width = Math.min(width, this.getMaxSize().width)
    this.container.style.width = `${String(width)}px`
  }

  /**
   * @param {number} width
   * @param {number} height
   */
  setSize(width, height) {
    const maxSize = this.getMaxSize()
    this.width = Math.min(Math.round(width), maxSize.width)
    this.height = Math.max(
      MIN_HEIGHT,
      Math.min(Math.round(height), maxSize.height)
    )
    this.renderSize()
  }

  /**
   * @param {string} [urlParam]
   */
  persistToUrl(urlParam) {
    const frameUrl = new URL(window.location.href)
    let currentUrl = frameUrl.searchParams.get('url')
    if (urlParam !== undefined) currentUrl = urlParam
    frameUrl.searchParams.delete('width')
    frameUrl.searchParams.delete('height')
    frameUrl.searchParams.delete('url')
    if (this.width !== null)
      frameUrl.searchParams.set('width', String(this.width))
    if (this.height !== null)
      frameUrl.searchParams.set('height', String(this.height))
    if (currentUrl !== null) frameUrl.searchParams.set('url', currentUrl)
    history.replaceState(null, '', frameUrl)
  }

  /**
   * @param {HTMLDivElement} handle
   */
  initHandle(handle) {
    const isCorner = handle.classList.contains('app-frame__handle--corner')
    const isLeft =
      handle.classList.contains('app-frame__handle--left') ||
      handle.classList.contains('app-frame__handle--top-left') ||
      handle.classList.contains('app-frame__handle--bottom-left')
    const isTop =
      handle.classList.contains('app-frame__handle--top') ||
      handle.classList.contains('app-frame__handle--top-left') ||
      handle.classList.contains('app-frame__handle--top-right')
    const isVertical =
      handle.classList.contains('app-frame__handle--top') ||
      handle.classList.contains('app-frame__handle--bottom')
    let startX = 0
    let startY = 0
    let startWidth = 0
    let startHeight = 0

    handle.addEventListener('pointerdown', (e) => {
      if (this.activePointerId !== null || e.button !== 0) return
      e.preventDefault()
      this.activePointerId = e.pointerId
      handle.setPointerCapture(e.pointerId)
      startX = e.clientX
      startY = e.clientY
      startWidth = this.container.clientWidth
      startHeight = this.container.clientHeight
      handle.classList.add('app-frame__handle--dragging')
      if (isCorner) {
        document.body.style.cursor =
          handle.classList.contains('app-frame__handle--top-left') ||
          handle.classList.contains('app-frame__handle--bottom-right')
            ? 'nwse-resize'
            : 'nesw-resize'
      } else {
        document.body.style.cursor = isVertical ? 'ns-resize' : 'ew-resize'
      }
      document.body.style.userSelect = 'none'
      this.root.classList.add('app-frame--resizing')
    })

    handle.addEventListener('pointermove', (e) => {
      if (e.pointerId !== this.activePointerId) return
      const deltaX = e.clientX - startX
      const deltaY = e.clientY - startY
      // Frame is centred, so it grows on both sides
      const newWidth = isLeft
        ? startWidth - 2 * deltaX
        : startWidth + 2 * deltaX
      const newHeight = isTop
        ? startHeight - 2 * deltaY
        : startHeight + 2 * deltaY

      if (isCorner) {
        this.setSize(
          Math.max(MIN_WIDTH, newWidth),
          Math.max(MIN_HEIGHT, newHeight)
        )
      } else if (isVertical) {
        this.setSize(startWidth, Math.max(MIN_HEIGHT, newHeight))
      } else {
        this.setSize(Math.max(MIN_WIDTH, newWidth), startHeight)
      }
    })

    /**
     * @param {PointerEvent} e
     */
    const endDrag = (e) => {
      if (e.pointerId !== this.activePointerId) return
      this.activePointerId = null
      handle.classList.remove('app-frame__handle--dragging')
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      this.root.classList.remove('app-frame--resizing')
      this.persistToUrl()
    }

    // Listen to all three, as some browsers skip lostpointercapture on cancel
    handle.addEventListener('pointerup', endDrag)
    handle.addEventListener('pointercancel', endDrag)
    handle.addEventListener('lostpointercapture', endDrag)
  }

  syncFromIframe() {
    // Cross-origin – cannot read iframe document
    const iframeDocument = this.iframe.contentDocument
    if (!iframeDocument) return

    // Skip the initial about:blank document and pages still loading
    const { href, pathname, search, hash } = iframeDocument.location
    if (href === 'about:blank' || iframeDocument.readyState !== 'complete') {
      return
    }

    // Update the browser tab title to match the iframe's title
    document.title = iframeDocument.title || 'NHS prototype kit'

    // Keep ?url= in sync so reloads return to the current page
    this.persistToUrl(pathname + search + hash)
  }
}
