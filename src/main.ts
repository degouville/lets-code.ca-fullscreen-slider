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


  const effectDuration = 300
  const slidesAmount = Array.from(slideElements).length
  let currentSlide: number = 0

  const triggerEffect = () => {
    slides.classList.add('is-scrolling')
    setTimeout(() => slides.classList.remove('is-scrolling'), effectDuration)
  }

  const updateLinks = () => {
    const isActive = app.querySelector('.is-active') as HTMLElement
    const currentLink = Array.from(linkElements)[currentSlide]

    isActive?.classList.remove('is-active')
    currentLink?.classList.add('is-active')
  }

  const goToNext = (isReverse: boolean = false, behavior: ScrollBehavior = 'smooth') => {
    const { innerHeight } = window    
    
    if (isReverse && currentSlide > 0) currentSlide--
    if (!isReverse && slidesAmount > currentSlide) currentSlide++
    if (!!currentSlide && currentSlide !== slidesAmount) triggerEffect()
    updateLinks()

    window.scroll({ top: currentSlide * innerHeight, behavior })
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

  const moveMouseText = (e: MouseEvent) => {
    floatingText.style.display = 'block';
    floatingText.style.left = `${e.screenX + 10}px`;
    floatingText.style.top = `${e.screenY - 70}px`;
  }

  const reset = () => {
    currentSlide = 0
    goToNext(true)
  }
  const resetFinally = () => setTimeout(reset, 0)


  // TODO: Handle animation on scroll
  window.addEventListener('wheel', e => e.preventDefault(), {passive: false})
  window.addEventListener('wheel', throttle(animate, 1000))
  window.onmousemove = moveMouseText
  window.onkeydown = animate
  window.onclick = animate
  resetButton.addEventListener('click', resetFinally)
}

window.onload = runApp