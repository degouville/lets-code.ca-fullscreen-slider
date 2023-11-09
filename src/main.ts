import './style.css'
import throttle from 'lodash.throttle'

// NOTE: Force-bypass the 1st Overlay
window.scroll({ top: window.innerHeight, behavior: 'instant' })

const runApp = () => {
  const app = document.querySelector('#app') as HTMLElement
  const resetButton = document.querySelector('.reset') as HTMLElement
  const slides = app.querySelector('.slides') as HTMLElement
  const slideElements = slides.querySelectorAll('.slide') as NodeListOf<HTMLElement>
  const links = app.querySelector('.links') as HTMLElement
  const linkElements = links.querySelectorAll('.link') as NodeListOf<HTMLElement>
  const floatingText = document.querySelector('.floating-text') as HTMLElement


  const effectDuration = 300
  const slidesAmount = Array.from(slideElements).length
  let currentSlide: number = 1 // TODO: use state for the slides

  const triggerEffect = () => {
    slides.classList.add('is-scrolling')
    setTimeout(() => slides.classList.remove('is-scrolling'), effectDuration)
  }

  const updateLinks = () => {
    const isActive = app.querySelector('.is-active') as HTMLElement
    // TODO: improve this with status value
    const currentLink = Array.from(linkElements)[currentSlide - 1] 
    // TODO: Make those links clickable to their targets
    isActive?.classList.remove('is-active')
    currentLink?.classList.add('is-active')
  }

  const reload = (top: number = 0, behavior: ScrollBehavior = 'instant') => {
    console.info('%cRun it back Turbooo ∞💫', 'color: yellow')
    currentSlide = 0
    window.scroll({ top, behavior })
  }

  const goToNext = (isReverse: boolean = false, behavior: ScrollBehavior = 'smooth') => {
    const { innerHeight } = window
    const isFirst = currentSlide >= 1
    
    if (isReverse && isFirst) currentSlide--
    if (!isReverse && slidesAmount - 1 > currentSlide) currentSlide++

    const isLast = currentSlide === slidesAmount - 1
    const isOverlay = currentSlide === 0 || currentSlide === slidesAmount
    if (!isOverlay) triggerEffect()

    updateLinks()

    window.scroll({ top: currentSlide * innerHeight, behavior })
    if (isLast) setTimeout(reload, effectDuration * 3)
  }

  const animate = (e: KeyboardEvent | MouseEvent | WheelEvent) => {
    if (e instanceof WheelEvent) return goToNext(e.deltaY < 0)
    if (e instanceof MouseEvent) return goToNext()

    const { code } = e
    const keys = ['ArrowUp', 'ArrowDown', 'Space']

    if (keys.includes(code)) e.preventDefault()
    if (code === keys[0]) goToNext(true)
    if (code === keys[1]) goToNext()
  }

  const moveMouseText = throttle((e: MouseEvent) => {
    const x = e.offsetX + 20
    const y = e.offsetY - 10
    floatingText.style.display = 'block'
    floatingText.style.transform = `translate(${ x }px, ${ y }px)`
  }, 50)

  const reset = () => {
    currentSlide = 2
    goToNext(true)
  }
  const resetFinally = () => setTimeout(reset, 0)

  window.addEventListener('wheel', e => e.preventDefault(), {passive: false})
  // TODO: Find a remove throttle and just block any event while animate() is running
  window.addEventListener('wheel', throttle(animate, effectDuration * 3))
  window.onmousemove = moveMouseText
  window.onkeydown = animate
  window.onclick = animate
  resetButton.addEventListener('click', resetFinally)
}

window.onload = runApp