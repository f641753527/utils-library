export default {
    functional: true,
    render(h, ctx) {
        const data = ctx.data
        const on = { ...data.on, ...ctx.listeners }
        const props = ctx.props
        return h('div', {
            ...data,
            on,
            props,
        }, '123')
    }
}
