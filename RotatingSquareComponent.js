const scGap = 0.02
const w = window.innerWidth
const h = window.innerHeight
const sizeFactor = 8
const delay = 30

const sinify = (scale) => Math.sin(Math.PI * scale)

class State {

    scale = 0
    dir = 0
    prevScale = 0

    update(cb) {
        this.scale += scGap * this.dir
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            cb()
        }
    }

    startUpdating(cb) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale
            cb()
        }
    }
}

class Animator {

    animated = false
    interval

    start(cb) {
        if (!this.animated) {
            this.animated = true
            this.interval = setInterval(cb, delay)
        }
    }

    stop() {
        if (this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }

    }
}

const squareStyle = (scale) => {
    const border = '1px solid #01579B'
    const size = `${Math.min(w, h) / sizeFactor}`
    const width = `${size}px`
    const height = `${size}px`
    const position = 'absolute'
    const top = `${h / 2 - size / 2}px`
    const left = `${w / 2 - size / 2}px`
    const WebkitTransform = `rotate(${90 * sinify(scale)}deg)`
    return {width, height, border, WebkitTransform, position, top, left}
}

const animator = new Animator()
Vue.component('rotating-square-component', {
    template : '#rotatingSquareBox',

    data() {
        return {state : new State(), squareStyle : squareStyle(0)}
    },

    methods : {
        update() {
            console.log(this.state.scale)
            this.squareStyle = squareStyle(this.state.scale)
            this.state.update(() => {
                animator.stop()
                this.squareStyle = squareStyle(this.state.scale)
            })
        },

        start() {
            this.state.startUpdating(() => {
                animator.start(() => {
                    this.update()
                })
            })
        }
    }
})

const app = new Vue({
    el : '#app'
})
