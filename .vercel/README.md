

## The challenge:
Recreate a similar application using the video above as a reference, using native tools (HTML, CSS & Javascript).

### Instructions:
1. BASIC #
- Create at least 4 fullscreen compositions.
- Create a reveal state with an image centered on the screen.

2. MEDIUM #
- Create an effect that move the sliders from bottom to top and reveal the image.
- Create a scale effect while navigating through the slider.

3. ADVANCED #
- Create a seamless animation from state 1 (scrolling) to state 2 (image revealing).
- Create an infinity loop while scrolling the page.

## Case Study

This file is responsible for creating an interactive image slider. It uses the lodash.throttle function to limit the rate at which a function can fire.

1. Initialization: The runApp function is called when the window loads. It first grabs references to various HTML elements using document.querySelector.

2. Setting up the slider: It sets up the slider by defining the number of slides (slidesAmount) and the current slide (currentSlide).

3. Triggering the slide effect: The triggerEffect function is responsible for creating a scrolling effect on the slides. This is achieved by adding a CSS class is-scrolling to the slides element. This class presumably contains CSS transitions or animations that create the scrolling effect. After a duration specified by effectDuration (300ms in this case), the is-scrolling class is removed from the slides element, effectively ending the scrolling effect.

```typescript
const triggerEffect = () => {
  slides.classList.add('is-scrolling')
  setTimeout(() => slides.classList.remove('is-scrolling'), effectDuration)
}
```


4. Updating the links: The updateLinks function updates the active link based on the current slide.

5. Reloading the slides: The reload function resets the slider to the initial state.

6. Navigating through the slides: The goToNext function is responsible for navigating through the slides. It takes a boolean parameter isReverse which determines the direction of navigation. If isReverse is true, it decrements the currentSlide (as long as it's not the first slide). If isReverse is false, it increments the currentSlide (as long as it's not the last slide).

After updating the currentSlide, it checks if the current slide is the last slide or an overlay slide. If it's not an overlay slide, it triggers the slide effect by calling triggerEffect.

Then, it calls updateLinks to update the active link based on the currentSlide.

Finally, it transforms the slides element's position using CSS translate to create the effect of moving to the next slide. If the current slide is the last slide, it calls the reload function after a delay to reset the slider to the initial state.
  
```typescript
const goToNext = (isReverse: boolean = false) => {
  const isFirst = currentSlide >= 1
  
  if (isReverse && isFirst) currentSlide--
  if (!isReverse && slidesAmount - 1 > currentSlide) currentSlide++

  const isLast = currentSlide === slidesAmount - 1
  const isOverlay = currentSlide === 0 || currentSlide === slidesAmount
  if (!isOverlay) triggerEffect()

  updateLinks()
  
  const vh = ((slidesAmount - 1) - currentSlide) * 100

  slides.style.transform = `translateY(${ vh }vh)`
  if (isLast) setTimeout(reload, effectDuration * 2)
}
```

In summary, triggerEffect is responsible for the scrolling effect, while goToNext handles the navigation between slides.

7. Animating the slides: The animate function handles different types of events (keyboard, mouse, wheel) and calls goToNext accordingly.

8. Moving the floating text: The moveMouseText function moves a floating text element based on the mouse position.

9. Resetting the slider: The reset function resets the slider to a specific slide.

10. Event listeners: Finally, event listeners are added to handle different user interactions (scrolling, moving the mouse, pressing keys, clicking).

In summary, this file sets up an interactive image slider that responds to various user interactions. It uses CSS transitions for the slide effect and throttles event handlers to ensure smooth performance.
