import Two, { ConstructorParams } from 'two.js'
export interface AnimationOption extends ConstructorParams {
  el: SvgAnimation['el']
  shakingRange?: SvgAnimation['shakingRange']
}

export default class SvgAnimation extends Two {
  public shakingRange: number
  private el: HTMLElement
  constructor(params: AnimationOption) {
    super(params)
    /**
     * bind methods
     */
    this.animationStart = this.animationStart.bind(this)
    this.shaking = this.shaking.bind(this)
    /**
     * Setup parameter
     */
    // TODO: Fix Two.vector constructor params
    this.shakingRange = params.shakingRange || 2
    this.type = params.type || Two.Types.canvas
    this.el = params.el
    this.width = this.el.clientWidth
    this.height = this.el.clientHeight
    this.animationStart()
  }
  /**
   * Shaking Drawing line
   */
  public shaking(): () => void {
    const randomShaking = (): number =>
      Math.random() * this.shakingRange - this.shakingRange / 2
    const updateShake = (frameCount: any, timeDelta: any) => {
      // shake speed
      if (frameCount % 5 !== 0) return
      this.scene.children.map((child: Two.Object) => {
        if (!(child as Two.Path).vertices) return
        ;(child as Two.Path).vertices.map((v: Two.Anchor | any) => {
          // TODO: define position types
          // v.position is base position
          if (!v.position) {
            v.position = v.clone()
          }
          v.x = v.position.x + randomShaking()
          v.y = v.position.y + randomShaking()
        })
      })
    }

    // to fix original position
    const toBasePosition = () =>
      this.scene.children.map((child: Two.Object) => {
        this.scene.children.map((child: Two.Object) => {
          const vertices = (child as Two.Path).vertices
          if (!vertices) return
          vertices.map((v: Two.Anchor | any) => {
            // TODO: define position types
            if (!v.position) {
              return
            }
            v.x = v.position.x
            v.y = v.position.y
            delete v.position
          })
        })
      })
    this.bind('update', updateShake).play()
    return () => {
      this.unbind('update', updateShake)
      toBasePosition()
    }
  }
  /**
   * DrawingStart
   */
  private animationStart(): SvgAnimation {
    this.appendTo(this.el)
    return this
  }
}
