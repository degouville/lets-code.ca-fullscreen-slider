import './style.css'

const runApp = () => {
  const app = document.querySelector('#app')
  const slides = app?.querySelector('.slides')
  const slideElements = slides?.querySelectorAll('.slide')

  if (!app || !slides || !slideElements)
    throw new Error("HTML Elements are missing...")

  const effectDuration = 300
  let currentSlide: number = 0
  const slidesAmount = Array.from(slideElements).length

  const triggerEffect = () => {
    slides?.classList.add('is-scrolling')
    setTimeout(() => { slides?.classList.remove('is-scrolling') }, effectDuration)
  }

  const goToNext = (isReverse: boolean = false, behavior: ScrollBehavior = 'smooth') => {
    const { innerHeight } = window    
    
    if (isReverse && currentSlide > 0 ) currentSlide--
    if (!isReverse && slidesAmount > currentSlide) currentSlide++
    const top = currentSlide * innerHeight

    if (!!currentSlide && currentSlide !== slidesAmount) triggerEffect()
    window.scroll({ top, behavior })
  }

  const animate = (e: KeyboardEvent | MouseEvent) => {
    if (e instanceof MouseEvent) return goToNext()

    const { code } = e 
    const keys = ['ArrowUp', 'ArrowDown']

    if (keys.includes(code)) e.preventDefault()
    if (code === keys[0]) goToNext(true)
    if (code === keys[1]) goToNext()
  }

  // TODO: Handle animation on scroll
  const disableScroll = (e: MouseEvent) => e.preventDefault()
  window.addEventListener('wheel', disableScroll, { passive: false })
  window.onkeydown = animate
  window.onclick = animate
}


window.onload = runApp