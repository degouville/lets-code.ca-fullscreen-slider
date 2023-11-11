import './style.css'
import throttle from 'lodash.throttle'

const runApp = () => {
  const app = document.querySelector('#app') as HTMLElement
  const resetButton = document.querySelector('.reset') as HTMLElement
  const slides = app.querySelector('.slides') as HTMLElement
  const slideElements = slides.querySelectorAll('.slide') as NodeListOf<HTMLElement>
  const links = app.querySelector('.links') as HTMLElement
  const linkElements = links.querySelectorAll('.link') as NodeListOf<HTMLElement>
  const floatingText = document.querySelector('.floating-text') as HTMLElement


  const effectDuration: number = 300
  let isAnimating: boolean = false
  const slidesAmount: number = Array.from(slideElements).length
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

  const reload = () => {
    const time = new Date().toLocaleTimeString()
    console.info(`%c ${time}: Run it back Turbooo ∞💫`, 'color: yellow')
    currentSlide = 0
    slides.style.transition = 'none'
    slides.style.transform = 'translateY(600vh)'
    setTimeout(() => slides.style.transition = '', effectDuration * .1)
  }

  const goToNext = (isReverse: boolean = false) => {
    const isFirst = currentSlide >= 1
    
    if (isReverse && isFirst) currentSlide--
    if (!isReverse && slidesAmount - 1 > currentSlide) currentSlide++

    const isLast = currentSlide === slidesAmount - 1
    const isOverlay = currentSlide === 0 || currentSlide === slidesAmount
    if (!isOverlay) triggerEffect()

    updateLinks()
    
    // TODO: make this mapped with slides
    const vh = ((slidesAmount - 1) - currentSlide) * 100

    slides.style.transform = `translateY(${ vh }vh)`
    if (isLast) setTimeout(reload, effectDuration)
  }

  const animate = (e: KeyboardEvent | MouseEvent | WheelEvent) => {
    if (isAnimating) return
    isAnimating = true
    setTimeout(() => isAnimating = false, effectDuration)

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
  const setPortraitMode = () => {
    window.innerWidth / window.innerHeight < 4 / 3
      ? slides.classList.add('is-portrait')
      : slides.classList.remove('is-portrait')
  }

  // TODO: Find a remove throttle and just block any event while animate() is running
  // window.addEventListener('wheel', e => {
  //   if (!isAnimating) return
  //   isAnimating = true
  //   setTimeout(() => isAnimating = false, 1000)

  //   animate(e)
  // })
  window.addEventListener('wheel', e => e.preventDefault() , { passive: false })
  window.addEventListener('wheel', throttle(animate, effectDuration * 3))
  window.onmousemove = moveMouseText
  window.onkeydown = animate
  window.onclick = animate
  resetButton.addEventListener('click', resetFinally)
  window.onresize = setPortraitMode
}

window.onload = runApp