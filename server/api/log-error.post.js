export default defineEventHandler(async (event) => {
    const context = await readBody(event)
    log({ level: 'error', source: 'client', message: context.message, context })
})